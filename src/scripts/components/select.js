import { handleClickOnOptions } from '../components/searchBar.js'

export default function displaySelectDropdowns(selects, listOfOptions) {
    let allSelects = []

    try {
        // Use a template element ([data-select-template]) to create selects
        const selectTemplate = document.querySelector('[data-select-template]')
        const selectContainer = document.querySelector(
            '[data-select-container]'
        )

        // Use a DocumentFragment to append all recipe cards at once
        const fragment = document.createDocumentFragment()

        allSelects = selects.map((select) => {
            try {
                const dropdown =
                    selectTemplate.content.cloneNode(true).children[0]

                const dropdownBtn = dropdown.querySelector(
                    '[data-dropdown-btn]'
                )
                dropdownBtn.setAttribute('id', `${select.id}`)
                dropdownBtn.setAttribute(
                    'aria-label',
                    `Sélectionner par ${select.id}`
                )
                dropdownBtn.textContent = select.text

                const iconElement = document.createElement('span')
                iconElement.className = 'arrow'
                iconElement.textContent = `>`
                dropdownBtn.appendChild(iconElement)

                // Attach event listeners for click and keydown events on the dropdown
                dropdownBtn.addEventListener('click', handleDropdownToggle)
                dropdownBtn.addEventListener('keydown', handleDropdownToggle)

                const dropdownContent = dropdown.querySelector(
                    '[data-dropdown-content]'
                )
                dropdownContent.setAttribute('id', `${select.contentId}`)

                const dropdownInput = dropdown.querySelector(
                    '[data-dropdown-input]'
                )
                dropdownInput.setAttribute('id', `${select.inputId}`)
                dropdownInput.setAttribute(
                    'aria-label',
                    `Recherche d'un ${select.inputLabel}`
                )
                // Attach keyup event on the select input
                // As you fill in the input, any keywords that don't match should disappears
                dropdownInput.addEventListener('keyup', (e) => {
                    e.preventDefault()
                    filterOptions(e.currentTarget)
                })

                // Find the correct options list for this select
                const optionsForThisSelect = listOfOptions.find(
                    (option) => option.id === select.id
                )

                if (optionsForThisSelect) {
                    // Add options to the dropdown
                    optionsForThisSelect.options.forEach((option) => {
                        const optionElement = document.createElement('div')
                        optionElement.className = 'dropdown_item'
                        optionElement.textContent = option
                        optionElement.setAttribute('data-value', option)
                        dropdownContent.appendChild(optionElement)

                        // Attach event listeners for click and keydown events on the options
                        optionElement.addEventListener(
                            'click',
                            handleClickOnOptions
                        )
                        optionElement.addEventListener(
                            'keydown',
                            handleClickOnOptions
                        )
                    })
                }

                fragment.append(dropdown)
                selectContainer.append(fragment)

                return {
                    id: select.id,
                    contentId: select.contentId,
                    inputId: select.inputId,
                    element: dropdown,
                }
            } catch (error) {
                console.error(
                    `Error creating dropdown for ${select.id}:`,
                    error
                )
            }
        })

        return allSelects
    } catch (error) {
        console.error('Error in displaySelectDropdowns:', error)
    }
}

// Handle open/close on select dropdown
function handleDropdownToggle(e) {
    const key = e.key
    // Handle keyboard and mouse interactions
    if (key === 'Enter' || key === ' ' || e.type === 'click') {
        e.preventDefault()
        dropdowntoggle(e.currentTarget)
    }
}

function dropdowntoggle(currentTarget) {
    let id = currentTarget.id
    const selectDropdown = document.getElementById(id)
    selectDropdown.nextElementSibling.classList.toggle('show')
    selectDropdown.lastElementChild.style.transform =
        selectDropdown.nextElementSibling.classList.contains('show')
            ? 'rotate(270deg)'
            : 'rotate(90deg)'
    selectDropdown.style.borderRadius =
        selectDropdown.nextElementSibling.classList.contains('show')
            ? '10px 10px 0 0'
            : '10px'
}

// Filter options to show only matching keywords while fillingt the input
function filterOptions(currentTarget) {
    const selectInputValue = currentTarget.value.toLowerCase()
    const inputContainer = currentTarget.parentElement
    const options = inputContainer
        .closest('.dropdown_content')
        .getElementsByClassName('dropdown_item')

    Array.from(options).forEach((option) => {
        const optionInputValue = option.textContent
        const isVisible = optionInputValue
            .toLowerCase()
            .includes(selectInputValue)
        option.style.display = isVisible ? '' : 'none'
        option.closest('.dropdown_content').style.height = 'auto'
    })
}
