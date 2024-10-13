<?php

namespace App\Entity;

use App\Repository\RecetteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RecetteRepository::class)]
class Recette
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["recette:read", "recette:write"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["recette:read", "recette:write"])]
    #[Assert\NotBlank(message: "Le nom de la recette est obligatoire")]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(["recette:read", "recette:write"])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(["recette:read", "recette:write"])]
    private ?\DateTimeImmutable $creationAt;

    #[ORM\Column]
    #[Groups(["recette:read", "recette:write"])]
    private ?int $tempsPreparation;

    #[ORM\Column]
    #[Groups(["recette:read", "recette:write"])]
    private ?int $tempsCuisson;

    #[ORM\Column]
    #[Groups(["recette:read", "recette:write"])]
    private ?int $nbPart = null;

    #[ORM\ManyToOne(inversedBy: 'recettes')]
    #[Groups(["recette:read", "recette:write"])]
    private ?Utilisateur $utilisateur = null;

    /**
     * @var Collection<int, Ustensile>
     */
    #[ORM\ManyToMany(targetEntity: Ustensile::class, mappedBy: 'recettes', orphanRemoval: true, cascade: ["remove"])]
    #[Groups(["recette:read", "recette:write"])]
    private Collection $ustensiles;

    /**
     * @var Collection<int, RecetteIngredient>
     */
    #[ORM\OneToMany(targetEntity: RecetteIngredient::class, mappedBy: 'recette', orphanRemoval: true, cascade: ["remove"])]
    #[Groups(["recette:read", "recette:write"])]
    private Collection $recetteIngredients;


    public function __construct()
    {
        $this->creationAt = new \DateTimeImmutable();
        $this->tempsPreparation = 0;
        $this->tempsCuisson = 0;
        $this->creationAt = new \DateTimeImmutable();
        $this->ustensiles = new ArrayCollection();
        $this->recetteIngredients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getDateCreation(): ?\DateTimeImmutable
    {
        return $this->creationAt;
    }

    public function setDateCreation(\DateTimeImmutable $creationAt): static
    {
        $this->creationAt = $creationAt;
        return $this;
    }

    public function getTempsPreparation(): ?int
    {
        return $this->tempsPreparation;
    }

    public function setTempsPreparation(int $tempsPreparation): static
    {
        $this->tempsPreparation = $tempsPreparation;

        return $this;
    }

    public function getTempsCuisson(): ?int
    {
        return $this->tempsCuisson;
    }

    public function setTempsCuisson(int $tempsCuisson): static
    {
        $this->tempsCuisson = $tempsCuisson;

        return $this;
    }

    public function getNbPart(): ?int
    {
        return $this->nbPart;
    }

    public function setNbPart(int $nbPart): static
    {
        $this->nbPart = $nbPart;

        return $this;
    }

    public function getUtilisateur(): ?utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }

    /**
     * @return Collection<int, Ustensile>
     */
    public function getUstensiles(): Collection
    {
        return $this->ustensiles;
    }

    public function addUstensile(Ustensile $ustensile): static
    {
        if (!$this->ustensiles->contains($ustensile)) {
            $this->ustensiles->add($ustensile);
            $ustensile->addRecette($this);
        }

        return $this;
    }

    public function removeUstensile(Ustensile $ustensile): static
    {
        if ($this->ustensiles->removeElement($ustensile)) {
            $ustensile->removeRecette($this);
        }
        return $this;
    }

    /**
     * @return Collection<int, RecetteIngredient>
     */
    public function getRecetteIngredients(): Collection
    {
        return $this->recetteIngredients;
    }

    public function addRecetteIngredient(RecetteIngredient $recetteIngredient): static
    {
        if (!$this->recetteIngredients->contains($recetteIngredient)) {
            $this->recetteIngredients->add($recetteIngredient);
            $recetteIngredient->setRecette($this);
        }

        return $this;
    }

    public function removeRecetteIngredient(RecetteIngredient $recetteIngredient): static
    {
        if ($this->recetteIngredients->removeElement($recetteIngredient)) {
            // set the owning side to null (unless already changed)
            if ($recetteIngredient->getRecette() === $this) {
                $recetteIngredient->setRecette(null);
            }
        }

        return $this;
    }

    public function detailRecette(): array
    {
        return [
            'id' => $this->getId(),
            'nom' => $this->getNom(),
            'description' => $this->getDescription(),
            'creationAt' => $this->getDateCreation()->format(DATE_ATOM),
            'tempsPreparation' => $this->getTempsPreparation(),
            'tempsCuisson' => $this->getTempsCuisson(),
            'nbPart' => $this->getNbPart(),

            'utilisateur' => $this->getUtilisateur() ? [
                'id' => $this->getUtilisateur()->getId(),
                'nom' => $this->getUtilisateur()->getNom(),
                'prenom' => $this->getUtilisateur()->getPrenom(),
            ] : null,

            'ustensiles' => $this->getUstensiles()->isEmpty() ? null :
                array_map(function ($ustensile) {
                    return $ustensile->getNom();
                }, $this->getUstensiles()->toArray()),

            'ingredients' => $this->getRecetteIngredients()->isEmpty() ? null :
                array_map(function ($recetteIngredient) {
                    return [
                        'ingredient' => $recetteIngredient->getIngredient()->getNom(),
                        'quantite' => $recetteIngredient->getQuantite(),
                        'unite' => $recetteIngredient->getUnite(),
                    ];
                }, $this->getRecetteIngredients()->toArray()),
        ];
    }
}
