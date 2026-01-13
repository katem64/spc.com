// Bookmark System for SPC Online
// Allows users to save and manage favorite prayers

(function() {
  'use strict';

  const STORAGE_KEY = 'spc-bookmarks';
  const HISTORY_KEY = 'spc-bookmarks-history';
  const MAX_HISTORY = 20;

  // Get all bookmarks from localStorage
  function getBookmarks() {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (e) {
      console.error('Error loading bookmarks:', e);
      return [];
    }
  }

  // Save bookmarks to localStorage
  function saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      return true;
    } catch (e) {
      console.error('Error saving bookmarks:', e);
      return false;
    }
  }

  // Get current page info
  function getCurrentPageInfo() {
    return {
      url: window.location.pathname,
      title: document.title.replace('SPC Online', '').replace(/[|-]/g, '').trim() || 'Home',
      timestamp: Date.now()
    };
  }

  // Check if current page is bookmarked
  function isBookmarked(url) {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.url === url);
  }

  // Add bookmark
  function addBookmark(pageInfo) {
    const bookmarks = getBookmarks();
    
    // Check if already bookmarked
    if (isBookmarked(pageInfo.url)) {
      return { success: false, message: 'Already bookmarked' };
    }

    bookmarks.unshift(pageInfo);
    
    if (saveBookmarks(bookmarks)) {
      announceToScreenReader(`${pageInfo.title} added to bookmarks`);
      return { success: true, message: 'Bookmark added' };
    }
    
    return { success: false, message: 'Failed to add bookmark' };
  }

  // Remove bookmark
  function removeBookmark(url) {
    let bookmarks = getBookmarks();
    const bookmark = bookmarks.find(b => b.url === url);
    
    bookmarks = bookmarks.filter(b => b.url !== url);
    
    if (saveBookmarks(bookmarks)) {
      announceToScreenReader(`${bookmark?.title || 'Prayer'} removed from bookmarks`);
      return { success: true, message: 'Bookmark removed' };
    }
    
    return { success: false, message: 'Failed to remove bookmark' };
  }

  // Toggle bookmark for current page
  function toggleBookmark() {
    const pageInfo = getCurrentPageInfo();
    
    if (isBookmarked(pageInfo.url)) {
      return removeBookmark(pageInfo.url);
    } else {
      return addBookmark(pageInfo);
    }
  }

  // Get prayer history
  function getHistory() {
    try {
      const history = localStorage.getItem(HISTORY_KEY);
      const parsed = history ? JSON.parse(history) : [];
      // Ensure it's an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error loading history:', e);
      return [];
    }
  }

  // Save to history
  function saveToHistory(pageInfo) {
    try {
      let history = getHistory();
      
      // Ensure history is an array
      if (!Array.isArray(history)) {
        history = [];
      }
      
      // Remove if already exists
      history = history.filter(h => h.url !== pageInfo.url);
      
      // Add to beginning
      history.unshift(pageInfo);
      
      // Keep only last MAX_HISTORY items
      history = history.slice(0, MAX_HISTORY);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  }

  // Clear all history
  function clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY);
      announceToScreenReader('Prayer history cleared');
      return { success: true, message: 'History cleared' };
    } catch (e) {
      return { success: false, message: 'Failed to clear history' };
    }
  }

  // Announce to screen readers
  function announceToScreenReader(message) {
    let announcer = document.getElementById('bookmark-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'bookmark-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  // Create bookmark button
  function createBookmarkButton() {
    const currentUrl = window.location.pathname;
    const bookmarked = isBookmarked(currentUrl);
    
    const button = document.createElement('button');
    button.className = 'bookmark-btn';
    button.type = 'button';
    button.setAttribute('aria-label', bookmarked ? 'Remove bookmark' : 'Add bookmark');
    button.setAttribute('title', bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks');
    button.innerHTML = `
      <i class="${bookmarked ? 'fas' : 'far'} fa-bookmark"></i>
      <span>${bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    `;
    
    if (bookmarked) {
      button.classList.add('bookmarked');
    }
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const result = toggleBookmark();
      if (result.success) {
        updateBookmarkButton(button);
        updateBookmarksList();
      }
    });
    
    return button;
  }

  // Update bookmark button state
  function updateBookmarkButton(button) {
    const currentUrl = window.location.pathname;
    const bookmarked = isBookmarked(currentUrl);
    
    button.setAttribute('aria-label', bookmarked ? 'Remove bookmark' : 'Add bookmark');
    button.setAttribute('title', bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks');
    button.innerHTML = `
      <i class="${bookmarked ? 'fas' : 'far'} fa-bookmark"></i>
      <span>${bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    `;
    
    if (bookmarked) {
      button.classList.add('bookmarked');
    } else {
      button.classList.remove('bookmarked');
    }
  }

  // Create bookmarks list panel
  function createBookmarksPanel() {
    const panel = document.createElement('div');
    panel.className = 'bookmarks-panel';
    panel.id = 'bookmarks-panel';
    panel.innerHTML = `
      <div class="bookmarks-header">
        <h3>
          <i class="fas fa-bookmark"></i>
          My Bookmarks
        </h3>
        <button class="close-panel" aria-label="Close bookmarks">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="bookmarks-content">
        <div class="bookmarks-list"></div>
      </div>
    `;
    
    const closeBtn = panel.querySelector('.close-panel');
    closeBtn.addEventListener('click', () => hideBookmarksPanel());
    
    document.body.appendChild(panel);
    updateBookmarksList();
    
    return panel;
  }

  // Update bookmarks list
  function updateBookmarksList() {
    const list = document.querySelector('.bookmarks-list');
    if (!list) return;
    
    const bookmarks = getBookmarks();
    
    if (bookmarks.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-bookmark"></i>
          <p>No bookmarks yet</p>
          <p class="hint">Click the bookmark button on any prayer to save it here</p>
        </div>
      `;
      return;
    }
    
    list.innerHTML = bookmarks.map(bookmark => `
      <div class="bookmark-item">
        <a href="${bookmark.url}" class="bookmark-link">
          <i class="fas fa-pray"></i>
          <span>${bookmark.title}</span>
        </a>
        <button class="remove-bookmark" data-url="${bookmark.url}" aria-label="Remove ${bookmark.title}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
    
    // Add remove handlers
    list.querySelectorAll('.remove-bookmark').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const url = this.getAttribute('data-url');
        removeBookmark(url);
        updateBookmarksList();
        
        // Update button if on current page
        if (url === window.location.pathname) {
          const bookmarkBtn = document.querySelector('.bookmark-btn');
          if (bookmarkBtn) updateBookmarkButton(bookmarkBtn);
        }
      });
    });
  }

  // Show bookmarks panel
  function showBookmarksPanel() {
    let panel = document.getElementById('bookmarks-panel');
    if (!panel) {
      panel = createBookmarksPanel();
    }
    panel.classList.add('visible');
    document.body.classList.add('panel-open');
  }

  // Hide bookmarks panel
  function hideBookmarksPanel() {
    const panel = document.getElementById('bookmarks-panel');
    if (panel) {
      panel.classList.remove('visible');
      document.body.classList.remove('panel-open');
    }
  }

  // Add styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .bookmark-btn {
        display: inline-flex !important;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 1.25rem;
        background: white !important;
        border: 1px solid #E8EAED !important;
        color: #2C3E50 !important;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        font-size: 0.9rem;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .bookmark-btn:hover {
        background: var(--color-bg-alt);
        border-color: var(--color-accent);
        color: var(--color-accent);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
      }

      .bookmark-btn.bookmarked {
        background: var(--color-accent);
        color: white;
        border-color: var(--color-accent);
      }

      .bookmark-btn.bookmarked i {
        animation: bookmarkPulse 0.4s ease;
      }

      @keyframes bookmarkPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }

      .dark-mode .bookmark-btn {
        background: #2a2a2a !important;
        border-color: #3a3a3a !important;
        color: #E8E6E3 !important;
      }

      .dark-mode .bookmark-btn:hover {
        background: #333 !important;
        border-color: #3498DB !important;
        color: #3498DB !important;
      }

      .dark-mode .bookmark-btn.bookmarked {
        background: #3498DB !important;
        color: white !important;
        border-color: #3498DB;
      }

      .bookmarks-panel {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        max-width: 90vw;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transition: right 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .bookmarks-panel.visible {
        right: 0;
      }

      .dark-mode .bookmarks-panel {
        background: #1a1a1a;
        border-left: 1px solid #3a3a3a;
      }

      .bookmarks-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #E0DDD8;
        background: #FAF9F6;
      }

      .dark-mode .bookmarks-header {
        background: #2a2a2a;
        border-bottom-color: #3a3a3a;
      }

      .bookmarks-header h3 {
        margin: 0;
        color: #667eea;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.4rem;
      }

      .dark-mode .bookmarks-header h3 {
        color: #D4A574;
      }

      .close-panel {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #5A5A5A;
        cursor: pointer;
        padding: 0.5rem;
        transition: all 0.2s ease;
      }

      .close-panel:hover {
        color: #667eea;
        transform: rotate(90deg);
      }

      .dark-mode .close-panel {
        color: #B8B5B2;
      }

      .dark-mode .close-panel:hover {
        color: #D4A574;
      }

      .bookmarks-content {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .bookmarks-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .bookmark-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: #F5F3EF;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .bookmark-item:hover {
        background: #E0DDD8;
        transform: translateX(-4px);
      }

      .dark-mode .bookmark-item {
        background: #252525;
      }

      .dark-mode .bookmark-item:hover {
        background: #2a2a2a;
      }

      .bookmark-link {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #2C2C2C;
        text-decoration: none;
        font-weight: 500;
      }

      .bookmark-link:hover {
        color: #667eea;
      }

      .dark-mode .bookmark-link {
        color: #E8E6E3;
      }

      .dark-mode .bookmark-link:hover {
        color: #D4A574;
      }

      .remove-bookmark {
        background: none;
        border: none;
        color: #5A5A5A;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1.2rem;
        transition: all 0.2s ease;
      }

      .remove-bookmark:hover {
        color: #dc3545;
        transform: scale(1.1);
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #5A5A5A;
      }

      .empty-state i {
        font-size: 4rem;
        color: #667eea;
        opacity: 0.3;
        margin-bottom: 1rem;
      }

      .dark-mode .empty-state {
        color: #B8B5B2;
      }

      .dark-mode .empty-state i {
        color: #D4A574;
      }

      .empty-state .hint {
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }

      body.panel-open {
        overflow: hidden;
      }

      @media (max-width: 576px) {
        .bookmarks-panel {
          width: 100vw;
          right: -100vw;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize bookmark system
  function init() {
    try {
      addStyles();
      
      // Save current page to history (not on homepage)
      const path = window.location.pathname;
      const isHome = path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('/landing.html');
      if (!isHome) {
        saveToHistory(getCurrentPageInfo());
      }

      // Add bookmark button to control container with retry logic
      function addBookmarkButton() {
        const controlContainer = document.querySelector('.pwa-controls');
        
        if (controlContainer) {
          const bookmarkBtn = createBookmarkButton();
          // Insert at the beginning of the controls
          controlContainer.insertBefore(bookmarkBtn, controlContainer.firstChild);
        } else {
          return false;
        }
        return true;
      }

      // Try immediately
      if (!addBookmarkButton()) {
        // Retry after delay
        setTimeout(function() {
          if (!addBookmarkButton()) {
            // Final retry
            setTimeout(addBookmarkButton, 500);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Bookmark system initialization error:', error);
    }
  }

  // Expose public API
  window.BookmarkSystem = {
    init: init,
    add: addBookmark,
    remove: removeBookmark,
    toggle: toggleBookmark,
    getAll: getBookmarks,
    isBookmarked: isBookmarked,
    showPanel: showBookmarksPanel,
    hidePanel: hideBookmarksPanel,
    getHistory: getHistory,
    clearHistory: clearHistory
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
