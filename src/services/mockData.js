export const ELECTION_TYPES = ['Presidential', 'Senatorial', 'Gubernatorial'];

export const PARTIES = ['APC', 'PDP', 'LP', 'NNPP', 'ADC', 'SDP', 'ZLP'];

export const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

export const GEOPOLITICAL_ZONES = {
  'North-Central': ['Benue','FCT','Kogi','Kwara','Nasarawa','Niger','Plateau'],
  'North-East':    ['Adamawa','Bauchi','Borno','Gombe','Taraba','Yobe'],
  'North-West':    ['Jigawa','Kaduna','Kano','Katsina','Kebbi','Sokoto','Zamfara'],
  'South-East':    ['Abia','Anambra','Ebonyi','Enugu','Imo'],
  'South-South':   ['Akwa Ibom','Bayelsa','Cross River','Delta','Edo','Rivers'],
  'South-West':    ['Ekiti','Lagos','Ogun','Ondo','Osun','Oyo'],
};

export const PARTY_COLORS = {
  APC:  '#1a3c6e', PDP:  '#cc0000', LP:   '#228B22',
  NNPP: '#FF8C00', ADC:  '#8B008B', SDP:  '#4169E1', ZLP: '#708090',
};

// ── Presidential Results ──────────────────────────────────────────────────
export const MOCK_PRESIDENTIAL_RESULTS = [
  { id:1, candidate:'Bola Ahmed Tinubu',        party:'APC',  votes:8794726, state:'Lagos',   avatar:'🏛️' },
  { id:2, candidate:'Atiku Abubakar',            party:'PDP',  votes:6984520, state:'Adamawa', avatar:'🌐' },
  { id:3, candidate:'Peter Obi',                 party:'LP',   votes:6101533, state:'Anambra', avatar:'🟢' },
  { id:4, candidate:'Rabiu Musa Kwankwaso',      party:'NNPP', votes:1496687, state:'Kano',    avatar:'🔶' },
];

// ── Senatorial Results (sample — 109 senate seats, showing top contested) ─
export const MOCK_SENATORIAL_RESULTS = [
  { id:1, candidate:'Kashim Shettima',      party:'APC',  votes:892430, state:'Borno',    district:'Borno Central',   avatar:'🏛️' },
  { id:2, candidate:'Dino Melaye',           party:'PDP',  votes:741200, state:'Kogi',     district:'Kogi West',       avatar:'🌐' },
  { id:3, candidate:'Abba Moro',             party:'PDP',  votes:689400, state:'Benue',    district:'Benue South',     avatar:'🌐' },
  { id:4, candidate:'Abdul Ningi',           party:'PDP',  votes:621000, state:'Bauchi',   district:'Bauchi Central',  avatar:'🌐' },
  { id:5, candidate:'Ned Nwoko',             party:'PDP',  votes:582000, state:'Delta',    district:'Delta North',     avatar:'🌐' },
  { id:6, candidate:'Sani Musa',             party:'APC',  votes:541000, state:'Niger',    district:'Niger East',      avatar:'🏛️' },
  { id:7, candidate:'Bamidele Opeyemi',      party:'APC',  votes:521000, state:'Ekiti',    district:'Ekiti Central',   avatar:'🏛️' },
  { id:8, candidate:'Jibrin Isah',           party:'LP',   votes:498000, state:'Kogi',     district:'Kogi East',       avatar:'🟢' },
];

