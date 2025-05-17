function initializeSearch(inputId, containerSelector, itemSelector, titleSelector, descriptionSelector) {
    const searchInput = document.getElementById(inputId);
    const itemContainer = document.querySelector(containerSelector);

    if (!searchInput || !itemContainer) {
        // console.log(`Search setup failed for ${inputId}: missing input or container.`);
        return;
    }

    // Get all items once to avoid re-querying the DOM on every input
    const allItems = Array.from(itemContainer.querySelectorAll(itemSelector));
    if (!allItems.length) {
        // console.log(`Search setup for ${inputId}: no items found with selector '${itemSelector}'.`);
        return;
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();

        allItems.forEach(item => {
            const titleElement = item.querySelector(titleSelector);
            const descriptionElement = item.querySelector(descriptionSelector);

            const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
            const descriptionText = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';

            if (titleText.includes(searchTerm) || descriptionText.includes(searchTerm)) {
                item.style.display = ''; // Show item (reset to default display)
            } else {
                item.style.display = 'none'; // Hide item
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Ebooks Page Search
    initializeSearch(
        'ebook-search',          // ID of the search input
        '.ebooks-grid',          // Selector for the container of items
        '.ebook-card',           // Selector for individual items
        'h2',                    // Selector for title within an item
        '.ebook-description'     // Selector for description within an item
    );

    // Blog Page Search
    initializeSearch(
        'blog-search',
        '.blog-list',
        '.blog-post-summary',
        'h2 a',                  // Title is within an 'a' tag here
        '.post-excerpt'
    );
});