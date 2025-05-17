document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('page-404-body')) { // Check for 404 page
        return;
    }

    fetch('/layout.html')
      .then(res => {
        if (!res.ok) {
            throw new Error(`Failed to load layout: ${res.status}`);
        }
        return res.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Inject head elements (excluding title, specific metas already on page)
        const layoutHeadElements = doc.head.childNodes;
        const currentTitle = document.querySelector('title');
        const currentDescription = document.querySelector('meta[name="description"]');

        layoutHeadElements.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'TITLE' ||
                    (node.tagName === 'META' && node.getAttribute('name') === 'description') ||
                    (node.tagName === 'META' && node.getAttribute('charset')) ||
                    (node.tagName === 'META' && node.getAttribute('name') === 'viewport')) {
                    // Skip, as these should be unique per page or are fundamental
                } else {
                    // Avoid duplicating CSS links
                    let exists = false;
                    if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
                        const existingLinks = document.head.querySelectorAll(`link[rel="stylesheet"][href="${node.getAttribute('href')}"]`);
                        if (existingLinks.length > 0) exists = true;
                    }
                    if (node.tagName === 'SCRIPT' && node.src && node.src.includes('layoutLoader.js')) {
                        exists = true; // Don't load self
                    }
                    if (!exists) {
                        document.head.appendChild(node.cloneNode(true));
                    }
                }
            }
        });

        // If the current page didn't have a title/desc, use layout's as fallback (optional)
        if (!currentTitle && doc.querySelector('title')) {
            document.title = doc.querySelector('title').textContent;
        }
        // You can do the same for description if needed

        // Inject body content (navbar, hero, support button)
        const layoutBodyContent = doc.body.innerHTML; // This gets everything from layout's body
        document.body.insertAdjacentHTML('afterbegin', layoutBodyContent);

        // Re-initialize navActive if it's part of the layout script bundle (it is)
        if (window.setupNavActiveLink) {
            window.setupNavActiveLink();
        }
      })
      .catch(error => console.error('Error loading layout:', error));
});