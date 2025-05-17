function setupNavActiveLink() {
    const navLinks = document.querySelectorAll('.navbar .nav-menu .nav-link');
    if (!navLinks.length) return;

    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        link.classList.remove('active'); // Reset all first

        if (linkPath === currentPath) {
            link.classList.add('active');
        }
        // Handle homepage case where / or /index.html redirects to /pages/about.html
        if ((currentPath === '/' || currentPath === '/index.html' || currentPath === '/pages/about.html') && linkPath === '/pages/about.html') {
            // Ensure the "About (Home)" link is active on any of these homepage paths
            if (link.getAttribute('href') === '/pages/about.html') {
                 link.classList.add('active');
            }
        }
    });
}

// Run on initial load if elements are static
// If layout is dynamically loaded, layoutLoader.js will call this
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavActiveLink);
} else {
    setupNavActiveLink();
}
window.setupNavActiveLink = setupNavActiveLink; // Expose for layoutLoader