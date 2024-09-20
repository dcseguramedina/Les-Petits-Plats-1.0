export default function displayRecipeCards(recipes) {
    let allRecipes = []

    try {
        // Use a template element ([data-recipe-card-template]) to create recipe cards
        const recipeCardTemplate = document.querySelector(
            '[data-recipe-card-template]'
        )
        const recipeCardContainer = document.querySelector(
            '[data-recipe-cards-container]'
        )

        // Use a DocumentFragment to append all recipe cards at once
        const fragment = document.createDocumentFragment()

        // Dynamically populates each card with recipe details
        // Use data attributes for selecting elements to separates concerns between HTML structure and JavaScript functionality
        allRecipes = recipes.map((recipe) => {
            try {
                const card =
                    recipeCardTemplate.content.cloneNode(true).children[0]

                const recipeTime = card.querySelector('[data-recipe-time]')
                recipeTime.textContent = `${recipe.time} min`

                const recipeImage = card.querySelector('[data-recipe-image]')
                recipeImage.src = `../src/assets/recipes/${recipe.image}`
                recipeImage.loading = 'lazy'
                recipeImage.alt = recipe.name

                const recipeName = card.querySelector('[data-recipe-name]')
                recipeName.textContent = recipe.name

                const recipeDescriptionTitle = card.querySelector(
                    '[data-recipe-description-title]'
                )
                recipeDescriptionTitle.textContent = `recette`

                const recipeDescriptionText = card.querySelector(
                    '[data-recipe-description-text]'
                )
                recipeDescriptionText.textContent = recipe.description

                const recipeIngredientsTitle = card.querySelector(
                    '[data-recipe-ingredients-title]'
                )
                recipeIngredientsTitle.textContent = `ingrédients`

                const recipeIngredientsList = card.querySelector(
                    '[data-recipe-ingredients-list]'
                )

                // Create a list of ingredients to display them in the recipe card
                let ingredientsList = recipe.ingredients

                for (let i = 0; i < ingredientsList.length; i++) {
                    const list = document.createElement('ul')
                    list.className = 'mt-5'
                    recipeIngredientsList.appendChild(list)

                    const ingredient = document.createElement('li')
                    ingredient.textContent = ingredientsList[i].ingredient
                    list.appendChild(ingredient)

                    const quantity = document.createElement('li')
                    quantity.className = 'text-stone-500'
                    quantity.textContent =
                        (ingredientsList[i].quantity
                            ? ingredientsList[i].quantity
                            : '') +
                        ' ' +
                        (ingredientsList[i].unit ? ingredientsList[i].unit : '')
                    list.appendChild(quantity)
                }

                fragment.append(card)
                recipeCardContainer.append(fragment)

                // Return an array of objects containing both the recipe data and the corresponding DOM element
                return {
                    name: recipe.name,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    appliances: recipe.appliance,
                    ustensils: recipe.ustensils,
                    element: card,
                }
            } catch (error) {
                console.error(
                    `Error creating card for recipe ${recipe.name}:`,
                    error
                )
            }
        })

        return allRecipes
    } catch (error) {
        console.error('Error in displayRecipeCards:', error)
    }
}
