/**
 * Génère et retourne un élément DOM représentant la carte d'une recette.
 * 
 * Cette fonction crée dynamiquement toute la structure HTML d’une carte
 * (image, titre, temps de préparation, description, ingrédients),
 * en appliquant les classes Tailwind nécessaires au style.
 *
 * @function DefineRecipeTemplate
 * @param {RecipeInfo} recipe - Instance du modèle RecipeInfo contenant toutes les données de la recette.
 * @returns {HTMLElement} L’élément <article> complet représentant la carte recette.
 */
export function DefineRecipeTemplate (recipe) {
    

    const recipeCard = document.createElement('article');
    recipeCard.classList.add(  "recipe-card",
                                "w-[380px]",
                                "h-[731px]",
                                "bg-white",
                                "rounded-[21px]",
                                "relative"
                                );
    // Image recette
    const recipeImage= document.createElement('img');
    recipeImage.src= recipe.imageUrl;
    recipeImage.alt= recipe.name;
    recipeImage.loading="lazy";
    recipeImage.classList.add(
                                "recipe-card__image",
                                "w-full",
                                "h-[253px]",
                                "object-cover",
                                "rounded-t-[21px]",
                                );

    recipeCard.appendChild (recipeImage);

    // Badge temps 
    const recipeTime=document.createElement('div')
    recipeTime.classList.add(   "recipe-card__time",
                                "absolute",
                                "flex",
                                "items-center",
                                "justify-center",
                                "w-[63px]",
                                "h-[26px]",
                                "rounded-[14px]",
                                "top-[21px]",
                                "right-[22px]",
                                "bg-yellow"
                            );
    recipeCard.appendChild (recipeTime);
    const recipeTimetext=document.createElement('p');
    recipeTimetext.textContent=recipe.time+"min";
    recipeTimetext.classList.add(  "recipe-card__time-label",
                                "text-black",
                                "font-[Manrope]",
                                "text-[12px]",
                                "font-normal"
                            );
    recipeTime.appendChild (recipeTimetext);

     // Titre
    const RecipeTitle= document.createElement('h3');
    RecipeTitle.textContent= recipe.name;
    RecipeTitle.classList.add(  "recipe-card__title",
                                "ml-[25px]",
                                "mt-8",
                                "font-[Anton]",
                                "text-[18px]",
                                "font-normal",
                                "text-black"
                                );
    recipeCard.appendChild (RecipeTitle);
 
    // Contenu principal
    const recipeContent= document.createElement('div');
    recipeContent.classList.add(
                                "content",
                                "mt-[29px]",
                                "ml-[25px]",
                                "mr-[25px]",
                                "flex",
                                "flex-col",
                                "gap-8"
                                );
    recipeCard.appendChild (recipeContent);

    // Label + description de la recette
    const recipeRecette=document.createElement('div')
    recipeRecette.classList.add(    "content_recette",
                                    "flex",
                                    "flex-col",
                                    "items-baseline",
                                    "gap-[15px]"
                                );
    recipeContent.appendChild (recipeRecette);

    // Titre "RECETTE"
    const recetteLabel= document.createElement('p');
    recetteLabel.textContent= "RECETTE";
    recetteLabel.classList.add( "content__recette-label",
                                "font-[Manrope]",
                                "text-[12px]",
                                "font-bold",
                                "text-grey",
                                "m-0"
                                );
    recipeRecette.appendChild (recetteLabel);

    // Description recette
    const recetteDescription= document.createElement('p');
    recetteDescription.textContent=recipe.description;
    recetteDescription.classList.add("content__recette-description",
                                    "font-[Manrope]",
                                    "text-[14px]",
                                    "font-normal",
                                    "text-black",
                                    "m-0",
                                    "overflow-hidden",
                                    "text-ellipsis",
                                    "leading-[1.4]",
                                    "h-[76px]"
                                    );
    recipeRecette.appendChild (recetteDescription); 

    // Ingrédients de la recette
    const recipeIngredient= document.createElement('div');
    recipeIngredient.classList.add( "content_ingredients",
                                    "flex",
                                    "flex-col",
                                    "items-baseline",
                                    "gap-[15px]"
                                );
    recipeContent.appendChild (recipeIngredient);

    // Titre "INGREDIENTS"
    const ingredientLabel= document.createElement('p');
    ingredientLabel.textContent= "INGRÉDIENTS";
    ingredientLabel.classList.add("content_ingredients-label",
                                "font-[Manrope]",
                                "text-[12px]",
                                "font-bold",
                                "text-grey",
                                "m-0"
                                );
    recipeIngredient.appendChild (ingredientLabel);

    //Tableau de 2 colonnes de la liste des ingrédients
    const ingredientList= document.createElement('div');
    ingredientList.classList.add("ingredientslist",
                                "grid",
                                "grid-cols-[179px_1fr]",
                                "mb-[61px]",
                                );
    recipeIngredient.appendChild (ingredientList);


    // Ingrédients colonne 1                            
    const ingredientColumn1= document.createElement('dl');
    ingredientColumn1.classList.add("ingredients__list-col1",
                                    "space-y-[21px]",
                                    "font-[Manrope]",
                                    "text-[14px]");
    ingredientList.appendChild (ingredientColumn1);

     // Ingrédients colonne 2   
    const ingredientColumn2= document.createElement('dl');
    ingredientColumn2.classList.add("ingredients__list-col2",
                                    "space-y-[21px]",
                                    "font-[Manrope]",
                                    "text-[14px]" );
    ingredientList.appendChild (ingredientColumn2);

    // Répartition des ingrédients dans les deux colonnes
    recipe.ingredients.forEach((ing, index) => {
 
        const ingredientName = document.createElement('dt');
        ingredientName.textContent = ing.ingredient;
        ingredientName.classList.add(
            "ingredient__list-name",
            "font-medium",
            "text-black",
            "leading-[1.4]",
            "m-0"
        );

        const ingredientQuantity = document.createElement('dd');
        const formatted = recipe.formattedIngredients[index] ?? "";
        ingredientQuantity.textContent = formatted;
        ingredientQuantity.classList.add(
            "ingredient__list-quantity",
            "font-normal",
            "leading-[1.4]",
            "text-grey",
        );

        // on décide dans quelle colonne mettre l'ingrédient et les quantité
        if (index % 2 === 0) {
            ingredientColumn1.appendChild(ingredientName);
            ingredientColumn1.appendChild(ingredientQuantity);

        } else {
            ingredientColumn2.appendChild(ingredientName);
            ingredientColumn2.appendChild(ingredientQuantity);
        }
    });     

    return recipeCard;
}

