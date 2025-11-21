import { UpdateRecipes, normaliseText, StateRecipes} from "./services.js";
import { addTag } from "../template/filtersTemp.js";

/**
 * Initialise et gère les filtres (ingrédients, appareils, ustensiles) de la page.
 * - Configure l’ouverture/fermeture des dropdowns
 * - Gère les clics sur les items de liste
 * - Gère l’affichage / suppression des tags
 * - Applique les filtres combinés sur la liste des recettes
 *
 * @param {RecipeInfo[]} recipes - Liste de toutes les recettes (modèles RecipeInfo).
 * @param {Object} recipeIndex - Index de recherche (actuellement non utilisé ici, mais passé pour future extension).
 * @returns {void}
 */
export const filters = () => {

    /**
     * Configure l’ouverture / fermeture d’un menu déroulant de filtre
     * (ingrédient, appareil ou ustensile).
     *
     * @param {string} Rootelement - Racine BEM du filtre (ex : "fingredient", "fappareil", "fustensile").
     * @returns {void}
     */
    function setupDropdown(Rootelement) {
        const trigger = document.querySelector(`.${Rootelement}__header-btn`);
        const panel   = document.querySelector(`.${Rootelement}__choix-search`);
        const list    = document.querySelector(`.${Rootelement}__items`);
        const input   = document.querySelector(`.${Rootelement}__choix-input`);

        if (!trigger || !panel || !list) return;

        trigger.addEventListener('click', () => {
            const isOpen   = trigger.getAttribute('aria-expanded') === 'true';
                const newState = !isOpen;

                trigger.setAttribute('aria-expanded', String(newState));

                panel.classList.toggle('hidden', !newState);
                list.classList.toggle('hidden', !newState);
                panel.classList.toggle('flex', newState);
                list.classList.toggle('flex', newState);

                // Si on vient d’ouvrir, alors on met le focus sur l'input
                if (newState && input) {
                    input.focus();
                }
        });
    }

    /**
     * Convertit le préfixe BEM en clé de StateRecipes.activeTags
     *
     * @param {string} rootElement
     * @returns {"ingredient"|"appareil"|"ustensile"|null}
     */
    function rootToKey(rootElement) {
        switch (rootElement) {
            case "fingredient":
                return "ingredient";
            case "fappareil":
                return "appareil";
            case "fustensile":
                return "ustensile";
        }
    }

    /**
     * Ajoute un tag (state + UI) et relance le filtrage.
     *
     * @param {string} rootElement - "fingredient" | "fappareil" | "fustensile"
     * @param {string} value - Texte choisi dans la liste.
     */
    function ManageTagAdd(rootElement, value) {

        let key=rootToKey(rootElement);

        // si déjà présent dans le set → on ne duplique pas
        if (StateRecipes.activeTags[key].has(value)) return;

        StateRecipes.activeTags[key].add(value);

        // Création du tag visuel
        addTag(rootElement, value, ({ root, value }) => {
            key=rootToKey(root);
            
            if (!StateRecipes.activeTags[key]) return;

            StateRecipes.activeTags[key].delete(value);
            // gestion du décalage de la grille
            const filter = document.querySelector(".recipes_list");
            const maxTags = Math.max(
                StateRecipes.activeTags.ingredient.size,
                StateRecipes.activeTags.appareil.size,
                StateRecipes.activeTags.ustensile.size
             );
            let shiftafter= 55 + maxTags * 62;
            filter.style.marginTop=`${shiftafter}px`;
       
            UpdateRecipes ();
        });
       UpdateRecipes ();
    }
   /**
     * Configure le comportement d’un filtre donné (ingrédient, appareil ou ustensile).
     *
     * Pour un bloc de filtre identifié par son préfixe BEM (ex. "fingredient") :
     *  - Ajoute un filtrage des items de la liste en fonction de la saisie dans l’input
     *    (`.${Rootelement}__choix-input`).
     *  - Gère le clic sur un `<li>` de la listbox (`.${Rootelement}__items`) :
     *      → crée un tag via `ManageTagAdd(Rootelement, value)`.
     *      → les tags sont ensuite utilisés pour filtrer les recettes via le système global
     *        (StateRecipes + AllFilters).
     *
     * Cette fonction ne connaît pas directement les recettes :
     * elle se contente de gérer les filtres,
     * et je délègue `ManageTagAdd` pour la gestion des tags
     *
     * @param {string} Rootelement - Préfixe BEM du filtre
     *   (par ex. "fingredient", "fappareil" ou "fustensile").
     * @returns {void}

     */
    function setupFilter(Rootelement)
    {
        const input       = document.querySelector(`.${Rootelement}__choix-input`);
        const list        = document.querySelector(`.${Rootelement}__items`);
  

        // Filtrage des <li> dans la listbox quand on tape dans l’input
        input.addEventListener("input", () => {
            const search = normaliseText(input.value);
            const items = list.querySelectorAll("li");

            items.forEach((li) => {
                const text = normaliseText(li.textContent);
                const isMatch = text.includes(search);
                li.classList.toggle("hidden", !isMatch);
            });
        });

        // Clic sur un élément de la liste : appliquer le filtre
        list.addEventListener("click", (event) => {
            const clicked = event.target.closest("li");
            list.querySelectorAll("li").forEach((el) => { 
                if (el==clicked) { 
                    ManageTagAdd(Rootelement, el.textContent)
                } 
            });
        });

    }

    // Initialisation des dropdowns
    setupDropdown('fingredient');
    setupDropdown('fappareil');
    setupDropdown('fustensile');

    // Initialisation du contenu de chaque filtre
    setupFilter("fingredient");
    setupFilter("fappareil");
    setupFilter("fustensile");

}