import displayRecipeCards from '../components/cards.js'
import displaySelectDropdowns from '../components/select.js'
import {
    listOfRecipes,
    listOfSelects,
    listOfOptions,
} from '../utils/lists.utils.js'

function displayHomePage() {
    displaySelectDropdowns(listOfSelects, listOfOptions)
    displayRecipeCards(listOfRecipes)
}
displayHomePage()
