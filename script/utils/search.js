import { StateRecipes, UpdateRecipes, hideError, displayError, normaliseText} from "./services.js";
/**
 * Initialise la recherche principale (barre de recherche du header).
 *
 * Cette fonction :
 *  - Surveille la saisie dans l’input `.pp-search__input`.
 *  - Réinitialise la valeur de recherche lorsque l’input est vide.
 *  - Masque automatiquement le message d’erreur dès que l’utilisateur tape ≥ 3 caractères.
 *  - Intercepte la soumission du formulaire pour empêcher le rechargement de la page.
 *  - Valide la recherche :
 *        • < 3 caractères → affiche un message d’erreur
 *        • ≥ 3 caractères → lance la mise à jour des recettes via `UpdateRecipes()`
 *  - Met à jour l’état global `StateRecipes.searchvalue` à chaque recherche.
 *
 * Effets de bord :
 *  - Déclenche un recalcul des recettes filtrées
 *    (recherche plein texte + tags actifs) via `UpdateRecipes()`.
 *  - Met à jour l’affichage du nombre de résultats et les filtres dynamiques.
 *
 * @returns {void}
 *
 */
export const mainsearch= () => {

    const mainSearch= document.querySelector('.pp-search');
    const inputsearch = document.querySelector('.pp-search__input');
    StateRecipes.searchvalue="";

    // Masquer l'erreur dès qu'on tape + de 2 caractères
    inputsearch.addEventListener("input", () => {
        if (inputsearch.value.trim() === "") {
             StateRecipes.searchvalue=normaliseText(inputsearch.value);
             UpdateRecipes ();
        }
        if (inputsearch.value.length>2) {
            hideError(".formData");
        }
    });

    mainSearch.addEventListener("submit", (event) => {
        const value = inputsearch.value;
        event.preventDefault();

        StateRecipes.searchvalue=normaliseText(inputsearch.value);

        if (value.trim().length < 3) { 
            displayError(".formData", "Veuillez entrer au minimum 3 caractères pour la recherche");
        }
        else
        {
            hideError(".formData");
        }
         if (value.trim().length >2 ) { 
            //affichage recettes  + mise à jour des filtres
             UpdateRecipes ();
        }
    });

}


