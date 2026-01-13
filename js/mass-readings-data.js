// Mass Readings Data - Pre-calculated Citations (2025-2035)
// Hybrid approach: Store references offline, fetch full text when online

(function() {
  'use strict';

  // Liturgical Year Cycles
  // Sundays: Year A (2026, 2029, 2032, 2035), Year B (2024, 2027, 2030, 2033), Year C (2025, 2028, 2031, 2034)
  // Weekdays: Year I (odd years: 2025, 2027, 2029, 2031, 2033, 2035), Year II (even years: 2026, 2028, 2030, 2032, 2034)

  // Reading citations by date (YYYY-MM-DD)
  const readingsCitations = {
    // ADVENT 2025 (Year C)
    '2025-12-01': { // Monday, 1st Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 2:1-5',
        psalm: 'Psalm 122:1-9',
        gospel: 'Matthew 8:5-11'
      }
    },
    '2025-12-02': { // Tuesday, 1st Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 11:1-10',
        psalm: 'Psalm 72:1-2, 7-8, 12-13, 17',
        gospel: 'Luke 10:21-24'
      }
    },
    '2025-12-03': { // Wednesday, 1st Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 25:6-10a',
        psalm: 'Psalm 23:1-6',
        gospel: 'Matthew 15:29-37'
      }
    },
    '2025-12-04': { // Thursday, 1st Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 26:1-6',
        psalm: 'Psalm 118:1, 8-9, 19-21, 25-27',
        gospel: 'Matthew 7:21, 24-27'
      }
    },
    '2025-12-05': { // Friday, 1st Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 29:17-24',
        psalm: 'Psalm 27:1, 4, 13-14',
        gospel: 'Matthew 9:27-31'
      }
    },
    '2025-12-06': { // Saturday, 1st Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 30:19-21, 23-26',
        psalm: 'Psalm 147:1-6',
        gospel: 'Matthew 9:35—10:1, 5a, 6-8'
      }
    },
    '2025-12-07': { // Second Sunday of Advent (Year C)
      cycle: 'C',
      readings: {
        first: 'Baruch 5:1-9',
        psalm: 'Psalm 126:1-6',
        second: 'Philippians 1:4-6, 8-11',
        gospel: 'Luke 3:1-6'
      }
    },
    '2025-12-08': { // Immaculate Conception (Solemnity)
      feast: 'The Immaculate Conception of the Blessed Virgin Mary',
      cycle: 'Solemnity',
      readings: {
        first: 'Genesis 3:9-15, 20',
        psalm: 'Psalm 98:1-4',
        second: 'Ephesians 1:3-6, 11-12',
        gospel: 'Luke 1:26-38'
      }
    },
    '2025-12-09': { // Tuesday, 2nd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 40:1-11',
        psalm: 'Psalm 96:1-3, 10-13',
        gospel: 'Matthew 18:12-14'
      }
    },
    '2025-12-10': { // Wednesday, 2nd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 40:25-31',
        psalm: 'Psalm 103:1-4, 8, 10',
        gospel: 'Matthew 11:28-30'
      }
    },
    '2025-12-11': { // Thursday, 2nd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 41:13-20',
        psalm: 'Psalm 145:1, 9-13',
        gospel: 'Matthew 11:11-15'
      }
    },
    '2025-12-12': { // Friday, 2nd Week of Advent
      feast: 'Our Lady of Guadalupe',
      cycle: 'Feast',
      readings: {
        first: 'Zechariah 2:14-17',
        psalm: 'Judith 13:18bcde, 19',
        gospel: 'Luke 1:26-38'
      }
    },
    '2025-12-13': { // Saturday, 2nd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Sirach 48:1-4, 9-11',
        psalm: 'Psalm 80:2-3, 15-16, 18-19',
        gospel: 'Matthew 17:9a, 10-13'
      }
    },
    '2025-12-14': { // Third Sunday of Advent (Year C)
      cycle: 'C',
      readings: {
        first: 'Zephaniah 3:14-18a',
        psalm: 'Isaiah 12:2-6',
        second: 'Philippians 4:4-7',
        gospel: 'Luke 3:10-18'
      }
    },
    '2025-12-15': { // Monday, 3rd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Numbers 24:2-7, 15-17a',
        psalm: 'Psalm 25:4-9',
        gospel: 'Matthew 21:23-27'
      }
    },
    '2025-12-16': { // Tuesday, 3rd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Zephaniah 3:1-2, 9-13',
        psalm: 'Psalm 34:2-3, 6-7, 17-19, 23',
        gospel: 'Matthew 21:28-32'
      }
    },
    '2025-12-17': { // Wednesday, 3rd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Genesis 49:2, 8-10',
        psalm: 'Psalm 72:1-4, 7-8, 17',
        gospel: 'Matthew 1:1-17'
      }
    },
    '2025-12-18': { // Thursday, 3rd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Jeremiah 23:5-8',
        psalm: 'Psalm 72:1-2, 12-13, 18-19',
        gospel: 'Matthew 1:18-25'
      }
    },
    '2025-12-19': { // Friday, 3rd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Judges 13:2-7, 24-25a',
        psalm: 'Psalm 71:3-6, 16-17',
        gospel: 'Luke 1:5-25'
      }
    },
    '2025-12-20': { // Saturday, 3rd Week of Advent
      cycle: 'I',
      readings: {
        first: 'Isaiah 7:10-14',
        psalm: 'Psalm 24:1-6',
        gospel: 'Luke 1:26-38'
      }
    },
    '2025-12-21': { // Fourth Sunday of Advent (Year C)
      cycle: 'C',
      readings: {
        first: 'Micah 5:1-4a',
        psalm: 'Psalm 80:2-3, 15-16, 18-19',
        second: 'Hebrews 10:5-10',
        gospel: 'Luke 1:39-45'
      }
    },
    '2025-12-22': { // Monday, 4th Week of Advent
      cycle: 'I',
      readings: {
        first: '1 Samuel 1:24-28',
        psalm: '1 Samuel 2:1, 4-8',
        gospel: 'Luke 1:46-56'
      }
    },
    '2025-12-23': { // Tuesday, 4th Week of Advent
      cycle: 'I',
      readings: {
        first: 'Malachi 3:1-4, 23-24',
        psalm: 'Psalm 25:4-5, 8-10, 14',
        gospel: 'Luke 1:57-66'
      }
    },
    '2025-12-24': { // Wednesday, 4th Week of Advent
      cycle: 'I',
      readings: {
        first: '2 Samuel 7:1-5, 8b-12, 14a, 16',
        psalm: 'Psalm 89:2-5, 27, 29',
        gospel: 'Luke 1:67-79'
      }
    },
    '2025-12-25': { // Christmas (Solemnity) - Day Mass
      feast: 'The Nativity of the Lord (Christmas)',
      cycle: 'Solemnity',
      readings: {
        first: 'Isaiah 52:7-10',
        psalm: 'Psalm 98:1-6',
        second: 'Hebrews 1:1-6',
        gospel: 'John 1:1-18'
      }
    },
    '2025-12-26': { // Saint Stephen (Feast)
      feast: 'Saint Stephen, The First Martyr',
      cycle: 'Feast',
      readings: {
        first: 'Acts 6:8-10; 7:54-59',
        psalm: 'Psalm 31:3-4, 6, 8, 16-17',
        gospel: 'Matthew 10:17-22'
      }
    },
    '2025-12-27': { // Saint John (Feast)
      feast: 'Saint John, Apostle and Evangelist',
      cycle: 'Feast',
      readings: {
        first: '1 John 1:1-4',
        psalm: 'Psalm 97:1-2, 5-6, 11-12',
        gospel: 'John 20:1a, 2-8'
      }
    },
    '2025-12-28': { // Holy Innocents (Feast)
      feast: 'The Holy Innocents, Martyrs',
      cycle: 'Feast',
      readings: {
        first: '1 John 1:5—2:2',
        psalm: 'Psalm 124:2-5, 7-8',
        gospel: 'Matthew 2:13-18'
      }
    },
    '2025-12-29': { // Fifth Day in the Octave of Christmas
      cycle: 'Christmas',
      readings: {
        first: '1 John 2:3-11',
        psalm: 'Psalm 96:1-3, 5-6',
        gospel: 'Luke 2:22-35'
      }
    },
    '2025-12-30': { // Sixth Day in the Octave of Christmas
      cycle: 'Christmas',
      readings: {
        first: '1 John 2:12-17',
        psalm: 'Psalm 96:7-10',
        gospel: 'Luke 2:36-40'
      }
    },
    '2025-12-31': { // Seventh Day in the Octave of Christmas
      cycle: 'Christmas',
      readings: {
        first: '1 John 2:18-21',
        psalm: 'Psalm 96:1-2, 11-13',
        gospel: 'John 1:1-18'
      }
    },
    '2026-01-01': { // Mary, Mother of God (Solemnity)
      feast: 'Mary, the Holy Mother of God',
      cycle: 'Solemnity',
      readings: {
        first: 'Numbers 6:22-27',
        psalm: 'Psalm 67:2-3, 5-6, 8',
        second: 'Galatians 4:4-7',
        gospel: 'Luke 2:16-21'
      }
    },
    '2026-01-02': { // Saints Basil the Great and Gregory Nazianzen
      cycle: 'II',
      readings: {
        first: '1 John 2:22-28',
        psalm: 'Psalm 98:1-4',
        gospel: 'John 1:19-28'
      }
    },
    '2026-01-03': { // Saturday after New Year
      cycle: 'II',
      readings: {
        first: '1 John 2:29—3:6',
        psalm: 'Psalm 98:1, 3-6',
        gospel: 'John 1:29-34'
      }
    },
    '2026-01-04': { // The Epiphany of the Lord (Sunday)
      feast: 'The Epiphany of the Lord',
      cycle: 'A',
      readings: {
        first: 'Isaiah 60:1-6',
        psalm: 'Psalm 72:1-2, 7-8, 10-13',
        second: 'Ephesians 3:2-3a, 5-6',
        gospel: 'Matthew 2:1-12'
      }
    },
    '2026-01-05': { // Monday after Epiphany
      cycle: 'II',
      readings: {
        first: '1 John 3:22—4:6',
        psalm: 'Psalm 2:7-8, 10-12',
        gospel: 'Matthew 4:12-17, 23-25'
      }
    },
    '2026-01-06': { // Tuesday after Epiphany
      cycle: 'II',
      readings: {
        first: '1 John 4:7-10',
        psalm: 'Psalm 72:1-4, 7-8',
        gospel: 'Mark 6:34-44'
      }
    },
    '2026-01-07': { // Wednesday after Epiphany
      cycle: 'II',
      readings: {
        first: '1 John 4:11-18',
        psalm: 'Psalm 72:1-2, 10-13',
        gospel: 'Mark 6:45-52'
      }
    },
    '2026-01-08': { // Thursday after Epiphany
      cycle: 'II',
      readings: {
        first: '1 John 4:19—5:4',
        psalm: 'Psalm 72:1-2, 14-15, 17',
        gospel: 'Luke 4:14-22'
      }
    },
    '2026-01-09': { // Friday after Epiphany
      cycle: 'II',
      readings: {
        first: '1 John 5:5-13',
        psalm: 'Psalm 147:12-15, 19-20',
        gospel: 'Luke 5:12-16'
      }
    },
    '2026-01-10': { // Saturday after Epiphany
      cycle: 'II',
      readings: {
        first: '1 John 5:14-21',
        psalm: 'Psalm 149:1-6, 9',
        gospel: 'John 3:22-30'
      }
    },
    '2026-01-11': { // The Baptism of the Lord (Sunday)
      feast: 'The Baptism of the Lord',
      cycle: 'A',
      readings: {
        first: 'Isaiah 42:1-4, 6-7',
        psalm: 'Psalm 29:1-4, 9-10',
        second: 'Acts 10:34-38',
        gospel: 'Matthew 3:13-17'
      }
    },
    '2026-01-12': { // Monday, Week 1 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 1:1-6',
        psalm: 'Psalm 97:1-2, 6-7, 9',
        gospel: 'Mark 1:14-20'
      }
    },
    '2026-01-13': { // Tuesday, Week 1 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 2:5-12',
        psalm: 'Psalm 8:2, 5-9',
        gospel: 'Mark 1:21-28'
      }
    },
    '2026-01-14': { // Wednesday, Week 1 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 2:14-18',
        psalm: 'Psalm 105:1-4, 6-9',
        gospel: 'Mark 1:29-39'
      }
    },
    '2026-01-15': { // Thursday, Week 1 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 3:7-14',
        psalm: 'Psalm 95:6-11',
        gospel: 'Mark 1:40-45'
      }
    },
    '2026-01-16': { // Friday, Week 1 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 4:1-5, 11',
        psalm: 'Psalm 78:3-4, 6-8',
        gospel: 'Mark 2:1-12'
      }
    },
    '2026-01-17': { // Saturday, Week 1 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 4:12-16',
        psalm: 'Psalm 19:8-10, 15',
        gospel: 'Mark 2:13-17'
      }
    },
    '2026-01-18': { // Second Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 49:3, 5-6',
        psalm: 'Psalm 40:2, 4, 7-10',
        second: '1 Corinthians 1:1-3',
        gospel: 'John 1:29-34'
      }
    },
    '2026-01-19': { // Monday, Week 2 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 5:1-10',
        psalm: 'Psalm 110:1-4',
        gospel: 'Mark 2:18-22'
      }
    },
    '2026-01-20': { // Tuesday, Week 2 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 6:10-20',
        psalm: 'Psalm 111:1-2, 4-5, 9-10',
        gospel: 'Mark 2:23-28'
      }
    },
    '2026-01-21': { // Wednesday, Week 2 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 7:1-3, 15-17',
        psalm: 'Psalm 110:1-4',
        gospel: 'Mark 3:1-6'
      }
    },
    '2026-01-22': { // Thursday, Week 2 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 7:25—8:6',
        psalm: 'Psalm 40:7-10, 17',
        gospel: 'Mark 3:7-12'
      }
    },
    '2026-01-23': { // Friday, Week 2 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 8:6-13',
        psalm: 'Psalm 85:8, 10-14',
        gospel: 'Mark 3:13-19'
      }
    },
    '2026-01-24': { // Saturday, Week 2 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 9:2-3, 11-14',
        psalm: 'Psalm 47:2-3, 6-9',
        gospel: 'Mark 3:20-21'
      }
    },
    '2026-01-25': { // Third Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 8:23—9:3',
        psalm: 'Psalm 27:1, 4, 13-14',
        second: '1 Corinthians 1:10-13, 17',
        gospel: 'Matthew 4:12-23'
      }
    },
    '2026-01-26': { // Monday, Week 3 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 9:15, 24-28',
        psalm: 'Psalm 98:1-6',
        gospel: 'Mark 3:22-30'
      }
    },
    '2026-01-27': { // Tuesday, Week 3 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 10:1-10',
        psalm: 'Psalm 40:2, 4, 7-8, 10-11',
        gospel: 'Mark 3:31-35'
      }
    },
    '2026-01-28': { // Wednesday, Week 3 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 10:11-18',
        psalm: 'Psalm 110:1-4',
        gospel: 'Mark 4:1-20'
      }
    },
    '2026-01-29': { // Thursday, Week 3 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 10:19-25',
        psalm: 'Psalm 24:1-4, 5-6',
        gospel: 'Mark 4:21-25'
      }
    },
    '2026-01-30': { // Friday, Week 3 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 10:32-39',
        psalm: 'Psalm 37:3-6, 23-24, 39-40',
        gospel: 'Mark 4:26-34'
      }
    },
    '2026-01-31': { // Saturday, Week 3 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 11:1-2, 8-19',
        psalm: 'Luke 1:69-75',
        gospel: 'Mark 4:35-41'
      }
    },
    // FEBRUARY 2026
    '2026-02-01': { // Fourth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Zephaniah 2:3; 3:12-13',
        psalm: 'Psalm 146:6-10',
        second: '1 Corinthians 1:26-31',
        gospel: 'Matthew 5:1-12a'
      }
    },
    '2026-02-02': { // The Presentation of the Lord (Feast)
      feast: 'The Presentation of the Lord',
      cycle: 'Feast',
      readings: {
        first: 'Malachi 3:1-4',
        psalm: 'Psalm 24:7-10',
        second: 'Hebrews 2:14-18',
        gospel: 'Luke 2:22-40'
      }
    },
    '2026-02-03': { // Tuesday, Week 4 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 12:1-4',
        psalm: 'Psalm 22:26-28, 30-32',
        gospel: 'Mark 5:21-43'
      }
    },
    '2026-02-04': { // Wednesday, Week 4 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 12:4-7, 11-15',
        psalm: 'Psalm 103:1-2, 13-14, 17-18',
        gospel: 'Mark 6:1-6'
      }
    },
    '2026-02-05': { // Thursday, Week 4 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 12:18-19, 21-24',
        psalm: 'Psalm 48:2-4, 9-11',
        gospel: 'Mark 6:7-13'
      }
    },
    '2026-02-06': { // Friday, Week 4 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 13:1-8',
        psalm: 'Psalm 27:1, 3, 5, 8-9',
        gospel: 'Mark 6:14-29'
      }
    },
    '2026-02-07': { // Saturday, Week 4 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hebrews 13:15-17, 20-21',
        psalm: 'Psalm 23:1-6',
        gospel: 'Mark 6:30-34'
      }
    },
    '2026-02-08': { // Fifth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 58:7-10',
        psalm: 'Psalm 112:4-9',
        second: '1 Corinthians 2:1-5',
        gospel: 'Matthew 5:13-16'
      }
    },
    '2026-02-09': { // Monday, Week 5 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 1:1-19',
        psalm: 'Psalm 104:1-2, 5-6, 10, 12, 24, 35',
        gospel: 'Mark 6:53-56'
      }
    },
    '2026-02-10': { // Tuesday, Week 5 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 1:20—2:4a',
        psalm: 'Psalm 8:4-9',
        gospel: 'Mark 7:1-13'
      }
    },
    '2026-02-11': { // Wednesday, Week 5 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 2:4b-9, 15-17',
        psalm: 'Psalm 104:1-2, 27-28, 29-30',
        gospel: 'Mark 7:14-23'
      }
    },
    '2026-02-12': { // Thursday, Week 5 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 2:18-25',
        psalm: 'Psalm 128:1-5',
        gospel: 'Mark 7:24-30'
      }
    },
    '2026-02-13': { // Friday, Week 5 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 3:1-8',
        psalm: 'Psalm 32:1-2, 5-7',
        gospel: 'Mark 7:31-37'
      }
    },
    '2026-02-14': { // Saturday, Week 5 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 3:9-24',
        psalm: 'Psalm 90:2-6, 12-13',
        gospel: 'Mark 8:1-10'
      }
    },
    '2026-02-15': { // Sixth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Sirach 15:15-20',
        psalm: 'Psalm 119:1-2, 4-5, 17-18, 33-34',
        second: '1 Corinthians 2:6-10',
        gospel: 'Matthew 5:17-37'
      }
    },
    '2026-02-16': { // Monday, Week 6 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Genesis 4:1-15, 25',
        psalm: 'Psalm 50:1, 8, 16-17, 20-21',
        gospel: 'Mark 8:11-13'
      }
    },
    '2026-02-17': { // Ash Wednesday
      feast: 'Ash Wednesday',
      cycle: 'Lent',
      readings: {
        first: 'Joel 2:12-18',
        psalm: 'Psalm 51:3-6, 12-14, 17',
        second: '2 Corinthians 5:20—6:2',
        gospel: 'Matthew 6:1-6, 16-18'
      }
    },
    '2026-02-18': { // Thursday after Ash Wednesday
      cycle: 'II',
      readings: {
        first: 'Deuteronomy 30:15-20',
        psalm: 'Psalm 1:1-4, 6',
        gospel: 'Luke 9:22-25'
      }
    },
    '2026-02-19': { // Friday after Ash Wednesday
      cycle: 'II',
      readings: {
        first: 'Isaiah 58:1-9a',
        psalm: 'Psalm 51:3-6, 18-19',
        gospel: 'Matthew 9:14-15'
      }
    },
    '2026-02-20': { // Saturday after Ash Wednesday
      cycle: 'II',
      readings: {
        first: 'Isaiah 58:9b-14',
        psalm: 'Psalm 86:1-6',
        gospel: 'Luke 5:27-32'
      }
    },
    '2026-02-21': { // Saturday after Ash Wednesday
      cycle: 'II',
      readings: {
        first: 'Isaiah 58:9b-14',
        psalm: 'Psalm 86:1-6',
        gospel: 'Luke 5:27-32'
      }
    },
    '2026-02-22': { // First Sunday of Lent
      cycle: 'A',
      readings: {
        first: 'Genesis 2:7-9; 3:1-7',
        psalm: 'Psalm 51:3-6, 12-13, 17',
        second: 'Romans 5:12-19',
        gospel: 'Matthew 4:1-11'
      }
    },
    '2026-02-23': { // Monday, Week 1 of Lent
      cycle: 'II',
      readings: {
        first: 'Leviticus 19:1-2, 11-18',
        psalm: 'Psalm 19:8-10, 15',
        gospel: 'Matthew 25:31-46'
      }
    },
    '2026-02-24': { // Tuesday, Week 1 of Lent
      cycle: 'II',
      readings: {
        first: 'Isaiah 55:10-11',
        psalm: 'Psalm 34:4-7, 16-19',
        gospel: 'Matthew 6:7-15'
      }
    },
    '2026-02-25': { // Wednesday, Week 1 of Lent
      cycle: 'II',
      readings: {
        first: 'Jonah 3:1-10',
        psalm: 'Psalm 51:3-4, 12-13, 18-19',
        gospel: 'Luke 11:29-32'
      }
    },
    '2026-02-26': { // Thursday, Week 1 of Lent
      cycle: 'II',
      readings: {
        first: 'Esther C:12, 14-16, 23-25',
        psalm: 'Psalm 138:1-3, 7-8',
        gospel: 'Matthew 7:7-12'
      }
    },
    '2026-02-27': { // Friday, Week 1 of Lent
      cycle: 'II',
      readings: {
        first: 'Ezekiel 18:21-28',
        psalm: 'Psalm 130:1-8',
        gospel: 'Matthew 5:20-26'
      }
    },
    '2026-02-28': { // Saturday, Week 1 of Lent
      cycle: 'II',
      readings: {
        first: 'Deuteronomy 26:16-19',
        psalm: 'Psalm 119:1-2, 4-5, 7-8',
        gospel: 'Matthew 5:43-48'
      }
    },
    // MARCH 2026
    '2026-03-01': { // Second Sunday of Lent
      cycle: 'A',
      readings: {
        first: 'Genesis 12:1-4a',
        psalm: 'Psalm 33:4-5, 18-20, 22',
        second: '2 Timothy 1:8b-10',
        gospel: 'Matthew 17:1-9'
      }
    },
    '2026-03-02': { // Monday, Week 2 of Lent
      cycle: 'II',
      readings: {
        first: 'Daniel 9:4b-10',
        psalm: 'Psalm 79:8-9, 11, 13',
        gospel: 'Luke 6:36-38'
      }
    },
    '2026-03-03': { // Tuesday, Week 2 of Lent
      cycle: 'II',
      readings: {
        first: 'Isaiah 1:10, 16-20',
        psalm: 'Psalm 50:8-9, 16-17, 21, 23',
        gospel: 'Matthew 23:1-12'
      }
    },
    '2026-03-04': { // Wednesday, Week 2 of Lent
      cycle: 'II',
      readings: {
        first: 'Jeremiah 18:18-20',
        psalm: 'Psalm 31:5-6, 14-16',
        gospel: 'Matthew 20:17-28'
      }
    },
    '2026-03-05': { // Thursday, Week 2 of Lent
      cycle: 'II',
      readings: {
        first: 'Jeremiah 17:5-10',
        psalm: 'Psalm 1:1-4, 6',
        gospel: 'Luke 16:19-31'
      }
    },
    '2026-03-06': { // Friday, Week 2 of Lent
      cycle: 'II',
      readings: {
        first: 'Genesis 37:3-4, 12-13a, 17b-28a',
        psalm: 'Psalm 105:16-21',
        gospel: 'Matthew 21:33-43, 45-46'
      }
    },
    '2026-03-07': { // Saturday, Week 2 of Lent
      cycle: 'II',
      readings: {
        first: 'Micah 7:14-15, 18-20',
        psalm: 'Psalm 103:1-4, 9-12',
        gospel: 'Luke 15:1-3, 11-32'
      }
    },
    '2026-03-08': { // Third Sunday of Lent
      cycle: 'A',
      readings: {
        first: 'Exodus 17:3-7',
        psalm: 'Psalm 95:1-2, 6-9',
        second: 'Romans 5:1-2, 5-8',
        gospel: 'John 4:5-42'
      }
    },
    '2026-03-09': { // Monday, Week 3 of Lent
      cycle: 'II',
      readings: {
        first: '2 Kings 5:1-15b',
        psalm: 'Psalm 42:2-3; 43:3-4',
        gospel: 'Luke 4:24-30'
      }
    },
    '2026-03-10': { // Tuesday, Week 3 of Lent
      cycle: 'II',
      readings: {
        first: 'Daniel 3:25, 34-43',
        psalm: 'Psalm 25:4-9',
        gospel: 'Matthew 18:21-35'
      }
    },
    '2026-03-11': { // Wednesday, Week 3 of Lent
      cycle: 'II',
      readings: {
        first: 'Deuteronomy 4:1, 5-9',
        psalm: 'Psalm 147:12-13, 15-16, 19-20',
        gospel: 'Matthew 5:17-19'
      }
    },
    '2026-03-12': { // Thursday, Week 3 of Lent
      cycle: 'II',
      readings: {
        first: 'Jeremiah 7:23-28',
        psalm: 'Psalm 95:1-2, 6-9',
        gospel: 'Luke 11:14-23'
      }
    },
    '2026-03-13': { // Friday, Week 3 of Lent
      cycle: 'II',
      readings: {
        first: 'Hosea 14:2-10',
        psalm: 'Psalm 81:6-11, 14, 17',
        gospel: 'Mark 12:28-34'
      }
    },
    '2026-03-14': { // Saturday, Week 3 of Lent
      cycle: 'II',
      readings: {
        first: 'Hosea 6:1-6',
        psalm: 'Psalm 51:3-4, 18-21',
        gospel: 'Luke 18:9-14'
      }
    },
    '2026-03-15': { // Fourth Sunday of Lent
      cycle: 'A',
      readings: {
        first: '1 Samuel 16:1b, 6-7, 10-13a',
        psalm: 'Psalm 23:1-6',
        second: 'Ephesians 5:8-14',
        gospel: 'John 9:1-41'
      }
    },
    '2026-03-16': { // Monday, Week 4 of Lent
      cycle: 'II',
      readings: {
        first: 'Isaiah 65:17-21',
        psalm: 'Psalm 30:2, 4-6, 11-13',
        gospel: 'John 4:43-54'
      }
    },
    '2026-03-17': { // Tuesday, Week 4 of Lent
      cycle: 'II',
      readings: {
        first: 'Ezekiel 47:1-9, 12',
        psalm: 'Psalm 46:2-3, 5-6, 8-9',
        gospel: 'John 5:1-16'
      }
    },
    '2026-03-18': { // Wednesday, Week 4 of Lent
      cycle: 'II',
      readings: {
        first: 'Isaiah 49:8-15',
        psalm: 'Psalm 145:8-9, 13-14, 17-18',
        gospel: 'John 5:17-30'
      }
    },
    '2026-03-19': { // Saint Joseph, Spouse of the BVM (Solemnity)
      feast: 'Saint Joseph, Spouse of the Blessed Virgin Mary',
      cycle: 'Solemnity',
      readings: {
        first: '2 Samuel 7:4-5a, 12-14a, 16',
        psalm: 'Psalm 89:2-5, 27, 29',
        second: 'Romans 4:13, 16-18, 22',
        gospel: 'Matthew 1:16, 18-21, 24a'
      }
    },
    '2026-03-20': { // Friday, Week 4 of Lent
      cycle: 'II',
      readings: {
        first: 'Wisdom 2:1a, 12-22',
        psalm: 'Psalm 34:17-21, 23',
        gospel: 'John 7:1-2, 10, 25-30'
      }
    },
    '2026-03-21': { // Saturday, Week 4 of Lent
      cycle: 'II',
      readings: {
        first: 'Jeremiah 11:18-20',
        psalm: 'Psalm 7:2-3, 9-12',
        gospel: 'John 7:40-53'
      }
    },
    '2026-03-22': { // Fifth Sunday of Lent
      cycle: 'A',
      readings: {
        first: 'Ezekiel 37:12-14',
        psalm: 'Psalm 130:1-8',
        second: 'Romans 8:8-11',
        gospel: 'John 11:1-45'
      }
    },
    '2026-03-23': { // Monday, Week 5 of Lent
      cycle: 'II',
      readings: {
        first: 'Daniel 13:1-9, 15-17, 19-30, 33-62',
        psalm: 'Psalm 23:1-6',
        gospel: 'John 8:1-11'
      }
    },
    '2026-03-24': { // Tuesday, Week 5 of Lent
      cycle: 'II',
      readings: {
        first: 'Numbers 21:4-9',
        psalm: 'Psalm 102:2-3, 16-21',
        gospel: 'John 8:21-30'
      }
    },
    '2026-03-25': { // The Annunciation of the Lord (Solemnity)
      feast: 'The Annunciation of the Lord',
      cycle: 'Solemnity',
      readings: {
        first: 'Isaiah 7:10-14; 8:10',
        psalm: 'Psalm 40:7-11',
        second: 'Hebrews 10:4-10',
        gospel: 'Luke 1:26-38'
      }
    },
    '2026-03-26': { // Thursday, Week 5 of Lent
      cycle: 'II',
      readings: {
        first: 'Genesis 17:3-9',
        psalm: 'Psalm 105:4-9',
        gospel: 'John 8:51-59'
      }
    },
    '2026-03-27': { // Friday, Week 5 of Lent
      cycle: 'II',
      readings: {
        first: 'Jeremiah 20:10-13',
        psalm: 'Psalm 18:2-7',
        gospel: 'John 10:31-42'
      }
    },
    '2026-03-28': { // Saturday, Week 5 of Lent
      cycle: 'II',
      readings: {
        first: 'Ezekiel 37:21-28',
        psalm: 'Jeremiah 31:10-13',
        gospel: 'John 11:45-56'
      }
    },
    '2026-03-29': { // Palm Sunday of the Passion of the Lord
      feast: 'Palm Sunday of the Passion of the Lord',
      cycle: 'A',
      readings: {
        first: 'Isaiah 50:4-7',
        psalm: 'Psalm 22:8-9, 17-20, 23-24',
        second: 'Philippians 2:6-11',
        gospel: 'Matthew 26:14—27:66'
      }
    },
    '2026-03-30': { // Monday of Holy Week
      cycle: 'Holy Week',
      readings: {
        first: 'Isaiah 42:1-7',
        psalm: 'Psalm 27:1-3, 13-14',
        gospel: 'John 12:1-11'
      }
    },
    '2026-03-31': { // Tuesday of Holy Week
      cycle: 'Holy Week',
      readings: {
        first: 'Isaiah 49:1-6',
        psalm: 'Psalm 71:1-6, 15, 17',
        gospel: 'John 13:21-33, 36-38'
      }
    },
    // APRIL 2026
    '2026-04-01': { // Wednesday of Holy Week
      cycle: 'Holy Week',
      readings: {
        first: 'Isaiah 50:4-9a',
        psalm: 'Psalm 69:8-10, 21-22, 31, 33-34',
        gospel: 'Matthew 26:14-25'
      }
    },
    '2026-04-02': { // Holy Thursday
      feast: 'Holy Thursday - Lord\'s Supper',
      cycle: 'Holy Week',
      readings: {
        first: 'Exodus 12:1-8, 11-14',
        psalm: 'Psalm 116:12-13, 15-18',
        second: '1 Corinthians 11:23-26',
        gospel: 'John 13:1-15'
      }
    },
    '2026-04-03': { // Good Friday
      feast: 'Friday of the Passion of the Lord',
      cycle: 'Holy Week',
      readings: {
        first: 'Isaiah 52:13—53:12',
        psalm: 'Psalm 31:2, 6, 12-13, 15-17, 25',
        second: 'Hebrews 4:14-16; 5:7-9',
        gospel: 'John 18:1—19:42'
      }
    },
    '2026-04-04': { // Holy Saturday
      feast: 'Holy Saturday - Easter Vigil',
      cycle: 'Holy Week',
      readings: {
        first: 'Genesis 1:1—2:2',
        psalm: 'Psalm 104:1-2, 5-6, 10, 12-14, 24, 35',
        second: 'Romans 6:3-11',
        gospel: 'Matthew 28:1-10'
      }
    },
    '2026-04-05': { // Easter Sunday
      feast: 'Easter Sunday of the Resurrection of the Lord',
      cycle: 'A',
      readings: {
        first: 'Acts 10:34a, 37-43',
        psalm: 'Psalm 118:1-2, 16-17, 22-23',
        second: 'Colossians 3:1-4',
        gospel: 'John 20:1-9'
      }
    },
    '2026-04-06': { // Monday within the Octave of Easter
      cycle: 'Easter',
      readings: {
        first: 'Acts 2:14, 22-33',
        psalm: 'Psalm 16:1-2, 5, 7-11',
        gospel: 'Matthew 28:8-15'
      }
    },
    '2026-04-07': { // Tuesday within the Octave of Easter
      cycle: 'Easter',
      readings: {
        first: 'Acts 2:36-41',
        psalm: 'Psalm 33:4-5, 18-20, 22',
        gospel: 'John 20:11-18'
      }
    },
    '2026-04-08': { // Wednesday within the Octave of Easter
      cycle: 'Easter',
      readings: {
        first: 'Acts 3:1-10',
        psalm: 'Psalm 105:1-4, 6-9',
        gospel: 'Luke 24:13-35'
      }
    },
    '2026-04-09': { // Thursday within the Octave of Easter
      cycle: 'Easter',
      readings: {
        first: 'Acts 3:11-26',
        psalm: 'Psalm 8:2, 5-9',
        gospel: 'Luke 24:35-48'
      }
    },
    '2026-04-10': { // Friday within the Octave of Easter
      cycle: 'Easter',
      readings: {
        first: 'Acts 4:1-12',
        psalm: 'Psalm 118:1-2, 4, 22-27',
        gospel: 'John 21:1-14'
      }
    },
    '2026-04-11': { // Saturday within the Octave of Easter
      cycle: 'Easter',
      readings: {
        first: 'Acts 4:13-21',
        psalm: 'Psalm 118:1, 14-21',
        gospel: 'Mark 16:9-15'
      }
    },
    '2026-04-12': { // Second Sunday of Easter
      cycle: 'A',
      readings: {
        first: 'Acts 2:42-47',
        psalm: 'Psalm 118:2-4, 13-15, 22-24',
        second: '1 Peter 1:3-9',
        gospel: 'John 20:19-31'
      }
    },
    '2026-04-13': { // Monday, Week 2 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 4:23-31',
        psalm: 'Psalm 2:1-9',
        gospel: 'John 3:1-8'
      }
    },
    '2026-04-14': { // Tuesday, Week 2 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 4:32-37',
        psalm: 'Psalm 93:1-2, 5',
        gospel: 'John 3:7b-15'
      }
    },
    '2026-04-15': { // Wednesday, Week 2 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 5:17-26',
        psalm: 'Psalm 34:2-9',
        gospel: 'John 3:16-21'
      }
    },
    '2026-04-16': { // Thursday, Week 2 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 5:27-33',
        psalm: 'Psalm 34:2, 9, 17-20',
        gospel: 'John 3:31-36'
      }
    },
    '2026-04-17': { // Friday, Week 2 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 5:34-42',
        psalm: 'Psalm 27:1, 4, 13-14',
        gospel: 'John 6:1-15'
      }
    },
    '2026-04-18': { // Saturday, Week 2 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 6:1-7',
        psalm: 'Psalm 33:1-2, 4-5, 18-19',
        gospel: 'John 6:16-21'
      }
    },
    '2026-04-19': { // Third Sunday of Easter
      cycle: 'A',
      readings: {
        first: 'Acts 2:14, 22-33',
        psalm: 'Psalm 16:1-2, 5, 7-11',
        second: '1 Peter 1:17-21',
        gospel: 'Luke 24:13-35'
      }
    },
    '2026-04-20': { // Monday, Week 3 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 6:8-15',
        psalm: 'Psalm 119:23-24, 26-27, 29-30',
        gospel: 'John 6:22-29'
      }
    },
    '2026-04-21': { // Tuesday, Week 3 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 7:51—8:1a',
        psalm: 'Psalm 31:3-4, 6-8, 17, 21',
        gospel: 'John 6:30-35'
      }
    },
    '2026-04-22': { // Wednesday, Week 3 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 8:1b-8',
        psalm: 'Psalm 66:1-7',
        gospel: 'John 6:35-40'
      }
    },
    '2026-04-23': { // Thursday, Week 3 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 8:26-40',
        psalm: 'Psalm 66:8-9, 16-17, 20',
        gospel: 'John 6:44-51'
      }
    },
    '2026-04-24': { // Friday, Week 3 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 9:1-20',
        psalm: 'Psalm 117:1-2',
        gospel: 'John 6:52-59'
      }
    },
    '2026-04-25': { // Saint Mark, Evangelist (Feast)
      feast: 'Saint Mark, Evangelist',
      cycle: 'Feast',
      readings: {
        first: '1 Peter 5:5b-14',
        psalm: 'Psalm 89:2-3, 6-7, 16-17',
        gospel: 'Mark 16:15-20'
      }
    },
    '2026-04-26': { // Fourth Sunday of Easter
      cycle: 'A',
      readings: {
        first: 'Acts 2:14a, 36-41',
        psalm: 'Psalm 23:1-6',
        second: '1 Peter 2:20b-25',
        gospel: 'John 10:1-10'
      }
    },
    '2026-04-27': { // Monday, Week 4 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 11:1-18',
        psalm: 'Psalm 42:2-3; 43:3-4',
        gospel: 'John 10:11-18'
      }
    },
    '2026-04-28': { // Tuesday, Week 4 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 11:19-26',
        psalm: 'Psalm 87:1-7',
        gospel: 'John 10:22-30'
      }
    },
    '2026-04-29': { // Wednesday, Week 4 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 12:24—13:5a',
        psalm: 'Psalm 67:2-3, 5-6, 8',
        gospel: 'John 12:44-50'
      }
    },
    '2026-04-30': { // Thursday, Week 4 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 13:13-25',
        psalm: 'Psalm 89:2-3, 21-22, 25, 27',
        gospel: 'John 13:16-20'
      }
    },
    // MAY 2026
    '2026-05-01': { // Friday, Week 4 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 13:26-33',
        psalm: 'Psalm 2:6-11',
        gospel: 'John 14:1-6'
      }
    },
    '2026-05-02': { // Saturday, Week 4 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 13:44-52',
        psalm: 'Psalm 98:1-4',
        gospel: 'John 14:7-14'
      }
    },
    '2026-05-03': { // Fifth Sunday of Easter / Saints Philip and James (Feast)
      feast: 'Saints Philip and James, Apostles',
      cycle: 'Feast',
      readings: {
        first: '1 Corinthians 15:1-8',
        psalm: 'Psalm 19:2-5',
        gospel: 'John 14:6-14'
      }
    },
    '2026-05-04': { // Monday, Week 5 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 14:5-18',
        psalm: 'Psalm 115:1-4, 15-16',
        gospel: 'John 14:21-26'
      }
    },
    '2026-05-05': { // Tuesday, Week 5 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 14:19-28',
        psalm: 'Psalm 145:10-13, 21',
        gospel: 'John 14:27-31a'
      }
    },
    '2026-05-06': { // Wednesday, Week 5 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 15:1-6',
        psalm: 'Psalm 122:1-5',
        gospel: 'John 15:1-8'
      }
    },
    '2026-05-07': { // Thursday, Week 5 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 15:7-21',
        psalm: 'Psalm 96:1-3, 10',
        gospel: 'John 15:9-11'
      }
    },
    '2026-05-08': { // Friday, Week 5 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 15:22-31',
        psalm: 'Psalm 57:8-10, 12',
        gospel: 'John 15:12-17'
      }
    },
    '2026-05-09': { // Saturday, Week 5 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 16:1-10',
        psalm: 'Psalm 100:1-3, 5',
        gospel: 'John 15:18-21'
      }
    },
    '2026-05-10': { // Sixth Sunday of Easter
      cycle: 'A',
      readings: {
        first: 'Acts 8:5-8, 14-17',
        psalm: 'Psalm 66:1-7, 16, 20',
        second: '1 Peter 3:15-18',
        gospel: 'John 14:15-21'
      }
    },
    '2026-05-11': { // Monday, Week 6 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 16:11-15',
        psalm: 'Psalm 149:1-6, 9',
        gospel: 'John 15:26—16:4a'
      }
    },
    '2026-05-12': { // Tuesday, Week 6 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 16:22-34',
        psalm: 'Psalm 138:1-3, 7-8',
        gospel: 'John 16:5-11'
      }
    },
    '2026-05-13': { // Wednesday, Week 6 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 17:15, 22—18:1',
        psalm: 'Psalm 148:1-2, 11-14',
        gospel: 'John 16:12-15'
      }
    },
    '2026-05-14': { // Ascension of the Lord OR Thursday, Week 6 of Easter
      feast: 'The Ascension of the Lord',
      cycle: 'A',
      readings: {
        first: 'Acts 1:1-11',
        psalm: 'Psalm 47:2-3, 6-9',
        second: 'Ephesians 1:17-23',
        gospel: 'Matthew 28:16-20'
      }
    },
    '2026-05-15': { // Friday, Week 6 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 18:9-18',
        psalm: 'Psalm 47:2-7',
        gospel: 'John 16:20-23'
      }
    },
    '2026-05-16': { // Saturday, Week 6 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 18:23-28',
        psalm: 'Psalm 47:2-3, 8-10',
        gospel: 'John 16:23b-28'
      }
    },
    '2026-05-17': { // Seventh Sunday of Easter
      cycle: 'A',
      readings: {
        first: 'Acts 1:12-14',
        psalm: 'Psalm 27:1, 4, 7-8',
        second: '1 Peter 4:13-16',
        gospel: 'John 17:1-11a'
      }
    },
    '2026-05-18': { // Monday, Week 7 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 19:1-8',
        psalm: 'Psalm 68:2-7',
        gospel: 'John 16:29-33'
      }
    },
    '2026-05-19': { // Tuesday, Week 7 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 20:17-27',
        psalm: 'Psalm 68:10-11, 20-21',
        gospel: 'John 17:1-11a'
      }
    },
    '2026-05-20': { // Wednesday, Week 7 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 20:28-38',
        psalm: 'Psalm 68:29-30, 33-36',
        gospel: 'John 17:11b-19'
      }
    },
    '2026-05-21': { // Thursday, Week 7 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 22:30; 23:6-11',
        psalm: 'Psalm 16:1-2, 5, 7-11',
        gospel: 'John 17:20-26'
      }
    },
    '2026-05-22': { // Friday, Week 7 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 25:13b-21',
        psalm: 'Psalm 103:1-2, 11-12, 19-20',
        gospel: 'John 21:15-19'
      }
    },
    '2026-05-23': { // Saturday, Week 7 of Easter
      cycle: 'II',
      readings: {
        first: 'Acts 28:16-20, 30-31',
        psalm: 'Psalm 11:4-5, 7',
        gospel: 'John 21:20-25'
      }
    },
    '2026-05-24': { // Pentecost Sunday
      feast: 'Pentecost Sunday',
      cycle: 'A',
      readings: {
        first: 'Acts 2:1-11',
        psalm: 'Psalm 104:1, 24, 29-31, 34',
        second: '1 Corinthians 12:3b-7, 12-13',
        gospel: 'John 20:19-23'
      }
    },
    '2026-05-25': { // Monday, Week 8 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 17:20-24',
        psalm: 'Psalm 32:1-2, 5-7',
        gospel: 'Mark 10:17-27'
      }
    },
    '2026-05-26': { // Tuesday, Week 8 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 35:1-12',
        psalm: 'Psalm 50:5-8, 14, 23',
        gospel: 'Mark 10:28-31'
      }
    },
    '2026-05-27': { // Wednesday, Week 8 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 36:1, 4-5a, 10-17',
        psalm: 'Psalm 79:8-9, 11, 13',
        gospel: 'Mark 10:32-45'
      }
    },
    '2026-05-28': { // Thursday, Week 8 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 42:15-25',
        psalm: 'Psalm 33:2-9',
        gospel: 'Mark 10:46-52'
      }
    },
    '2026-05-29': { // Friday, Week 8 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 44:1, 9-13',
        psalm: 'Psalm 149:1-6, 9',
        gospel: 'Mark 11:11-26'
      }
    },
    '2026-05-30': { // Saturday, Week 8 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 51:12-20',
        psalm: 'Psalm 19:8-11',
        gospel: 'Mark 11:27-33'
      }
    },
    '2026-05-31': { // The Visitation of the Blessed Virgin Mary (Feast)
      feast: 'The Visitation of the Blessed Virgin Mary',
      cycle: 'Feast',
      readings: {
        first: 'Zephaniah 3:14-18a',
        psalm: 'Isaiah 12:2-6',
        second: 'Romans 12:9-16',
        gospel: 'Luke 1:39-56'
      }
    },
    // JUNE 2026
    '2026-06-01': { // Monday, Week 9 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Peter 1:2-7',
        psalm: 'Psalm 91:1-2, 14-16',
        gospel: 'Mark 12:1-12'
      }
    },
    '2026-06-02': { // Tuesday, Week 9 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Peter 3:12-15a, 17-18',
        psalm: 'Psalm 90:2-4, 10, 14, 16',
        gospel: 'Mark 12:13-17'
      }
    },
    '2026-06-03': { // Wednesday, Week 9 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Timothy 1:1-3, 6-12',
        psalm: 'Psalm 123:1-2',
        gospel: 'Mark 12:18-27'
      }
    },
    '2026-06-04': { // Thursday, Week 9 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Timothy 2:8-15',
        psalm: 'Psalm 25:4-5, 8-10, 14',
        gospel: 'Mark 12:28-34'
      }
    },
    '2026-06-05': { // Friday, Week 9 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Timothy 3:10-17',
        psalm: 'Psalm 119:157, 160-161, 165-166, 168',
        gospel: 'Mark 12:35-37'
      }
    },
    '2026-06-06': { // Saturday, Week 9 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Timothy 4:1-8',
        psalm: 'Psalm 71:8-9, 14-15, 16-17, 22',
        gospel: 'Mark 12:38-44'
      }
    },
    '2026-06-07': { // The Most Holy Trinity (Solemnity)
      feast: 'The Most Holy Trinity',
      cycle: 'A',
      readings: {
        first: 'Exodus 34:4b-6, 8-9',
        psalm: 'Daniel 3:52-56',
        second: '2 Corinthians 13:11-13',
        gospel: 'John 3:16-18'
      }
    },
    '2026-06-08': { // Monday, Week 10 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 17:1-6',
        psalm: 'Psalm 121:1-8',
        gospel: 'Matthew 5:1-12'
      }
    },
    '2026-06-09': { // Tuesday, Week 10 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 17:7-16',
        psalm: 'Psalm 4:2-5, 7-8',
        gospel: 'Matthew 5:13-16'
      }
    },
    '2026-06-10': { // Wednesday, Week 10 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 18:20-39',
        psalm: 'Psalm 16:1-2, 4-5, 8, 11',
        gospel: 'Matthew 5:17-19'
      }
    },
    '2026-06-11': { // Thursday, Week 10 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 18:41-46',
        psalm: 'Psalm 65:10-13',
        gospel: 'Matthew 5:20-26'
      }
    },
    '2026-06-12': { // Friday, Week 10 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 19:9a, 11-16',
        psalm: 'Psalm 27:7-9, 13-14',
        gospel: 'Matthew 5:27-32'
      }
    },
    '2026-06-13': { // Saturday, Week 10 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 19:19-21',
        psalm: 'Psalm 16:1-2, 5, 7-10',
        gospel: 'Matthew 5:33-37'
      }
    },
    '2026-06-14': { // The Most Holy Body and Blood of Christ (Solemnity)
      feast: 'The Most Holy Body and Blood of Christ',
      cycle: 'A',
      readings: {
        first: 'Deuteronomy 8:2-3, 14b-16a',
        psalm: 'Psalm 147:12-15, 19-20',
        second: '1 Corinthians 10:16-17',
        gospel: 'John 6:51-58'
      }
    },
    '2026-06-15': { // Monday, Week 11 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 21:1-16',
        psalm: 'Psalm 5:2-3, 5-7',
        gospel: 'Matthew 5:38-42'
      }
    },
    '2026-06-16': { // Tuesday, Week 11 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Kings 21:17-29',
        psalm: 'Psalm 51:3-6, 11, 16',
        gospel: 'Matthew 5:43-48'
      }
    },
    '2026-06-17': { // Wednesday, Week 11 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Kings 2:1, 6-14',
        psalm: 'Psalm 31:20-21, 24',
        gospel: 'Matthew 6:1-6, 16-18'
      }
    },
    '2026-06-18': { // Thursday, Week 11 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Sirach 48:1-14',
        psalm: 'Psalm 97:1-7',
        gospel: 'Matthew 6:7-15'
      }
    },
    '2026-06-19': { // The Most Sacred Heart of Jesus (Solemnity)
      feast: 'The Most Sacred Heart of Jesus',
      cycle: 'A',
      readings: {
        first: 'Deuteronomy 7:6-11',
        psalm: 'Psalm 103:1-4, 6-8, 10',
        second: '1 John 4:7-16',
        gospel: 'Matthew 11:25-30'
      }
    },
    '2026-06-20': { // The Immaculate Heart of Mary
      cycle: 'II',
      readings: {
        first: 'Isaiah 61:9-11',
        psalm: 'Samuel 2:1, 4-8',
        gospel: 'Luke 2:41-51'
      }
    },
    '2026-06-21': { // Twelfth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Jeremiah 20:10-13',
        psalm: 'Psalm 69:8-10, 14, 17, 33-35',
        second: 'Romans 5:12-15',
        gospel: 'Matthew 10:26-33'
      }
    },
    '2026-06-22': { // Monday, Week 12 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Kings 17:5-8, 13-15a, 18',
        psalm: 'Psalm 60:3-5, 12-13',
        gospel: 'Matthew 7:1-5'
      }
    },
    '2026-06-23': { // Tuesday, Week 12 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Kings 19:9b-11, 14-21, 31-35a, 36',
        psalm: 'Psalm 48:2-4, 10-11',
        gospel: 'Matthew 7:6, 12-14'
      }
    },
    '2026-06-24': { // The Nativity of Saint John the Baptist (Solemnity)
      feast: 'The Nativity of Saint John the Baptist',
      cycle: 'Solemnity',
      readings: {
        first: 'Isaiah 49:1-6',
        psalm: 'Psalm 139:1-3, 13-15',
        second: 'Acts 13:22-26',
        gospel: 'Luke 1:57-66, 80'
      }
    },
    '2026-06-25': { // Thursday, Week 12 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Kings 24:8-17',
        psalm: 'Psalm 79:1-5, 8-9',
        gospel: 'Matthew 7:21-29'
      }
    },
    '2026-06-26': { // Friday, Week 12 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Kings 25:1-12',
        psalm: 'Psalm 137:1-6',
        gospel: 'Matthew 8:1-4'
      }
    },
    '2026-06-27': { // Saturday, Week 12 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Lamentations 2:2, 10-14, 18-19',
        psalm: 'Psalm 74:1-7, 20-21',
        gospel: 'Matthew 8:5-17'
      }
    },
    '2026-06-28': { // Thirteenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: '2 Kings 4:8-11, 14-16a',
        psalm: 'Psalm 89:2-3, 16-19',
        second: 'Romans 6:3-4, 8-11',
        gospel: 'Matthew 10:37-42'
      }
    },
    '2026-06-29': { // Saints Peter and Paul, Apostles (Solemnity)
      feast: 'Saints Peter and Paul, Apostles',
      cycle: 'Solemnity',
      readings: {
        first: 'Acts 12:1-11',
        psalm: 'Psalm 34:2-9',
        second: '2 Timothy 4:6-8, 17-18',
        gospel: 'Matthew 16:13-19'
      }
    },
    '2026-06-30': { // Tuesday, Week 13 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Amos 3:1-8; 4:11-12',
        psalm: 'Psalm 5:5-8',
        gospel: 'Matthew 8:23-27'
      }
    },
    // JULY 2026
    '2026-07-01': { // Wednesday, Week 13 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Amos 5:14-15, 21-24',
        psalm: 'Psalm 50:7-13, 16-17',
        gospel: 'Matthew 8:28-34'
      }
    },
    '2026-07-02': { // Thursday, Week 13 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Amos 7:10-17',
        psalm: 'Psalm 19:8-11',
        gospel: 'Matthew 9:1-8'
      }
    },
    '2026-07-03': { // Saint Thomas, Apostle (Feast)
      feast: 'Saint Thomas, Apostle',
      cycle: 'Feast',
      readings: {
        first: 'Ephesians 2:19-22',
        psalm: 'Psalm 117:1-2',
        gospel: 'John 20:24-29'
      }
    },
    '2026-07-04': { // Saturday, Week 13 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Amos 9:11-15',
        psalm: 'Psalm 85:9, 11-14',
        gospel: 'Matthew 9:14-17'
      }
    },
    '2026-07-05': { // Fourteenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Zechariah 9:9-10',
        psalm: 'Psalm 145:1-2, 8-11, 13-14',
        second: 'Romans 8:9, 11-13',
        gospel: 'Matthew 11:25-30'
      }
    },
    '2026-07-06': { // Monday, Week 14 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hosea 2:16, 17-18, 21-22',
        psalm: 'Psalm 145:2-9',
        gospel: 'Matthew 9:18-26'
      }
    },
    '2026-07-07': { // Tuesday, Week 14 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hosea 8:4-7, 11-13',
        psalm: 'Psalm 115:3-10',
        gospel: 'Matthew 9:32-38'
      }
    },
    '2026-07-08': { // Wednesday, Week 14 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hosea 10:1-3, 7-8, 12',
        psalm: 'Psalm 105:2-7',
        gospel: 'Matthew 10:1-7'
      }
    },
    '2026-07-09': { // Thursday, Week 14 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hosea 11:1-4, 8-9',
        psalm: 'Psalm 80:2-3, 15-16',
        gospel: 'Matthew 10:7-15'
      }
    },
    '2026-07-10': { // Friday, Week 14 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Hosea 14:2-10',
        psalm: 'Psalm 51:3-4, 8-9, 12-14, 17',
        gospel: 'Matthew 10:16-23'
      }
    },
    '2026-07-11': { // Saturday, Week 14 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Isaiah 6:1-8',
        psalm: 'Psalm 93:1-2, 5',
        gospel: 'Matthew 10:24-33'
      }
    },
    '2026-07-12': { // Fifteenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 55:10-11',
        psalm: 'Psalm 65:10-14',
        second: 'Romans 8:18-23',
        gospel: 'Matthew 13:1-23'
      }
    },
    '2026-07-13': { // Monday, Week 15 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Isaiah 1:10-17',
        psalm: 'Psalm 50:8-9, 16-17, 21, 23',
        gospel: 'Matthew 10:34—11:1'
      }
    },
    '2026-07-14': { // Tuesday, Week 15 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Isaiah 7:1-9',
        psalm: 'Psalm 48:2-8',
        gospel: 'Matthew 11:20-24'
      }
    },
    '2026-07-15': { // Wednesday, Week 15 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Isaiah 10:5-7, 13-16',
        psalm: 'Psalm 94:5-10, 14-15',
        gospel: 'Matthew 11:25-27'
      }
    },
    '2026-07-16': { // Thursday, Week 15 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Isaiah 26:7-9, 12, 16-19',
        psalm: 'Psalm 102:13-21',
        gospel: 'Matthew 11:28-30'
      }
    },
    '2026-07-17': { // Friday, Week 15 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Isaiah 38:1-6, 21-22, 7-8',
        psalm: 'Isaiah 38:10-12, 16',
        gospel: 'Matthew 12:1-8'
      }
    },
    '2026-07-18': { // Saturday, Week 15 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Micah 2:1-5',
        psalm: 'Psalm 10:1-4, 7-8, 14',
        gospel: 'Matthew 12:14-21'
      }
    },
    '2026-07-19': { // Sixteenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Wisdom 12:13, 16-19',
        psalm: 'Psalm 86:5-6, 9-10, 15-16',
        second: 'Romans 8:26-27',
        gospel: 'Matthew 13:24-43'
      }
    },
    '2026-07-20': { // Monday, Week 16 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Micah 6:1-4, 6-8',
        psalm: 'Psalm 50:5-6, 8-9, 16-17, 21, 23',
        gospel: 'Matthew 12:38-42'
      }
    },
    '2026-07-21': { // Tuesday, Week 16 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Micah 7:14-15, 18-20',
        psalm: 'Psalm 85:2-8',
        gospel: 'Matthew 12:46-50'
      }
    },
    '2026-07-22': { // Saint Mary Magdalene (Feast)
      feast: 'Saint Mary Magdalene',
      cycle: 'Feast',
      readings: {
        first: 'Song of Songs 3:1-4',
        psalm: 'Psalm 63:2-6, 8-9',
        gospel: 'John 20:1-2, 11-18'
      }
    },
    '2026-07-23': { // Thursday, Week 16 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 2:1-3, 7-8, 12-13',
        psalm: 'Psalm 36:6-11',
        gospel: 'Matthew 13:10-17'
      }
    },
    '2026-07-24': { // Friday, Week 16 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 3:14-17',
        psalm: 'Jeremiah 31:10-13',
        gospel: 'Matthew 13:18-23'
      }
    },
    '2026-07-25': { // Saint James, Apostle (Feast)
      feast: 'Saint James, Apostle',
      cycle: 'Feast',
      readings: {
        first: '2 Corinthians 4:7-15',
        psalm: 'Psalm 126:1-6',
        gospel: 'Matthew 20:20-28'
      }
    },
    '2026-07-26': { // Seventeenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: '1 Kings 3:5, 7-12',
        psalm: 'Psalm 119:57, 72, 76-77, 127-130',
        second: 'Romans 8:28-30',
        gospel: 'Matthew 13:44-52'
      }
    },
    '2026-07-27': { // Monday, Week 17 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 13:1-11',
        psalm: 'Deuteronomy 32:18-21',
        gospel: 'Matthew 13:31-35'
      }
    },
    '2026-07-28': { // Tuesday, Week 17 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 14:17-22',
        psalm: 'Psalm 79:8-9, 11, 13',
        gospel: 'Matthew 13:36-43'
      }
    },
    '2026-07-29': { // Wednesday, Week 17 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 15:10, 16-21',
        psalm: 'Psalm 59:2-4, 10-11, 17-18',
        gospel: 'Matthew 13:44-46'
      }
    },
    '2026-07-30': { // Thursday, Week 17 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 18:1-6',
        psalm: 'Psalm 146:1-6',
        gospel: 'Matthew 13:47-53'
      }
    },
    '2026-07-31': { // Friday, Week 17 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 26:1-9',
        psalm: 'Psalm 69:5, 8-10, 14',
        gospel: 'Matthew 13:54-58'
      }
    },
    // AUGUST 2026
    '2026-08-01': { // Saturday, Week 17 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 26:11-16, 24',
        psalm: 'Psalm 69:15-16, 30-31, 33-34',
        gospel: 'Matthew 14:1-12'
      }
    },
    '2026-08-02': { // Eighteenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 55:1-3',
        psalm: 'Psalm 145:8-9, 15-18',
        second: 'Romans 8:35, 37-39',
        gospel: 'Matthew 14:13-21'
      }
    },
    '2026-08-03': { // Monday, Week 18 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 28:1-17',
        psalm: 'Psalm 119:29, 43, 79-80, 95, 102',
        gospel: 'Matthew 14:13-21'
      }
    },
    '2026-08-04': { // Tuesday, Week 18 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 30:1-2, 12-15, 18-22',
        psalm: 'Psalm 102:16-21, 29, 22-23',
        gospel: 'Matthew 14:22-36'
      }
    },
    '2026-08-05': { // Wednesday, Week 18 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Jeremiah 31:1-7',
        psalm: 'Jeremiah 31:10-13',
        gospel: 'Matthew 15:21-28'
      }
    },
    '2026-08-06': { // The Transfiguration of the Lord (Feast)
      feast: 'The Transfiguration of the Lord',
      cycle: 'Feast',
      readings: {
        first: 'Daniel 7:9-10, 13-14',
        psalm: 'Psalm 97:1-2, 5-6, 9',
        second: '2 Peter 1:16-19',
        gospel: 'Matthew 17:1-9'
      }
    },
    '2026-08-07': { // Friday, Week 18 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Nahum 2:1, 3; 3:1-3, 6-7',
        psalm: 'Deuteronomy 32:35-36, 39, 41',
        gospel: 'Matthew 16:24-28'
      }
    },
    '2026-08-08': { // Saturday, Week 18 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Habakkuk 1:12—2:4',
        psalm: 'Psalm 9:8-13',
        gospel: 'Matthew 17:14-20'
      }
    },
    '2026-08-09': { // Nineteenth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: '1 Kings 19:9a, 11-13a',
        psalm: 'Psalm 85:9-14',
        second: 'Romans 9:1-5',
        gospel: 'Matthew 14:22-33'
      }
    },
    '2026-08-10': { // Saint Lawrence, Deacon and Martyr (Feast)
      feast: 'Saint Lawrence, Deacon and Martyr',
      cycle: 'Feast',
      readings: {
        first: '2 Corinthians 9:6-10',
        psalm: 'Psalm 112:1-2, 5-9',
        gospel: 'John 12:24-26'
      }
    },
    '2026-08-11': { // Tuesday, Week 19 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 2:8—3:4',
        psalm: 'Psalm 119:14, 24, 72, 103, 111, 131',
        gospel: 'Matthew 18:1-5, 10, 12-14'
      }
    },
    '2026-08-12': { // Wednesday, Week 19 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 9:1-7; 10:18-22',
        psalm: 'Psalm 113:1-6',
        gospel: 'Matthew 18:15-20'
      }
    },
    '2026-08-13': { // Thursday, Week 19 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 12:1-12',
        psalm: 'Psalm 78:56-59, 61-62',
        gospel: 'Matthew 18:21—19:1'
      }
    },
    '2026-08-14': { // Friday, Week 19 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 16:1-15, 60, 63',
        psalm: 'Isaiah 12:2-6',
        gospel: 'Matthew 19:3-12'
      }
    },
    '2026-08-15': { // The Assumption of the Blessed Virgin Mary (Solemnity)
      feast: 'The Assumption of the Blessed Virgin Mary',
      cycle: 'Solemnity',
      readings: {
        first: 'Revelation 11:19a; 12:1-6a, 10ab',
        psalm: 'Psalm 45:10-12, 16',
        second: '1 Corinthians 15:20-27',
        gospel: 'Luke 1:39-56'
      }
    },
    '2026-08-16': { // Twentieth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 56:1, 6-7',
        psalm: 'Psalm 67:2-3, 5-6, 8',
        second: 'Romans 11:13-15, 29-32',
        gospel: 'Matthew 15:21-28'
      }
    },
    '2026-08-17': { // Monday, Week 20 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 24:15-24',
        psalm: 'Deuteronomy 32:18-21',
        gospel: 'Matthew 19:16-22'
      }
    },
    '2026-08-18': { // Tuesday, Week 20 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 28:1-10',
        psalm: 'Deuteronomy 32:26-28, 30, 35-36',
        gospel: 'Matthew 19:23-30'
      }
    },
    '2026-08-19': { // Wednesday, Week 20 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 34:1-11',
        psalm: 'Psalm 23:1-6',
        gospel: 'Matthew 20:1-16'
      }
    },
    '2026-08-20': { // Thursday, Week 20 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 36:23-28',
        psalm: 'Psalm 51:12-15, 18-19',
        gospel: 'Matthew 22:1-14'
      }
    },
    '2026-08-21': { // Friday, Week 20 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 37:1-14',
        psalm: 'Psalm 107:2-9',
        gospel: 'Matthew 22:34-40'
      }
    },
    '2026-08-22': { // Saturday, Week 20 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ezekiel 43:1-7',
        psalm: 'Psalm 85:9-14',
        gospel: 'Matthew 23:1-12'
      }
    },
    '2026-08-23': { // Twenty-First Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 22:19-23',
        psalm: 'Psalm 138:1-3, 6, 8',
        second: 'Romans 11:33-36',
        gospel: 'Matthew 16:13-20'
      }
    },
    '2026-08-24': { // Saint Bartholomew, Apostle (Feast)
      feast: 'Saint Bartholomew, Apostle',
      cycle: 'Feast',
      readings: {
        first: 'Revelation 21:9b-14',
        psalm: 'Psalm 145:10-13, 17-18',
        gospel: 'John 1:45-51'
      }
    },
    '2026-08-25': { // Tuesday, Week 21 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Thessalonians 2:1-3a, 14-17',
        psalm: 'Psalm 96:10-13',
        gospel: 'Matthew 23:23-26'
      }
    },
    '2026-08-26': { // Wednesday, Week 21 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 Thessalonians 3:6-10, 16-18',
        psalm: 'Psalm 128:1-2, 4-5',
        gospel: 'Matthew 23:27-32'
      }
    },
    '2026-08-27': { // Thursday, Week 21 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 1:1-9',
        psalm: 'Psalm 145:2-7',
        gospel: 'Matthew 24:42-51'
      }
    },
    '2026-08-28': { // Friday, Week 21 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 1:17-25',
        psalm: 'Psalm 33:1-2, 4-5, 10-11',
        gospel: 'Matthew 25:1-13'
      }
    },
    '2026-08-29': { // Saturday, Week 21 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 1:26-31',
        psalm: 'Psalm 33:12-13, 18-21',
        gospel: 'Matthew 25:14-30'
      }
    },
    '2026-08-30': { // Twenty-Second Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Jeremiah 20:7-9',
        psalm: 'Psalm 63:2-6, 8-9',
        second: 'Romans 12:1-2',
        gospel: 'Matthew 16:21-27'
      }
    },
    '2026-08-31': { // Monday, Week 22 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 2:1-5',
        psalm: 'Psalm 119:97-102',
        gospel: 'Luke 4:16-30'
      }
    },
    // SEPTEMBER 2026
    '2026-09-01': { // Tuesday, Week 22 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 2:10b-16',
        psalm: 'Psalm 145:8-14',
        gospel: 'Luke 4:31-37'
      }
    },
    '2026-09-02': { // Wednesday, Week 22 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 3:1-9',
        psalm: 'Psalm 33:12-15, 20-21',
        gospel: 'Luke 4:38-44'
      }
    },
    '2026-09-03': { // Thursday, Week 22 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 3:18-23',
        psalm: 'Psalm 24:1-6',
        gospel: 'Luke 5:1-11'
      }
    },
    '2026-09-04': { // Friday, Week 22 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 4:1-5',
        psalm: 'Psalm 37:3-6, 27-28, 39-40',
        gospel: 'Luke 5:33-39'
      }
    },
    '2026-09-05': { // Saturday, Week 22 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 4:6b-15',
        psalm: 'Psalm 145:17-21',
        gospel: 'Luke 6:1-5'
      }
    },
    '2026-09-06': { // Twenty-Third Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Ezekiel 33:7-9',
        psalm: 'Psalm 95:1-2, 6-9',
        second: 'Romans 13:8-10',
        gospel: 'Matthew 18:15-20'
      }
    },
    '2026-09-07': { // Monday, Week 23 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 5:1-8',
        psalm: 'Psalm 5:5-7, 12',
        gospel: 'Luke 6:6-11'
      }
    },
    '2026-09-08': { // The Nativity of the Blessed Virgin Mary (Feast)
      feast: 'The Nativity of the Blessed Virgin Mary',
      cycle: 'Feast',
      readings: {
        first: 'Micah 5:1-4a',
        psalm: 'Psalm 13:6',
        gospel: 'Matthew 1:1-16, 18-23'
      }
    },
    '2026-09-09': { // Wednesday, Week 23 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 7:25-31',
        psalm: 'Psalm 45:11-12, 14-17',
        gospel: 'Luke 6:20-26'
      }
    },
    '2026-09-10': { // Thursday, Week 23 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 8:1b-7, 11-13',
        psalm: 'Psalm 139:1-3, 13-14, 23-24',
        gospel: 'Luke 6:27-38'
      }
    },
    '2026-09-11': { // Friday, Week 23 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 9:16-19, 22b-27',
        psalm: 'Psalm 84:3-6, 12',
        gospel: 'Luke 6:39-42'
      }
    },
    '2026-09-12': { // Saturday, Week 23 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 10:14-22',
        psalm: 'Psalm 116:12-13, 17-18',
        gospel: 'Luke 6:43-49'
      }
    },
    '2026-09-13': { // Twenty-Fourth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Sirach 27:30—28:7',
        psalm: 'Psalm 103:1-4, 9-12',
        second: 'Romans 14:7-9',
        gospel: 'Matthew 18:21-35'
      }
    },
    '2026-09-14': { // The Exaltation of the Holy Cross (Feast)
      feast: 'The Exaltation of the Holy Cross',
      cycle: 'Feast',
      readings: {
        first: 'Numbers 21:4b-9',
        psalm: 'Psalm 78:1-2, 34-38',
        second: 'Philippians 2:6-11',
        gospel: 'John 3:13-17'
      }
    },
    '2026-09-15': { // Tuesday, Week 24 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 12:12-14, 27-31a',
        psalm: 'Psalm 100:1-5',
        gospel: 'Luke 7:11-17'
      }
    },
    '2026-09-16': { // Wednesday, Week 24 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 12:31—13:13',
        psalm: 'Psalm 33:2-5, 12, 22',
        gospel: 'Luke 7:31-35'
      }
    },
    '2026-09-17': { // Thursday, Week 24 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 15:1-11',
        psalm: 'Psalm 118:1-2, 16-17, 28',
        gospel: 'Luke 7:36-50'
      }
    },
    '2026-09-18': { // Friday, Week 24 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 15:12-20',
        psalm: 'Psalm 17:1, 6-7, 8, 15',
        gospel: 'Luke 8:1-3'
      }
    },
    '2026-09-19': { // Saturday, Week 24 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '1 Corinthians 15:35-37, 42-49',
        psalm: 'Psalm 56:10-14',
        gospel: 'Luke 8:4-15'
      }
    },
    '2026-09-20': { // Twenty-Fifth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 55:6-9',
        psalm: 'Psalm 145:2-3, 8-9, 17-18',
        second: 'Philippians 1:20c-24, 27a',
        gospel: 'Matthew 20:1-16a'
      }
    },
    '2026-09-21': { // Saint Matthew, Apostle and Evangelist (Feast)
      feast: 'Saint Matthew, Apostle and Evangelist',
      cycle: 'Feast',
      readings: {
        first: 'Ephesians 4:1-7, 11-13',
        psalm: 'Psalm 19:2-5',
        gospel: 'Matthew 9:9-13'
      }
    },
    '2026-09-22': { // Tuesday, Week 25 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Proverbs 21:1-6, 10-13',
        psalm: 'Psalm 119:1, 27, 30, 34-35, 44',
        gospel: 'Luke 8:19-21'
      }
    },
    '2026-09-23': { // Wednesday, Week 25 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Proverbs 30:5-9',
        psalm: 'Psalm 119:29, 72, 89, 101, 104, 163',
        gospel: 'Luke 9:1-6'
      }
    },
    '2026-09-24': { // Thursday, Week 25 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ecclesiastes 1:2-11',
        psalm: 'Psalm 90:3-6, 12-14, 17',
        gospel: 'Luke 9:7-9'
      }
    },
    '2026-09-25': { // Friday, Week 25 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ecclesiastes 3:1-11',
        psalm: 'Psalm 144:1-4',
        gospel: 'Luke 9:18-22'
      }
    },
    '2026-09-26': { // Saturday, Week 25 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ecclesiastes 11:9—12:8',
        psalm: 'Psalm 90:3-6, 12-14, 17',
        gospel: 'Luke 9:43b-45'
      }
    },
    '2026-09-27': { // Twenty-Sixth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Ezekiel 18:25-28',
        psalm: 'Psalm 25:4-9',
        second: 'Philippians 2:1-11',
        gospel: 'Matthew 21:28-32'
      }
    },
    '2026-09-28': { // Monday, Week 26 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Job 1:6-22',
        psalm: 'Psalm 17:1-3, 6-7',
        gospel: 'Luke 9:46-50'
      }
    },
    '2026-09-29': { // Saints Michael, Gabriel and Raphael, Archangels (Feast)
      feast: 'Saints Michael, Gabriel and Raphael, Archangels',
      cycle: 'Feast',
      readings: {
        first: 'Daniel 7:9-10, 13-14',
        psalm: 'Psalm 138:1-5',
        gospel: 'John 1:47-51'
      }
    },
    '2026-09-30': { // Wednesday, Week 26 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Job 9:1-12, 14-16',
        psalm: 'Psalm 88:10-15',
        gospel: 'Luke 9:57-62'
      }
    },
    // OCTOBER 2026
    '2026-10-01': { // Thursday, Week 26 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Job 19:21-27',
        psalm: 'Psalm 27:7-9, 13-14',
        gospel: 'Luke 10:1-12'
      }
    },
    '2026-10-02': { // The Holy Guardian Angels
      cycle: 'II',
      readings: {
        first: 'Exodus 23:20-23',
        psalm: 'Psalm 91:1-6, 10-11',
        gospel: 'Matthew 18:1-5, 10'
      }
    },
    '2026-10-03': { // Saturday, Week 26 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Job 42:1-3, 5-6, 12-17',
        psalm: 'Psalm 119:66, 71, 75, 91, 125, 130',
        gospel: 'Luke 10:17-24'
      }
    },
    '2026-10-04': { // Twenty-Seventh Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 5:1-7',
        psalm: 'Psalm 80:9, 12-16, 19-20',
        second: 'Philippians 4:6-9',
        gospel: 'Matthew 21:33-43'
      }
    },
    '2026-10-05': { // Monday, Week 27 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 1:6-12',
        psalm: 'Psalm 111:1-2, 7-10',
        gospel: 'Luke 10:25-37'
      }
    },
    '2026-10-06': { // Tuesday, Week 27 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 1:13-24',
        psalm: 'Psalm 139:1-3, 13-15',
        gospel: 'Luke 10:38-42'
      }
    },
    '2026-10-07': { // Wednesday, Week 27 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 2:1-2, 7-14',
        psalm: 'Psalm 117:1-2',
        gospel: 'Luke 11:1-4'
      }
    },
    '2026-10-08': { // Thursday, Week 27 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 3:1-5',
        psalm: 'Luke 1:69-75',
        gospel: 'Luke 11:5-13'
      }
    },
    '2026-10-09': { // Friday, Week 27 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 3:7-14',
        psalm: 'Psalm 111:1-6',
        gospel: 'Luke 11:15-26'
      }
    },
    '2026-10-10': { // Saturday, Week 27 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 3:22-29',
        psalm: 'Psalm 105:2-7',
        gospel: 'Luke 11:27-28'
      }
    },
    '2026-10-11': { // Twenty-Eighth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 25:6-10a',
        psalm: 'Psalm 23:1-6',
        second: 'Philippians 4:12-14, 19-20',
        gospel: 'Matthew 22:1-14'
      }
    },
    '2026-10-12': { // Monday, Week 28 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 4:22-24, 26-27, 31—5:1',
        psalm: 'Psalm 113:1-7',
        gospel: 'Luke 11:29-32'
      }
    },
    '2026-10-13': { // Tuesday, Week 28 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 5:1-6',
        psalm: 'Psalm 119:41, 43-45, 47-48',
        gospel: 'Luke 11:37-41'
      }
    },
    '2026-10-14': { // Wednesday, Week 28 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Galatians 5:18-25',
        psalm: 'Psalm 1:1-4, 6',
        gospel: 'Luke 11:42-46'
      }
    },
    '2026-10-15': { // Thursday, Week 28 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 1:1-10',
        psalm: 'Psalm 98:1-6',
        gospel: 'Luke 11:47-54'
      }
    },
    '2026-10-16': { // Friday, Week 28 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 1:11-14',
        psalm: 'Psalm 33:1-2, 4-5, 12-13',
        gospel: 'Luke 12:1-7'
      }
    },
    '2026-10-17': { // Saturday, Week 28 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 1:15-23',
        psalm: 'Psalm 8:2-7',
        gospel: 'Luke 12:8-12'
      }
    },
    '2026-10-18': { // Twenty-Ninth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Isaiah 45:1, 4-6',
        psalm: 'Psalm 96:1, 3-5, 7-10',
        second: '1 Thessalonians 1:1-5b',
        gospel: 'Matthew 22:15-21'
      }
    },
    '2026-10-19': { // Monday, Week 29 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 2:1-10',
        psalm: 'Psalm 100:1-5',
        gospel: 'Luke 12:13-21'
      }
    },
    '2026-10-20': { // Tuesday, Week 29 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 2:12-22',
        psalm: 'Psalm 85:9-14',
        gospel: 'Luke 12:35-38'
      }
    },
    '2026-10-21': { // Wednesday, Week 29 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 3:2-12',
        psalm: 'Isaiah 12:2-6',
        gospel: 'Luke 12:39-48'
      }
    },
    '2026-10-22': { // Thursday, Week 29 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 3:14-21',
        psalm: 'Psalm 33:1-2, 4-5, 11-12, 18-19',
        gospel: 'Luke 12:49-53'
      }
    },
    '2026-10-23': { // Friday, Week 29 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 4:1-6',
        psalm: 'Psalm 24:1-6',
        gospel: 'Luke 12:54-59'
      }
    },
    '2026-10-24': { // Saturday, Week 29 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 4:7-16',
        psalm: 'Psalm 122:1-5',
        gospel: 'Luke 13:1-9'
      }
    },
    '2026-10-25': { // Thirtieth Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Exodus 22:20-26',
        psalm: 'Psalm 18:2-4, 47, 51',
        second: '1 Thessalonians 1:5c-10',
        gospel: 'Matthew 22:34-40'
      }
    },
    '2026-10-26': { // Monday, Week 30 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 4:32—5:8',
        psalm: 'Psalm 1:1-4, 6',
        gospel: 'Luke 13:10-17'
      }
    },
    '2026-10-27': { // Tuesday, Week 30 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 5:21-33',
        psalm: 'Psalm 128:1-5',
        gospel: 'Luke 13:18-21'
      }
    },
    '2026-10-28': { // Saints Simon and Jude, Apostles (Feast)
      feast: 'Saints Simon and Jude, Apostles',
      cycle: 'Feast',
      readings: {
        first: 'Ephesians 2:19-22',
        psalm: 'Psalm 19:2-5',
        gospel: 'Luke 6:12-16'
      }
    },
    '2026-10-29': { // Thursday, Week 30 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Ephesians 6:10-20',
        psalm: 'Psalm 144:1-2, 9-10',
        gospel: 'Luke 13:31-35'
      }
    },
    '2026-10-30': { // Friday, Week 30 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 1:1-11',
        psalm: 'Psalm 111:1-6',
        gospel: 'Luke 14:1-6'
      }
    },
    '2026-10-31': { // Saturday, Week 30 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 1:18b-26',
        psalm: 'Psalm 42:2-3, 5',
        gospel: 'Luke 14:1, 7-11'
      }
    },
    // NOVEMBER 2026
    '2026-11-01': { // All Saints (Solemnity)
      feast: 'All Saints',
      cycle: 'Solemnity',
      readings: {
        first: 'Revelation 7:2-4, 9-14',
        psalm: 'Psalm 24:1-6',
        second: '1 John 3:1-3',
        gospel: 'Matthew 5:1-12a'
      }
    },
    '2026-11-02': { // The Commemoration of All the Faithful Departed
      feast: 'All Souls\' Day',
      cycle: 'Special',
      readings: {
        first: 'Wisdom 3:1-9',
        psalm: 'Psalm 23:1-6',
        second: 'Romans 5:5-11',
        gospel: 'John 6:37-40'
      }
    },
    '2026-11-03': { // Tuesday, Week 31 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 2:5-11',
        psalm: 'Psalm 22:26-32',
        gospel: 'Luke 14:15-24'
      }
    },
    '2026-11-04': { // Wednesday, Week 31 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 2:12-18',
        psalm: 'Psalm 27:1, 4, 13-14',
        gospel: 'Luke 14:25-33'
      }
    },
    '2026-11-05': { // Thursday, Week 31 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 3:3-8a',
        psalm: 'Psalm 105:2-7',
        gospel: 'Luke 15:1-10'
      }
    },
    '2026-11-06': { // Friday, Week 31 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 3:17—4:1',
        psalm: 'Psalm 122:1-5',
        gospel: 'Luke 16:1-8'
      }
    },
    '2026-11-07': { // Saturday, Week 31 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philippians 4:10-19',
        psalm: 'Psalm 112:1-2, 5-6, 8-9',
        gospel: 'Luke 16:9-15'
      }
    },
    '2026-11-08': { // Thirty-Second Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Wisdom 6:12-16',
        psalm: 'Psalm 63:2-8',
        second: '1 Thessalonians 4:13-18',
        gospel: 'Matthew 25:1-13'
      }
    },
    '2026-11-09': { // The Dedication of the Lateran Basilica (Feast)
      feast: 'The Dedication of the Lateran Basilica',
      cycle: 'Feast',
      readings: {
        first: 'Ezekiel 47:1-2, 8-9, 12',
        psalm: 'Psalm 46:2-3, 5-6, 8-9',
        gospel: 'John 2:13-22'
      }
    },
    '2026-11-10': { // Tuesday, Week 32 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Titus 2:1-8, 11-14',
        psalm: 'Psalm 37:3-4, 18, 23, 27, 29',
        gospel: 'Luke 17:7-10'
      }
    },
    '2026-11-11': { // Wednesday, Week 32 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Titus 3:1-7',
        psalm: 'Psalm 23:1-6',
        gospel: 'Luke 17:11-19'
      }
    },
    '2026-11-12': { // Thursday, Week 32 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Philemon 7-20',
        psalm: 'Psalm 146:7-10',
        gospel: 'Luke 17:20-25'
      }
    },
    '2026-11-13': { // Friday, Week 32 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '2 John 4-9',
        psalm: 'Psalm 119:1-2, 10-11, 17-18',
        gospel: 'Luke 17:26-37'
      }
    },
    '2026-11-14': { // Saturday, Week 32 in Ordinary Time
      cycle: 'II',
      readings: {
        first: '3 John 5-8',
        psalm: 'Psalm 112:1-6',
        gospel: 'Luke 18:1-8'
      }
    },
    '2026-11-15': { // Thirty-Third Sunday in Ordinary Time
      cycle: 'A',
      readings: {
        first: 'Proverbs 31:10-13, 19-20, 30-31',
        psalm: 'Psalm 128:1-5',
        second: '1 Thessalonians 5:1-6',
        gospel: 'Matthew 25:14-30'
      }
    },
    '2026-11-16': { // Monday, Week 33 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 1:1-4; 2:1-5',
        psalm: 'Psalm 1:1-4, 6',
        gospel: 'Luke 18:35-43'
      }
    },
    '2026-11-17': { // Tuesday, Week 33 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 3:1-6, 14-22',
        psalm: 'Psalm 15:2-5',
        gospel: 'Luke 19:1-10'
      }
    },
    '2026-11-18': { // Wednesday, Week 33 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 4:1-11',
        psalm: 'Psalm 150:1-6',
        gospel: 'Luke 19:11-28'
      }
    },
    '2026-11-19': { // Thursday, Week 33 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 5:1-10',
        psalm: 'Psalm 149:1-6, 9',
        gospel: 'Luke 19:41-44'
      }
    },
    '2026-11-20': { // Friday, Week 33 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 10:8-11',
        psalm: 'Psalm 119:14, 24, 72, 103, 111, 131',
        gospel: 'Luke 19:45-48'
      }
    },
    '2026-11-21': { // Saturday, Week 33 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 11:4-12',
        psalm: 'Psalm 144:1-2, 9-10',
        gospel: 'Luke 20:27-40'
      }
    },
    '2026-11-22': { // Our Lord Jesus Christ, King of the Universe (Solemnity)
      feast: 'Our Lord Jesus Christ, King of the Universe',
      cycle: 'A',
      readings: {
        first: 'Ezekiel 34:11-12, 15-17',
        psalm: 'Psalm 23:1-6',
        second: '1 Corinthians 15:20-26, 28',
        gospel: 'Matthew 25:31-46'
      }
    },
    '2026-11-23': { // Monday, Week 34 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 14:1-3, 4b-5',
        psalm: 'Psalm 24:1-6',
        gospel: 'Luke 21:1-4'
      }
    },
    '2026-11-24': { // Tuesday, Week 34 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 14:14-19',
        psalm: 'Psalm 96:10-13',
        gospel: 'Luke 21:5-11'
      }
    },
    '2026-11-25': { // Wednesday, Week 34 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 15:1-4',
        psalm: 'Psalm 98:1-3, 7-9',
        gospel: 'Luke 21:12-19'
      }
    },
    '2026-11-26': { // Thursday, Week 34 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 18:1-2, 21-23; 19:1-3, 9a',
        psalm: 'Psalm 100:1-5',
        gospel: 'Luke 21:20-28'
      }
    },
    '2026-11-27': { // Friday, Week 34 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 20:1-4, 11—21:2',
        psalm: 'Psalm 84:3-6, 8',
        gospel: 'Luke 21:29-33'
      }
    },
    '2026-11-28': { // Saturday, Week 34 in Ordinary Time
      cycle: 'II',
      readings: {
        first: 'Revelation 22:1-7',
        psalm: 'Psalm 95:1-7',
        gospel: 'Luke 21:34-36'
      }
    },
    '2026-11-29': { // First Sunday of Advent
      cycle: 'A',
      readings: {
        first: 'Isaiah 2:1-5',
        psalm: 'Psalm 122:1-9',
        second: 'Romans 13:11-14',
        gospel: 'Matthew 24:37-44'
      }
    },
    '2026-11-30': { // Monday, Week 1 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 4:2-6',
        psalm: 'Psalm 122:1-9',
        gospel: 'Matthew 8:5-11'
      }
    },
    // DECEMBER 2026
    '2026-12-01': { // Tuesday, Week 1 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 11:1-10',
        psalm: 'Psalm 72:1-2, 7-8, 12-13, 17',
        gospel: 'Luke 10:21-24'
      }
    },
    '2026-12-02': { // Wednesday, Week 1 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 25:6-10a',
        psalm: 'Psalm 23:1-6',
        gospel: 'Matthew 15:29-37'
      }
    },
    '2026-12-03': { // Thursday, Week 1 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 26:1-6',
        psalm: 'Psalm 118:1, 8-9, 19-21, 25-27',
        gospel: 'Matthew 7:21, 24-27'
      }
    },
    '2026-12-04': { // Friday, Week 1 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 29:17-24',
        psalm: 'Psalm 27:1, 4, 13-14',
        gospel: 'Matthew 9:27-31'
      }
    },
    '2026-12-05': { // Saturday, Week 1 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 30:19-21, 23-26',
        psalm: 'Psalm 147:1-6',
        gospel: 'Matthew 9:35—10:1, 5a, 6-8'
      }
    },
    '2026-12-06': { // Second Sunday of Advent
      cycle: 'A',
      readings: {
        first: 'Isaiah 11:1-10',
        psalm: 'Psalm 72:1-2, 7-8, 12-13, 17',
        second: 'Romans 15:4-9',
        gospel: 'Matthew 3:1-12'
      }
    },
    '2026-12-07': { // Monday, Week 2 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 35:1-10',
        psalm: 'Psalm 85:9-14',
        gospel: 'Luke 5:17-26'
      }
    },
    '2026-12-08': { // The Immaculate Conception (Solemnity)
      feast: 'The Immaculate Conception of the Blessed Virgin Mary',
      cycle: 'Solemnity',
      readings: {
        first: 'Genesis 3:9-15, 20',
        psalm: 'Psalm 98:1-4',
        second: 'Ephesians 1:3-6, 11-12',
        gospel: 'Luke 1:26-38'
      }
    },
    '2026-12-09': { // Wednesday, Week 2 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 40:25-31',
        psalm: 'Psalm 103:1-4, 8, 10',
        gospel: 'Matthew 11:28-30'
      }
    },
    '2026-12-10': { // Thursday, Week 2 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 41:13-20',
        psalm: 'Psalm 145:1, 9-13',
        gospel: 'Matthew 11:11-15'
      }
    },
    '2026-12-11': { // Friday, Week 2 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 48:17-19',
        psalm: 'Psalm 1:1-4, 6',
        gospel: 'Matthew 11:16-19'
      }
    },
    '2026-12-12': { // Saturday, Week 2 of Advent
      cycle: 'II',
      readings: {
        first: 'Sirach 48:1-4, 9-11',
        psalm: 'Psalm 80:2-3, 15-16, 18-19',
        gospel: 'Matthew 17:9a, 10-13'
      }
    },
    '2026-12-13': { // Third Sunday of Advent
      cycle: 'A',
      readings: {
        first: 'Isaiah 35:1-6a, 10',
        psalm: 'Psalm 146:6-10',
        second: 'James 5:7-10',
        gospel: 'Matthew 11:2-11'
      }
    },
    '2026-12-14': { // Monday, Week 3 of Advent
      cycle: 'II',
      readings: {
        first: 'Numbers 24:2-7, 15-17a',
        psalm: 'Psalm 25:4-9',
        gospel: 'Matthew 21:23-27'
      }
    },
    '2026-12-15': { // Tuesday, Week 3 of Advent
      cycle: 'II',
      readings: {
        first: 'Zephaniah 3:1-2, 9-13',
        psalm: 'Psalm 34:2-3, 6-7, 17-19, 23',
        gospel: 'Matthew 21:28-32'
      }
    },
    '2026-12-16': { // Wednesday, Week 3 of Advent
      cycle: 'II',
      readings: {
        first: 'Isaiah 45:6b-8, 18, 21b-25',
        psalm: 'Psalm 85:9-14',
        gospel: 'Luke 7:18b-23'
      }
    },
    '2026-12-17': { // Thursday, Week 3 of Advent
      cycle: 'II',
      readings: {
        first: 'Genesis 49:2, 8-10',
        psalm: 'Psalm 72:1-4, 7-8, 17',
        gospel: 'Matthew 1:1-17'
      }
    },
    '2026-12-18': { // Friday, Week 3 of Advent
      cycle: 'II',
      readings: {
        first: 'Jeremiah 23:5-8',
        psalm: 'Psalm 72:1-2, 12-13, 18-19',
        gospel: 'Matthew 1:18-25'
      }
    },
    '2026-12-19': { // Saturday, Week 3 of Advent
      cycle: 'II',
      readings: {
        first: 'Judges 13:2-7, 24-25a',
        psalm: 'Psalm 71:3-6, 16-17',
        gospel: 'Luke 1:5-25'
      }
    },
    '2026-12-20': { // Fourth Sunday of Advent
      cycle: 'A',
      readings: {
        first: 'Isaiah 7:10-14',
        psalm: 'Psalm 24:1-6',
        second: 'Romans 1:1-7',
        gospel: 'Matthew 1:18-24'
      }
    },
    '2026-12-21': { // Monday, Week 4 of Advent
      cycle: 'II',
      readings: {
        first: 'Song of Songs 2:8-14',
        psalm: 'Psalm 33:2-3, 11-12, 20-21',
        gospel: 'Luke 1:39-45'
      }
    },
    '2026-12-22': { // Tuesday, Week 4 of Advent
      cycle: 'II',
      readings: {
        first: '1 Samuel 1:24-28',
        psalm: '1 Samuel 2:1, 4-8',
        gospel: 'Luke 1:46-56'
      }
    },
    '2026-12-23': { // Wednesday, Week 4 of Advent
      cycle: 'II',
      readings: {
        first: 'Malachi 3:1-4, 23-24',
        psalm: 'Psalm 25:4-5, 8-10, 14',
        gospel: 'Luke 1:57-66'
      }
    },
    '2026-12-24': { // Thursday, Week 4 of Advent
      cycle: 'II',
      readings: {
        first: '2 Samuel 7:1-5, 8b-12, 14a, 16',
        psalm: 'Psalm 89:2-5, 27, 29',
        gospel: 'Luke 1:67-79'
      }
    },
    '2026-12-25': { // The Nativity of the Lord (Christmas - Solemnity)
      feast: 'The Nativity of the Lord',
      cycle: 'Solemnity',
      readings: {
        first: 'Isaiah 52:7-10',
        psalm: 'Psalm 98:1-6',
        second: 'Hebrews 1:1-6',
        gospel: 'John 1:1-18'
      }
    },
    '2026-12-26': { // Saint Stephen, the First Martyr (Feast)
      feast: 'Saint Stephen, the First Martyr',
      cycle: 'Feast',
      readings: {
        first: 'Acts 6:8-10; 7:54-59',
        psalm: 'Psalm 31:3-4, 6, 8, 17, 21',
        gospel: 'Matthew 10:17-22'
      }
    },
    '2026-12-27': { // Saint John, Apostle and Evangelist (Feast)
      feast: 'Saint John, Apostle and Evangelist',
      cycle: 'Feast',
      readings: {
        first: '1 John 1:1-4',
        psalm: 'Psalm 97:1-2, 5-6, 11-12',
        gospel: 'John 20:1a, 2-8'
      }
    },
    '2026-12-28': { // The Holy Innocents, Martyrs (Feast)
      feast: 'The Holy Innocents, Martyrs',
      cycle: 'Feast',
      readings: {
        first: '1 John 1:5—2:2',
        psalm: 'Psalm 124:2-5, 7-8',
        gospel: 'Matthew 2:13-18'
      }
    },
    '2026-12-29': { // Tuesday within the Octave of Christmas
      cycle: 'Christmas',
      readings: {
        first: '1 John 2:3-11',
        psalm: 'Psalm 96:1-6',
        gospel: 'Luke 2:22-35'
      }
    },
    '2026-12-30': { // Wednesday within the Octave of Christmas
      cycle: 'Christmas',
      readings: {
        first: '1 John 2:12-17',
        psalm: 'Psalm 96:7-10',
        gospel: 'Luke 2:36-40'
      }
    },
    '2026-12-31': { // Thursday within the Octave of Christmas
      cycle: 'Christmas',
      readings: {
        first: '1 John 2:18-21',
        psalm: 'Psalm 96:1-2, 11-13',
        gospel: 'John 1:1-18'
      }
    }
  };

  // Helper: Get today's date in YYYY-MM-DD format
  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Get readings for a specific date
  function getReadingsForDate(dateString) {
    return readingsCitations[dateString] || null;
  }

  // Get today's readings
  function getTodaysReadings() {
    const today = getTodayDateString();
    return getReadingsForDate(today);
  }

  // Public API
  window.MassReadingsData = {
    getReadingsForDate,
    getTodaysReadings,
    getTodayDateString
  };

})();
