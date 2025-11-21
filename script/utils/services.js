import { DefineRecipeTemplate } from "../template/RecetteTemp.js";
import { DefineFilterTemplate } from "../template/filtersTemp.js";

// Variables globales partagées, permet de connaître à tous 
// instant l'état du filtrage
export const StateRecipes = {
    initialrecipes: [], // toutes les recette
    TableauIndex : [],
    searchvalue : "",
    activeTags: {
        ingredient: new Set(),
        appareil: new Set(),
        ustensile: new Set()
    }
};

/**
 * Indique s'il y a au moins un tag actif.
 * @returns {boolean}
 */
export function hasActiveTags() {
    const { ingredient, appareil, ustensile } = StateRecipes.activeTags;
    return ingredient.size > 0 || appareil.size > 0 || ustensile.size > 0;
}
/**
 * Affiche un message d’erreur sous le champ de recherche.
 * Le message est injecté via les attributs `data-error` et `data-error-visible`,
 * lesquels sont utilisés dans le CSS pour l’affichage.
 *
 * @param {string} inputId - Sélecteur CSS du conteneur de l’input (ex : ".formData")
 * @param {string} message - Message d’erreur à afficher
 * @returns {void}
 */
export function displayError(inputId, message) {

    const input = document.querySelector(inputId);
    input.setAttribute("data-error", message);          // Définit le texte d'erreur
    input.setAttribute("data-error-visible", "true");   // Rend visible l'erreur

}

/**
 * Masque toute erreur affichée dans un conteneur utilisant data-error.
 *
 * @param {string} inputId - Sélecteur CSS du conteneur de l’input (ex : ".formData")
 * @returns {void}
 */
export function hideError(inputId) {

    const input = document.querySelector(inputId);

    input.removeAttribute("data-error");                // Supprime le message
    input.setAttribute("data-error-visible", "false");  // Cache l'erreur
}

/**
 * Normalise un texte :
 * - en string
 * - minuscule
 * - sans accents
 * - sans espaces multiples
 */
export function normaliseText(text) {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")               // décompose les  accents
        .replace(/[\u0300-\u036f]/g, "") // supprimeles accents
        .replace(/\s+/g, " ")            // multiples espaces à 1
        .trim();
}

/**
 * Construit un index de recherche pour les recettes.
 * Chaque entrée contient :
 * - la recette (modèle RecipeInfo)
 * - un texte concaténé et normalisé pour la recherche plein texte.
 *
 * @param {RecipeInfo[]} recipeModels - Liste des modèles de recettes.
 * @returns {{ recipe: RecipeInfo, textRecherche: string }[]} Index de recherche.
 */
export function buildRecipeIndex(recipeModels) {
    return recipeModels.map((recipe) => {
    
        const fulltext = recipe.fullTextRecipe;

        //Normaliser le texte (accents, majuscules, etc.)
        const textRecherche = normaliseText(fulltext);

        return {recipe, textRecherche};
    });
};

/**
 * Filtre les recettes en fonction d’un ensemble de tags d’ingrédients.
 *
 * Cette fonction :
 *  - Normalise les tags d’ingrédients fournis (issus du Set `activeTags.ingredient`)
 *  - Normalise les ingrédients de chaque recette
 *  - Conserve uniquement les recettes qui contiennent tous*les tags
 * 
 * @param {RecipeInfo[]} recipes
 *        Liste des recettes à filtrer.
 * @param {Set<string>} ingredientTags
 *        Ensemble des tags d’ingrédients sélectionnés par l’utilisateur.
 * @returns {RecipeInfo[]}
 *        Tableau des recettes correspondant aux tags actifs.
 *
 */

export function searchIngredient(recipes, ingredientTags) {

    // on transforme le Set en tableau de tags normalisés
    const tags = [...ingredientTags].map((t) => normaliseText(t));

    return recipes.filter((recipe) => {

        // ingrédients normalisés de la recette
        const IngredientsRecette = recipe.uniqueIngredientsWithId.map((obj) =>normaliseText(obj.ingredient)
        );

        // garde la recette si tous les ingrédients sont dans les ingrédients
        return tags.every((tag) =>
        IngredientsRecette.some((ing) => ing.includes(tag))
    );
  });
}

/**
 * Filtre les recettes en fonction d’un ensemble de tags d’ustensiles.
 *
 * Cette fonction :
 *  - Normalise les tags d’ustensiles sélectionnés par l’utilisateur
 *    (issus du Set `activeTags.ustensile`).
 *  - Normalise les ustensiles présents dans chaque recette.
 *  - Conserve uniquement les recettes qui contiennent **tous** les tags fournis.
 *
 * Logique :
 *   tags = ["presse-ail", "casserole"]
 *   → La recette est gardée uniquement si elle contient au moins
 *     un ustensile correspondant à chaque tag.
 *   (Logique AND : tous les tags doivent matcher)
 *
 * @param {RecipeInfo[]} recipes
 *        Liste des recettes à filtrer.
 * @param {Set<string>} ustensilesTags
 *        Ensemble des ustensiles sélectionnés comme tags.
 * @returns {RecipeInfo[]}
 *          Tableau des recettes correspondant aux ustensiles recherchés.
 */
