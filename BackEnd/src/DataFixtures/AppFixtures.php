<?php

namespace App\DataFixtures;

use App\Entity\Ingredient;
use App\Entity\Recette;
use App\Entity\RecetteIngredient;
use App\Entity\Ustensile;
use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $userPasswordHasher;

    public function __construct(UserPasswordHasherInterface $userPasswordHasher)
    {
        $this->userPasswordHasher = $userPasswordHasher;
    }

    public function load(ObjectManager $manager): void
    {

        $user1 = $this->ajouterUtilisateur($manager, 'Dupont', 'Jean', 'jean.dupont@example.com', 'password123', ['ROLE_ADMIN']);
        $user2 = $this->ajouterUtilisateur($manager, 'Martin', 'Claire', 'claire.martin@example.com', 'password123', ['ROLE_USER']);

        $recette1 = $this->ajouterRecette($manager, 'Tarte aux pommes', 'Délicieuse tarte aux pommes avec une pâte sablée.', 30, 45, 8, $user1);
        $recette2 = $this->ajouterRecette($manager, 'Crèpe', 'Recette de crèpe à l\'ancienne.', 10, 40, 10, $user2);

        $ingred1 = $this->ajouterIngredient($manager, 'Pomme');
        $ingred2 = $this->ajouterIngredient($manager, 'Pâte sablée');
        $ingred3 = $this->ajouterIngredient($manager, 'Beurre');
        $ingred4 = $this->ajouterIngredient($manager, 'Farine');
        $ingred5 =  $this->ajouterIngredient($manager, 'Oeufs');
        $ingred6 =  $this->ajouterIngredient($manager, 'Lait');
        $ingred7 = $this->ajouterIngredient($manager, 'Sucre roux');
        $ingred8 = $this->ajouterIngredient($manager, 'Sucre');

        $this->recetteIngredient($manager, $recette1, $ingred1, 4, 'pcs');
        $this->recetteIngredient($manager, $recette1, $ingred2, 1, 'pcs');
        $this->recetteIngredient($manager, $recette1, $ingred3, 50, 'g');
        $this->recetteIngredient($manager, $recette1, $ingred7, 20, 'g');

        $this->recetteIngredient($manager, $recette2, $ingred3, 40, 'g');
        $this->recetteIngredient($manager, $recette2, $ingred4, 200, 'g');
        $this->recetteIngredient($manager, $recette2, $ingred5, 3, 'pcs');
        $this->recetteIngredient($manager, $recette2, $ingred6, 50, 'cl');
        $this->recetteIngredient($manager, $recette2, $ingred8, 20, 'g');

        $ustens1 = $this->ajouterUstensile($manager, 'Four');
        $ustens2 = $this->ajouterUstensile($manager, 'Couteau');
        $ustens3 = $this->ajouterUstensile($manager, 'Moule à tarte');
        $ustens4 = $this->ajouterUstensile($manager, 'Poele');
        $ustens5 = $this->ajouterUstensile($manager, 'Fouet');

        $recette1->addUstensile($ustens1);
        $recette1->addUstensile($ustens2);
        $recette1->addUstensile($ustens3);
        $recette2->addUstensile($ustens4);
        $recette2->addUstensile($ustens5);

        $manager->flush();
    }

    private function ajouterUtilisateur($manager, $nom, $prenom, $email, $motDePasse, $role): Utilisateur
    {
        $utilisateur = new Utilisateur();
        $utilisateur->setNom($nom);
        $utilisateur->setprenom($prenom);
        $utilisateur->setEmail($email);
        $utilisateur->setMotDePasse($this->userPasswordHasher->hashPassword($utilisateur, $motDePasse));
        $utilisateur->setRoles($role);

        $manager->persist($utilisateur);
        return $utilisateur;
    }

    private function ajouterRecette($manager, $nom, $description, $tempsPreparation, $tempsCuisson, $nbPart, $utilisateur): Recette
    {
        $recette = new Recette();
        $recette->setNom($nom);
        $recette->setDescription($description);
        $recette->setTempsPreparation($tempsPreparation);
        $recette->setTempsCuisson($tempsCuisson);
        $recette->setNbPart($nbPart);
        $recette->setUtilisateur($utilisateur);

        $manager->persist($recette);
        return $recette;
    }

    private function ajouterUstensile($manager, $nom): Ustensile
    {
        $ustensile = new Ustensile();
        $ustensile->setNom($nom);
        $manager->persist($ustensile);
        return $ustensile;
    }

    private function ajouterIngredient($manager, $nom): Ingredient
    {
        $ingredient = new Ingredient();
        $ingredient->setNom($nom);
        $manager->persist($ingredient);
        return $ingredient;
    }

    private function recetteIngredient($manager, $recette, $ingredient, $quantite, $unite)
    {
        $recetteIngredient = new RecetteIngredient;
        $recetteIngredient->setIngredient($ingredient);
        $recetteIngredient->setRecette($recette);
        $recetteIngredient->setQuantite($quantite);
        $recetteIngredient->setUnite($unite);

        $recette->addRecetteIngredient($recetteIngredient);
        $manager->persist($recetteIngredient);
    }
}
