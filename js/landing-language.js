(function () {
  'use strict';

  const language = localStorage.getItem('spc-examen-language') === 'fr' ? 'fr' : 'en';
  if (language !== 'fr') return;

  const setList = (selector, values) => document.querySelectorAll(selector).forEach((element, index) => {
    if (values[index]) element.textContent = values[index];
  });

  setList('.action-btn-label', ['Pri\u00e8res formulaires', 'Le Rosaire', 'Examen M.A.R.K.S.']);
  setList('.category-title', ['Pri\u00e8res formulaires', 'Le Rosaire', 'Examen M.A.R.K.S.']);
  setList('.prayer-card-title', [
    'Renouvellement des v\u0153ux', 'Pri\u00e8re au lever', 'Offrande du jour',
    'Pri\u00e8re du matin', 'Pri\u00e8re du soir', 'Myst\u00e8res joyeux',
    'Myst\u00e8res lumineux', 'Myst\u00e8res douloureux', 'Myst\u00e8res glorieux',
    'Commencer l\u2019examen'
  ]);
  setList('.prayer-card-description', [
    'Renouvelez votre engagement sacr\u00e9 envers Dieu et la Congr\u00e9gation',
    'Commencez votre journ\u00e9e avec Dieu', 'Consacrez votre journ\u00e9e au Seigneur',
    'Commencez votre journ\u00e9e dans la gratitude et la gr\u00e2ce',
    'Terminez votre journ\u00e9e dans la paix et l\u2019action de gr\u00e2ce',
    'Lundi et samedi', 'Jeudi', 'Mardi et vendredi', 'Mercredi et dimanche',
    'Un chemin quotidien de r\u00e9flexion \u00e0 travers les 12 Marks SPC'
  ]);

  const aboutTitle = document.querySelector('.card h2');
  const profileTitle = document.querySelector('.card h3');
  if (aboutTitle) aboutTitle.textContent = '\u00c0 propos de nous';
  if (profileTitle) profileTitle.textContent = 'Bref profil SPC';

  const profile = [
    'Nous sommes les S\u0153urs de Saint-Paul, une congr\u00e9gation missionnaire fond\u00e9e en 1696 par le P\u00e8re Louis Chauvet, cur\u00e9 de Levesville-la-Chenard, un petit village de la r\u00e9gion de la Beauce, \u00e0 environ 80 kilom\u00e8tres au sud-est de Paris.',
    'Notre premi\u00e8re maison se trouvait au centre du village et lui appartenait.',
    'Notre premi\u00e8re chapelle \u00e9tait l\u2019\u00e9glise paroissiale et notre premier champ d\u2019apostolat \u00e9tait constitu\u00e9 des hameaux environnants.',
    'Notre premi\u00e8re mission consistait \u00e0 am\u00e9liorer le niveau humain et spirituel des villageois en instruisant les jeunes filles et en visitant les pauvres et les malades.',
    'Aujourd\u2019hui, nous sommes pr\u00e9sentes dans 40 pays r\u00e9partis sur les cinq continents, toujours fid\u00e8les \u00e0 notre premi\u00e8re mission : rendre J\u00e9sus pr\u00e9sent dans les visages si nombreux et diff\u00e9rents des derniers, des plus petits et des plus d\u00e9laiss\u00e9s.',
    'L\u2019amour du Christ continue de nous pousser \u00e0 manifester sa tendresse et sa bont\u00e9 envers tous.',
    'Tout au long de l\u2019histoire de la Congr\u00e9gation des S\u0153urs de Saint-Paul de Chartres, la pr\u00e9sence de l\u2019Esprit Saint est clairement perceptible.',
    'L\u2019amour du Christ continue de nous pousser \u00e0 manifester sa tendresse et sa bont\u00e9 envers tous.',
    'Tout au long de l\u2019histoire de la Congr\u00e9gation des S\u0153urs de Saint-Paul de Chartres, la pr\u00e9sence de l\u2019Esprit Saint est clairement perceptible.',
    'Les valeurs essentielles de l\u2019\u00c9vangile du Christ, pr\u00each\u00e9 avec tant d\u2019intensit\u00e9 par saint Paul, se refl\u00e8tent dans l\u2019h\u00e9ritage, le charisme et la spiritualit\u00e9 apostolique de la Congr\u00e9gation.',
    'Nous continuons \u00e0 lire les signes des temps en vivant la Parole de l\u2019\u00c9vangile afin de devenir lumi\u00e8re pour les autres : \u00ab Que votre lumi\u00e8re brille devant les hommes afin qu\u2019ils voient vos bonnes \u0153uvres et rendent gloire \u00e0 votre P\u00e8re qui est aux cieux. \u00bb (Mt 5,16)'
  ];
  document.querySelectorAll('.card > div[style*="text-align: justify"] > p').forEach((element, index) => {
    if (profile[index]) element.textContent = profile[index];
  });

  const season = document.querySelector('.liturgical-badge');
  if (season && season.textContent.trim() === 'Ordinary Time') season.textContent = 'Temps ordinaire';
  const readings = document.querySelector('.readings-badge');
  if (readings) readings.textContent = readings.textContent.replace('Readings', 'Lectures');
})();