// ── Gubernatorial Results ─────────────────────────────────────────────────
export const MOCK_GUBERNATORIAL_RESULTS = [
  { id:1,  candidate:'Babajide Sanwo-Olu',     party:'APC',  votes:762134, state:'Lagos',      avatar:'🏛️' },
  { id:2,  candidate:'Biodun Oyebanji',         party:'APC',  votes:544186, state:'Ekiti',      avatar:'🏛️' },
  { id:3,  candidate:'Umo Eno',                 party:'PDP',  votes:343866, state:'Akwa Ibom',  avatar:'🌐' },
  { id:4,  candidate:'Lucky Aiyedatiwa',        party:'APC',  votes:312000, state:'Ondo',       avatar:'🏛️' },
  { id:5,  candidate:'Alex Otti',               party:'LP',   votes:175050, state:'Abia',       avatar:'🟢' },
  { id:6,  candidate:'Charles Soludo',          party:'APGA', votes:391862, state:'Anambra',    avatar:'🔵' },
  { id:7,  candidate:'Caleb Mutfwang',          party:'PDP',  votes:194301, state:'Plateau',    avatar:'🌐' },
  { id:8,  candidate:'Siminalayi Fubara',       party:'PDP',  votes:302614, state:'Rivers',     avatar:'🌐' },
];

