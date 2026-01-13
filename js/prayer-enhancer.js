// Universal Prayer Page Enhancer
// Automatically wraps prayer content in modern card layout
(function() {
  'use strict';

  function enhancePrayerPage() {
    // Check if we're on a prayer page (not index, landing, or test pages)
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === 'landing.html' || 
        currentPage === '' || currentPage.includes('test') || 
        currentPage === 'navbar.html' || currentPage === 'footer.html') {
      return; // Don't enhance these pages
    }

    // Add prayer page background
    if (!document.body.classList.contains('dashboard-container')) {
      document.body.classList.add('prayer-page-container');
    }

    // Remove old masthead header
    const masthead = document.querySelector('.masthead, header.masthead');
    if (masthead) {
      masthead.remove();
    }

    // Find the main content container
    const container = document.querySelector('.container');
    if (!container) return;

    // Check if already enhanced
    if (container.classList.contains('prayer-enhanced')) {
      return;
    }

    // Map filenames to exact link names from navbar
    const prayerTitles = {
      'RenewalofVows.html': 'Renewal of Vows',
      'PrayeruponRising.html': 'Prayer upon Rising',
      'OfferingoftheDay.html': 'Offering of the Day',
      'PrayertotheHolySpirit.html': 'Prayer to the Holy Spirit',
      'Angelus.html': 'Angelus',
      'ReginaCoeli.html': 'Regina Coeli',
      'PrayertoOurLadyofthisHouse.html': 'Prayer to Our Lady of this House',
      'PrayerforourSisters.html': 'Prayer for our Sisters',
      'ActofContrition.html': 'Act of Contrition',
      'ActofFaith.html': 'Act of Faith',
      'ActofHope.html': 'Act of Hope',
      'ActofCharity.html': 'Act of Charity',
      'WeFlytoyourProtection.html': 'We Fly to your Protection',
      'Memorare.html': 'Memorare',
      'PrayerbeforeRetiring.html': 'Prayer before Retiring',
      'PrayerforAcceptanceofDeath.html': 'Prayer for Acceptance of Death',
      'PrayerforVocations.html': 'Prayer for Vocations',
      'WayoftheCross.html': 'Way of the Cross',
      'AnimaChristi.html': 'Anima Christi',
      'DivinePraises.html': 'Divine Praises',
      'LitanyoftheBlessedVirgin.html': 'Litany of the Blessed Virgin',
      'PrayertoourLadyofChartres.html': 'Prayer to our Lady of Chartres',
      'ActofConsecrationtotheImmaculateHeartofMary.html': 'Act of Consecration to the Immaculate Heart of Mary',
      'UnfailingPrayertoStJoseph.html': 'Unfailing Prayer to St. Joseph',
      'ConsecrationtotheSacredHeartofJesus.html': 'Consecration to the Sacred Heart of Jesus',
      'ThreeOClockPrayer.html': 'Three O\' Clock Prayer',
      'PrayerfortheDying.html': 'Prayer for the Dying',
      'PrayertoSt.Paul.html': 'Prayer to St. Paul',
      'PrayertoSt.Michael.html': 'Prayer to St. Michael',
      'PrayerforPeace.html': 'Prayer for Peace',
      'TheChapletofDivineMercy.html': 'The Chaplet of Divine Mercy',
      'joy.html': 'The Mysteries of Joy',
      'light.html': 'The Mysteries of Light',
      'sorrow.html': 'The Mysteries of Sorrow',
      'glorious.html': 'The Mysteries of Glory',
      'BLwhoarewe.html': 'Who Are WE',
      'BLnatureandmission.html': 'Nature & Mission',
      'BLlifeofconsecration.html': 'Life of Consecration'
    };
    
    // Get the page title from the mapping
    let pageTitle = prayerTitles[currentPage] || '';
    
    // If extraction fails, use masthead h1 or document title
    if (!pageTitle) {
      const h1 = document.querySelector('.masthead h1, .page-heading h1');
      if (h1) {
        pageTitle = h1.textContent.trim();
      } else {
        pageTitle = document.title.replace('SPC Online', '').replace(/[-|]/g, '').trim() || 'Prayer';
      }
    }

    // Get all content from container
    const contentRows = container.querySelectorAll('.row');
    let allContent = '';
    
    contentRows.forEach(row => {
      allContent += row.innerHTML;
    });

    // Remove empty divs and clean up
    allContent = allContent.replace(/<div class="col-lg-8 col-md-10 mx-auto">/g, '');
    allContent = allContent.replace(/<\/div>/g, '');

    // Create new modern card wrapper
    container.innerHTML = `
      <div class="prayer-content-card fade-in-up">
        <h1 class="prayer-title">${pageTitle}</h1>
        <div class="prayer-text">
          ${allContent}
        </div>
      </div>
    `;

    // Mark as enhanced
    container.classList.add('prayer-enhanced');

    // Keep PWA controls - move them above the card if needed
    const pwaControls = document.querySelector('.pwa-controls');
    if (pwaControls && pwaControls.parentElement === container) {
      // Move controls outside and above the container
      container.parentElement.insertBefore(pwaControls, container);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhancePrayerPage);
  } else {
    enhancePrayerPage();
  }
})();
