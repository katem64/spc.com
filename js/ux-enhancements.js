// UX Enhancements: Offline Indicator, Keyboard Navigation
// Improves user experience and accessibility for native apps and PWA

(function() {
  'use strict';

  // ========== OFFLINE INDICATOR ==========
  
  let offlineIndicator = null;

  function createOfflineIndicator() {
    offlineIndicator = document.createElement('div');
    offlineIndicator.className = 'offline-indicator';
    offlineIndicator.innerHTML = `
      <i class="fas fa-wifi-slash"></i>
      <span>Offline Mode</span>
    `;
    document.body.appendChild(offlineIndicator);
  }

  function showOfflineIndicator() {
    if (!offlineIndicator) createOfflineIndicator();
    offlineIndicator.classList.add('visible');
  }

  function hideOfflineIndicator() {
    if (offlineIndicator) {
      offlineIndicator.classList.remove('visible');
    }
  }

  // Monitor online/offline status
  function initOfflineMonitoring() {
    // Check initial state
    if (!navigator.onLine) {
      showOfflineIndicator();
    }

    // Listen for status changes
    window.addEventListener('online', () => {
      console.log('Back online');
      hideOfflineIndicator();
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline');
      showOfflineIndicator();
    });
  }

  // ========== KEYBOARD NAVIGATION ==========

  function initKeyboardNavigation() {
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        // Close readings modal
        const readingsModal = document.getElementById('readingsModal');
        if (readingsModal && readingsModal.classList.contains('active')) {
          if (window.MassReadings) {
            window.MassReadings.closeModal();
          }
        }

        // Close any other open modals
        const modals = document.querySelectorAll('.modal.active, .readings-modal.active');
        modals.forEach(modal => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });

    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      const readingsModal = document.getElementById('readingsModal');
      if (!readingsModal || !readingsModal.classList.contains('active')) return;

      if (e.key === 'Tab') {
        const focusableElements = readingsModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Enter key activates buttons
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('prayer-card')) {
        e.target.click();
      }
    });

    // Add tabindex to interactive elements that might be missing it
    const cards = document.querySelectorAll('.prayer-card:not([tabindex])');
    cards.forEach(card => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });
  }

  // Add focus styles
  function addFocusStyles() {
    const style = document.createElement('style');
    style.id = 'ux-enhancements-styles';
    style.textContent = `
      /* Offline Indicator */
      .offline-indicator {
        position: fixed;
        top: 70px;
        right: 1rem;
        background: linear-gradient(135deg, #9a6c2f 0%, #6b421f 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }

      .offline-indicator.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .offline-indicator i {
        font-size: 1rem;
      }

      @media (max-width: 768px) {
        .offline-indicator {
          top: 56px;
          right: 0.5rem;
          font-size: 0.8rem;
          padding: 0.4rem 0.85rem;
        }
      }

      /* Keyboard Focus Styles */
      *:focus-visible {
        outline: 2px solid #9a6c2f;
        outline-offset: 2px;
        border-radius: 4px;
      }

      .prayer-card:focus-visible {
        outline: 3px solid #9a6c2f;
        outline-offset: 3px;
        transform: translateY(-2px);
      }

      button:focus-visible,
      a:focus-visible {
        outline: 2px solid #9a6c2f;
        outline-offset: 2px;
      }

      .readings-badge:focus-visible,
      .liturgical-badge:focus-visible {
        outline: 2px solid white;
        outline-offset: 2px;
      }

      /* Skip to main content link (accessibility) */
      .skip-to-main {
        position: fixed;
        top: -100px;
        left: 1rem;
        background: #9a6c2f;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.3s ease;
      }

      .skip-to-main:focus {
        top: 1rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Add skip to main content link
  function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add id to main content if not exists
    const mainContent = document.querySelector('.container-modern, main, .dashboard-container');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('tabindex', '-1');
    }
  }

  // ========== INITIALIZATION ==========

  function init() {
    console.log('UX Enhancements: Initializing...');
    
    // Add styles first
    addFocusStyles();
    
    // Initialize features
    initOfflineMonitoring();
    initKeyboardNavigation();
    addSkipLink();
    
    console.log('UX Enhancements: Initialized successfully');
  }

  // Public API
  window.UXEnhancements = {
    showOfflineIndicator,
    hideOfflineIndicator
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