// ── All 37 State Results (Presidential breakdown) ─────────────────────────
export const MOCK_STATE_RESULTS = [
  { state:'Abia',        winner:'LP',   apc:45326,  pdp:39281,  lp:175050, nnpp:8430,  registered:1722009, accredited:312145, uploaded:94 },
  { state:'Adamawa',     winner:'PDP',  apc:402951, pdp:416009, lp:25240,  nnpp:12301, registered:1949786, accredited:718340, uploaded:88 },
  { state:'Akwa Ibom',   winner:'PDP',  apc:81235,  pdp:343866, lp:21432,  nnpp:4320,  registered:2184662, accredited:512430, uploaded:91 },
  { state:'Anambra',     winner:'LP',   apc:24486,  pdp:18636,  lp:150990, nnpp:5120,  registered:2147270, accredited:255832, uploaded:87 },
  { state:'Bauchi',      winner:'APC',  apc:621420, pdp:381200, lp:21000,  nnpp:93201, registered:2507842, accredited:984321, uploaded:82 },
  { state:'Bayelsa',     winner:'PDP',  apc:64543,  pdp:120983, lp:13201,  nnpp:2100,  registered:1005780, accredited:201430, uploaded:85 },
  { state:'Benue',       winner:'LP',   apc:187632, pdp:263401, lp:280012, nnpp:5432,  registered:2349016, accredited:620341, uploaded:79 },
  { state:'Borno',       winner:'APC',  apc:671421, pdp:64201,  lp:8321,   nnpp:7210,  registered:2100432, accredited:812341, uploaded:76 },
  { state:'Cross River', winner:'APC',  apc:203412, pdp:168321, lp:34201,  nnpp:5430,  registered:1865430, accredited:412341, uploaded:83 },
  { state:'Delta',       winner:'PDP',  apc:121320, pdp:432012, lp:98321,  nnpp:12300, registered:3001248, accredited:712341, uploaded:92 },
  { state:'Ebonyi',      winner:'APC',  apc:152341, pdp:92310,  lp:93450,  nnpp:4320,  registered:1463012, accredited:312431, uploaded:88 },
  { state:'Edo',         winner:'APC',  apc:321043, pdp:241032, lp:62341,  nnpp:8210,  registered:2212345, accredited:681230, uploaded:90 },
  { state:'Ekiti',       winner:'APC',  apc:187420, pdp:67843,  lp:32401,  nnpp:4320,  registered:988432, accredited:312430, uploaded:95 },
  { state:'Enugu',       winner:'LP',   apc:42312,  pdp:134012, lp:213401, nnpp:6540,  registered:1870431, accredited:412340, uploaded:89 },
  { state:'FCT',         winner:'LP',   apc:90902,  pdp:74106,  lp:148015, nnpp:15901, registered:1122171, accredited:317341, uploaded:97 },
  { state:'Gombe',       winner:'APC',  apc:412310, pdp:134210, lp:12300,  nnpp:43201, registered:1340120, accredited:612430, uploaded:81 },
  { state:'Imo',         winner:'APC',  apc:213101, pdp:83201,  lp:182901, nnpp:5320,  registered:2084321, accredited:501230, uploaded:74 },
  { state:'Jigawa',      winner:'APC',  apc:891230, pdp:231041, lp:12310,  nnpp:43210, registered:2401230, accredited:1124301, uploaded:86 },
  { state:'Kaduna',      winner:'APC',  apc:721340, pdp:423010, lp:32401,  nnpp:156230,registered:4028621, accredited:1412310, uploaded:84 },
  { state:'Kano',        winner:'NNPP', apc:594301, pdp:187043, lp:32401,  nnpp:995000,registered:5720340, accredited:2012430, uploaded:78 },
  { state:'Katsina',     winner:'APC',  apc:841230, pdp:213401, lp:23010,  nnpp:43201, registered:3312410, accredited:1124301, uploaded:81 },
  { state:'Kebbi',       winner:'APC',  apc:632410, pdp:143201, lp:12300,  nnpp:21300, registered:1820430, accredited:812310, uploaded:83 },
  { state:'Kogi',        winner:'APC',  apc:412301, pdp:103421, lp:201320, nnpp:12401, registered:1672341, accredited:731240, uploaded:71 },
  { state:'Kwara',       winner:'APC',  apc:343012, pdp:178230, lp:42310,  nnpp:23010, registered:1411240, accredited:612310, uploaded:87 },
  { state:'Lagos',       winner:'APC',  apc:572606, pdp:75750,  lp:582454, nnpp:34120, registered:7060880, accredited:1384560, uploaded:96 },
  { state:'Nasarawa',    winner:'APC',  apc:312401, pdp:183021, lp:32401,  nnpp:23010, registered:1172430, accredited:562310, uploaded:80 },
  { state:'Niger',       winner:'APC',  apc:612310, pdp:201043, lp:32401,  nnpp:43201, registered:2341230, accredited:921430, uploaded:85 },
  { state:'Ogun',        winner:'APC',  apc:411230, pdp:114130, lp:114023, nnpp:23010, registered:2388432, accredited:712340, uploaded:93 },
  { state:'Ondo',        winner:'APC',  apc:312010, pdp:191230, lp:168040, nnpp:12300, registered:1817840, accredited:612340, uploaded:88 },
  { state:'Osun',        winner:'PDP',  apc:243401, pdp:314921, lp:95231,  nnpp:12300, registered:1954321, accredited:712310, uploaded:91 },
  { state:'Oyo',         winner:'PDP',  apc:243450, pdp:378028, lp:132423, nnpp:32401, registered:3242432, accredited:1012430, uploaded:89 },
  { state:'Plateau',     winner:'LP',   apc:232401, pdp:189430, lp:243280, nnpp:23010, registered:2031430, accredited:712310, uploaded:77 },
  { state:'Rivers',      winner:'LP',   apc:231591, pdp:213912, lp:175071, nnpp:12300, registered:3477432, accredited:812430, uploaded:82 },
  { state:'Sokoto',      winner:'PDP',  apc:386021, pdp:441241, lp:23010,  nnpp:23010, registered:1896430, accredited:873240, uploaded:84 },
  { state:'Taraba',      winner:'PDP',  apc:231040, pdp:312401, lp:34210,  nnpp:12300, registered:1532400, accredited:612310, uploaded:79 },
  { state:'Yobe',        winner:'APC',  apc:512310, pdp:87430,  lp:12300,  nnpp:8210,  registered:1320430, accredited:632310, uploaded:76 },
  { state:'Zamfara',     winner:'APC',  apc:522401, pdp:198230, lp:12300,  nnpp:43201, registered:1898430, accredited:732310, uploaded:80 },
];

export const MOCK_DASHBOARD_STATS = {
  totalRegistered:  93469008,
  totalVotesCast:   25286616,
  resultsUploaded:  149272,
  totalPollingUnits:176846,
  uploadPercentage: 84.4,
};