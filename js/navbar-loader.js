// Navbar Loader - Dynamically loads universal navbar on all pages
(function() {
  'use strict';

  // Load navbar HTML
  function loadNavbar() {
    // Check if navbar already exists
    if (document.querySelector('#mainNav')) {
      return;
    }

    // Determine which navbar to load based on location
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes('/pages/');
    const navbarFile = isInPagesFolder ? '../navbar-for-pages.html' : './navbar.html';

    fetch(navbarFile)
      .then(response => response.text())
      .then(html => {
        // Remove any old navbar if exists
        const oldNav = document.querySelector('nav');
        if (oldNav) {
          oldNav.remove();
        }

        // Insert new navbar at the beginning of body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html.trim();
        const navbar = tempDiv.querySelector('nav#mainNav');
        
        if (navbar) {
          // Insert right after body opening tag
          document.body.insertBefore(navbar, document.body.firstChild);
          const languageScript = document.createElement('script');
          languageScript.src = isInPagesFolder ? '../js/global-language.js?v=4' : './js/global-language.js?v=4';
          document.body.appendChild(languageScript);
        } else {
          console.error('Could not find nav element in navbar.html');
        }

        console.log('Universal navbar loaded successfully');
      })
      .catch(error => {
        console.error('Error loading navbar:', error);
      });
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
  } else {
    loadNavbar();
  }
})();
