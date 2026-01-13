// Liturgical Calendar Data - Pre-calculated for 2025-2035
// Catholic liturgical seasons and major feasts

const LiturgicalData = {
  version: "2025-2035",
  lastUpdated: "2025-12-13",
  
  // Pre-calculated Easter dates (using Computus algorithm)
  easterDates: {
    2025: "2025-04-20",
    2026: "2026-04-05",
    2027: "2027-03-28",
    2028: "2028-04-16",
    2029: "2029-04-01",
    2030: "2030-04-21",
    2031: "2031-04-13",
    2032: "2032-03-28",
    2033: "2033-04-17",
    2034: "2034-04-09",
    2035: "2035-03-25"
  },
  
  // Fixed feast days (never change)
  fixedFeasts: {
    "01-01": { name: "Solemnity of Mary, Mother of God", season: "christmas", rank: "solemnity" },
    "01-06": { name: "Epiphany of the Lord", season: "christmas", rank: "solemnity" },
    "02-02": { name: "Presentation of the Lord", season: "ordinary", rank: "feast" },
    "03-19": { name: "Saint Joseph, Spouse of the Blessed Virgin Mary", season: "ordinary", rank: "solemnity" },
    "03-25": { name: "The Annunciation of the Lord", season: "ordinary", rank: "solemnity" },
    "06-24": { name: "The Nativity of Saint John the Baptist", season: "ordinary", rank: "solemnity" },
    "06-29": { name: "Saints Peter and Paul, Apostles", season: "ordinary", rank: "solemnity" },
    "08-06": { name: "The Transfiguration of the Lord", season: "ordinary", rank: "feast" },
    "08-15": { name: "The Assumption of the Blessed Virgin Mary", season: "ordinary", rank: "solemnity" },
    "09-08": { name: "The Nativity of the Blessed Virgin Mary", season: "ordinary", rank: "feast" },
    "09-14": { name: "The Exaltation of the Holy Cross", season: "ordinary", rank: "feast" },
    "11-01": { name: "All Saints", season: "ordinary", rank: "solemnity" },
    "11-02": { name: "All Souls' Day", season: "ordinary", rank: "commemoration" },
    "12-08": { name: "The Immaculate Conception of the Blessed Virgin Mary", season: "advent", rank: "solemnity" },
    "12-25": { name: "The Nativity of the Lord (Christmas)", season: "christmas", rank: "solemnity" }
  },
  
  // Movable feasts (calculated from Easter)
  // Offsets in days from Easter
  movableFeasts: {
    "ashWednesday": -46,      // Lent begins
    "palmSunday": -7,          // Passion Sunday
    "holyThursday": -3,
    "goodFriday": -2,
    "holySaturday": -1,
    "easterSunday": 0,
    "divineMercy": 7,          // Second Sunday of Easter
    "ascension": 39,           // Thursday
    "pentecost": 49,           // 7 weeks after Easter
    "trinity": 56,             // Sunday after Pentecost
    "corpusChristi": 60,       // Thursday after Trinity
    "sacredHeart": 68          // Friday after Corpus Christi
  }
};

// Calculate date with offset
function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Get movable feast dates for a specific year
function getMovableFeasts(year) {
  const easterDate = LiturgicalData.easterDates[year];
  if (!easterDate) return null;
  
  const feasts = {};
  for (const [name, offset] of Object.entries(LiturgicalData.movableFeasts)) {
    feasts[name] = addDays(easterDate, offset);
  }
  return feasts;
}

// Calculate Advent start (4th Sunday before Christmas)
function getAdventStart(year) {
  const christmas = new Date(year, 11, 25); // Dec 25
  const christmasDay = christmas.getDay(); // 0 = Sunday
  
  // Calculate days back to 4th Sunday before Christmas
  let daysBack = christmasDay === 0 ? 28 : (christmasDay + 21);
  
  const adventStart = new Date(christmas);
  adventStart.setDate(christmas.getDate() - daysBack);
  
  return adventStart.toISOString().split('T')[0];
}

// Make functions globally available
window.LiturgicalData = LiturgicalData;
window.getMovableFeasts = getMovableFeasts;
window.getAdventStart = getAdventStart;
window.addDaysToDate = addDays;

// Export for use in other modules (Node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LiturgicalData, getMovableFeasts, getAdventStart, addDays };
}
