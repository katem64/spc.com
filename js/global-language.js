(function () {
  'use strict';

  const STORAGE_KEY = 'spc-examen-language';
  let frenchPageManifestPromise;

  function getLanguage() {
    return localStorage.getItem(STORAGE_KEY) === 'fr' ? 'fr' : 'en';
  }

  async function redirectPrayerPage(language) {
    const path = window.location.pathname;
    if (!path.includes('/pages/')) return;
    if (path.endsWith('marks-examen.html') || path.endsWith('examen-foundations.html')) return;
    const fileName = path.split('/').pop();
    const isFrenchPage = fileName.endsWith('.fr.html');
    if (language === 'fr' && !isFrenchPage) {
      const frenchPath = path.replace(/\.html$/, '.fr.html');
      try {
        frenchPageManifestPromise = frenchPageManifestPromise || fetch('../data/french-page-manifest.json?v=1').then((response) => response.json());
        const manifest = await frenchPageManifestPromise;
        const baseName = fileName.replace(/\.html$/, '');
        if (manifest.includes(`${baseName}.fr`)) window.location.replace(frenchPath + window.location.search + window.location.hash);
      } catch (error) {
        console.warn('[Language] French page manifest unavailable:', error);
      }
    } else if (language === 'en' && isFrenchPage) {
      window.location.replace(path.replace(/\.fr\.html$/, '.html') + window.location.search + window.location.hash);
    }
  }

  function applyLanguageMenu() {
    const language = getLanguage();
    const labels = language === 'fr' ? {
      home: 'Accueil',
      formulary: 'Prières formulaires',
      rosary: 'Le Rosaire',
      examen: 'EXAMEN M.A.R.K.S.',
      language: 'Langue'
    } : {
      home: 'Home',
      formulary: 'Formulary Prayers',
      rosary: 'The Rosary',
      examen: 'M.A.R.K.S. EXAMEN',
      language: 'Language'
    };
    const nav = document.querySelector('#mainNav');
    if (nav) {
      const home = nav.querySelector('.navbar-nav > .nav-item:first-child .nav-link');
      const formulary = nav.querySelector('#navbarDropdown');
      const rosary = nav.querySelector('#navbarDropdownRosary');
      const examen = nav.querySelector('#navbarDropdownExamen');
      const languageMenu = nav.querySelector('#navbarDropdownLanguage');
      if (home) home.textContent = labels.home;
      if (formulary) formulary.childNodes[0].textContent = labels.formulary;
      if (rosary) rosary.childNodes[0].textContent = labels.rosary;
      if (examen) examen.childNodes[0].textContent = labels.examen;
      if (languageMenu) languageMenu.childNodes[0].textContent = labels.language;
    }
    document.querySelectorAll('[data-global-language]').forEach((link) => {
      link.classList.toggle('active', link.dataset.globalLanguage === language);
      link.setAttribute('aria-current', link.dataset.globalLanguage === language ? 'true' : 'false');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem(STORAGE_KEY, link.dataset.globalLanguage);
        window.location.reload();
      });
    });
    applyLandingLanguage(language);
  }

  function applyLandingLanguage(language) {
    if (!document.body.classList.contains('dashboard-container')) return;
    const french = language === 'fr';
    const setText = (selector, values) => document.querySelectorAll(selector).forEach((element, index) => {
      if (!element.dataset.englishText) element.dataset.englishText = element.textContent;
      if (values[index] !== undefined) element.textContent = french ? values[index] : element.dataset.englishText;
    });
    document.querySelectorAll('[data-landing-en]').forEach((element) => {
      if (!element.dataset.englishText) element.dataset.englishText = element.textContent;
      element.textContent = french ? (element.dataset.landingFr || element.dataset.englishText) : element.dataset.englishText;
    });
    const profile = [
      'Nous sommes les Sœurs de Saint-Paul, une congrégation missionnaire fondée en 1696 par le Père Louis Chauvet, curé de Levesville-la-Chenard, un petit village de la région de la Beauce, à environ 80 kilomètres au sud-est de Paris.',
      'Notre première maison se trouvait au centre du village et lui appartenait.',
      'Notre première chapelle était l’église paroissiale et notre premier champ d’apostolat était constitué des hameaux environnants.',
      'Notre première mission consistait à améliorer le niveau humain et spirituel des villageois en instruisant les jeunes filles et en visitant les pauvres et les malades.',
      'Aujourd’hui, nous sommes présentes dans 40 pays répartis sur les cinq continents, toujours fidèles à notre première mission : rendre Jésus présent dans les visages si nombreux et différents des derniers, des plus petits et des plus délaissés.',
      'L’amour du Christ continue de nous pousser à manifester sa tendresse et sa bonté envers tous.',
      'Tout au long de l’histoire de la Congrégation des Sœurs de Saint-Paul de Chartres, la présence de l’Esprit Saint est clairement perceptible.',
      'L’amour du Christ continue de nous pousser à manifester sa tendresse et sa bonté envers tous.',
      'Tout au long de l’histoire de la Congrégation des Sœurs de Saint-Paul de Chartres, la présence de l’Esprit Saint est clairement perceptible.',
      'Les valeurs essentielles de l’Évangile du Christ, prêché avec tant d’intensité par saint Paul, se reflètent dans l’héritage, le charisme et la spiritualité apostolique de la Congrégation.',
      'Nous continuons à lire les signes des temps en vivant la Parole de l’Évangile, afin de devenir lumière pour les autres : « Que votre lumière brille devant les hommes afin qu’ils voient vos bonnes œuvres et rendent gloire à votre Père qui est aux cieux. » (Mt 5,16)'
    ];
    document.querySelectorAll('.card > div[style*="text-align: justify"] > p').forEach((element, index) => {
      if (!element.dataset.englishText) element.dataset.englishText = element.textContent;
      if (french && profile[index]) element.textContent = profile[index];
      else element.textContent = element.dataset.englishText;
    });
    const labels = {
      '.action-btn-label': ['Prières formulaires', 'Le Rosaire', 'Examen M.A.R.K.S.'],
      '.category-title': ['Prières formulaires', 'Le Rosaire', 'Examen M.A.R.K.S.'],
      '.prayer-card-title': ['Renouvellement des vœux', 'Prière au lever', 'Offrande du jour', 'Prière du matin', 'Prière du soir', 'Mystères joyeux', 'Mystères lumineux', 'Mystères douloureux', 'Mystères glorieux', 'Commencer l’examen'],
      '.prayer-card-description': ['Renouvelez votre engagement sacré envers Dieu et la Congrégation', 'Commencez votre journée avec Dieu', 'Consacrez votre journée au Seigneur', 'Commencez votre journée dans la gratitude et la grâce', 'Terminez votre journée dans la paix et l’action de grâce', 'Lundi et samedi', 'Jeudi', 'Mardi et vendredi', 'Mercredi et dimanche', 'Un chemin quotidien de réflexion à travers les 12 Marks SPC']
    };
    Object.entries(labels).forEach(([selector, values]) => setText(selector, values));
    const aboutTitle = document.querySelector('.card h2');
    const profileTitle = document.querySelector('.card h3');
    if (aboutTitle) { if (!aboutTitle.dataset.englishText) aboutTitle.dataset.englishText = aboutTitle.textContent; aboutTitle.textContent = french ? 'À propos de nous' : aboutTitle.dataset.englishText; }
    if (profileTitle) { if (!profileTitle.dataset.englishText) profileTitle.dataset.englishText = profileTitle.textContent; profileTitle.textContent = french ? 'Bref profil SPC' : profileTitle.dataset.englishText; }
    const season = document.querySelector('.liturgical-badge');
    if (season && french) season.textContent = season.textContent === 'Ordinary Time' ? 'Temps ordinaire' : season.textContent;
    const readings = document.querySelector('.readings-badge');
    if (readings && french) readings.textContent = readings.textContent.replace('Readings', 'Lectures');
  }

  window.SPCGlobalLanguage = { getLanguage };
  redirectPrayerPage(getLanguage());
  applyLanguageMenu();
  window.addEventListener('load', applyLanguageMenu, { once: true });
  setTimeout(applyLanguageMenu, 250);
})();
