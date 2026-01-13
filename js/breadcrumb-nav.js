// Breadcrumb Navigation & Active Section Indicator
// Adds breadcrumb trail and highlights current navbar section

(function() {
  'use strict';

  // Prayer page categories mapping
  const prayerCategories = {
    'Formulary Prayers': [
      'RenewalofVows', 'PrayeruponRising', 'OfferingoftheDay', 'PrayertotheHolySpirit',
      'Angelus', 'ReginaCoeli', 'PrayertoOurLadyofthisHouse', 'PrayerforourSisters',
      'ActofContrition', 'ActofFaith', 'ActofHope', 'ActofCharity',
      'WeFlytoyourProtection', 'Memorare', 'PrayerbeforeRetiring',
      'PrayerforAcceptanceofDeath', 'PrayerforVocations', 'WayoftheCross',
      'AnimaChristi', 'DivinePraises', 'LitanyoftheBlessedVirgin',
      'PrayertoourLadyofChartres', 'ActofConsecrationtotheImmaculateHeartofMary',
      'UnfailingPrayertoStJoseph', 'ConsecrationtotheSacredHeartofJesus',
      'ThreeOClockPrayer', 'PrayerfortheDying', 'PrayertoSt.Paul',
      'PrayertoSt.Michael', 'VeniCreatorSpiritus', 'VeniSancteSpritus',
      'TheChapletofDivineMercy', 'PrayerforPeace', 'morning', 'night'
    ],
    'The Rosary': [
      'joy', 'light', 'sorrow', 'glorious'
    ],
    'Book of Life': [
      'BLwhoarewe', 'BLnatureandmission', 'BLlifeofconsecration'
    ]
  };

  // Get current page info
  function getCurrentPageInfo() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop().replace('.html', '');
    
    // Determine category
    let category = null;
    for (const [catName, pages] of Object.entries(prayerCategories)) {
      if (pages.includes(fileName)) {
        category = catName;
        break;
      }
    }
    
    // Get prayer title from h1 tag
    const h1 = document.querySelector('h1');
    const prayerTitle = h1 ? h1.textContent : formatPrayerName(fileName);
    
    return {
      fileName: fileName,
      category: category,
      prayerTitle: prayerTitle
    };
  }

  // Format prayer name from filename
  function formatPrayerName(fileName) {
    return fileName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^BL/, 'Book of Life: ')
      .trim();
  }

  // Add breadcrumb navigation
  function addBreadcrumb() {
    const pageInfo = getCurrentPageInfo();
    
    if (!pageInfo.category) return; // Not a prayer page
    
    // Check if breadcrumb already exists
    if (document.querySelector('.breadcrumb-nav')) return;
    
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb-nav';
    breadcrumb.innerHTML = `
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="../landing.html">
                <i class="fas fa-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li class="breadcrumb-item">
              <a href="../landing.html#${getCategoryAnchor(pageInfo.category)}">
                ${pageInfo.category}
              </a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              ${pageInfo.prayerTitle}
            </li>
          </ol>
        </nav>
      </div>
    `;
    
    // Insert after navbar (which is fixed-top)
    const navbar = document.querySelector('#mainNav');
    if (navbar && navbar.nextElementSibling) {
      navbar.parentNode.insertBefore(breadcrumb, navbar.nextElementSibling);
    } else {
      document.body.insertBefore(breadcrumb, document.body.firstChild);
    }
    
    // Add styles
    addBreadcrumbStyles();
  }

  // Get category anchor for landing page
  function getCategoryAnchor(category) {
    const anchorMap = {
      'Formulary Prayers': 'formulary',
      'The Rosary': 'rosary',
      'Book of Life': 'bookoflife'
    };
    return anchorMap[category] || '';
  }

  // Highlight active section in navbar
  function highlightActiveSection() {
    const pageInfo = getCurrentPageInfo();
    
    if (!pageInfo.category) return;
    
    // Wait for navbar to load
    setTimeout(() => {
      const dropdowns = document.querySelectorAll('.nav-item.dropdown');
      
      dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link.dropdown-toggle');
        const dropdownText = dropdownLink ? dropdownLink.textContent.trim() : '';
        
        if (dropdownText === pageInfo.category) {
          // Add active class to dropdown
          dropdown.classList.add('active');
          
          // Highlight current prayer in dropdown menu
          const menuItems = dropdown.querySelectorAll('.dropdown-item');
          menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.includes(pageInfo.fileName)) {
              item.classList.add('active');
            }
          });
        }
      });
    }, 300);
  }

  // Add breadcrumb styles
  function addBreadcrumbStyles() {
    if (document.getElementById('breadcrumb-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'breadcrumb-styles';
    style.textContent = `
      .breadcrumb-nav {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        z-index: 1029;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(102, 126, 234, 0.15);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .breadcrumb-nav .breadcrumb {
        background: transparent;
        padding: 0.75rem 0;
        margin: 0;
        font-size: 0.9rem;
      }

      .breadcrumb-nav .breadcrumb-item {
        color: var(--text-secondary);
      }

      .breadcrumb-nav .breadcrumb-item a {
        color: var(--primary);
        text-decoration: none;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .breadcrumb-nav .breadcrumb-item a:hover {
        color: var(--accent);
        text-decoration: none;
      }

      .breadcrumb-nav .breadcrumb-item.active {
        color: var(--text-primary);
        font-weight: 500;
      }

      .breadcrumb-nav .breadcrumb-item + .breadcrumb-item::before {
        content: "›";
        color: var(--text-secondary);
        font-size: 1.1rem;
        padding-right: 0.5rem;
      }

      .breadcrumb-nav .fas.fa-home {
        font-size: 0.85rem;
      }

      /* Active section indicator in navbar */
      #mainNav .nav-item.dropdown.active > .nav-link {
        color: var(--primary) !important;
        font-weight: 600;
        position: relative;
      }

      #mainNav .nav-item.dropdown.active > .nav-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 3px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        border-radius: 2px;
      }

      #mainNav .dropdown-item.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        color: var(--primary) !important;
        font-weight: 600;
        border-left: 3px solid var(--primary);
        padding-left: calc(0.875rem - 3px);
      }

      /* Adjust page content to account for breadcrumb */
      body {
        padding-top: 115px !important;
      }

      .dashboard-container {
        padding-top: 115px !important;
      }

      .prayer-page-container {
        padding-top: 115px !important;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .breadcrumb-nav {
          top: 60px;
        }

        .breadcrumb-nav .breadcrumb {
          padding: 0.5rem 0;
          font-size: 0.8rem;
        }

        .breadcrumb-nav .breadcrumb-item a span {
          display: none;
        }

        .breadcrumb-nav .breadcrumb-item a i {
          font-size: 1rem;
        }

        body {
          padding-top: 100px !important;
        }

        .dashboard-container {
          padding-top: 100px !important;
        }

        .prayer-page-container {
          padding-top: 100px !important;
        }

        #mainNav .nav-item.dropdown.active > .nav-link::after {
          bottom: 0;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Initialize
  function init() {
    // Check if we're on a prayer page
    const path = window.location.pathname;
    if (!path.includes('/pages/')) return;
    
    const fileName = path.split('/').pop();
    if (fileName === 'prayer-stats.html' || fileName === 'prayer-settings.html') return;
    
    // Add breadcrumb
    addBreadcrumb();
    
    // Highlight active section
    highlightActiveSection();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
