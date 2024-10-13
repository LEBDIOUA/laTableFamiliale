<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class UtilisateurController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/api/utilisateur', name: 'getUtilisateur', methods: ['GET'])]
    public function getUtilisateur(SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();
    
        $jsonUser = $serializer->serialize($user, 'json', ["groups" => 'utilisateur:read']);

        return new JsonResponse($jsonUser, Response::HTTP_OK, [], true);;
    }
}
