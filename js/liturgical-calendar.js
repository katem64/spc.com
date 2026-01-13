// Liturgical Calendar System
// Determines current liturgical season and manages updates

(function() {
  'use strict';

  const CACHE_KEY = 'spc-liturgical-cache';
  const LAST_UPDATE_KEY = 'spc-liturgical-last-update';
  const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  // Current liturgical season and feast
  let currentLiturgicalInfo = null;

  // Initialize
  function init() {
    // Load cached data or use built-in data
    loadLiturgicalData();
    
    // Check for updates in background (when online)
    checkForUpdates();
    
    // Display liturgical info on landing page
    if (isLandingPage()) {
      displayLiturgicalBanner();
    }
  }

  // Check if we're on landing page
  function isLandingPage() {
    const path = window.location.pathname;
    return path.endsWith('landing.html') || path.endsWith('/www/') || path === '/';
  }

  // Load liturgical data
  function loadLiturgicalData() {
    // Try to get cached data first
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        console.log('Loaded cached liturgical data, version:', parsed.version);
      } catch (e) {
        console.log('Using built-in liturgical data');
      }
    }
    
    // Calculate current season
    currentLiturgicalInfo = getCurrentLiturgicalSeason();
  }

  // Determine current liturgical season
  function getCurrentLiturgicalSeason() {
    const today = new Date();
    const year = today.getFullYear();
    const dateStr = formatDate(today);
    const monthDay = dateStr.substring(5); // MM-DD format

    // Check for fixed feasts first
    if (LiturgicalData.fixedFeasts[monthDay]) {
      const feast = LiturgicalData.fixedFeasts[monthDay];
      return {
        season: feast.season,
        seasonName: getSeasonName(feast.season),
        feast: feast.name,
        feastRank: feast.rank,
        color: getSeasonColor(feast.season),
        date: dateStr
      };
    }

    // Check movable feasts and seasons
    const movableFeasts = getMovableFeasts(year);
    if (movableFeasts) {
      // Check if today is a movable feast
      for (const [name, date] of Object.entries(movableFeasts)) {
        if (date === dateStr) {
          return {
            season: getSeasonForFeast(name, movableFeasts),
            seasonName: getSeasonName(getSeasonForFeast(name, movableFeasts)),
            feast: formatFeastName(name),
            feastRank: 'feast',
            color: getSeasonColor(getSeasonForFeast(name, movableFeasts)),
            date: dateStr
          };
        }
      }
    }

    // Determine season by date ranges
    const season = determineSeasonByDate(today, year);
    return {
      season: season,
      seasonName: getSeasonName(season),
      feast: null,
      feastRank: null,
      color: getSeasonColor(season),
      date: dateStr
    };
  }

  // Determine season by date
  function determineSeasonByDate(date, year) {
    const dateStr = formatDate(date);
    const movableFeasts = getMovableFeasts(year);
    
    // Advent (4 Sundays before Christmas)
    const adventStart = getAdventStart(year);
    if (dateStr >= adventStart && dateStr < `${year}-12-25`) {
      return 'advent';
    }
    
    // Christmas (Dec 25 - Baptism of the Lord, usually Jan 9-13)
    if (dateStr >= `${year}-12-25` || dateStr < `${year}-01-13`) {
      return 'christmas';
    }
    
    if (movableFeasts) {
      // Lent (Ash Wednesday to Holy Saturday)
      if (dateStr >= movableFeasts.ashWednesday && dateStr < movableFeasts.easterSunday) {
        return 'lent';
      }
      
      // Easter (Easter Sunday to Pentecost)
      if (dateStr >= movableFeasts.easterSunday && dateStr <= movableFeasts.pentecost) {
        return 'easter';
      }
    }
    
    // Ordinary Time (everything else)
    return 'ordinary';
  }

  // Get season for movable feast
  function getSeasonForFeast(feastName, movableFeasts) {
    const ashWed = movableFeasts.ashWednesday;
    const easter = movableFeasts.easterSunday;
    const pentecost = movableFeasts.pentecost;
    
    const feastDate = movableFeasts[feastName];
    
    if (feastDate >= ashWed && feastDate < easter) return 'lent';
    if (feastDate >= easter && feastDate <= pentecost) return 'easter';
    
    return 'ordinary';
  }

  // Format feast name
  function formatFeastName(name) {
    const names = {
      'ashWednesday': 'Ash Wednesday',
      'palmSunday': 'Palm Sunday',
      'holyThursday': 'Holy Thursday',
      'goodFriday': 'Good Friday',
      'holySaturday': 'Holy Saturday',
      'easterSunday': 'Easter Sunday',
      'divineMercy': 'Divine Mercy Sunday',
      'ascension': 'The Ascension of the Lord',
      'pentecost': 'Pentecost',
      'trinity': 'The Most Holy Trinity',
      'corpusChristi': 'The Most Holy Body and Blood of Christ',
      'sacredHeart': 'The Most Sacred Heart of Jesus'
    };
    return names[name] || name;
  }

  // Get season display name
  function getSeasonName(season) {
    const names = {
      'advent': 'Advent',
      'christmas': 'Christmas',
      'lent': 'Lent',
      'easter': 'Easter',
      'ordinary': 'Ordinary Time'
    };
    return names[season] || 'Ordinary Time';
  }

  // Get season color
  function getSeasonColor(season) {
    const colors = {
      'advent': '#6B46C1',     // Purple
      'christmas': '#FFD700',  // Gold
      'lent': '#8B4789',       // Deep Purple
      'easter': '#FFFFFF',     // White
      'ordinary': '#2D5016'    // Green
    };
    return colors[season] || '#2D5016';
  }

  // Display liturgical badge on landing page
  function displayLiturgicalBanner() {
    if (!currentLiturgicalInfo) return;

    // Check if badge already exists
    if (document.querySelector('.liturgical-badge')) return;

    // Find the subtitle in dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header .container-modern');
    if (!dashboardHeader) return;

    const badge = document.createElement('div');
    badge.className = 'liturgical-badge';
    badge.style.backgroundColor = currentLiturgicalInfo.color;
    
    // Badge content
    let badgeText = currentLiturgicalInfo.seasonName;
    let tooltipText = currentLiturgicalInfo.seasonName;
    
    if (currentLiturgicalInfo.feast) {
      tooltipText += ` • ${currentLiturgicalInfo.feast}`;
    }
    
    badge.textContent = badgeText;
    badge.setAttribute('title', tooltipText);
    badge.setAttribute('aria-label', tooltipText);
    
    // Append badge to the container
    dashboardHeader.appendChild(badge);

    // Add styles
    addLiturgicalStyles();
  }

  // Check for updates from online API
  function checkForUpdates() {
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    const now = Date.now();
    
    // Check if it's time to update (every 7 days)
    if (lastUpdate && (now - parseInt(lastUpdate)) < UPDATE_INTERVAL) {
      return; // Too soon to check again
    }
    
    // Check if online
    if (!navigator.onLine) {
      console.log('Offline - skipping liturgical calendar update');
      return;
    }
    
    // Try to fetch updated data (silent background update)
    fetchLiturgicalUpdates();
  }

  // Fetch updates from Catholic calendar API
  function fetchLiturgicalUpdates() {
    // Note: This would connect to a Catholic liturgical calendar API
    // For now, we'll just log that we checked
    console.log('Checking for liturgical calendar updates...');
    
    // Example API endpoint (would need to implement):
    // fetch('https://calapi.inadiutorium.cz/api/v0/en/calendars/default/today')
    
    // For now, just update the last check time
    localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
  }

  // Helper: Format date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add liturgical badge styles
  function addLiturgicalStyles() {
    if (document.getElementById('liturgical-styles')) return;

    const style = document.createElement('style');
    style.id = 'liturgical-styles';
    style.textContent = `
      .dashboard-header p {
        margin-bottom: 0.1rem;
      }

      .liturgical-badge {
        display: inline-block;
        margin-top: 0.1rem;
        padding: 0.25rem 0.75rem;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: white;
        border-radius: 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        cursor: help;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-align: center;
      }

      .liturgical-badge:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18);
      }

      @media (max-width: 768px) {
        .liturgical-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.65rem;
          margin-top: 0.1rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Public API
  window.LiturgicalCalendar = {
    getCurrentSeason: () => currentLiturgicalInfo,
    refresh: () => {
      loadLiturgicalData();
      if (isLandingPage()) {
        const existing = document.querySelector('.liturgical-badge');
        if (existing) existing.remove();
        displayLiturgicalBanner();
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