export function searchUstensiles(recipes, ustensilesTags) {
    const tags = [...ustensilesTags].map((t) => normaliseText(t));

    return recipes.filter((recipe) => {

        // ustensiles normalisés de la recette
        const UstensilesRecette = recipe.uniqueUstensilsWithId.map((obj) =>normaliseText(obj.ustensil)
        );

        // garde la recette si tous les tags sont dans les ustensiles
        return tags.every((tag) =>
        UstensilesRecette.some((ing) => ing.includes(tag))
    );
  });;
}


/**
 * Recherche dans l’index à partir d’un terme utilisateur.
 * - Si la requête normalisée fait moins de 3 caractères,
 *   toutes les recettes sont retournées.
 * - Sinon, on filtre les entrées dont le texte normalisé contient la requête.
 *
 * @param {{ recipe: RecipeInfo, textRecherche: string }[]} index - Index construit par buildRecipeIndex().
 * @param {string} inputtext - Texte saisi par l’utilisateur.
 * @returns {RecipeInfo[]} Liste de recettes correspondantes.
 */
export function searchRecipes(index, inputtext) {
    const norminputtext = normaliseText(inputtext);

    // Si moins de 3 caractères → retourner toutes les recettes
    if (norminputtext.length < 3) {
        const allRecipes = [];
        for (let i = 0; i < index.length; i++) {
            allRecipes.push(index[i].recipe);
        }
        return allRecipes;
    }

    // Filtrage bouche for
    const result = [];

    for (let i = 0; i < index.length; i++) {
        const entry = index[i];

        let j = 0;
        let match=false;
        while ((j < index[i].textRecherche.length) && (!match)) {
            if (index[i].textRecherche[j] === norminputtext[0]) {
                // vérifie si tout le mot correspond
                let k = 0;
                while (k < norminputtext.length && index[i].textRecherche[j + k] === norminputtext[k]) {
                    k++;
                }
                if (k === norminputtext.length) {
                    result.push(entry.recipe);
                    match=true;
                }
                    
            }
            j++;
        }
    }

    return result;
}
/**
 * Met à jour la liste des recettes affichées en appliquant :
 *  1. La recherche principale (barre de recherche du header)
 *  2. Les tags d’ingrédients, d’appareils et d’ustensiles
 *  3. L’ordre logique de filtrage :
 *        - Recherche plein texte
 *        - Tags ingrédient
 *        - Tag appareil
 *        - Tags ustensile
 *
 * Fonctionnement :
 * ----------------
 * - Si `StateRecipes.searchvalue` contient un texte, la recherche plein texte
 *   est réalisée via `searchRecipes()` en utilisant l’index pré-construit.
 *
 * - Si des tags sont actifs (via `StateRecipes.activeTags`), chaque groupe
 *   de tags est appliqué successivement :
 *     • searchIngredient() pour les ingrédients
 *     • un filtre interne pour l’appareil (un seul tag possible)
 *     • searchUstensiles() pour les ustensiles
 *
 * - Si aucune recette ne correspond :
 *       • Affiche un message d’erreur
 *       • Supprime tous les tags du DOM
 *       • Réinitialise tous les tags actifs dans `StateRecipes`
 *       • Réinitialise le décalage visuel de la grille
 *
 * - Si des résultats existent :
 *       • Masque l’erreur
 *
 * - Enfin :
 *       • Affiche les recettes via `displayRecipes(result)`
 *       • Met à jour les listes des filtres via `updatefilters(result)`
 *
 * Effets de bord :
 * ----------------
 * - Modifie l’affichage (tags, messages d’erreurs, grille de recettes)
 * - Met à jour `StateRecipes.currentrecipes` indirectement via `displayRecipes`
 * - Recalcule dynamiquement les valeurs disponibles dans les dropdowns
 *
 * @returns {void}
 *
 * @example
 * // Après un changement de tag ou une saisie dans la barre de recherche :
 * UpdateRecipes();
 */
