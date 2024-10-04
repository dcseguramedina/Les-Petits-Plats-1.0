import displayRecipeCards from '../components/cards.js'
import createSearchTag from '../components/tags.js'
import { listOfRecipes } from '../utils/lists.utils.js'

// SEARCH FROM SEARCHBAR (MAIN SEARCH) //
const searchInput = document.querySelector('[data-search]')
const searchBtn = document.querySelector('[data-search-btn]')

// Add an input event for real-time search with a debounce mechanism
// Process user input by preventing a “no result” alert message from being sent while the user is still typing
function debounce(callback, delay) {
    let timer
    return function () {
        let args = arguments
        let context = this
        clearTimeout(timer)
        timer = setTimeout(function () {
            callback.apply(context, args)
        }, delay)
    }
}

searchInput.addEventListener(
    'input',
    debounce((e) => {
        const value = e.target.value.trim().toLowerCase()
        if (value.length >= 3) {
            handleSearch(value)
        } else {
            clearSearchResults()
        }
    }, 500)
)

// Add keydown event for Enter key press
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        clearSearchResults()
        handleSearch(e.currentTarget.value)
        e.currentTarget.value = ''
    }
})

// Add click event for search button
searchBtn.addEventListener('click', () => {
    clearSearchResults()
    handleSearch(searchInput.value)
    searchInput.value = ''
})

// Add event to clean searchBar input on page reload
window.addEventListener('load', () => {
    searchInput.value = ''
})

// SEARCH FROM SELECT OPTIONS (ADVANCED SEARCH) //

export function handleClickOnOptions(e) {
    e.preventDefault()
    e.currentTarget.closest('.dropdown_content').classList.remove('show')
    e.currentTarget.closest(
        '.dropdown_content'
    ).previousElementSibling.style.borderRadius = '10px'
    handleSearch(e.currentTarget.textContent)
    // Create and add a tag to the DOM for the select options search
    createSearchTag(e.currentTarget.textContent)
}

// HANDLE SEARCH GENERAL //

// Initialize the results array with all recipes
let results = [...listOfRecipes]

// Handle earch process when a user enter an input (launch a search)
function handleSearch(value) {
    // Normalize the input value for consistent handling of search terms
    value = value.trim().toLowerCase()
    // Validate the input length (at least 3 characters long) and display error if needed
    if (value.length < 3) {
        displaySearchError('Veuillez saisir au moins 3 caractères.')
        return
    }

    // Performs the search if the input is valid and update the page with the search results
    launchSearch(value)
    updateHomePage(results, value)
}

// Display an error for short inputs
function displaySearchError(message) {
    alert(message)
}

// Clear search results before starting a new search (when searching in the searchBar only)
function clearSearchResults() {
    results = [...listOfRecipes]
    updateHomePage(results)
}

// Iterate through the recipes and updates the results array
function launchSearch(value) {
    // Create an empty array to store recipes that match the search criteria
    let newResults = []

    // Search through all recipes, regardless of previous search results
    for (let i = 0; i < listOfRecipes.length; i++) {
        const recipe = listOfRecipes[i]

        // Check if the search value matches any of the recipe's properties
        let isMatch = false

        // Check recipe name and description
        if (
            recipe.name.toLowerCase().includes(value) ||
            recipe.description.toLowerCase().includes(value)
        ) {
            isMatch = true
        }

        // Check ingredients
        if (!isMatch) {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (
                    recipe.ingredients[j].ingredient
                        .toLowerCase()
                        .includes(value)
                ) {
                    isMatch = true
                    break
                }
            }
        }

        // Check appliance
        if (!isMatch && recipe.appliance.toLowerCase().includes(value)) {
            isMatch = true
        }

        // Check ustensils
        if (!isMatch) {
            for (let k = 0; k < recipe.ustensils.length; k++) {
                if (recipe.ustensils[k].toLowerCase().includes(value)) {
                    isMatch = true
                    break
                }
            }
        }

        if (isMatch) {
            // Add matching recipes to newResults array
            newResults.push(recipe)
        }
    }

    // Update the global results array filtering the results
    results = results.filter((recipe) => {
        for (let i = 0; i < newResults.length; i++) {
            if (newResults[i].name === recipe.name) {
                return true
            }
        }
        return false
    })

    return results
}

// Update the home page with the search results
// Update available items in advanced search (select options)
function updateHomePage(results, value) {
    // Display "no results" alert message if needed
    if (results.length === 0) {
        alert(
            `Aucune recette ne contient "${value}" vous pouvez chercher «tarte aux pommes », « poisson », etc.`
        )
    } else {
        const recipesSection = document.querySelector('.recipes_section')
        recipesSection.textContent = ''
        displayRecipeCards(results)
        updateSelectOptions(results)
        updateRecipesNumber(results)
    }
}

// Update the options in a dropdown based on the current search results
function updateSelectOptions(results) {
    // Extract unique elements from the results
    const getUniqueElements = (results, key, subKey = null) => [
        ...new Set(
            results.flatMap((result) =>
                subKey ? result[key].map((item) => item[subKey]) : result[key]
            )
        ),
    ]
    // Create an array of objects (containing id and options for each select)
    const listOfUpdatedOptions = [
        {
            id: 'ingredients_content',
            options: getUniqueElements(results, 'ingredients', 'ingredient'),
        },
        {
            id: 'appliance_content',
            options: getUniqueElements(results, 'appliance'),
        },
        {
            id: 'ustensils_content',
            options: getUniqueElements(results, 'ustensils'),
        },
    ]

    const dropdownContents = document.querySelectorAll(
        '[data-dropdown-content]'
    )

    dropdownContents.forEach((dropdown) => {
        // Find the correct options list for each select
        const optionsForThisSelect = listOfUpdatedOptions.find(
            (option) => option.id === dropdown.id
        )

        if (optionsForThisSelect) {
            // Remove existing options with class 'dropdown_item'
            dropdown
                .querySelectorAll('.dropdown_item')
                .forEach((item) => item.remove())

            // Add new options to the select
            optionsForThisSelect.options.forEach((option) => {
                const optionElement = document.createElement('div')
                optionElement.className = 'dropdown_item'
                optionElement.textContent = option
                optionElement.setAttribute('data-value', option)
                dropdown.appendChild(optionElement)

                // Add a click event for each new option
                optionElement.addEventListener('click', handleClickOnOptions)
            })
        }
    })
}

function updateRecipesNumber(results) {
    const recipesNumber = document.getElementById('recipes_number')
    if (results.length === 50) {
        recipesNumber.textContent = `1500 recettes`
    } else {
        let number = results.length
        recipesNumber.textContent = `${number} recette${number !== 1 ? 's' : ''}`
    }
}
