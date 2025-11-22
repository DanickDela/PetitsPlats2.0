
  /**
   * 
   * @param {object} recipe - Données brutes provenant du JSON.
   * @param {number} recipe.id - Identifiant unique de la recette.
   * @param {string} recipe.image - Nom du fichier image de la recette.
   * @param {string} recipe.name - Nom / titre de la recette.
   * @param {number} recipe.servings - Nombre de couverts.
   * @param {Array<object>} recipe.ingredients - Liste des ingrédients.
   * @param {string} recipe.ingredients[].ingredient - Nom de l'ingrédient.
   * @param {number|string} [recipe.ingredients[].quantity] - Quantité 
   * @param {string} [recipe.ingredients[].unit] - Unité
   * @param {number} recipe.time - Temps de préparation en minutes.
   * @param {string} recipe.description - Description / étapes de la recette.
   * @param {string} recipe.appliance - Appareil principal utilisé.
   * @param {string[]} recipe.ustensils - Liste d’ustensiles.
   */
    /**
     * Représente une recette.
     */
export class RecipeInfo {
    /**
     * Crée une instance de RecipeInfo.
     * @param {RawRecipe} recipe - Données brutes provenant du JSON.
     */
    constructor(recipe) {
        this._id = recipe.id;
        this._image = recipe.image || null;
        this._name = recipe.name;
        this._servings = recipe.servings;
        this._ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
        this._time = recipe.time;
        this._description = recipe.description;
        this._appliance = recipe.appliance || null;
        this._ustensils = Array.isArray(recipe.ustensils) ? recipe.ustensils : [];
    }

    /**
     * Identifiant de la recette.
     * @returns {number}
     */
    get idRecipe() {
        return this._id;
    }

    /**
     * Nom de la recette.
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Nom du fichier image (brut).
     * @returns {string|null}
     */
    get image() {
        return this._image;
    }

    /**
     * URL relative de l'image, ou chaîne vide si absente.
     * À adapter selon ton arborescence.
     * @returns {string}
     */
    get imageUrl() {
        if (!this._image) return "";
        return `../assets/JSON-recipes/${this._image}`;
    }

    /**
     * Nombre de couverts
     * @returns {number}
     */
    get servings() {
        return this._servings;
    }

    /**
     * Liste brute des ingrédients.
     * @returns {Array<object>}
     */
    get ingredients() {
        return this._ingredients;
    }

    /**
     * Temps de préparation (en minutes).
     * @returns {number}
     */
    get time() {
        return this._time;
    }

    /**
     * Description / étapes de la recette.
     * @returns {string}
     */
    get description() {
        return this._description;
    }

    /**
     * Appareil principal utilisé (Four, Blender, Cocotte…).
     * @returns {string|null}
     */
    get appliance() {
        return this._appliance;
    }

    /**
     * Liste des ustensiles.
     * @returns {string[]}
     */
    get ustensils() {
        return this._ustensils;
    }

    /**
     * Retourne la quantité formatée en texte lisible.
     * ex : 400ml"
     * @returns {string[]}
     */
    get formattedIngredients() {
        return this._ingredients.map((item) => {
        const quantity = item.quantity ?? "";
        const unit = item.unit ?? "";

        if (!quantity && !unit) return null;
        if (quantity && !unit) return `${quantity}`;
        return `${quantity}${unit}`;
        });
    }

    /**
     *  Retourne les ingrédients uniques avec l'id de la recette.
     * @returns {{ idRecipe: number, ingredient: string }[]}
     */
    get uniqueIngredientsWithId() {
        const seen = new Set();
        const result = [];

        this._ingredients.forEach((item) => {
            if (!item || !item.ingredient) return;

            const raw = String(item.ingredient).trim();
            const key = raw.toLowerCase();

            if (!seen.has(key)) {
                seen.add(key);
                result.push({
                    idRecipe: this._id,
                    ingredient: raw
                });
            }
        });

        return result;
    }
    /**
    * Retourne les ustensiles uniques avec l'id de la recette.
    * @returns {{ idRecipe: number, ustensil: string }[]}
    */
    get uniqueUstensilsWithId() {
        const seen = new Set();
        const result = [];

        this._ustensils.forEach((ustensil) => {
            if (!ustensil) return;

                const raw = String(ustensil).trim();
                const key = raw.toLowerCase();

            if (!seen.has(key)) {
                seen.add(key);
                result.push({
                    idRecipe: this._id,
                    ustensil: raw
                });
            }
        });

        return result;
    }

    /**
     * Texte concaténé pour la recherche plein texte :
     * nom + description + ingrédients.
     * @returns {string}
     */
    get fullTextRecipe() {
        const ingredientsText = this._ingredients
            .map((item) => item.ingredient || "") .join(" ");

        const fullText = [this._name, this._description,ingredientsText,].join(" ");

        return fullText;
    }
}


