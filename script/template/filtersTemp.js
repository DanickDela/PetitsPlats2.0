import { StateRecipes } from "../utils/services.js";

/**
 * Génère et met à jour les listes des filtres (ingrédients, appareils, ustensiles)
 * en créant dynamiquement les éléments `<li>` dans les dropdowns correspondants.
 *
 * Chaque élément créé reçoit :
 *  - role="option" (accessibilité)
 *  - tabindex="0" (navigation clavier)
 *  - un hover Tailwind (surbrillance)
 *  - un formatage padding + line-height
 *
 * @param {RecipeInfo[]} recipes - Liste des recettes (instances de RecipeInfo)
 *
 */
export function DefineFilterTemplate (VuIngredients,VuAppareils,VuUstensiles) {


    const fingredientchoixlist=document.querySelector('.fingredient__items')
    fingredientchoixlist.innerHTML = ""; // on vide

    const fappareilschoixlist=document.querySelector('.fappareil__items')
    fappareilschoixlist.innerHTML = ""; // on vide

    const fustensilschoixlist=document.querySelector('.fustensile__items')
    fustensilschoixlist.innerHTML = ""; // on vide
    //mise à jour du filtre ingrédient


    const ingredients = [...VuIngredients];
    //classé par ordre alphabétique
    const ingredientsClasse= ingredients.sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase(), 'fr')
    );

    ingredientsClasse.map ((ing) => { 
   
        const listIngredient = document.createElement('li');
        
        listIngredient.setAttribute("role", "option");
        listIngredient.setAttribute("tabindex", "0"); 
        listIngredient.textContent=ing;
        listIngredient.classList.add(   "pt-[9px]","pb-[9px]",
                                        "pl-[16px]","leading-[19px]",
                                        "flex", "flex-row",
                                        "items-center","hover:bg-yellow","hover:text-black");
        fingredientchoixlist.appendChild(listIngredient); 
    });

    const appareils = [...VuAppareils];
    //classé par ordre alphabétique
    const appareilsClasse= appareils.sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase(), 'fr')
    );


    appareilsClasse.map((app) => {

        //mise à jour du filtre des appareils
        const listappareils = document.createElement('li'); 

        listappareils.setAttribute("role", "option");
        listappareils.setAttribute("tabindex", "0"); 
        listappareils.textContent=app;
        listappareils.classList.add(   "pt-[9px]","pb-[9px]",
                                        "pl-[16px]","leading-[19px]",
                                        "flex", "flex-row",
                                        "items-center","hover:bg-yellow","hover:text-black");
        fappareilschoixlist.appendChild(listappareils);   
    });


    const ustensiles = [...VuUstensiles];

    //classé par ordre alphabétique
    const ustensilesClasse= ustensiles.sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase(), 'fr')
    );

    //mise à jour du filtre du filtres ustensiles
    ustensilesClasse.map((ust) => {
        const listustensils = document.createElement('li'); 

        listustensils.setAttribute("role", "option");
        listustensils.setAttribute("tabindex", "0"); 
        listustensils.textContent=ust;
        listustensils.classList.add(   "pt-[9px]","pb-[9px]",
                                    "pl-[16px]","leading-[19px]",
                                    "flex", "flex-row",
                                    "items-center","hover:bg-yellow","hover:text-black");
        fustensilschoixlist.appendChild(listustensils);     
    })

}
/**
 * Ajoute dynamiquement un tag dans le système de filtres (ingrédients, appareils, ustensiles).
 *
 * Cette fonction :
 *  - Crée un bloc de tag (texte + bouton de fermeture).
 *  - L’insère dans le DOM juste avant le conteneur de choix du filtre
 *    correspondant (ex : `.fingredient__choix`).
 *  - Met à jour le décalage vertical de la grille de recettes
 *    (`.recipes_list`) en fonction du nombre maximum de tags actifs
 *    (ingrédients, appareils, ustensiles).
 *  - Configure le bouton de fermeture pour supprimer le tag du DOM
 *    via `removeTag` et déclencher un callback optionnel (`onDelete`)
 *    afin de mettre à jour le filtrage.
 *
 * @param {string} Rootelement - Préfixe BEM du filtre ciblé
 *   (ex. "fingredient", "fappareil", "fustensile").
 * @param {string} text - Texte affiché dans le tag (nom de l’ingrédient, appareil ou ustensile).
 * @param {Function} [onDelete] - Callback appelée lors de la suppression du tag.
 *   Reçoit en argument un objet `{ root, value }` si propagé par `removeTag`.
 *
 * @returns {void}
 *
 */
 export function addTag(Rootelement, text,onDelete) {

    const input = document.querySelector(`.${Rootelement}__choix`);
    const parent= document.querySelector(`.${Rootelement}__choix`).parentNode;
    
    // --- Création du conteneur du tag ---
    const tagBox = document.createElement("div");
    tagBox.classList.add(
                        `${Rootelement}__tag`,
                        "flex",
                        "flex-row",
                        "justify-between",
                        "items-center",
                        "w-[203px]",
                        "h-[53px]",
                        "mt-[0px]",
                        "mb-[0px]",
                        "rounded-[10px]",
                        "pt-[17px]",
                        "pb-[17px]",
                        "pr-2",
                        "pl-[18px]",
                        "bg-yellow"
                    );

    // Utile pour la mise à jour du filtrage           
    tagBox.dataset.root = Rootelement;
    tagBox.dataset.value = text;

    // --- Texte du tag ---
    const tagText = document.createElement("p");
    tagText.classList.add(
                            `${Rootelement}__text`,
                            "font-[Manrope]",
                            "font-normal",
                            "text-[14px]",
                            "text-black",
                            "overflow-hidden",
                            "text-ellipsis",
                            "text-left"
                        );
    tagText.textContent = text;
    tagBox.appendChild(tagText);

    // --- Bouton de fermeture ---
    const tagCloseBtn = document.createElement("button");
    tagCloseBtn.classList.add(
                            `${Rootelement}__btn`,
                            "flex",
                            "items-center",
                            "justify-center",
                            "h-4",
                            "w-4",
                            "rounded-full",
                            "group",
                            "hover:bg-black"
                        );

   // Ajout de l'icône dans le bouton svg pour ptimisation des requêtes
    const tagBtnIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    tagBtnIcon.setAttribute("viewBox", "0 0 10 10");
    tagBtnIcon.setAttribute("fill", "none");
    tagBtnIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    tagBtnIcon.classList.add("w-2.5", "h-2.5", "text-black","group-hover:text-white");

    // Création du <path>
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M2 2L8 8M8 2L2 8");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2.17");
    path.setAttribute("stroke-linecap", "round");

    tagBtnIcon.appendChild(path);
    tagCloseBtn.appendChild(tagBtnIcon);
    tagBox.appendChild(tagCloseBtn);

    parent.insertBefore(tagBox, input);

    const maxTags = Math.max(
        StateRecipes.activeTags.ingredient.size,
        StateRecipes.activeTags.appareil.size,
        StateRecipes.activeTags.ustensile.size
    );

    // gestion du décalage de la grille
    const filter = document.querySelector(".recipes_list");
    let shiftafter= 55 + maxTags * 62;
    filter.style.marginTop=`${shiftafter}px`;

    // clic sur la croix = suppression du tag
    tagCloseBtn.addEventListener("click", () => {
        removeTag(tagBox, onDelete);
    });
}

/**
 * Supprime un tag du DOM et appelle un callback optionnel.
 *
 * @param {HTMLDivElement} tagBox - Le conteneur du tag à supprimer
 * @param {Function} [onDelete] - Callback appelée avec { root, value }
 * pour mettre à jour le filtrage
 */
export function removeTag(tagBox, onDelete) {
    const root = tagBox.dataset.root;
    const value = tagBox.dataset.value;

    tagBox.remove();

    if (typeof onDelete === "function") {
        onDelete({ root, value });
    }
}