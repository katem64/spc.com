// Footer Loader - Dynamically loads universal footer on all pages
(function() {
  'use strict';

  // Load footer HTML
  function loadFooter() {
    // Check if footer already exists
    if (document.querySelector('.universal-footer')) {
      return;
    }

    // Find existing footer or create insertion point
    const existingFooter = document.querySelector('footer');
    const body = document.body;
    
    // Determine correct path based on location
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes('/pages/');
    const footerFile = isInPagesFolder ? '../footer.html' : './footer.html';
    
    fetch(footerFile)
      .then(response => response.text())
      .then(html => {
        // Remove old footer if exists
        if (existingFooter) {
          existingFooter.remove();
        }

        // Remove any inline footer styles from old footers
        const oldFooters = document.querySelectorAll('footer[style]');
        oldFooters.forEach(f => f.remove());

        // Insert new footer before closing body tag
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const footer = tempDiv.querySelector('.universal-footer');
        
        if (footer) {
          body.appendChild(footer);
        }
      })
      .catch(error => {
        console.warn('Footer could not be loaded:', error);
      });
  }

  // Load footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }

})();
