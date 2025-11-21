import { recipes } from "../../data/recipes.js";
import { RecipeInfo } from "../models/ReccetteM.js";
import { filters } from "../utils/filters.js";
import { mainsearch } from "../utils/search.js";
import { buildRecipeIndex, StateRecipes , UpdateRecipes} from "../utils/services.js";

/**
 * Point d'entrée principal de l'application PetitsPlats 2.0.
 *
 * Ce module :
 *  1. Charge les données brutes des recettes depuis le recipe.js.
 *  2. Instancie chaque recette sous forme d'objet `RecipeInfo`.
 *  3. Initialise l'état global `StateRecipes` :
 *      - recettes initiales
 *      - tags actifs (vides)
 *  4. Construit l'index de recherche plein texte via `buildRecipeIndex()`
 *     pour optimiser les performances des recherches utilisateurs.
 *  5. Déclenche un premier rendu des recettes et des filtres via `UpdateRecipes()`.
 *  6. Active la recherche principale du header (`mainsearch()`).
 *  7. Initialise les filtres dynamiques (ingrédients, appareils, ustensiles)
 *     via la fonction `filters()`.

 *
 * @module init
 *
 */
// Charger et transformer les recettes en modèles
StateRecipes.initialrecipes = recipes.map((recipe) => new RecipeInfo(recipe));

// Réinitialiser les tags actifs
StateRecipes.activeTags.ingredient.clear();
StateRecipes.activeTags.appareil.clear();
StateRecipes.activeTags.ustensile.clear();

// Construire l’index de recherche, base description, ingrédients et nom de la recette
StateRecipes.TableauIndex= buildRecipeIndex(StateRecipes.initialrecipes)

// Afficher les recettes + les filtres
UpdateRecipes();

// Activer la barre de recherche principal
mainsearch();

// Activer les 3 filtres (ingrédient, appareil, ustensile)
filters();

