<?php

namespace App\Repository;

use App\Entity\Ingredient;
use App\Entity\RecetteIngredient;
use App\Entity\Recette;
use App\Entity\Ustensile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @extends ServiceEntityRepository<Recette>
 */
class RecetteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Recette::class);
    }

    private function detailRecette(Recette $recette): array
    {
        return [
            'id' => $recette->getId(),
            'nom' => $recette->getNom(),
            'description' => $recette->getDescription(),
            'creationAt' => $recette->getDateCreation()->format(DATE_ATOM),
            'tempsPreparation' => $recette->getTempsPreparation(),
            'tempsCuisson' => $recette->getTempsCuisson(),
            'nbPart' => $recette->getNbPart(),

            'utilisateur' => $recette->getUtilisateur() ? [
                'id' => $recette->getUtilisateur()->getId(),
                'nom' => $recette->getUtilisateur()->getNom(),
                'prenom' => $recette->getUtilisateur()->getPrenom(),
            ] : null,

            'ustensiles' => $recette->getUstensiles()->isEmpty() ? null :
                array_map(function ($ustensile) {
                    return $ustensile->getNom();
                }, $recette->getUstensiles()->toArray()),

            'ingredients' => $recette->getRecetteIngredients()->isEmpty() ? null :
                array_map(function ($recetteIngredient) {
                    return [
                        'ingredient' => $recetteIngredient->getIngredient()->getNom(),
                        'quantite' => $recetteIngredient->getQuantite(),
                        'unite' => $recetteIngredient->getUnite(),
                    ];
                }, $recette->getRecetteIngredients()->toArray()),
        ];
    }

    public function getRecettesWithDetails()
    {
        $recettes = $this->createQueryBuilder('r')
            ->leftJoin('r.utilisateur', 'u')
            ->addSelect('u')
            ->leftJoin('r.ustensiles', 'us')
            ->addSelect('us')
            ->leftJoin('r.recetteIngredients', 'ri')
            ->addSelect('ri')
            ->leftJoin('ri.ingredient', 'i')
            ->addSelect('i')
            ->getQuery()
            ->getResult();

        return array_map(function ($recette) {
            return $this->detailRecette($recette);
        }, $recettes);
    }

    public function getRecetteWithDetail(int $id)
    {
        $recette = $this->createQueryBuilder('r')
            ->leftJoin('r.utilisateur', 'u')
            ->addSelect('u')
            ->leftJoin('r.ustensiles', 'us')
            ->addSelect('us')
            ->leftJoin('r.recetteIngredients', 'ri')
            ->addSelect('ri')
            ->leftJoin('ri.ingredient', 'i')
            ->addSelect('i')
            ->where('r.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$recette) return null;
        return $this->detailRecette($recette);
    }

    public function saveUtilisateur($utilisateurId, UtilisateurRepository $utilisateurRepository)
    {
        if ($utilisateurId) {
            $utilisateur = $utilisateurRepository->find($utilisateurId);
            if ($utilisateur) {
                return ['utilisateur' => $utilisateur];
            } else {
                return ['utilisateur' => null, 'warning' => 'Utilisateur introuvable'];
            }
        }
        return ['utilisateur' => null, 'warning' => 'Utilisateur non fourni'];
    }

    public function saveUstensiles($ustensiles, Recette $recette, UstensileRepository $ustensileRepository, EntityManagerInterface $em)
    {
        foreach ($ustensiles as $ustensileName) {
            $ustensile = $ustensileRepository->findOneBy(['nom' => $ustensileName]);
            if (!$ustensile) {
                $ustensile = new Ustensile();
                $ustensile->setNom($ustensileName);
                $em->persist($ustensile);
            }
            $recette->addUstensile($ustensile);
        }
    }

    public function saveIngredients($ingredients, Recette $recette, IngredientRepository $ingredientRepository, EntityManagerInterface $em)
    {
        foreach ($ingredients as $ingredientData) {
            $ingredientName = $ingredientData['ingredient'];
            $quantite = $ingredientData['quantite'];
            $unite = $ingredientData['unite'];

            $ingredient = $ingredientRepository->findOneBy(['nom' => $ingredientName]);
            if (!$ingredient) {
                $ingredient = new Ingredient();
                $ingredient->setNom($ingredientName);
                $em->persist($ingredient);
            }

            $recetteIngredient = new RecetteIngredient();
            $recetteIngredient->setRecette($recette);
            $recetteIngredient->setIngredient($ingredient);
            $recetteIngredient->setQuantite($quantite);
            $recetteIngredient->setUnite($unite);
            $em->persist($recetteIngredient);
        }
    }

    public function saveRecette(Recette $recette, ?int $utilisateurId, array $ingredients, array $ustensiles, UtilisateurRepository $utilisateurRepository, UstensileRepository $ustensileRepository, IngredientRepository $ingredientRepository, EntityManagerInterface $em)
    {
        $response = array();
        if ($recette) {
            $getUtilisateur = $this->saveUtilisateur($utilisateurId, $utilisateurRepository);
            if (isset($getUtilisateur['warning'])) {
                $response['warning'] = $getUtilisateur['warning'] . ', recette ajoutée sans utilisateur.';
            }

            $recette->setUtilisateur($getUtilisateur['utilisateur']);

            $this->saveUstensiles($ustensiles, $recette, $ustensileRepository, $em);
            $this->saveIngredients($ingredients, $recette, $ingredientRepository, $em);

            $em->persist($recette);
            $em->flush();

            $response['OK'] = 'Recette ajoutée avec succès';
        } else {
            $response['error'] = 'Pas de recette à ajouter';
        }
        return $response;
    }

    public function updateUstensiles($ustensiles, Recette $recette, UstensileRepository $ustensileRepository, EntityManagerInterface $em)
    {
        foreach ($recette->getUstensiles() as $ustensile) {
            if (!in_array($ustensile->getNom(), $ustensiles)) {
                $recette->removeUstensile($ustensile);
                $em->persist($ustensile);
            }
        }
        foreach ($ustensiles as $ustensileName) {
            $ustensile = $ustensileRepository->findOneBy(['nom' => $ustensileName]);
            if (!$ustensile) {
                $ustensile = new Ustensile();
                $ustensile->setNom($ustensileName);
                $em->persist($ustensile);
            }
            $recette->addUstensile($ustensile);
            $em->persist($ustensile);
        }
    }

    public function UpdateIngredients($ingredients, Recette $recette, IngredientRepository $ingredientRepository, EntityManagerInterface $em)
    {
        $nomsIngredients = array_map(function ($ingredient) {
            return $ingredient['ingredient'];
        }, $ingredients);

        foreach ($recette->getRecetteIngredients() as $recetteIngredient) {
            if (!in_array($recetteIngredient->getIngredient()->getNom(), $nomsIngredients)) {
                $recette->removeRecetteIngredient($recetteIngredient);
                $em->persist($recette);
            }
        }

        foreach ($ingredients as $ingredientData) {
            $ingredientName = $ingredientData['ingredient'] ?? null;
            $quantite = $ingredientData['quantite'] ?? 0;
            $unite = $ingredientData['unite'] ?? 0;

            $ingredient = $ingredientRepository->findOneBy(['nom' => $ingredientName]);
            if (!$ingredient) {
                $ingredient = new Ingredient();
                $ingredient->setNom($ingredientName);
                $em->persist($ingredient);
            }

            $recetteIngredient = $recette->getRecetteIngredients()->filter(function ($ri) use ($ingredient) {
                return $ri->getIngredient() === $ingredient;
            })->first();

            if (!$recetteIngredient) {
                $recetteIngredient = new RecetteIngredient();
                $recetteIngredient->setRecette($recette);
                $recetteIngredient->setIngredient($ingredient);
                $recette->addRecetteIngredient($recetteIngredient);
            }

            $recetteIngredient->setQuantite($quantite);
            $recetteIngredient->setUnite($unite);

            $em->persist($recetteIngredient);
        }
    }

    public function updateRecette(Recette $currentRecette, $newRecette, array $ustensiles, array $ingredients, EntityManagerInterface $em, SerializerInterface $serializer, UstensileRepository $ustensileRepository, IngredientRepository $ingredientRepository): Recette
    {
        $updatedRecette = $serializer->deserialize(
            json_encode($newRecette),
            Recette::class,
            'json',
            [AbstractNormalizer::OBJECT_TO_POPULATE => $currentRecette]
        );
        $this->updateUstensiles($ustensiles, $currentRecette, $ustensileRepository, $em);
        $this->UpdateIngredients($ingredients, $currentRecette, $ingredientRepository, $em);
        $em->flush();

        return $updatedRecette;
    }    

    public function findAllWithPagination($page, $limit)
    {
        $qb = $this->createQueryBuilder('b')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);
        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return Recette[] Returns an array of Recette objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Recette
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
