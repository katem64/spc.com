(function () {
  'use strict';

  const DATA_URL = '../data/marks-examen-index.json?v=prelim1';
  const LANGUAGE_KEY = 'spc-examen-language';
  const labels = {
    en: { lead: 'A prayerful daily journey through the twelve Marks of our SPC identity.', start: "Start today's Examen", howtoMark: 'Choose a Mark', howtoMarkHelp: 'One area of our SPC life', howtoWeek: 'Choose a week', howtoWeekHelp: 'Follow the four-week journey', howtoDay: "Read today's prompt", howtoDayHelp: 'Pause, pray, and reflect', introTitle: 'Before you begin', searchTitle: 'Find a reflection', search: 'Search Marks, weeks, Scripture, or daily prompts', records: 'daily prompts', mark: 'Mark', week: 'Week', open: 'Open', previous: 'Previous', next: 'Next', back: 'Back to Marks', backWeek: 'Back to this week', days: 'Choose a day', chooseMark: 'Choose one of the 12 SPC Marks', markHelp: 'Begin with the Mark you are praying with today. You can return here at any time.', weekHelp: 'Choose a week. Each week contains seven daily reflections.', dayHelp: 'Choose a day for your reflection.', reflectionHelp: 'Take a quiet moment. What is God inviting you to notice today?', source: 'Source content' },
    fr: { lead: 'Un chemin quotidien de prière à travers les douze Marks de notre identité SPC.', start: 'Commencer l’examen du jour', howtoMark: 'Choisir un Mark', howtoMarkHelp: 'Un aspect de notre vie SPC', howtoWeek: 'Choisir une semaine', howtoWeekHelp: 'Suivre le parcours de quatre semaines', howtoDay: 'Lire la réflexion du jour', howtoDayHelp: 'S’arrêter, prier et réfléchir', introTitle: 'Avant de commencer', searchTitle: 'Trouver une réflexion', search: 'Rechercher un Mark, une semaine, une Écriture ou une réflexion', records: 'réflexions quotidiennes', mark: 'Mark', week: 'Semaine', open: 'Ouvrir', previous: 'Précédent', next: 'Suivant', back: 'Retour aux Marks', backWeek: 'Retour à cette semaine', days: 'Choisir un jour', chooseMark: 'Choisir parmi les 12 Marks SPC', markHelp: "Commencez par le Mark que vous priez aujourd'hui. Vous pouvez revenir ici à tout moment.", weekHelp: 'Choisissez une semaine. Chaque semaine contient sept réflexions quotidiennes.', dayHelp: 'Choisissez un jour pour votre réflexion.', reflectionHelp: 'Prenez un moment de silence. À quoi Dieu vous invite-t-il aujourd’hui ?', source: 'Contenu source' }
  };
  const frenchSteps = ['Attentive à la présence de Dieu', 'Accueillir avec gratitude', 'Relire et reconnaître les mouvements intérieurs', 'Garder un cœur ouvert à la miséricorde de Dieu', 'S’abandonner et servir'];
  const frenchMarks = {
    'Christ at the Center of my Life': 'Le Christ au centre de ma vie',
    'Generous and Warmhearted Service': 'Service généreux et chaleureux',
    'Mortification and Asceticism': 'Mortification et ascèse',
    'Tranquil Daring': 'Audace tranquille',
    'Docility to the Spirit': 'Docilité à l’Esprit Saint',
    'Self-Effacement': 'Effacement de soi',
    'Simplicity': 'Simplicité',
    'Hospitality': 'Hospitalité',
    'Responsible Stewardship': 'Intendance responsable',
    'Zeal for Mission and Availability': 'Zèle missionnaire et disponibilité',
    'All to All': 'Tout à tous',
    'Charity in Community': 'Charité en communauté'
  };
  const frenchDays = { Sunday: 'Dimanche', Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi', Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi' };
  const frenchAliases = { prière: 'prayer', pardon: 'forgiveness', communauté: 'community', service: 'service', miséricorde: 'mercy', mission: 'mission' };
  let data;
  let language = localStorage.getItem(LANGUAGE_KEY) || 'en';

  const $ = (selector) => document.querySelector(selector);
  const clean = (value) => String(value || '').toLocaleLowerCase();
  const params = () => new URLSearchParams(location.hash.slice(1));
  const setHash = (values) => { location.hash = new URLSearchParams(values).toString(); };

  function allRecords() { return (data.records || []).concat(data.sourceRecords || []); }
  function mark(number) { return data.marks.find((item) => item.markNumber === Number(number)); }
  function currentWeek(markData, number) { return markData && markData.weeks.find((item) => item.weekNumber === Number(number)); }
  function localizedMark(markData) { return language === 'fr' ? (markData.frTitle || frenchMarks[markData.title] || markData.title) : markData.title; }
  function localizedDay(dayData) { return language === 'fr' ? (dayData.frDay || frenchDays[dayData.day] || dayData.day) : dayData.day; }
  function localizedWeek(weekData) { return language === 'fr' ? (weekData.frTheme || weekData.theme) : weekData.theme; }
  function localizedScripture(weekData) { return language === 'fr' ? (weekData.frScripture || weekData.scripture) : weekData.scripture; }
  function localizedPrompt(dayData) { return language === 'fr' ? (dayData.frPrompt || dayData.prompt) : dayData.prompt; }

  function updateLanguage() {
    const copy = labels[language];
    $('#intro-title').textContent = copy.introTitle;
    $('#search-title').textContent = copy.searchTitle;
    $('#examen-lead').textContent = copy.lead;
    $('#start-examen-button').childNodes[0].textContent = `${copy.start} `;
    $('#howto-mark').textContent = copy.howtoMark;
    $('#howto-mark-help').textContent = copy.howtoMarkHelp;
    $('#howto-week').textContent = copy.howtoWeek;
    $('#howto-week-help').textContent = copy.howtoWeekHelp;
    $('#howto-day').textContent = copy.howtoDay;
    $('#howto-day-help').textContent = copy.howtoDayHelp;
    $('#intro-text').textContent = language === 'fr' ? "L’examen de conscience nous apprend à vivre dans la pleine conscience de la présence aimante de Dieu, à reconnaître l’action de l’Esprit Saint dans notre vie quotidienne et à imiter le Christ." : data.intro;
    $('#examen-search-input').placeholder = copy.search;
    document.querySelectorAll('.language-button').forEach((button) => button.classList.toggle('active', button.dataset.language === language));
  }

  function renderSteps() {
    $('#marks-steps').innerHTML = data.steps.map((step, index) => `<div class="mark-step"><strong>${step.letter}</strong><span>${language === 'fr' ? (step.frTitle || frenchSteps[index]) : step.title}</span></div>`).join('');
  }

  function renderHome() {
    const copy = labels[language];
    $('#examen-content').innerHTML = `<div class="examen-breadcrumb">M.A.R.K.S. Examen</div><h2>${copy.chooseMark}</h2><p class="section-instruction">${copy.markHelp}</p><div class="mark-grid">${data.marks.map((item) => `<button class="examen-choice" data-mark="${item.markNumber}"><span class="choice-number">${item.markNumber}</span><strong>${localizedMark(item)}</strong><span>${copy.open} ${copy.mark}</span></button>`).join('')}</div>`;
    document.querySelectorAll('[data-mark]').forEach((button) => button.addEventListener('click', () => setHash({ mark: button.dataset.mark })));
  }

  function renderMark(markData) {
    const copy = labels[language];
    const sourceLabels = language === 'fr' ? ['À propos de ce Mark', 'Actes capitulaires', 'La grâce à demander'] : ['About this Mark', 'Capitular Acts', 'Grace to beg'];
    $('#examen-content').innerHTML = `<button class="back-button" data-home><i class="fas fa-arrow-left"></i> ${copy.back}</button><div class="examen-breadcrumb">M.A.R.K.S. Examen / ${localizedMark(markData)}</div><h2>${localizedMark(markData)}</h2><div class="mark-source-content"><h3>${sourceLabels[0]}</h3><p>${markData.description || ''}</p><h3>${sourceLabels[1]}</h3><p>${markData.capitularActs || ''}</p><h3>${sourceLabels[2]}</h3><p>${markData.graceToBeg || ''}</p></div><p class="section-instruction">${copy.weekHelp}</p><div class="week-grid">${markData.weeks.map((week) => `<button class="examen-choice" data-week="${week.weekNumber}"><span class="choice-number">${week.weekNumber}</span><strong>${copy.week} ${week.weekNumber}</strong><span>${localizedWeek(week)}</span></button>`).join('')}</div>`;
    $('[data-home]').addEventListener('click', () => { location.hash = ''; });
    document.querySelectorAll('[data-week]').forEach((button) => button.addEventListener('click', () => setHash({ mark: markData.markNumber, week: button.dataset.week })));
  }

  function renderWeek(markData, weekData) {
    const copy = labels[language];
    $('#examen-content').innerHTML = `<button class="back-button" data-back-mark><i class="fas fa-arrow-left"></i> ${copy.back}</button><div class="examen-breadcrumb">${localizedMark(markData)} / ${copy.week} ${weekData.weekNumber}</div><h2>${localizedWeek(weekData)}</h2><p class="daily-meta">${localizedScripture(weekData)}</p><p class="section-instruction">${copy.dayHelp}</p><div class="day-grid">${weekData.days.map((item) => `<button class="examen-choice" data-day="${item.day}"><span class="choice-number"><i class="far fa-calendar"></i></span><strong>${localizedDay(item)}</strong><span>${copy.open}</span></button>`).join('')}</div>`;
    $('[data-back-mark]').addEventListener('click', () => { setHash({ mark: markData.markNumber }); });
    document.querySelectorAll('[data-day]').forEach((button) => button.addEventListener('click', () => setHash({ mark: markData.markNumber, week: weekData.weekNumber, day: button.dataset.day })));
  }

  function renderDay(markData, weekData, dayName) {
    const copy = labels[language];
    const day = weekData.days.find((item) => item.day === dayName) || weekData.days[0];
    const index = weekData.days.findIndex((item) => item.day === day.day);
    const previous = weekData.days[index - 1];
    const next = weekData.days[index + 1];
    $('#examen-content').innerHTML = `<div class="daily-view"><button class="back-button" data-back-week><i class="fas fa-arrow-left"></i> ${copy.backWeek}</button><div class="examen-breadcrumb">${localizedMark(markData)} / ${copy.week} ${weekData.weekNumber} / ${localizedDay(day)}</div><h2>${localizedWeek(weekData)}</h2><p class="day-label">${localizedDay(day)}</p><p class="daily-meta">${localizedScripture(weekData)}</p><blockquote>${localizedPrompt(day)}</blockquote><p class="reflection-instruction">${copy.reflectionHelp}</p><div class="examen-nav"><button ${previous ? '' : 'disabled'} data-nav-day="${previous ? previous.day : ''}">${copy.previous}</button><button ${next ? '' : 'disabled'} data-nav-day="${next ? next.day : ''}">${copy.next}</button></div></div>`;
    $('[data-back-week]').addEventListener('click', () => { setHash({ mark: markData.markNumber, week: weekData.weekNumber }); });
    document.querySelectorAll('[data-nav-day]').forEach((button) => button.addEventListener('click', () => button.dataset.navDay && setHash({ mark: markData.markNumber, week: weekData.weekNumber, day: button.dataset.navDay })));
  }

  function render() {
    if (!data) return;
    const query = params();
    if (query.get('lang') === 'en' || query.get('lang') === 'fr') {
      language = query.get('lang');
      localStorage.setItem(LANGUAGE_KEY, language);
    }
    updateLanguage();
    const selectedMark = mark(query.get('mark'));
    const selectedWeek = currentWeek(selectedMark, query.get('week'));
    if (!selectedMark) renderHome();
    else if (!selectedWeek) renderMark(selectedMark);
    else if (!query.get('day')) renderWeek(selectedMark, selectedWeek);
    else renderDay(selectedMark, selectedWeek, query.get('day'));
  }

  function search(query) {
    const copy = labels[language];
    const normalized = clean(query);
    if (normalized.length < 2) { $('#search-results').innerHTML = ''; return; }
    const terms = normalized.split(/\s+/).filter(Boolean).map((term) => frenchAliases[term] || term);
    const results = allRecords().map((record) => {
      const haystack = clean([record.mark, record.theme, record.day, record.scripture, record.prompt, record.week, record.weekNumber].join(' '));
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { record, score };
    }).filter((item) => item.score === terms.length).sort((a, b) => b.score - a.score).slice(0, 30);
    $('#search-results').innerHTML = results.length ? results.map(({ record }) => {
      const resultLink = record.contentType === 'daily-prompt' ? `data-result="${record.markNumber}|${record.weekNumber}|${record.day}"` : '';
      const sourceText = language === 'fr' && record.frPrompt ? record.frPrompt : record.prompt;
      const preview = record.contentType === 'source-content' ? sourceText.replace(/\s+/g, ' ').slice(0, 240) + '...' : (language === 'fr' && record.frPrompt ? record.frPrompt : record.prompt);
      const resultMark = language === 'fr' ? (record.frMark || record.mark) : record.mark;
      const resultTheme = language === 'fr' ? (record.frTheme || record.theme) : record.theme;
      const resultDay = language === 'fr' ? (record.frDay || record.day) : record.day;
      return `<button class="search-result" ${resultLink}><small>${record.weekNumber ? `${resultMark} / ${copy.week} ${record.weekNumber}: ${resultTheme} / ${resultDay}` : `${resultMark} / ${copy.source}`}</small><p>${language === 'fr' && record.frPrompt ? record.frPrompt : preview}</p></button>`;
    }).join('') : '<p>No matching Examen content found.</p>';
    document.querySelectorAll('[data-result]').forEach((button) => button.addEventListener('click', () => { const [markNumber, weekNumber, day] = button.dataset.result.split('|'); setHash({ mark: markNumber, week: weekNumber, day }); }));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = await response.json();
      $('#record-count').textContent = `${data.records.length} ${labels[language].records}`;
      renderSteps();
      render();
      $('#examen-search-input').addEventListener('input', (event) => search(event.target.value));
      document.querySelectorAll('.language-button').forEach((button) => button.addEventListener('click', () => { language = button.dataset.language; localStorage.setItem(LANGUAGE_KEY, language); render(); }));
      window.addEventListener('hashchange', render);
    } catch (error) {
      $('#examen-content').innerHTML = '<p>Unable to load the offline Examen data.</p>';
      console.error('[Examen]', error);
    }
  });
}());