export function UpdateRecipes () {

    let result=StateRecipes.initialrecipes;

    // filtre les recette par rapport à la valeur de l'input search
    if (StateRecipes.searchvalue !== "") {
            result=searchRecipes(StateRecipes.TableauIndex, StateRecipes.searchvalue) 
    }

    // filtre les recettes par rapport aux Tags
    if (hasActiveTags)
    {
        // 1. ingrédient
        if (StateRecipes.activeTags.ingredient.size !==0) {
            result = searchIngredient(result, StateRecipes.activeTags.ingredient)
        }
          // 2. appareil
        if (StateRecipes.activeTags.appareil.size !==0) {
            
               const tags = [...StateRecipes.activeTags.appareil].map((t) => normaliseText(t));    
                result = result.filter((recipe) =>
                {
                    // ustensiles normalisés de la recette
                    const applianceRecette = normaliseText(recipe.appliance)
                    return tags.every((tag) =>
                        applianceRecette.includes(tag));
                }
             
            );
        }
          // 3. ustensile
        if (StateRecipes.activeTags.ustensile.size !==0) {
            result = searchUstensiles(result, StateRecipes.activeTags.ustensile);
        }

    }
    if (result.length==0) {
         displayError(".formData", `Aucune recette ne contient '${StateRecipes.searchvalue}' vous pouvez chercher «tarte aux pommes », « poisson », etc.`); 
        
        // si pas de recettes disponibles dans la barre de recherche principale, je supprime les tags
        const allTagsing = document.querySelectorAll(".fingredient__tag")
        allTagsing.forEach((tag)=> tag.remove());
        const allTagsapp = document.querySelectorAll(".fappareil__tag")
        allTagsapp.forEach((tag)=> tag.remove())
        const allTagsust = document.querySelectorAll(".fustensile__tag")
        allTagsust.forEach((tag)=> tag.remove());

        // gestion du décalage de la grille
        const filter = document.querySelector(".recipes_list");
        filter.style.marginTop="55px";


        StateRecipes.activeTags.ingredient.clear();
        StateRecipes.activeTags.appareil.clear();
        StateRecipes.activeTags.ustensile.clear();
    }
    else
    {
        hideError(".formData");
    }

    displayRecipes(result);
    updatefilters(result);
  
}


/**
 * Affiche une liste de recettes dans la section `.recipes_list`.
 * Vide d’abord le contenu existant, puis injecte une carte
 * pour chaque recette en utilisant DefineRecipeTemplate().
 *
 * @param {RecipeInfo[]} listrecettes - Recettes à afficher.
 * @returns {void}
 */
export function displayRecipes(listrecettes) {
    const recipesSection = document.querySelector('.recipes_list');
    recipesSection.innerHTML = ""; // on vide

    listrecettes.forEach((recipeModel) => {
        //affichage des recettes
        const card = DefineRecipeTemplate(recipeModel);
        recipesSection.appendChild(card);
 
    });

    //mettre à jour le nombre de recettes
    const counter = document.querySelector(".filters__recettes-nb");
    if (counter) {
        const count = listrecettes.length;
        const label = count > 1 ? "recettes" : "recette";
        counter.textContent = `${count} ${label}`;
    }
}
/**
 * Met à jour les listes de choix des filtres (ingrédients, appareils, ustensiles)
 * à partir d’une liste de recettes filtrées.
 *
 * Cette fonction :
 *  1. Parcourt toutes les recettes fournies.
 *  2. Extrait :
 *      - les ingrédients uniques,
 *      - les appareils uniques,
 *      - les ustensiles uniques.
 *  3. Nettoie les doublons grâce à des `Set`.
 *  4. Retire les valeurs déjà présentes dans les tags actifs
 *     (`StateRecipes.activeTags`) afin d’éviter les répétitions dans les listes déroulantes.
 *  5. Envoie les données triées et nettoyées à `DefineFilterTemplate`
 *     pour mettre à jour le DOM des dropdowns.
 *
 * @param {RecipeInfo[]} listrecettes - Liste de recettes utilisée pour alimenter les filtres.
 *   Ex: après une recherche ou une réduction par tags.
 *
 * @returns {void}
 *
 */
export function updatefilters(listrecettes) {

    const VuIngredients = new Set();
    const VuAppareils = new Set();
    const VuUstensiles = new Set();

    listrecettes.forEach((recipe) =>{
        // on mémorise les ingrédients
        recipe.uniqueIngredientsWithId.forEach((ing) => {
            const Name = ing.ingredient;
            if (!VuIngredients.has(Name)) {
                VuIngredients.add(Name);
            }
        });

        // on mémorise l’appareil
        const Name = recipe.appliance;
        if (!VuAppareils.has(Name)) {
            VuAppareils.add(Name);
        }

        // on mémorise l’appareil
        recipe.uniqueUstensilsWithId.forEach((ing) => {
   
            const Name = ing.ustensil;
       
            if (!VuUstensiles.has(Name)) {
                VuUstensiles.add(Name);
            }
        });
    });

    // Retirer les tags de la liste
    const Tagingredient = StateRecipes.activeTags.ingredient;

    // pour chaque tag actif, on le retire de VuIngredients
    for (const tag of Tagingredient) {
        VuIngredients.delete(tag);
    }

     // Retirer les tags de la liste
    const Tagapparareil = StateRecipes.activeTags.appareil;

    // pour chaque tag actif, on le retire de VuIngredients
    for (const tag of Tagapparareil) {
        VuAppareils.delete(tag);
    }
     // Retirer les tags de la liste
    const Tagustensiles = StateRecipes.activeTags.ustensile;

    // pour chaque tag actif, on le retire de VuIngredients
    for (const tag of Tagustensiles) {
        VuUstensiles.delete(tag);
    }
    
    DefineFilterTemplate(VuIngredients,VuAppareils,VuUstensiles);
    
}
