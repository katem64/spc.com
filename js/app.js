// SPC Prayer.Com - Main App Controller
// Initializes PWA and coordinates all features

(function() {
  'use strict';

  const APP_VERSION = '1.0.0';
  
  // Check if browser supports PWA features
  function checkPWASupport() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: typeof Storage !== 'undefined',
      notifications: 'Notification' in window
    };
  }

  // Register service worker
  async function registerServiceWorker() {
    const support = checkPWASupport();
    
    if (!support.serviceWorker) {
      console.log('Service Workers not supported');
      return false;
    }

    try {
      const isNestedPage = window.location.pathname.includes('/pages/');
      const swPath = isNestedPage ? '../sw.js' : './sw.js';
      const swScope = isNestedPage ? '../' : './';
      const registration = await navigator.serviceWorker.register(swPath, {
        scope: swScope,
        updateViaCache: 'none'
      });

      console.log('Service Worker registered successfully:', registration.scope);

      // Check if there is an update waiting
      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateNotification();
      }

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        console.log('Service Worker update found');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller && registration.waiting) {
            showUpdateNotification();
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  // Show update notification
  function showUpdateNotification() {
    if (document.querySelector('.update-notification')) {
      return;
    }
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <i class="fas fa-sync-alt"></i>
        <span>A new version is available!</span>
      </div>
      <button class="update-btn" onclick="window.SPCApp.updateApp()">Update</button>
      <button class="dismiss-btn" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    document.body.appendChild(notification);

    // Auto-show after a delay
    setTimeout(() => notification.classList.add('visible'), 500);
  }

  // Update app with new service worker
  function updateApp() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    const notif = document.querySelector('.update-notification');
    if (notif) notif.remove();
    window.location.reload();
  }

  // Dark mode toggle
  function initDarkMode() {
    const savedMode = localStorage.getItem('spc-dark-mode');
    
    if (savedMode === 'enabled') {
      document.body.classList.add('dark-mode');
    }

    // Create dark mode toggle
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.setAttribute('aria-label', 'Toggle dark mode');
    darkModeBtn.setAttribute('title', 'Toggle night mode');
    darkModeBtn.innerHTML = `
      <i class="fas fa-moon"></i>
      <span>Night Mode</span>
    `;

    darkModeBtn.addEventListener('click', toggleDarkMode);

    return darkModeBtn;
  }

  // Toggle dark mode
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('spc-dark-mode', isDark ? 'enabled' : 'disabled');

    // Update button
    const btn = document.querySelector('.dark-mode-toggle');
    if (btn) {
      btn.innerHTML = `
        <i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>
        <span>${isDark ? 'Light Mode' : 'Night Mode'}</span>
      `;
    }

    // Announce to screen readers
    const announcer = document.createElement('div');
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.textContent = `${isDark ? 'Night' : 'Light'} mode activated`;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  }

  // Install prompt handling
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Only show if app is not already installed
    if (!isAppInstalled() && shouldShowInstallPrompt()) {
      showInstallPrompt();
    }
  });

  // Check if app is already installed
  function isAppInstalled() {
    // Check if running in standalone mode (installed as PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    // Check for iOS standalone mode
    if (window.navigator.standalone === true) {
      return true;
    }
    return false;
  }

  // Show install prompt
  function showInstallPrompt() {
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-content">
        <div class="install-icon">
          <i class="fas fa-download"></i>
        </div>
        <div class="install-text">
          <strong>Install SPC Prayer.Com</strong>
          <p>Access prayers offline anytime</p>
        </div>
      </div>
      <div class="install-actions">
        <button class="install-btn" onclick="window.SPCApp.promptInstall()">Install</button>
        <button class="dismiss-install" onclick="window.SPCApp.dismissInstall()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 500);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (banner.classList.contains('visible')) {
        dismissInstall();
      }
    }, 10000);
  }

  // Prompt installation
  async function promptInstall() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Install prompt ${outcome}`);
    deferredPrompt = null;
    
    const banner = document.querySelector('.install-banner');
    if (banner) banner.remove();
  }

  // Dismiss install prompt
  function dismissInstall() {
    const banner = document.querySelector('.install-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
    
    // Don't show again for 7 days
    localStorage.setItem('spc-install-dismissed', Date.now());
  }

  // Check if should show install prompt
  function shouldShowInstallPrompt() {
    const dismissed = localStorage.getItem('spc-install-dismissed');
    if (!dismissed) return true;
    
    const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
    return daysSince > 7;
  }

  // Create PWA controls container
  function createControlsContainer() {
    // Check if pwa-controls div already exists in HTML
    let container = document.querySelector('.pwa-controls');
    
    if (!container) {
      // Create new container if not found
      container = document.createElement('div');
      container.className = 'pwa-controls';
    }
    
    // Add dark mode toggle
    const darkModeBtn = initDarkMode();
    container.appendChild(darkModeBtn);

    // The other systems will add their buttons to this container
    
    return container;
  }

  // Add controls to page
  function addControlsToPage() {
    // Check if container already exists in DOM
    let container = document.querySelector('.pwa-controls');
    
    if (container) {
      // Use existing container, just add dark mode button
      const darkModeBtn = initDarkMode();
      container.appendChild(darkModeBtn);
    } else {
      // Create new container and add to page
      const controls = createControlsContainer();
      
      // Try to add after header
      const header = document.querySelector('.masthead, header');
      if (header) {
        header.insertAdjacentElement('afterend', controls);
      } else {
        // Fallback: add at top of main content
        const main = document.querySelector('.container');
        if (main) {
          main.insertBefore(controls, main.firstChild);
        }
      }
    }

    // Add styles for controls
    addControlsStyles();
  }

  // Add styles for PWA controls
  function addControlsStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .pwa-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;
        padding: 1.5rem 1rem;
        background: white;
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        z-index: 998;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }

      .dark-mode .pwa-controls {
        background: #1a1a1a;
        border-bottom-color: #2a2a2a;
      }

      .dark-mode-toggle,
      .search-btn,
      .bookmark-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 1.25rem;
        background: white;
        border: 1px solid var(--color-border);
        color: var(--color-text);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: var(--transition);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        font-size: 0.9rem;
      }

      .dark-mode-toggle:hover,
      .search-btn:hover,
      .bookmark-btn:hover {
        background: var(--color-bg-alt);
        border-color: var(--color-accent);
        color: var(--color-accent);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
      }

      .dark-mode .dark-mode-toggle,
      .dark-mode .search-btn,
      .dark-mode .bookmark-btn {
        background: #2a2a2a;
        border-color: #3a3a3a;
        color: #E8E6E3;
      }

      .dark-mode .dark-mode-toggle:hover,
      .dark-mode .search-btn:hover,
      .dark-mode .bookmark-btn:hover {
        background: #333;
        border-color: #9a6c2f;
        color: #9a6c2f;
      }

      .install-banner,
      .update-notification {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 10001;
        transition: bottom 0.3s ease;
        max-width: 90vw;
        width: 500px;
      }

      .install-banner.visible,
      .update-notification.visible {
        bottom: 2rem;
      }

      .dark-mode .install-banner,
      .dark-mode .update-notification {
        background: #2a2a2a;
        border: 1px solid #3a3a3a;
      }

      .install-content,
      .update-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex: 1;
      }

      .install-icon {
        width: 48px;
        height: 48px;
        background: #9a6c2f;
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }

      .dark-mode .install-icon {
        background: #6b421f;
        color: white;
      }

      .install-text p {
        margin: 0;
        font-size: 0.9rem;
        color: #5A5A5A;
      }

      .dark-mode .install-text p {
        color: #B8B5B2;
      }

      .install-actions {
        display: flex;
        gap: 0.5rem;
      }

      .install-btn,
      .update-btn {
        background: #9a6c2f;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .install-btn:hover,
      .update-btn:hover {
        background: #6b421f;
        transform: scale(1.05);
      }

      .dark-mode .install-btn,
      .dark-mode .update-btn {
        background: #D4A574;
        color: #1a1a1a;
      }

      .dark-mode .install-btn:hover,
      .dark-mode .update-btn:hover {
        background: #E6C068;
      }

      .dismiss-install,
      .dismiss-btn {
        background: none;
        border: none;
        color: #5A5A5A;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1.2rem;
        transition: all 0.2s ease;
      }

      .dismiss-install:hover,
      .dismiss-btn:hover {
        color: #9a6c2f;
        transform: rotate(90deg);
      }

      .dark-mode .dismiss-install:hover,
      .dark-mode .dismiss-btn:hover {
        color: #6b421f;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      @media (max-width: 768px) {
        .pwa-controls {
          padding: 1rem 0.5rem;
        }

        .install-banner,
        .update-notification {
          width: 90vw;
          flex-direction: column;
          padding: 1rem;
        }

        .install-actions {
          width: 100%;
          justify-content: space-between;
        }
      }

      @media (max-width: 576px) {
        .pwa-controls {
          gap: 0.5rem;
        }

        .dark-mode-toggle span,
        .bookmark-btn span,
        .search-btn span {
          display: none;
        }

        .dark-mode-toggle,
        .bookmark-btn,
        .search-btn {
          padding: 0.6rem;
          min-width: 44px;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Cache all prayers for offline use
  async function cacheAllPrayers() {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (!worker) return;

    const prayerUrls = ['./landing.html'];
    const isNestedPage = window.location.pathname.includes('/pages/');
    const appRoot = isNestedPage ? '../' : './';
    const manifestPath = `${appRoot}data/prayer-page-manifest.json`;

    try {
      const response = await fetch(manifestPath);
      if (response.ok) {
        const pageNames = await response.json();
        pageNames.forEach((pageName) => prayerUrls.push(`${appRoot}pages/${pageName}`));
      }
    } catch (error) {
    }

    document.querySelectorAll('a[href]').forEach((link) => {
      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin === window.location.origin && url.pathname.endsWith('.html')) {
          url.hash = '';
          url.search = '';
          prayerUrls.push(url.href);
        }
      } catch (error) {
      }
    });

    const pageResources = await Promise.all(prayerUrls.map(async (pageUrl) => {
      try {
        const response = await fetch(pageUrl);
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) return [];
        const documentText = await response.text();
        const parsedDocument = new DOMParser().parseFromString(documentText, 'text/html');
        return [...parsedDocument.querySelectorAll('[src], [href]')].map((element) => element.src || element.href).filter((resourceUrl) => {
          try {
            return new URL(resourceUrl).origin === window.location.origin;
          } catch (error) {
            return false;
          }
        });
      } catch (error) {
        return [];
      }
    }));

    worker.postMessage({
      type: 'CACHE_PRAYERS',
      urls: [...new Set(prayerUrls.concat(pageResources.flat()))]
    });
  }

  // Log app info
  function logAppInfo() {
    const support = checkPWASupport();
    console.log(`
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘   SPC Prayer.Com - Prayer Companion               â•‘
â•‘   Version: ${APP_VERSION}                           â•‘
â•‘                                                â•‘
â•‘   PWA Support:                                 â•‘
â•‘   - Service Worker: ${support.serviceWorker ? 'âœ“' : 'âœ—'}                    â•‘
â•‘   - Local Storage: ${support.localStorage ? 'âœ“' : 'âœ—'}                     â•‘
â•‘   - Notifications: ${support.notifications ? 'âœ“' : 'âœ—'}                     â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    `);
  }

  // Initialize app
  async function init() {
    console.log('Initializing SPC Prayer.Com...');
    logAppInfo();

    // Register service worker
    await registerServiceWorker();

    // Add PWA controls to page
    addControlsToPage();

    // Initialize other systems (they auto-initialize themselves)
    // FontSizeControl, BookmarkSystem, and SearchSystem

    // Cache all prayers in background
    setTimeout(cacheAllPrayers, 3000);

    console.log('SPC Prayer.Com initialized successfully');
  }

  // Expose public API
  window.SPCApp = {
    version: APP_VERSION,
    init: init,
    toggleDarkMode: toggleDarkMode,
    promptInstall: promptInstall,
    dismissInstall: dismissInstall,
    updateApp: updateApp,
    checkSupport: checkPWASupport
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle app installation
  window.addEventListener('appinstalled', () => {
    console.log('SPC Prayer.Com has been installed!');
    const banner = document.querySelector('.install-banner');
    if (banner) banner.remove();
  });

  // Handle online/offline status
  window.addEventListener('online', () => {
    console.log('App is online');
    showStatusMessage('Connected to internet');
  });

  window.addEventListener('offline', () => {
    console.log('App is offline');
    showStatusMessage('Offline mode - Your prayers are still available');
  });

  // Show status message
  function showStatusMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'status-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 100);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);

    // Add toast styles
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .status-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #9a6c2f;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 10002;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }

        .status-toast.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .dark-mode .status-toast {
          background: #2980B9;
          color: white;
        }

        @media (max-width: 576px) {
          .status-toast {
            right: 1rem;
            left: 1rem;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Handle nested dropdown submenus.
  function initNestedDropdowns() {
    document.addEventListener('DOMContentLoaded', function() {
      // Handle desktop hover for nested dropdowns
      const submenuToggles = document.querySelectorAll('.dropdown-submenu > .dropdown-toggle');
      
      submenuToggles.forEach(toggle => {
        // Prevent default link behavior
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // On mobile, toggle the submenu
          if (window.innerWidth <= 991) {
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('dropdown-menu')) {
              submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
          }
        });
      });
    });
  }
  
  initNestedDropdowns();

})();

