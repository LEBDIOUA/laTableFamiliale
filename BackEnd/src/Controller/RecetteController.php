<?php

namespace App\Controller;

use App\Entity\Recette;
use App\Repository\IngredientRepository;
use App\Repository\RecetteRepository;
use App\Repository\UstensileRepository;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RecetteController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route(path: "/api/recettes", name: "recettes", methods: ["GET"])]
    public function getAllRecettes(RecetteRepository $recetteRepository, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $page = $request->get('page', 1); // Initialiser la valeur à 1 pour récupérer la première page
        $limit = $request->get('limit', 3); // Initialiser la valeur à 3 pour récupérer 3 données pour chaque page

        // $recettes = $recetteRepository->getRecettesWithDetails();
        // $recettes = $recetteRepository->findAll();
        $recettes = $recetteRepository->findAllWithPagination($page, $limit);

        if (empty($recettes)) {
            return new JsonResponse(['error' => 'Aucune recette'], Response::HTTP_NOT_FOUND);
        }
        $jsonRecettes = $serializer->serialize($recettes, 'json', ["groups" => 'recette:read']);

        // return new JsonResponse($jsonRecettes, Response::HTTP_OK, [], true);

        $response = new JsonResponse($jsonRecettes, Response::HTTP_OK, [], true);
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return $response;
    }

    #[Route(path: '/api/recette/{id}', name: 'detailRecette', methods: ['GET'])]
    public function getRecette(Recette $recette,  SerializerInterface $serializer): JsonResponse
    {
        // $jsonRecette = $serializer->serialize($recette->detailRecette(), 'json');
        $jsonRecette = $serializer->serialize($recette, 'json', ["groups" => 'recette:read']);
        return new JsonResponse($jsonRecette, Response::HTTP_OK, [], true);
    }

    #[Route(path: '/api/recettes/{id}', name: 'deleteRecette', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour supprimer une recette')]
    public function deleteRecette(Recette $recette, IngredientRepository $ingredientRepository, EntityManagerInterface $em): JsonResponse
    {
        if (!$recette) {
            return new JsonResponse(['message' => 'Recette introuvable'], Response::HTTP_NOT_FOUND);
        }

        $ingredientRepository->removeIngredient($recette->getRecetteIngredients(), $recette->getId(), $em);

        foreach ($recette->getUstensiles() as $ustensile) {
            $recette->removeUstensile($ustensile);
        }
        $em->remove($recette);
        $em->flush();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    #[Route(path: '/api/recettes', name: 'createRecette', methods: ['POST'])]
    public function createRecette(ValidatorInterface $validator,  Request $request, SerializerInterface $serializer, RecetteRepository $recetteRepository, EntityManagerInterface $em, UtilisateurRepository $utilisateurRepository, UstensileRepository $ustensileRepository, IngredientRepository $ingredientRepository, UrlGeneratorInterface $urlGenerator): JsonResponse
    {
        $content = $request->toArray();
        $recetteData = $content['recette'] ?? null;

        if (!$recetteData) {
            return new JsonResponse(['error' => 'Invalid recette data'], Response::HTTP_BAD_REQUEST);
        }

        $recette = $serializer->deserialize(json_encode($recetteData), Recette::class, 'json');

        $errors = $validator->validate($recette);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $utilisateurId = $content['utilisateur'] ?? null;
        $ustensiles = $content['ustensiles'] ?? [];
        $ingredients = $content['ingredients'] ?? [];

        $response = $recetteRepository->saveRecette($recette, $utilisateurId, $ingredients, $ustensiles, $utilisateurRepository, $ustensileRepository, $ingredientRepository, $em);

        if (isset($response['OK'])) {
            $location = $urlGenerator->generate('detailRecette', ['id' => $recette->getId()], UrlGeneratorInterface::ABSOLUTE_URL);

            // A supprimer
            $responsePayload = ['data' => $recette->detailRecette()];
            if (isset($response['warning'])) {
                $responsePayload['message'] = $response['warning'];
            }
            return new JsonResponse($responsePayload, Response::HTTP_CREATED, ["Location" => $location]);
        }
        return new JsonResponse(['error' => $response['error']], Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/api/recettes/{id}', name: 'updateRecette', methods: ['PUT'])]
    public function updateRecette(Request $request, Recette $currentRecette, RecetteRepository $recetteRepository, SerializerInterface $serializer, EntityManagerInterface $em, UstensileRepository $ustensileRepository, IngredientRepository $ingredientRepository): JsonResponse
    {
        $utilisateur = $this->security->getUser();
        // ou $utilisateur = $this->getUser();

        if (!$this->IsGranted('ROLE_ADMIN') && $utilisateur !== $currentRecette->getUtilisateur()) {
            throw new AccessDeniedException('Vous n\'avez pas les droits suffisants pour modifier cette recette.');
        }
        if (empty($currentRecette)) {
            return new JsonResponse(['error' => 'Recette introuvable'], Response::HTTP_BAD_REQUEST);
        }

        $content = $request->toArray();
        $newRecette = $content['recette'] ?? null;

        if (!$newRecette) {
            return new JsonResponse(['error' => 'Invalid recette data'], Response::HTTP_BAD_REQUEST);
        }

        $ustensiles = $content['ustensiles'] ?? [];
        $ingredients = $content['ingredients'] ?? [];

        $updatedRecette = $recetteRepository->updateRecette($currentRecette, $newRecette, $ustensiles, $ingredients, $em, $serializer, $ustensileRepository, $ingredientRepository);

        $jsonRecette = $serializer->serialize($updatedRecette, 'json', ['groups' => 'recette:read']);

        return new JsonResponse($jsonRecette, Response::HTTP_OK, [], true);
    }
}
