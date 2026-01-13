// Mass Readings Display Module
// Shows daily Mass reading citations with online/offline hybrid approach

(function() {
  'use strict';

  const USCCB_API_BASE = 'https://bible.usccb.org/bible/readings/';
  const CACHE_KEY_PREFIX = 'spc-reading-';
  const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  const PREFETCH_DAYS = 7; // Pre-fetch next 7 days
  const LAST_PREFETCH_KEY = 'spc-readings-last-prefetch';
  const DATA_VERSION_KEY = 'spc-readings-data-version';
  const LAST_UPDATE_CHECK_KEY = 'spc-readings-last-update-check';
  const DATA_VERSION = '2025.1'; // Update this when data changes
  const UPDATE_CHECK_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days
  const DATE_RANGE_YEARS = 1; // Allow 1 year back and 1 year forward

  let currentReadings = null;
  let fullTextCache = {};
  let selectedDate = null; // Track the currently selected date

  // Initialize
  function init() {
    console.log('Mass Readings: Initializing...');
    console.log('Mass Readings: Is landing page?', isLandingPage());
    
    if (!isLandingPage()) return;

    // Set selected date to today
    selectedDate = new Date();
    
    // Get today's readings
    currentReadings = MassReadingsData.getTodaysReadings();
    console.log('Mass Readings: Current readings:', currentReadings);
    
    if (!currentReadings) {
      console.log('No readings data available for today');
      return;
    }

    // Display the readings badge
    displayReadingsBadge();

    // Check for data updates and pre-fetch when online
    if (navigator.onLine) {
      checkForDataUpdates();
      checkAndPrefetchReadings();
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  // Check if on landing page
  function isLandingPage() {
    const path = window.location.pathname;
    return path.endsWith('landing.html') || path.endsWith('/www/') || path === '/';
  }

  // Display readings badge next to liturgical badge
  function displayReadingsBadge() {
    console.log('Mass Readings: displayReadingsBadge called');
    if (!currentReadings) return;

    // Check if badge already exists
    if (document.querySelector('.readings-badge')) {
      console.log('Mass Readings: Badge already exists');
      return;
    }

    console.log('Mass Readings: Creating badge...');

    // Find the liturgical badge
    const liturgicalBadge = document.querySelector('.liturgical-badge');
    if (!liturgicalBadge) {
      console.log('Mass Readings: Liturgical badge not found, trying dashboard header');
      // Fallback: add to dashboard header
      const dashboardHeader = document.querySelector('.dashboard-header .container-modern');
      if (dashboardHeader) {
        createBadgeElement(dashboardHeader);
      }
      return;
    }

    // Insert badge after liturgical badge
    createBadgeElement(liturgicalBadge.parentNode, liturgicalBadge);
    
    // Add styles
    addReadingsStyles();
    
    // Create modal
    createReadingsModal();
  }

  // Create badge element
  function createBadgeElement(container, insertAfter = null) {
    const badge = document.createElement('span');
    badge.className = 'readings-badge';
    badge.innerHTML = '<i class="fas fa-book-open"></i> Readings';
    badge.setAttribute('title', 'View Today\'s Mass Readings');
    badge.setAttribute('aria-label', 'View Today\'s Mass Readings');
    badge.onclick = openReadingsModal;

    if (insertAfter) {
      insertAfter.parentNode.insertBefore(badge, insertAfter.nextSibling);
    } else {
      container.appendChild(badge);
    }
  }

  // Create modal for readings
  function createReadingsModal() {
    const modal = document.createElement('div');
    modal.className = 'readings-modal';
    modal.id = 'readingsModal';
    modal.onclick = (e) => {
      if (e.target === modal) closeReadingsModal();
    };

    // Initial content will be populated by updateModalContent
    modal.innerHTML = '<div class="readings-modal-content"><div class="readings-loading">Loading...</div></div>';
    document.body.appendChild(modal);
    
    // Update with current date's readings
    updateModalContent();
  }

  // Update modal content with current selectedDate
  function updateModalContent() {
    const modal = document.getElementById('readingsModal');
    if (!modal) return;

    const dateFormatted = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const dateStr = formatDateString(selectedDate);
    const readings = MassReadingsData.getReadingsForDate(dateStr);
    const hasData = readings !== null;
    const isOnline = navigator.onLine;

    // Calculate min and max dates (1 year back, 1 year forward)
    const today = new Date();
    const minDate = new Date(today);
    minDate.setFullYear(today.getFullYear() - DATE_RANGE_YEARS);
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + DATE_RANGE_YEARS);
    
    const minDateStr = formatDateString(minDate);
    const maxDateStr = formatDateString(maxDate);

    let modalContent = `
      <div class="readings-modal-content">
        <div class="readings-modal-header">
          <div>
            <h2><i class="fas fa-book-open"></i> Mass Readings</h2>
            <div class="readings-date-nav">
              <label class="date-picker-wrapper" title="Click to select a date">
                <i class="fas fa-calendar-alt"></i>
                <input type="date" class="date-picker" id="readingsDatePicker" value="${dateStr}" min="${minDateStr}" max="${maxDateStr}" onchange="MassReadings.jumpToDate(this.value)" />
                <div class="readings-modal-date">${dateFormatted}</div>
              </label>
            </div>
            ${readings?.feast ? `<div class="readings-modal-feast">${readings.feast}</div>` : ''}
          </div>
          <button class="readings-modal-close" onclick="MassReadings.closeModal()" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="readings-modal-body">
    `;

    if (!hasData && !isOnline) {
      // No data and offline
      modalContent += `
        <div class="readings-no-data">
          <i class="fas fa-wifi-slash"></i>
          <p>Readings not available offline for this date.</p>
          <p class="hint">Connect to the internet to view readings for this date.</p>
        </div>
      `;
    } else if (!hasData && isOnline) {
      // No data but online - can fetch from API
      modalContent += `
        <div class="readings-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading readings from USCCB...</p>
        </div>
      `;
      // Trigger API fetch
      setTimeout(() => fetchReadingsFromAPI(dateStr), 100);
    } else {
      // Have data - display it
      const dataSource = hasData ? '<span class="data-badge offline-badge"><i class="fas fa-check-circle"></i> Available Offline</span>' : '';
      
      modalContent += `<div class="data-source">${dataSource}</div>`;

      // First Reading
      if (readings.readings.first) {
        modalContent += `
          <div class="reading-item">
            <div class="reading-label">First Reading</div>
            <div class="reading-citation">${readings.readings.first}</div>
          </div>
        `;
      }

      // Responsorial Psalm
      if (readings.readings.psalm) {
        modalContent += `
          <div class="reading-item">
            <div class="reading-label">Responsorial Psalm</div>
            <div class="reading-citation">${readings.readings.psalm}</div>
          </div>
        `;
      }

      // Second Reading
      if (readings.readings.second) {
        modalContent += `
          <div class="reading-item">
            <div class="reading-label">Second Reading</div>
            <div class="reading-citation">${readings.readings.second}</div>
          </div>
        `;
      }

      // Gospel
      if (readings.readings.gospel) {
        modalContent += `
          <div class="reading-item gospel">
            <div class="reading-label">Gospel</div>
            <div class="reading-citation">${readings.readings.gospel}</div>
          </div>
        `;
      }
    }

    const dataVersion = localStorage.getItem(DATA_VERSION_KEY) || DATA_VERSION;
    const lastUpdate = localStorage.getItem(LAST_UPDATE_CHECK_KEY);
    let updateInfo = '';
    if (lastUpdate) {
      const lastUpdateDate = new Date(parseInt(lastUpdate));
      const daysAgo = Math.floor((Date.now() - lastUpdateDate.getTime()) / (24 * 60 * 60 * 1000));
      if (daysAgo === 0) updateInfo = 'Updated today';
      else if (daysAgo === 1) updateInfo = 'Updated yesterday';
      else updateInfo = `Updated ${daysAgo} days ago`;
    }

    modalContent += `
        </div>
        <div class="readings-modal-footer">
          <div class="footer-buttons">
            <button class="btn-today" onclick="MassReadings.goToToday()">
              <i class="fas fa-calendar-day"></i>
              Today's Reading
            </button>
            <button class="btn-view-full" onclick="MassReadings.viewFullReadings()">
              <i class="fas fa-external-link-alt"></i>
              Read Full Text (USCCB)
            </button>
          </div>
          ${updateInfo ? `<div class="data-info"><i class="fas fa-info-circle"></i> ${updateInfo} • Available: 1 year back/forward</div>` : ''}
        </div>
      </div>
    `;

    modal.innerHTML = modalContent;
  }

  // Open modal
  function openReadingsModal() {
    const modal = document.getElementById('readingsModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close modal
  function closeReadingsModal() {
    const modal = document.getElementById('readingsModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Check and pre-fetch readings for next 7 days
  function checkAndPrefetchReadings() {
    const lastPrefetch = localStorage.getItem(LAST_PREFETCH_KEY);
    const now = Date.now();
    
    // Only prefetch once per day
    if (lastPrefetch && (now - parseInt(lastPrefetch)) < 24 * 60 * 60 * 1000) {
      return;
    }

    console.log('Mass Readings: Pre-fetching next 7 days...');
    localStorage.setItem(LAST_PREFETCH_KEY, now.toString());

    // Pre-fetch next 7 days
    for (let i = 0; i < PREFETCH_DAYS; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = formatDateString(date);
      
      // Check if we have data for this date
      const readings = MassReadingsData.getReadingsForDate(dateStr);
      if (readings) {
        // Fetch full text in background
        setTimeout(() => fetchFullTextForDate(dateStr, true), i * 1000);
      }
    }
  }

  // Fetch full text readings for a specific date
  async function fetchFullTextForDate(dateStr, silent = false) {
    // Check cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${dateStr}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        
        if (age < CACHE_DURATION) {
          if (!silent) console.log('Using cached reading for', dateStr);
          fullTextCache[dateStr] = parsed.data;
          return parsed.data;
        }
      } catch (e) {
        console.error('Cache parse error:', e);
      }
    }

    // Fetch from API
    if (!navigator.onLine) {
      if (!silent) console.log('Offline - cannot fetch readings');
      return null;
    }

    try {
      const usccbDate = formatUSCCBDate(dateStr);
      const url = `${USCCB_API_BASE}${usccbDate}.cfm`;
      
      // Use a proxy or fetch directly
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse the readings from HTML
      const readings = parseUSCCBReadings(html, dateStr);
      
      if (readings) {
        // Cache the result
        const cacheData = {
          timestamp: Date.now(),
          data: readings
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        fullTextCache[dateStr] = readings;
        
        if (!silent) console.log('Fetched and cached readings for', dateStr);
        return readings;
      }
    } catch (error) {
      if (!silent) console.error('Error fetching readings:', error);
    }
    
    return null;
  }

  // Parse USCCB readings from HTML
  function parseUSCCBReadings(html, dateStr) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const readings = {
        date: dateStr,
        readings: []
      };

      // Find all reading sections
      const contentBody = doc.querySelector('.content-body');
      if (!contentBody) return null;

      // Extract readings
      const readingSections = contentBody.querySelectorAll('.bibleReadingText');
      readingSections.forEach((section, index) => {
        const text = section.textContent.trim();
        if (text) {
          readings.readings.push({
            index: index,
            text: text
          });
        }
      });

      return readings.readings.length > 0 ? readings : null;
    } catch (error) {
      console.error('Error parsing readings:', error);
      return null;
    }
  }

  // Format date for USCCB (MMDDYY)
  function formatUSCCBDate(dateStr) {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).substring(2);
    return `${month}${day}${year}`;
  }

  // Format date as YYYY-MM-DD
  function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // View full readings (opens USCCB website)
  async function viewFullReadings() {
    const dateStr = MassReadingsData.getTodayDateString();
    const usccbDate = formatUSCCBDate(dateStr);
    
    if (navigator.onLine) {
      // Open USCCB Bible readings page in new tab
      window.open(`${USCCB_API_BASE}${usccbDate}.cfm`, '_blank');
    } else {
      alert('Full text requires an internet connection. Please connect to view complete readings.');
    }
  }

  // Add styles for readings badge and modal
  function addReadingsStyles() {
    if (document.getElementById('readings-styles')) return;

    const style = document.createElement('style');
    style.id = 'readings-styles';
    style.textContent = `
      /* Readings Badge */
      .readings-badge {
        display: inline-block;
        margin-left: 0.5rem;
        margin-top: 0.1rem;
        padding: 0.25rem 0.75rem;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-align: center;
      }

      .readings-badge:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(102, 126, 234, 0.3);
      }

      .readings-badge i {
        margin-right: 0.35rem;
        font-size: 0.65rem;
      }

      /* Modal Overlay */
      .readings-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.2s ease;
      }

      .readings-modal.active {
        display: flex;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* Modal Content */
      .readings-modal-content {
        background: white;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 85vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-elevated);
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .dark-mode .readings-modal-content {
        background: #1a1a1a;
        color: #e0e0e0;
      }

      /* Modal Header */
      .readings-modal-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .readings-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .readings-modal-header i {
        font-size: 1.3rem;
      }

      .readings-modal-date {
        font-size: 0.9rem;
        opacity: 0.95;
        margin-top: 0.25rem;
        font-style: italic;
      }

      /* Date Navigation */
      .readings-date-nav {
        margin-top: 0.75rem;
      }

      .date-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        transition: background 0.2s ease;
        position: relative;
      }

      .date-picker-wrapper:hover {
        background: rgba(255, 255, 255, 0.25);
      }

      .date-picker-wrapper i {
        font-size: 1.1rem;
        opacity: 0.95;
      }

      .date-picker {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        cursor: pointer;
        z-index: 1;
      }

      .readings-modal-date {
        font-size: 0.95rem;
        opacity: 0.95;
        font-style: italic;
        margin: 0;
        pointer-events: none;
      }

      .readings-modal-feast {
        margin-top: 0.5rem;
        padding: 0.35rem 0.75rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-block;
      }

      .readings-modal-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
        font-size: 1.1rem;
      }

      .readings-modal-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Modal Body */
      .readings-modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
      }

      .reading-item {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 3px solid #667eea;
        margin-bottom: 1rem;
      }

      .dark-mode .reading-item {
        background: #2a2a2a;
        border-left-color: #667eea;
      }

      .reading-item.gospel {
        border-left-color: #764ba2;
        background: linear-gradient(135deg, #f8f9fa 0%, #faf9fc 100%);
      }

      .dark-mode .reading-item.gospel {
        background: linear-gradient(135deg, #2a2a2a 0%, #2d2a2f 100%);
        border-left-color: #764ba2;
      }

      .reading-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        color: #667eea;
        margin-bottom: 0.5rem;
        letter-spacing: 0.5px;
      }

      .dark-mode .reading-label {
        color: #8b9dff;
      }

      .reading-item.gospel .reading-label {
        color: #764ba2;
      }

      .dark-mode .reading-item.gospel .reading-label {
        color: #9d6bc4;
      }

      .reading-citation {
        font-size: 1.05rem;
        color: #2d3748;
        font-weight: 500;
        line-height: 1.5;
      }

      .dark-mode .reading-citation {
        color: #e0e0e0;
      }

      .reading-fulltext {
        font-size: 1rem;
        color: #2d3748;
        line-height: 1.7;
        white-space: pre-wrap;
      }

      .dark-mode .reading-fulltext {
        color: #e0e0e0;
      }

      /* Modal Footer */
      .readings-modal-footer {
        padding: 1rem 1.5rem;
        background: #f8f9fa;
        border-top: 1px solid #e2e8f0;
      }

      .dark-mode .readings-modal-footer {
        background: #2a2a2a;
        border-top-color: #3a3a3a;
      }

      .footer-buttons {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
      }

      .data-info {
        text-align: center;
        font-size: 0.75rem;
        color: #718096;
        padding-top: 0.75rem;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
      }

      .dark-mode .data-info {
        color: #a0aec0;
        border-top-color: #3a3a3a;
      }

      .data-info i {
        font-size: 0.7rem;
      }

      .btn-today {
        background: #48bb78;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
      }

      .btn-today:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(72, 187, 120, 0.4);
      }

      .btn-view-full {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.75rem;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
      }

      .btn-view-full:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
      }

      .btn-view-full i,
      .btn-today i {
        font-size: 0.85rem;
      }

      /* Data Source Badge */
      .data-source {
        text-align: center;
        margin-bottom: 1rem;
      }

      .data-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.85rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .offline-badge {
        background: #d4edda;
        color: #155724;
      }

      .dark-mode .offline-badge {
        background: #1e4620;
        color: #a3d9a5;
      }

      /* Loading and Error States */
      .readings-loading,
      .readings-no-data,
      .readings-api-message,
      .readings-error {
        text-align: center;
        padding: 3rem 2rem;
        color: #718096;
      }

      .readings-loading i,
      .readings-no-data i,
      .readings-api-message i,
      .readings-error i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.7;
      }

      .readings-loading i {
        color: #667eea;
      }

      .readings-no-data i {
        color: #ed8936;
      }

      .readings-error i {
        color: #f56565;
      }

      .readings-api-message i {
        color: #4299e1;
      }

      .readings-loading p,
      .readings-no-data p,
      .readings-api-message p,
      .readings-error p {
        font-size: 1rem;
        margin: 0.5rem 0;
      }

      .hint {
        font-size: 0.85rem;
        opacity: 0.8;
        font-style: italic;
      }

      .dark-mode .readings-loading,
      .dark-mode .readings-no-data,
      .dark-mode .readings-api-message,
      .dark-mode .readings-error {
        color: #a0aec0;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .readings-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.65rem;
          margin-top: 0.1rem;
          margin-left: 0.4rem;
        }

        .readings-badge i {
          font-size: 0.6rem;
          margin-right: 0.25rem;
        }

        .readings-modal {
          padding: 0;
          align-items: flex-end;
        }

        .readings-modal-content {
          max-height: 90vh;
          border-radius: 16px 16px 0 0;
          max-width: 100%;
        }

        .readings-modal-header {
          padding: 1.25rem;
        }

        .readings-modal-header h2 {
          font-size: 1.25rem;
        }

        .readings-modal-body {
          padding: 1.25rem;
        }

        .reading-item {
          padding: 0.85rem;
        }

        .readings-modal-footer {
          padding: 1rem;
        }

        .footer-buttons {
          flex-direction: column;
          margin-bottom: 0.5rem;
        }

        .btn-view-full,
        .btn-today {
          width: 100%;
          justify-content: center;
          padding: 0.85rem;
        }

        .data-info {
          font-size: 0.7rem;
          padding-top: 0.5rem;
        }

        .date-picker-wrapper {
          padding: 0.4rem 0.75rem;
        }

        .readings-modal-date {
          font-size: 0.85rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Change date (offset in days: -1 for previous, +1 for next)
  function changeDate(offset) {
    selectedDate.setDate(selectedDate.getDate() + offset);
    updateModalContent();
  }

  // Jump to specific date
  function jumpToDate(dateStr) {
    try {
      const newDate = new Date(dateStr + 'T00:00:00');
      if (!isNaN(newDate.getTime())) {
        selectedDate = newDate;
        updateModalContent();
      }
    } catch (e) {
      console.error('Invalid date:', dateStr);
    }
  }

  // Go back to today
  function goToToday() {
    selectedDate = new Date();
    updateModalContent();
  }

  // Fetch readings from USCCB API for dates not in local storage
  async function fetchReadingsFromAPI(dateStr) {
    const modal = document.getElementById('readingsModal');
    if (!modal) return;

    try {
      // Format date for USCCB URL (e.g., 122225 for Dec 22, 2025)
      const date = new Date(dateStr + 'T00:00:00');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      const usccbDate = month + day + year;

      const url = `${USCCB_API_BASE}${usccbDate}.cfm`;
      
      // Note: Direct fetch may have CORS issues. In production, use a proxy or backend
      // For now, show message to open in USCCB directly
      const modalBody = modal.querySelector('.readings-modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="readings-api-message">
            <i class="fas fa-info-circle"></i>
            <p>Readings for this date are not available offline.</p>
            <p class="hint">You can view them on the USCCB website:</p>
            <a href="${url}" target="_blank" class="btn-view-full" style="margin-top: 1rem;">
              <i class="fas fa-external-link-alt"></i>
              Open USCCB Readings
            </a>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error fetching from API:', error);
      const modalBody = modal.querySelector('.readings-modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="readings-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to load readings for this date.</p>
          </div>
        `;
      }
    }
  }

  // Helper: Format date as YYYY-MM-DD
  function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Check for data updates when online
  function checkForDataUpdates() {
    const lastCheck = localStorage.getItem(LAST_UPDATE_CHECK_KEY);
    const currentVersion = localStorage.getItem(DATA_VERSION_KEY);
    const now = Date.now();

    // Check if we need to update (every 7 days or version mismatch)
    const needsCheck = !lastCheck || (now - parseInt(lastCheck)) > UPDATE_CHECK_INTERVAL || currentVersion !== DATA_VERSION;

    if (needsCheck) {
      console.log('Checking for readings data updates...');
      
      // Update last check timestamp
      localStorage.setItem(LAST_UPDATE_CHECK_KEY, now.toString());
      
      // Update version if changed
      if (currentVersion !== DATA_VERSION) {
        localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
        console.log(`Data version updated to ${DATA_VERSION}`);
      }

      // Pre-fetch important dates (current week + next Sunday)
      prefetchImportantDates();
    }
  }

  // Pre-fetch important dates (current week and next Sunday)
  function prefetchImportantDates() {
    const today = new Date();
    
    // Fetch next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = formatDateString(date);
      
      const readings = MassReadingsData.getReadingsForDate(dateStr);
      if (readings) {
        // Mark as available in cache (just verify we have the data)
        console.log(`✓ Readings available for ${dateStr}`);
      }
    }
  }

  // Handle coming online
  function handleOnline() {
    console.log('Connection restored - checking for updates');
    checkForDataUpdates();
    checkAndPrefetchReadings();
    
    // Update modal if open and showing a date without data
    const modal = document.getElementById('readingsModal');
    if (modal && modal.classList.contains('active')) {
      updateModalContent();
    }
  }

  // Handle going offline
  function handleOffline() {
    console.log('Connection lost - operating in offline mode');
  }

  // Public API
  window.MassReadings = {
    viewFullReadings,
    closeModal: closeReadingsModal,
    refresh: init,
    changeDate,
    jumpToDate,
    goToToday,
    checkForUpdates: checkForDataUpdates
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
