import recipes from '../../data/recipes.js'

// Import recipe data from JSON file and assign it to listOfRecipes
const listOfRecipes = recipes.recipes

// Extract all unique elements to create arrays containing the ingredients, appliances, and utensils used across all recipes
// The use of Set ensures no duplicates
const uniqueElements = listOfRecipes.reduce(
    (acc, recipe) => {
        // Add ingredients
        recipe.ingredients.forEach((ing) => acc.ingredients.add(ing.ingredient))
        // Add appliance
        acc.appliances.add(recipe.appliance)
        // Add ustensils
        recipe.ustensils.forEach((utensil) => acc.ustensils.add(utensil))
        return acc
    },
    {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
    }
)

const listOfRecipeIngredients = [...uniqueElements.ingredients]
const listOfRecipeAppliances = [...uniqueElements.appliances]
const listOfRecipeUstensils = [...uniqueElements.ustensils]

// Create arrays to be used for configuring UI elements (select dropdowns)
const listOfSelects = [
    {
        id: 'ingredients',
        text: 'Ingredients',
        contentId: 'ingredients_content',
        inputId: 'ingredients_input',
        inputLabel: 'ingredient',
    },
    {
        id: 'appliance',
        text: 'Appliance',
        contentId: 'appliance_content',
        inputId: 'appliance_input',
        inputLabel: 'appliance',
    },
    {
        id: 'ustensils',
        text: 'Ustensils',
        contentId: 'ustensils_content',
        inputId: 'ustensils_input',
        inputLabel: 'ustensil',
    },
]

const listOfOptions = [
    { id: 'ingredients', options: listOfRecipeIngredients },
    { id: 'appliance', options: listOfRecipeAppliances },
    { id: 'ustensils', options: listOfRecipeUstensils },
]

export {
    listOfRecipes,
    listOfRecipeIngredients,
    listOfRecipeAppliances,
    listOfRecipeUstensils,
    listOfOptions,
    listOfSelects,
}
