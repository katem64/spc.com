// Prayer Tracker - Phase 1
// Tracks prayer history, streaks, and statistics using localStorage

(function() {
  'use strict';

  const STORAGE_KEY = 'spc-prayer-history';
  const SETTINGS_KEY = 'spc-tracker-settings';

  // Default settings
  const defaultSettings = {
    streaksEnabled: true,
    showStats: true,
    showRecentPrayers: true,
    showStatsLink: false
  };

  // Initialize tracker
  function initTracker() {
    // Load or create prayer history
    let history = loadHistory();
    
    // Check if we need to mark today's prayer
    const currentPage = getCurrentPrayerName();
    
    if (currentPage && !isIndexOrLanding()) {
      markPrayerVisited(currentPage);
      
      // Show brief notification
      showTrackingNotification(currentPage);
    }

    // Add stats link to navbar if not exists
    addStatsLinkToNavbar();
  }

  // Load prayer history from localStorage
  function loadHistory() {
    const defaultHistory = {
      prayers: {},
      dailyLog: {},
      firstPrayerDate: new Date().toISOString().split('T')[0],
      totalPrayers: 0,
      lastVisited: []
    };
    
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Handle corrupt data (if it's an array, clear it)
        if (Array.isArray(parsed)) {
          localStorage.removeItem(STORAGE_KEY);
          return defaultHistory;
        }
        
        // Ensure all required properties exist
        return {
          prayers: parsed.prayers || {},
          dailyLog: parsed.dailyLog || {},
          firstPrayerDate: parsed.firstPrayerDate || defaultHistory.firstPrayerDate,
          totalPrayers: parsed.totalPrayers !== undefined ? parsed.totalPrayers : 0,
          lastVisited: parsed.lastVisited || []
        };
      } catch (e) {
        console.error('Error loading prayer history:', e);
      }
    }
    
    return defaultHistory;
  }

  // Save prayer history to localStorage
  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving prayer history:', e);
    }
  }

  // Load settings
  function loadSettings() {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    return defaultSettings;
  }

  // Save settings
  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  // Get current prayer name from page
  function getCurrentPrayerName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    
    // Exclude non-prayer pages
    const excludedPages = ['', 'index.html', 'landing.html', 'prayer-stats.html', 'prayer-settings.html', 'test-tracker.html'];
    
    if (!fileName || excludedPages.includes(fileName)) {
      return null;
    }
    
    // Clean up the name
    return fileName.replace('.html', '').replace(/([A-Z])/g, ' $1').trim();
  }

  // Check if we're on index or landing
  function isIndexOrLanding() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName === '' || fileName === 'index.html' || fileName === 'landing.html';
  }

  // Check if we're on index page
  function isIndexPage() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName === '' || fileName === 'landing.html';
  }

  // Mark prayer as visited
  function markPrayerVisited(prayerName) {
    const history = loadHistory();
    const today = new Date().toISOString().split('T')[0];



    // Update prayer count
    if (!history.prayers[prayerName]) {
      history.prayers[prayerName] = {
        count: 0,
        lastVisited: null,
        firstVisited: today
      };
    }
    
    history.prayers[prayerName].count++;
    history.prayers[prayerName].lastVisited = today;
    history.totalPrayers++;

    // Update daily log
    if (!history.dailyLog[today]) {
      history.dailyLog[today] = [];
    }
    
    if (!history.dailyLog[today].includes(prayerName)) {
      history.dailyLog[today].push(prayerName);
    }

    // Update recently visited
    history.lastVisited = history.lastVisited || [];
    history.lastVisited = history.lastVisited.filter(p => p !== prayerName);
    history.lastVisited.unshift(prayerName);
    history.lastVisited = history.lastVisited.slice(0, 10);

    saveHistory(history);
    

  }

  // Calculate current streak
  function calculateStreak() {
    const history = loadHistory();
    const settings = loadSettings();
    
    if (!settings.streaksEnabled) {
      return 0;
    }

    const dailyLog = history.dailyLog || {};
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check if prayed today
    const todayKey = today.toISOString().split('T')[0];
    if (!dailyLog[todayKey] || dailyLog[todayKey].length === 0) {
      // Check yesterday to see if streak is ongoing
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count backwards from today/yesterday
    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      
      if (dailyLog[dateKey] && dailyLog[dateKey].length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Calculate total prayer days
  function calculateTotalDays() {
    const history = loadHistory();
    return Object.keys(history.dailyLog || {}).length;
  }

  // Get this week's prayer days
  function getWeekPrayers() {
    const history = loadHistory();
    const dailyLog = history.dailyLog || {};
    const week = [];
    const today = new Date();

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      week.push({
        day: dayName,
        date: dateKey,
        prayed: dailyLog[dateKey] && dailyLog[dateKey].length > 0,
        isToday: i === 0
      });
    }

    return week;
  }

  // Get this month's stats
  function getMonthStats() {
    const history = loadHistory();
    const dailyLog = history.dailyLog || {};
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let prayedDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      
      if (dailyLog[dateKey] && dailyLog[dateKey].length > 0) {
        prayedDays++;
      }
    }

    return {
      prayedDays,
      totalDays: daysInMonth
    };
  }

  // Update dashboard with tracker widgets
  function updateDashboard() {
    const settings = loadSettings();
    const container = document.querySelector('.container-modern');
    
    if (!container) return;

    // Create tracker section
    const trackerSection = document.createElement('div');
    trackerSection.className = 'prayer-tracker-dashboard';
    trackerSection.style.marginBottom = '2rem';

    let html = '<div class="widget-grid" style="margin-top: 1rem;">';

    // Streak widget (if enabled)
    if (settings.streaksEnabled) {
      const streak = calculateStreak();
      html += `
        <div class="card prayer-tracker-card fade-in-up">
          <div class="tracker-icon">ðŸ”¥</div>
          <div class="tracker-number">${streak}</div>
          <div class="tracker-label">Day Streak</div>
          <div class="tracker-subtitle">${streak === 0 ? 'Start praying today!' : 'Keep it going!'}</div>
        </div>
      `;
    }

    // Total days widget (always show)
    const totalDays = calculateTotalDays();
    html += `
      <div class="card prayer-tracker-card fade-in-up">
        <div class="tracker-icon">ðŸ“…</div>
        <div class="tracker-number">${totalDays}</div>
        <div class="tracker-label">Days of Prayer</div>
        <div class="tracker-subtitle">Total days prayed</div>
      </div>
    `;

    // This month widget
    const monthStats = getMonthStats();
    html += `
      <div class="card prayer-tracker-card fade-in-up">
        <div class="tracker-icon">ðŸ“Š</div>
        <div class="tracker-number">${monthStats.prayedDays}/${monthStats.totalDays}</div>
        <div class="tracker-label">This Month</div>
        <div class="tracker-subtitle">Days prayed in ${new Date().toLocaleDateString('en-US', { month: 'long' })}</div>
      </div>
    `;

    html += '</div>';

    // Week view
    if (settings.showStats) {
      const week = getWeekPrayers();
      html += `
        <div class="week-tracker" style="margin-top: 1.5rem; text-align: center;">
          <h3 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 0.75rem;">This Week</h3>
          <div class="week-days">
            ${week.map(day => `
              <div class="week-day ${day.prayed ? 'prayed' : ''} ${day.isToday ? 'today' : ''}">
                <div class="day-name">${day.day}</div>
                <div class="day-indicator">${day.prayed ? 'âœ…' : 'â­•'}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Recently viewed prayers
    if (settings.showRecentPrayers) {
      const history = loadHistory();
      if (history.lastVisited && history.lastVisited.length > 0) {
        html += `
          <div class="recent-prayers" style="margin-top: 1.5rem;">
            <h3 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Recently Viewed</h3>
            <div class="recent-list">
              ${history.lastVisited.slice(0, 5).map(prayer => `
                <a href="${prayer.replace(/\s+/g, '')}.html" class="recent-item">
                  <span>ðŸ“–</span>
                  <span>${prayer}</span>
                </a>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    trackerSection.innerHTML = html;

    // Insert after dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader && dashboardHeader.nextElementSibling) {
      dashboardHeader.nextElementSibling.insertBefore(trackerSection, dashboardHeader.nextElementSibling.firstChild);
    }

    // Add styles
    addTrackerStyles();
  }

  // Add stats link to navbar
  function addStatsLinkToNavbar() {
    // Keep statistics available by direct URL, but hide the navigation entry.
    const existingLink = document.querySelector('.stats-link');
    if (existingLink) existingLink.remove();
    return;

    // Wait for navbar to load
    setTimeout(() => {
      const navbarNav = document.querySelector('.navbar-nav');
      if (!navbarNav) return;

      // Check if stats link already exists
      if (document.querySelector('.stats-link')) return;

      // Determine correct path based on current location
      const isInPagesFolder = window.location.pathname.includes('/pages/');
      const statsPath = isInPagesFolder ? 'prayer-stats.html' : './pages/prayer-stats.html';

      const statsLink = document.createElement('li');
      statsLink.className = 'nav-item stats-link';
      statsLink.innerHTML = `
        <a class="nav-link" href="${statsPath}">
          <i class="fas fa-chart-bar"></i> Stats
        </a>
      `;

      navbarNav.appendChild(statsLink);
    }, 500);
  }

  // Add tracker styles
  function addTrackerStyles() {
    if (document.getElementById('tracker-styles')) return;

    const style = document.createElement('style');
    style.id = 'tracker-styles';
    style.textContent = `
      .prayer-tracker-card {
        text-align: center;
        padding: 1.5rem !important;
        transition: transform 0.2s ease;
      }

      .prayer-tracker-card:hover {
        transform: translateY(-2px);
      }

      .tracker-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .tracker-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--catholic-purple);
        margin-bottom: 0.25rem;
      }

      .tracker-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
      }

      .tracker-subtitle {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }

      .week-days {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .week-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        min-width: 50px;
      }

      .day-name {
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .day-indicator {
        font-size: 1.5rem;
      }

      .week-day.today .day-name {
        color: var(--primary);
        font-weight: 700;
      }

      .recent-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .recent-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--bg-primary);
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.2s ease;
      }

      .recent-item:hover {
        background: var(--light-bg);
        border-color: var(--primary);
        transform: translateX(4px);
      }

      .recent-item span:first-child {
        font-size: 1.25rem;
      }

      .recent-item span:last-child {
        flex: 1;
        font-size: 0.9rem;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .prayer-tracker-card {
          padding: 1rem !important;
        }

        .tracker-number {
          font-size: 1.75rem;
        }

        .tracker-icon {
          font-size: 1.75rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Show tracking notification
  function showTrackingNotification(prayerName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #9a6c2f, #6b421f);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      z-index: 10000;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    notification.innerHTML = `âœ… Prayer tracked: ${prayerName}`;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Expose public API
  window.PrayerTracker = {
    loadSettings,
    saveSettings,
    calculateStreak,
    calculateTotalDays,
    getWeekPrayers,
    getMonthStats,
    loadHistory,
    addStatsLinkToNavbar
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracker);
  } else {
    initTracker();
  }
})();

