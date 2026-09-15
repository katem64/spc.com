// Search System for SPC Prayer.Com
// Client-side search across all prayers

(function() {
  'use strict';

  // Prayer pages index (auto-generated from available prayers)
  const PRAYER_PAGES = [
    { url: 'ActofCharity.html', title: 'Act of Charity', category: 'Formulary' },
    { url: 'ActofConsecrationtotheImmaculateHeartofMary.html', title: 'Act of Consecration to the Immaculate Heart of Mary', category: 'Formulary' },
    { url: 'ActofContrition.html', title: 'Act of Contrition', category: 'Formulary' },
    { url: 'ActofFaith.html', title: 'Act of Faith', category: 'Formulary' },
    { url: 'ActofHope.html', title: 'Act of Hope', category: 'Formulary' },
    { url: 'afterconfession.html', title: 'After Confession', category: 'Sacraments' },
    { url: 'afterholycommunion.html', title: 'After Holy Communion', category: 'Sacraments' },
    { url: 'aftermeal.html', title: 'After Meal', category: 'Daily' },
    { url: 'Angelus.html', title: 'Angelus', category: 'Formulary' },
    { url: 'AnimaChristi.html', title: 'Anima Christi', category: 'Formulary' },
    { url: 'apostle.html', title: 'Apostles Creed', category: 'Basic' },
    { url: 'AveMaria.html', title: 'Ave Maria', category: 'Latin' },
    { url: 'beforeconfession.html', title: 'Before Confession', category: 'Sacraments' },
    { url: 'beforeholycommunion.html', title: 'Before Holy Communion', category: 'Sacraments' },
    { url: 'beforemeal.html', title: 'Before Meal', category: 'Daily' },
    { url: 'ConsecrationtotheSacredHeartofJesus.html', title: 'Consecration to the Sacred Heart of Jesus', category: 'Formulary' },
    { url: 'contrition.html', title: 'Act of Contrition', category: 'Formulary' },
    { url: 'DeProfundis.html', title: 'De Profundis', category: 'Latin' },
    { url: 'DivinePraises.html', title: 'Divine Praises', category: 'Formulary' },
    { url: 'GloireauPere.html', title: 'Gloire au Pere', category: 'French' },
    { url: 'glorious.html', title: 'Glorious Mysteries', category: 'Rosary' },
    { url: 'glorybe.html', title: 'Glory Be', category: 'Basic' },
    { url: 'guardian.html', title: 'Guardian Angel Prayer', category: 'Basic' },
    { url: 'hailmary.html', title: 'Hail Mary', category: 'Basic' },
    { url: 'JevousSalue,Marie.html', title: 'Je vous Salue, Marie', category: 'French' },
    { url: 'joy.html', title: 'Joyful Mysteries', category: 'Rosary' },
    { url: 'light.html', title: 'Luminous Mysteries', category: 'Rosary' },
    { url: 'LitanyoftheBlessedVirgin.html', title: 'Litany of the Blessed Virgin', category: 'Formulary' },
    { url: 'Magnificat.html', title: 'Magnificat', category: 'Latin' },
    { url: 'Memorare.html', title: 'Memorare', category: 'Formulary' },
    { url: 'morning.html', title: 'Morning Prayer', category: 'Daily' },
    { url: 'nicene.html', title: 'Nicene Creed', category: 'Basic' },
    { url: 'night.html', title: 'Night Prayer', category: 'Daily' },
    { url: 'NotrePere.html', title: 'Notre Pere', category: 'French' },
    { url: 'OfferingoftheDay.html', title: 'Offering of the Day', category: 'Formulary' },
    { url: 'PATERNOSTER.html', title: 'Pater Noster', category: 'Latin' },
    { url: 'petition.html', title: 'Petition Prayer', category: 'Formulary' },
    { url: 'powerful.html', title: 'Powerful Daily Prayer', category: 'Basic' },
    { url: 'prayer.html', title: 'The Holy Rosary', category: 'Rosary' },
    { url: 'PrayerbeforeRetiring.html', title: 'Prayer before Retiring', category: 'Formulary' },
    { url: 'PrayerforAcceptanceofDeath.html', title: 'Prayer for Acceptance of Death', category: 'Formulary' },
    { url: 'PrayerforourSisters.html', title: 'Prayer for our Sisters', category: 'Formulary' },
    { url: 'PrayerforPeace.html', title: 'Prayer for Peace', category: 'Formulary' },
    { url: 'PrayerfortheDying.html', title: 'Prayer for the Dying', category: 'Formulary' },
    { url: 'PrayerforVocations.html', title: 'Prayer for Vocations', category: 'Formulary' },
    { url: 'PrayertoourLadyofChartres.html', title: 'Prayer to our Lady of Chartres', category: 'Formulary' },
    { url: 'PrayertoOurLadyofthisHouse.html', title: 'Prayer to Our Lady of this House', category: 'Formulary' },
    { url: 'PrayertoSt.Michael.html', title: 'Prayer to St. Michael', category: 'Formulary' },
    { url: 'PrayertoSt.Paul.html', title: 'Prayer to St. Paul', category: 'Formulary' },
    { url: 'PrayertotheHolySpirit.html', title: 'Prayer to the Holy Spirit', category: 'Formulary' },
    { url: 'PrayeruponRising.html', title: 'Prayer upon Rising', category: 'Formulary' },
    { url: 'ReginaCoeli.html', title: 'Regina Coeli', category: 'Formulary' },
    { url: 'RenewalofVows.html', title: 'Renewal of Vows', category: 'Formulary' },
    { url: 'SalveRegina.html', title: 'Salve Regina', category: 'Latin' },
    { url: 'signofthecross.html', title: 'Sign of the Cross', category: 'Basic' },
    { url: 'sorrow.html', title: 'Sorrowful Mysteries', category: 'Rosary' },
    { url: 'SymboledesApostres.html', title: 'Symbole des Apostres', category: 'French' },
    { url: 'thanksgiving.html', title: 'Thanksgiving Prayer', category: 'Formulary' },
    { url: 'TheChapletofDivineMercy.html', title: 'The Chaplet of Divine Mercy', category: 'Formulary' },
    { url: "thelord'sprayer.html", title: "The Lord's Prayer", category: 'Basic' },
    { url: 'ThreeOClockPrayer.html', title: "Three O'Clock Prayer", category: 'Formulary' },
    { url: 'UnfailingPrayertoStJoseph.html', title: 'Unfailing Prayer to St. Joseph', category: 'Formulary' },
    { url: 'VeniCreatorSpiritus.html', title: 'Veni Creator Spiritus', category: 'Latin' },
    { url: 'VeniSancteSpritus.html', title: 'Veni Sancte Spiritus', category: 'Latin' },
    { url: 'WayoftheCross.html', title: 'Way of the Cross', category: 'Formulary' },
    { url: 'WeFlytoyourProtection.html', title: 'We Fly to your Protection', category: 'Formulary' }
  ];

  const STORAGE_KEY = 'spc-search-history';
  const MAX_HISTORY = 10;
  let examenSearchRecords = [];
  let examenSearchPromise = null;

  function loadExamenSearchIndex() {
    if (examenSearchPromise) return examenSearchPromise;
    const inPages = window.location.pathname.includes('/pages/');
    const dataPath = inPages ? '../data/marks-examen-index.json?v=search1' : './data/marks-examen-index.json?v=search1';
    examenSearchPromise = fetch(dataPath)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data) return;
        const records = [];
        (data.marks || []).forEach((mark) => {
          (mark.weeks || []).forEach((week) => {
            (week.days || []).forEach((day) => {
              records.push({
                url: inPages ? `marks-examen.html#mark=${mark.markNumber}&week=${week.weekNumber}&day=${encodeURIComponent(day.day)}` : `./pages/marks-examen.html#mark=${mark.markNumber}&week=${week.weekNumber}&day=${encodeURIComponent(day.day)}`,
                title: `${mark.title} / Week ${week.weekNumber} / ${day.day}`,
                category: `M.A.R.K.S. Examen: ${week.theme}`,
                content: `M.A.R.K.S. Examen ${mark.title} ${week.theme} ${week.scripture || ''} ${day.day} ${day.prompt || ''}`,
                isExamen: true
              });
            });
          });
        });
        examenSearchRecords = records;
      })
      .catch(() => {});
    return examenSearchPromise;
  }

  // Fuzzy search function
  function fuzzyMatch(text, query) {
    text = text.toLowerCase();
    query = query.toLowerCase();
    
    // Exact match gets highest score
    if (text.includes(query)) {
      return 100;
    }
    
    // Fuzzy match - check if all query characters appear in order
    let textIndex = 0;
    let queryIndex = 0;
    let matches = 0;
    
    while (textIndex < text.length && queryIndex < query.length) {
      if (text[textIndex] === query[queryIndex]) {
        matches++;
        queryIndex++;
      }
      textIndex++;
    }
    
    if (queryIndex === query.length) {
      return matches / query.length * 50; // Partial match score
    }
    
    return 0;
  }

  // Search prayers
  function searchPrayers(query) {
    if (!query || query.length < 2) {
      return [];
    }

    const results = PRAYER_PAGES.map(prayer => {
      const titleScore = fuzzyMatch(prayer.title, query);
      const categoryScore = fuzzyMatch(prayer.category, query) * 0.5;
      const score = titleScore + categoryScore;
      
      return { ...prayer, score };
    })
    .filter(prayer => prayer.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

    const examenResults = examenSearchRecords.map((record) => ({
      ...record,
      score: fuzzyMatch(record.content, query)
    })).filter((record) => record.score > 0).sort((a, b) => b.score - a.score).slice(0, 15);

    return results.concat(examenResults).sort((a, b) => b.score - a.score).slice(0, 20);
  }

  // Get search history
  function getSearchHistory() {
    try {
      const history = localStorage.getItem(STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  }

  // Save to search history
  function saveToHistory(query) {
    if (!query || query.length < 2) return;
    
    let history = getSearchHistory();
    
    // Remove if exists
    history = history.filter(h => h.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    history.unshift(query);
    
    // Keep only MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving search history:', e);
    }
  }

  // Clear search history
  function clearSearchHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing search history:', e);
    }
  }

  // Create search interface
  function createSearchInterface() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.id = 'search-container';
    searchContainer.innerHTML = `
      <div class="search-overlay"></div>
      <div class="search-panel">
        <div class="search-header">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="search" 
              class="search-input" 
              placeholder="Search prayers..."
              aria-label="Search prayers"
              autocomplete="off"
            />
            <button class="clear-search" aria-label="Clear search" style="display: none;">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button class="close-search" aria-label="Close search">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="search-results">
          <div class="search-suggestions"></div>
        </div>
      </div>
    `;

    document.body.appendChild(searchContainer);
    
    const input = searchContainer.querySelector('.search-input');
    const results = searchContainer.querySelector('.search-results');
    const suggestions = searchContainer.querySelector('.search-suggestions');
    const clearBtn = searchContainer.querySelector('.clear-search');
    const closeBtn = searchContainer.querySelector('.close-search');
    const overlay = searchContainer.querySelector('.search-overlay');

    // Search input handler
    let searchTimeout;
    input.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length === 0) {
        clearBtn.style.display = 'none';
        showSearchHistory(suggestions);
      } else {
        clearBtn.style.display = 'block';
        searchTimeout = setTimeout(() => {
          performSearch(query, suggestions);
        }, 300);
      }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      input.focus();
      showSearchHistory(suggestions);
    });

    // Close button and overlay
    closeBtn.addEventListener('click', hideSearch);
    overlay.addEventListener('click', hideSearch);

    // Enter key to search
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          saveToHistory(query);
          performSearch(query, suggestions);
        }
      } else if (e.key === 'Escape') {
        hideSearch();
      }
    });

    // Show search history initially
    showSearchHistory(suggestions);
    
    return searchContainer;
  }

  // Perform search and display results
  async function performSearch(query, container) {
    await loadExamenSearchIndex();
    const results = searchPrayers(query);
    
    if (results.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>No prayers found for "${query}"</p>
          <p class="hint">Try different keywords or browse the menu</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="results-header">Found ${results.length} prayer${results.length !== 1 ? 's' : ''}</div>
      <div class="results-list">
        ${results.map(prayer => `
          <a href="${prayer.url}" class="result-item">
            <div class="result-icon">
              <i class="fas fa-pray"></i>
            </div>
            <div class="result-content">
              <div class="result-title">${highlightMatch(prayer.title, query)}</div>
              <div class="result-category">${prayer.category}</div>
            </div>
            <i class="fas fa-chevron-right result-arrow"></i>
          </a>
        `).join('')}
      </div>
    `;

    // Add click handler to save to history
    container.querySelectorAll('.result-item').forEach(item => {
      item.addEventListener('click', () => {
        saveToHistory(query);
        hideSearch();
      });
    });
  }

  // Highlight matching text
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Show search history
  function showSearchHistory(container) {
    const history = getSearchHistory();
    
    if (history.length === 0) {
      container.innerHTML = `
        <div class="search-empty">
          <i class="fas fa-history"></i>
          <p>No recent searches</p>
          <p class="hint">Start typing to search prayers</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="history-header">
        <span>Recent Searches</span>
        <button class="clear-history" onclick="window.SearchSystem.clearHistory()">Clear</button>
      </div>
      <div class="history-list">
        ${history.map(query => `
          <button class="history-item" data-query="${query}">
            <i class="fas fa-history"></i>
            <span>${query}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Add click handlers
    container.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', function() {
        const query = this.getAttribute('data-query');
        const input = document.querySelector('.search-input');
        input.value = query;
        input.dispatchEvent(new Event('input'));
      });
    });
  }

  // Show search interface
  function showSearch() {
    let searchContainer = document.getElementById('search-container');
    if (!searchContainer) {
      searchContainer = createSearchInterface();
    }
    
    addStyles();
    searchContainer.classList.add('visible');
    document.body.classList.add('search-open');
    
    const input = searchContainer.querySelector('.search-input');
    setTimeout(() => input.focus(), 100);
  }

  // Hide search interface
  function hideSearch() {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
      searchContainer.classList.remove('visible');
      document.body.classList.remove('search-open');
    }
  }

  // Add styles
  function addStyles() {
    if (document.getElementById('search-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'search-styles';
    style.textContent = `
      .search-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
      }

      .search-container.visible {
        display: block;
      }

      .search-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
      }

      .search-panel {
        position: absolute;
        top: 5%;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 700px;
        max-height: 85vh;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .dark-mode .search-panel {
        background: #1a1a1a;
        border: 1px solid #3a3a3a;
      }

      .search-header {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-bottom: 1px solid #E0DDD8;
      }

      .dark-mode .search-header {
        border-bottom-color: #3a3a3a;
      }

      .search-input-wrapper {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-icon {
        position: absolute;
        left: 1rem;
        color: #9a6c2f;
        font-size: 1.2rem;
      }

      .dark-mode .search-icon {
        color: #D4A574;
      }

      .search-input {
        width: 100%;
        padding: 0.8rem 3rem 0.8rem 3rem;
        border: 2px solid #E0DDD8;
        border-radius: 8px;
        font-size: 1.1rem;
        transition: all 0.2s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #9a6c2f;
      }

      .dark-mode .search-input {
        background: #252525;
        border-color: #3a3a3a;
        color: #E8E6E3;
      }

      .dark-mode .search-input:focus {
        border-color: #D4A574;
      }

      .clear-search {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: #5A5A5A;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1.2rem;
      }

      .clear-search:hover {
        color: #9a6c2f;
      }

      .dark-mode .clear-search:hover {
        color: #D4A574;
      }

      .close-search {
        background: none;
        border: none;
        color: #5A5A5A;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1.5rem;
        transition: all 0.2s ease;
      }

      .close-search:hover {
        color: #9a6c2f;
        transform: rotate(90deg);
      }

      .dark-mode .close-search {
        color: #B8B5B2;
      }

      .dark-mode .close-search:hover {
        color: #D4A574;
      }

      .search-results {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .results-header,
      .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        font-weight: 600;
        color: #9a6c2f;
        font-size: 0.9rem;
        text-transform: uppercase;
      }

      .dark-mode .results-header,
      .dark-mode .history-header {
        color: #D4A574;
      }

      .clear-history {
        background: none;
        border: none;
        color: #5A5A5A;
        cursor: pointer;
        font-size: 0.85rem;
        padding: 0.25rem 0.5rem;
      }

      .clear-history:hover {
        color: #9a6c2f;
        text-decoration: underline;
      }

      .results-list,
      .history-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .result-item,
      .history-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #F5F3EF;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }

      .result-item:hover,
      .history-item:hover {
        background: #E0DDD8;
        transform: translateX(4px);
      }

      .dark-mode .result-item,
      .dark-mode .history-item {
        background: #252525;
      }

      .dark-mode .result-item:hover,
      .dark-mode .history-item:hover {
        background: #2a2a2a;
      }

      .result-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 8px;
        color: #9a6c2f;
        font-size: 1.2rem;
      }

      .dark-mode .result-icon {
        background: #1a1a1a;
        color: #D4A574;
      }

      .result-content {
        flex: 1;
      }

      .result-title {
        font-weight: 600;
        font-size: 1.05rem;
        margin-bottom: 0.25rem;
        color: #2C2C2C;
      }

      .dark-mode .result-title {
        color: #E8E6E3;
      }

      .result-title mark {
        background: #ffd700;
        color: #2C2C2C;
        padding: 0 0.2rem;
        border-radius: 2px;
      }

      .result-category {
        font-size: 0.85rem;
        color: #5A5A5A;
      }

      .dark-mode .result-category {
        color: #B8B5B2;
      }

      .result-arrow {
        color: #5A5A5A;
      }

      .no-results,
      .search-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: #5A5A5A;
      }

      .no-results i,
      .search-empty i {
        font-size: 3rem;
        color: #9a6c2f;
        opacity: 0.3;
        margin-bottom: 1rem;
      }

      .dark-mode .no-results,
      .dark-mode .search-empty {
        color: #B8B5B2;
      }

      .dark-mode .no-results i,
      .dark-mode .search-empty i {
        color: #D4A574;
      }

      .hint {
        font-size: 0.9rem;
        margin-top: 0.5rem;
        opacity: 0.7;
      }

      body.search-open {
        overflow: hidden;
      }

      @media (max-width: 576px) {
        .search-panel {
          width: 95%;
          max-height: 90vh;
        }

        .search-header {
          padding: 1rem;
        }

        .search-input {
          font-size: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create search button
  function createSearchButton() {
    const button = document.createElement('button');
    button.className = 'search-btn';
    button.setAttribute('aria-label', 'Search prayers');
    button.setAttribute('title', 'Search prayers (Ctrl+K)');
    button.innerHTML = `
      <i class="fas fa-search"></i>
      <span>Search</span>
    `;
    
    button.addEventListener('click', showSearch);
    
    return button;
  }

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      showSearch();
    }
  });

  // Initialize
  function init() {
    loadExamenSearchIndex();
    const controlContainer = document.querySelector('.pwa-controls');
    if (controlContainer) {
      const searchBtn = createSearchButton();
      controlContainer.appendChild(searchBtn);
    }

    // Add button styles
    const style = document.createElement('style');
    style.textContent = `
      .search-btn {
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

      .search-btn:hover {
        background: var(--color-bg-alt);
        border-color: var(--color-accent);
        color: var(--color-accent);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
      }

      .dark-mode .search-btn {
        background: #2a2a2a;
        border-color: #3a3a3a;
        color: #E8E6E3;
      }

      .dark-mode .search-btn:hover {
        background: #333;
        border-color: #9a6c2f;
        color: #9a6c2f;
      }
    `;
    document.head.appendChild(style);
  }

  // Expose public API
  window.SearchSystem = {
    init: init,
    show: showSearch,
    hide: hideSearch,
    search: searchPrayers,
    clearHistory: () => {
      clearSearchHistory();
      const container = document.querySelector('.search-suggestions');
      if (container) showSearchHistory(container);
    }
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

