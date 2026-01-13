// Font Size Control System
// Allows users to adjust text size for better readability

(function() {
  'use strict';

  const FONT_SIZES = {
    small: {
      name: 'Small',
      scale: 0.875,
      bodySize: '16px'
    },
    medium: {
      name: 'Medium',
      scale: 1,
      bodySize: '18px'
    },
    large: {
      name: 'Large',
      scale: 1.125,
      bodySize: '20px'
    },
    xlarge: {
      name: 'Extra Large',
      scale: 1.25,
      bodySize: '24px'
    }
  };

  const STORAGE_KEY = 'spc-font-size';

  // Get current font size from localStorage
  function getCurrentFontSize() {
    return localStorage.getItem(STORAGE_KEY) || 'medium';
  }

  // Save font size to localStorage
  function saveFontSize(size) {
    localStorage.setItem(STORAGE_KEY, size);
  }

  // Apply font size to document
  function applyFontSize(size) {
    const config = FONT_SIZES[size];
    if (!config) return;

    const root = document.documentElement;
    const body = document.body;

    // Apply base font size
    body.style.fontSize = config.bodySize;
    
    // Set CSS custom property for scaling
    root.style.setProperty('--font-scale', config.scale);

    // Update all headings proportionally
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const currentSize = window.getComputedStyle(heading).fontSize;
      const baseSize = parseFloat(currentSize);
      const newSize = baseSize * config.scale;
      heading.style.fontSize = newSize + 'px';
    });

    // Update paragraphs
    const paragraphs = document.querySelectorAll('p, .card-text');
    paragraphs.forEach(p => {
      p.style.fontSize = config.bodySize;
    });

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
      const baseSize = link.classList.contains('nav-link') ? 16 : 15;
      const newSize = baseSize * config.scale;
      link.style.fontSize = newSize + 'px';
    });

    // Mark current size as active
    updateActiveButton(size);
    
    // Announce to screen readers
    announceChange(config.name);
  }

  // Update active button state
  function updateActiveButton(activeSize) {
    const buttons = document.querySelectorAll('[data-font-size]');
    buttons.forEach(button => {
      const size = button.getAttribute('data-font-size');
      if (size === activeSize) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Announce change to screen readers
  function announceChange(sizeName) {
    let announcer = document.getElementById('font-size-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'font-size-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    announcer.textContent = `Font size changed to ${sizeName}`;
  }

  // Create font size controls
  function createFontSizeControls() {
    const container = document.createElement('div');
    container.className = 'font-size-controls';
    container.innerHTML = `
      <div class="font-size-control-group">
        <label class="font-size-label">
          <i class="fas fa-text-height"></i>
          <span class="sr-only">Font Size</span>
        </label>
        <div class="font-size-buttons">
          <button class="font-size-btn" data-font-size="small" title="Small text" aria-label="Small font size">
            A
          </button>
          <button class="font-size-btn" data-font-size="medium" title="Medium text" aria-label="Medium font size">
            A
          </button>
          <button class="font-size-btn" data-font-size="large" title="Large text" aria-label="Large font size">
            A
          </button>
          <button class="font-size-btn" data-font-size="xlarge" title="Extra large text" aria-label="Extra large font size">
            A
          </button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .font-size-controls {
        position: relative;
      }

      .font-size-control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        padding: 0.4rem 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      .dark-mode .font-size-control-group {
        background: #2a2a2a;
        border: 1px solid #3a3a3a;
      }

      .font-size-label {
        margin: 0;
        color: var(--color-text);
        font-size: 1rem;
      }

      .dark-mode .font-size-label {
        color: #E8E6E3;
      }

      .font-size-buttons {
        display: flex;
        gap: 0.25rem;
      }

      .font-size-btn {
        width: 32px;
        height: 32px;
        border: 1px solid var(--color-border);
        background: white;
        color: var(--color-text);
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dark-mode .font-size-btn {
        background: #1a1a1a;
        color: #E8E6E3;
        border-color: #3a3a3a;
      }

      .font-size-btn:hover {
        background: var(--color-bg-alt);
        border-color: var(--color-accent);
        color: var(--color-accent);
        transform: scale(1.05);
      }

      .dark-mode .font-size-btn:hover {
        background: #333;
        border-color: #3498DB;
        color: #3498DB;
      }

      .font-size-btn.active {
        background: var(--color-accent);
        color: white;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }

      .dark-mode .font-size-btn.active {
        background: #3498DB;
        color: white;
        border-color: #3498DB;
      }

      .font-size-btn:focus {
        outline: 2px solid #667eea;
        outline-offset: 2px;
      }

      .dark-mode .font-size-btn:focus {
        outline-color: #D4A574;
      }

      /* Different sizes for buttons */
      .font-size-btn[data-font-size="small"] {
        font-size: 0.8rem;
      }

      .font-size-btn[data-font-size="medium"] {
        font-size: 1rem;
      }

      .font-size-btn[data-font-size="large"] {
        font-size: 1.2rem;
      }

      .font-size-btn[data-font-size="xlarge"] {
        font-size: 1.4rem;
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

      @media (max-width: 576px) {
        .font-size-control-group {
          flex-wrap: wrap;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    const buttons = container.querySelectorAll('[data-font-size]');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const size = this.getAttribute('data-font-size');
        applyFontSize(size);
        saveFontSize(size);
      });
    });

    return container;
  }

  // Initialize font size system
  function init() {
    // Apply saved font size on page load
    const savedSize = getCurrentFontSize();
    applyFontSize(savedSize);

    // Add font size controls to page if control container exists
    const controlContainer = document.querySelector('.pwa-controls');
    if (controlContainer) {
      const controls = createFontSizeControls();
      controlContainer.appendChild(controls);
    }
  }

  // Expose public API
  window.FontSizeControl = {
    init: init,
    apply: applyFontSize,
    getCurrent: getCurrentFontSize,
    getSizes: () => Object.keys(FONT_SIZES),
    createControls: createFontSizeControls
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
