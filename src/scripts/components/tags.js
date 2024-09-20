// Create and add a tag to the DOM when a select option search is launched
export default function createSearchTag(value) {
    if (value === '') return null

    const tagSection = document.getElementById('tag_section')
    const tagElement = createTagElement(value)
    tagSection.appendChild(tagElement)
}

// Create HTML structure for a tag
function createTagElement(value) {
    const tagElement = document.createElement('div')
    tagElement.classList.add('tag')

    const keywordElement = document.createElement('span')
    keywordElement.classList.add('keyword')
    keywordElement.textContent = value
    tagElement.appendChild(keywordElement)

    const closeElement = document.createElement('button')
    closeElement.classList.add('close')
    closeElement.type = 'button'
    closeElement.textContent = 'x'
    tagElement.appendChild(closeElement)

    // Attach event listeners for click and keydown events on the close button
    const closeButton = tagElement.querySelector('.close')
    closeButton.addEventListener('click', closeSearchTag)
    closeButton.addEventListener('keydown', closeSearchTag)

    return tagElement
}

// Handle removal of tags
function closeSearchTag(e) {
    const key = e.key
    // Handle keyboard and mouse interactions
    if (key === 'Enter' || key === ' ' || e.type === 'click') {
        e.preventDefault()
        const tagElement = e.currentTarget.closest('.tag')
        if (tagElement) tagElement.remove()
    }
}
