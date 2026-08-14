// ===== MARVEL MULTIVERSE - CENTRALIZED CHARACTER ARCHIVE DATA =====

window.MARVEL_DATA = (function () {

  var UNIVERSES = [
    { id: 'avengers', name: 'Avengers Initiative', tag: 'EARTH\'S MIGHTIEST', color: '#e23636', icon: 'fa-shield-halved', desc: 'The unified defense force assembled to face threats no single hero can stop. Every hero in this archive is connected through this team.' },
    { id: 'earth-616', name: 'Earth-616', tag: 'PRIME COMICS UNIVERSE', color: '#ffd700', icon: 'fa-globe', desc: 'The original Marvel Comics universe and birthplace of the definitive versions of every Marvel hero.' },
    { id: 'earth-199999', name: 'Earth-199999', tag: 'MCU / SACRED TIMELINE', color: '#1a6bff', icon: 'fa-film', desc: 'The Marvel Cinematic Universe — the sacred timeline where the Infinity Saga unfolded.' },
    { id: 'wakanda', name: 'Wakanda', tag: 'HIDDEN NATION', color: '#9b59b6', icon: 'fa-cat', desc: 'The most technologically advanced nation on Earth, shielded from the world by vibranium-rich borders.' },
    { id: 'asgard', name: 'Asgard', tag: 'NINE REALMS', color: '#ffd700', icon: 'fa-bolt', desc: 'The golden realm of the Norse gods, connected to the other eight realms by the Bifrost.' },
    { id: 'multiverse', name: 'The Multiverse', tag: 'INFINITE REALITIES', color: '#4fc3f7', icon: 'fa-bahai', desc: 'An infinite web of branching realities where every choice creates a new universe. The Scarlet Witch stands at its center.' }
  ];

  var MOVIES = [
    { id: 'hulk08', title: 'The Incredible Hulk', year: '2008', phase: 'Phase 1', tag: 'FILM', desc: 'Bruce Banner hunts for a cure while pursued by the military.' },
    { id: 'im1', title: 'Iron Man', year: '2008', phase: 'Phase 1', tag: 'FILM', desc: 'Tony Stark builds the first Iron Man suit to escape captivity.' },
    { id: 'im2', title: 'Iron Man 2', year: '2010', phase: 'Phase 1', tag: 'FILM', desc: 'Stark faces his legacy and a rival powered by stolen tech.' },
    { id: 'thor', title: 'Thor', year: '2011', phase: 'Phase 1', tag: 'FILM', desc: 'The God of Thunder is banished to Earth to learn humility.' },
    { id: 'tfa', title: 'Captain America: The First Avenger', year: '2011', phase: 'Phase 1', tag: 'FILM', desc: 'Steve Rogers becomes the Super Soldier during WWII.' },
    { id: 'avengers', title: 'The Avengers', year: '2012', phase: 'Phase 1', tag: 'FILM', desc: 'Earth\'s mightiest heroes unite for the first time against Loki.' },
    { id: 'im3', title: 'Iron Man 3', year: '2013', phase: 'Phase 2', tag: 'FILM', desc: 'Stark battles the Mandarin without his armor\'s comforts.' },
    { id: 'tdw', title: 'Thor: The Dark World', year: '2013', phase: 'Phase 2', tag: 'FILM', desc: 'Thor faces the dark elves to protect the Reality Stone.' },
    { id: 'tws', title: 'Captain America: The Winter Soldier', year: '2014', phase: 'Phase 2', tag: 'FILM', desc: 'Cap uncovers HYDRA\'s infiltration of S.H.I.E.L.D.' },
    { id: 'aou', title: 'Avengers: Age of Ultron', year: '2015', phase: 'Phase 2', tag: 'FILM', desc: 'The Avengers face Ultron and the twins from Sokovia.' },
    { id: 'civilwar', title: 'Captain America: Civil War', year: '2016', phase: 'Phase 3', tag: 'FILM', desc: 'The Avengers fracture over the Sokovia Accords.' },
    { id: 'ds', title: 'Doctor Strange', year: '2016', phase: 'Phase 3', tag: 'FILM', desc: 'A neurosurgeon masters the mystic arts as Sorcerer Supreme.' },
    { id: 'smhc', title: 'Spider-Man: Homecoming', year: '2017', phase: 'Phase 3', tag: 'FILM', desc: 'Peter Parker balances high school and heroics under Stark\'s mentorship.' },
    { id: 'ragnarok', title: 'Thor: Ragnarok', year: '2017', phase: 'Phase 3', tag: 'FILM', desc: 'Thor races to stop Hela from destroying Asgard.' },
    { id: 'bp', title: 'Black Panther', year: '2018', phase: 'Phase 3', tag: 'FILM', desc: 'T\'Challa returns to Wakanda to claim his throne.' },
    { id: 'iw', title: 'Avengers: Infinity War', year: '2018', phase: 'Phase 3', tag: 'FILM', desc: 'Thanos begins his quest for the six Infinity Stones.' },
    { id: 'cm', title: 'Captain Marvel', year: '2019', phase: 'Phase 3', tag: 'FILM', desc: 'Carol Danvers discovers her past among the Kree.' },
    { id: 'eg', title: 'Avengers: Endgame', year: '2019', phase: 'Phase 3', tag: 'FILM', desc: 'The Time Heist to undo the Snap and the final battle against Thanos.' },
    { id: 'ffh', title: 'Spider-Man: Far From Home', year: '2019', phase: 'Phase 3', tag: 'FILM', desc: 'Peter inherits Stark\'s legacy across Europe.' },
    { id: 'bw', title: 'Black Widow', year: '2021', phase: 'Phase 4', tag: 'FILM', desc: 'Natasha confronts her Red Room past.' },
    { id: 'wandavision', title: 'WandaVision', year: '2021', phase: 'Phase 4', tag: 'SERIES', desc: 'Wanda\'s grief reshapes reality in Westview.' },
    { id: 'nwh', title: 'Spider-Man: No Way Home', year: '2021', phase: 'Phase 4', tag: 'FILM', desc: 'The multiverse is unleashed when a spell fractures.' },
    { id: 'hawkeye', title: 'Hawkeye', year: '2021', phase: 'Phase 4', tag: 'SERIES', desc: 'Clint mentors Kate Bishop during a New York Christmas.' },
    { id: 'mom', title: 'Doctor Strange in the Multiverse of Madness', year: '2022', phase: 'Phase 4', tag: 'FILM', desc: 'Strange crosses realities to stop the Scarlet Witch.' },
    { id: 'lnt', title: 'Thor: Love and Thunder', year: '2022', phase: 'Phase 4', tag: 'FILM', desc: 'Thor faces Gorr the God Butcher and reunites with Jane.' },
    { id: 'wf', title: 'Black Panther: Wakanda Forever', year: '2022', phase: 'Phase 4', tag: 'FILM', desc: 'Wakanda grieves its king while facing Namor.' },
    { id: 'amq', title: 'Ant-Man and the Wasp: Quantumania', year: '2023', phase: 'Phase 5', tag: 'FILM', desc: 'Scott Lang is pulled into the Quantum Realm against Kang.' }
  ];

  var CHARACTERS = [
    {
      id: 'iron-man', num: 'AV-001', name: 'IRON MAN', realName: 'Tony Stark',
      aliases: ['The Invincible Iron Man', 'Genius. Billionaire. Playboy. Philanthropist.'],
      title: 'Founding Avenger / Armored Avenger',
      description: 'Billionaire inventor Tony Stark built a powered exosuit to escape captivity and became Earth\'s mightiest defender. Visionary leader of the Avengers who sacrificed his life to defeat Thanos.',
      abilities: ['Arc Reactor Energy', 'Powered Exosuit', 'Super Genius IQ', 'Repulsor Blasts', 'Flight Capability', 'Nanotech Armor'],
      teams: ['avengers', 'stark'], categories: 'avengers street',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-616', 'earth-199999'],
      status: 'deceased', statusLabel: 'DECEASED',
      firstAppearance: 'TALES OF SUSPENSE #39 — 1963',
      movieAppearances: ['im1', 'im2', 'avengers', 'im3', 'aou', 'civilwar', 'iw', 'eg'],
      relatedCharacters: ['captain-america', 'thor', 'hulk', 'black-widow', 'hawkeye', 'black-panther', 'spider-man'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786297431/IRONMAN_Art_by_animenature_ig_wpu29s.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631686/Tony_stark_lrhk9h.jpg',
      identityName: 'Tony Stark',
      accent: '#e23636',
      stats: { strength: 8, speed: 7, intelligence: 10, durability: 7, power: 9, combat: 8 },
      quotes: ['"I am Iron Man."', '"I love you 3000."'],
      brief: 'Founding member and former leader of the Avengers. Created over 50 Iron Man suits from the Mark I cave suit to the nanotech Mark LXXXV. Sacrificed his life wielding the Infinity Stones. Posthumously honored with the Stark Memorial in New York.'
    },
    {
      id: 'captain-america', num: 'AV-002', name: 'CAPTAIN AMERICA', realName: 'Steve Rogers',
      aliases: ['The First Avenger', 'Sentinel of Liberty'],
      title: 'Founding Avenger / Super Soldier',
      description: 'A frail Brooklyn kid transformed by the Super Soldier Serum into the world\'s first superhero. Defied HYDRA, led the Avengers through their darkest hours, and chose a life lost in time.',
      abilities: ['Super Soldier Serum', 'Vibranium Shield', 'Peak Human Agility', 'Master Tactician', 'Enhanced Healing', 'Indomitable Will'],
      teams: ['avengers', 'shield'], categories: 'avengers',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-199999', 'earth-616'],
      status: 'retired', statusLabel: 'RETIRED',
      firstAppearance: 'CAPTAIN AMERICA COMICS #1 — 1941',
      movieAppearances: ['tfa', 'avengers', 'tws', 'aou', 'civilwar', 'iw', 'eg'],
      relatedCharacters: ['iron-man', 'thor', 'hulk', 'black-widow', 'hawkeye', 'black-panther'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786297431/download_4_lrrnak.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631685/Steve_Rogers_portrait_slslhb.jpg',
      identityName: 'Steve Rogers',
      accent: '#1a6bff',
      stats: { strength: 8, speed: 7, intelligence: 8, durability: 8, power: 6, combat: 10 },
      quotes: ['"I can do this all day."', '"Avengers... assemble."'],
      brief: 'Fought HYDRA across two timelines and led the Avengers through multiple crises. Wielded Mjolnir in the battle against Thanos. After returning the Infinity Stones, chose to live out his days with Peggy Carter. Shield passed to Sam Wilson.'
    },
    {
      id: 'thor', num: 'AV-003', name: 'THOR', realName: 'Thor Odinson',
      aliases: ['God of Thunder', 'King of Asgard'],
      title: 'God of Thunder / King of New Asgard',
      description: 'The Asgardian God of Thunder, banished to Earth for his arrogance. Through humility and courage, Thor earned the power of Mjolnir and became one of the most powerful Avengers to ever live.',
      abilities: ['Thunder & Lightning', 'Mjolnir / Stormbreaker', 'Asgardian Durability', 'Godly Strength', 'Bifrost Access', 'Immortality'],
      teams: ['avengers', 'guardians'], categories: 'avengers guardians',
      universe: 'Asgard', relatedUniverses: ['asgard', 'avengers', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'JOURNEY INTO MYSTERY #82 — 1962',
      movieAppearances: ['thor', 'avengers', 'tdw', 'aou', 'ragnarok', 'iw', 'eg', 'lnt'],
      relatedCharacters: ['iron-man', 'captain-america', 'hulk', 'black-panther', 'scarlet-witch'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350692/918804761504735501_sgpsix.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631685/50102614598727073_vg10bb.jpg',
      identityName: 'Thor Odinson',
      accent: '#ffd700',
      stats: { strength: 10, speed: 8, intelligence: 6, durability: 10, power: 10, combat: 9 },
      quotes: ['"Bring me Thanos!"', '"I\'m still worthy."'],
      brief: 'Wielder of Mjolnir and Stormbreaker. Fought Hela, Thanos, and Gorr the God Butcher across millennia. Currently traveling with the Guardians of the Galaxy, exploring the cosmos.'
    },
    {
      id: 'hulk', num: 'AV-004', name: 'HULK', realName: 'Dr. Bruce Banner',
      aliases: ['The Strongest One There Is', 'Professor Hulk'],
      title: 'Founding Avenger / Gamma Mutate',
      description: 'Exposed to massive gamma radiation, Dr. Bruce Banner transforms into the Hulk — an unstoppable force of raw power. Banner and Hulk finally merged into Professor Hulk, gaining control of both minds.',
      abilities: ['Gamma Radiation', 'Limitless Strength', 'Regenerative Healing', 'Near-Invulnerability', 'Scientific Genius', 'Thunderclap'],
      teams: ['avengers'], categories: 'avengers',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-616', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'INCREDIBLE HULK #1 — 1962',
      movieAppearances: ['hulk08', 'avengers', 'aou', 'iw', 'eg'],
      relatedCharacters: ['iron-man', 'captain-america', 'thor', 'black-widow', 'hawkeye'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350692/download_5_izcprc.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631685/download_9_fbfevt.jpg',
      identityName: 'Bruce Banner',
      accent: '#2ecc71',
      stats: { strength: 10, speed: 6, intelligence: 9, durability: 10, power: 9, combat: 8 },
      quotes: ['"That\'s my secret, Captain. I\'m always angry."', '"Hulk... smash!"'],
      brief: 'Professor Hulk used the Nano Gauntlet to reverse the Snap. Now runs a physics lab and a taco truck. One of the original Avengers whose raw power rivals Thor himself.'
    },
    {
      id: 'black-widow', num: 'AV-005', name: 'BLACK WIDOW', realName: 'Natasha Romanoff',
      aliases: ['The Spy Who Saved the Universe', 'Natasha Romanova'],
      title: 'Founding Avenger / Master Spy',
      description: 'Trained from childhood in the Red Room as a lethal assassin, Natasha Romanoff defected to S.H.I.E.L.D. and became an Avenger. She proved that the greatest weapon is the human heart.',
      abilities: ['Master Spy', 'Expert Martial Artist', 'Espionage Mastery', 'Widow Bite Gauntlets', 'Multi-Lingual', 'Psychological Warfare'],
      teams: ['avengers', 'shield'], categories: 'avengers street',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-199999'],
      status: 'deceased', statusLabel: 'DECEASED',
      firstAppearance: 'TALES OF SUSPENSE #52 — 1964',
      movieAppearances: ['im2', 'avengers', 'tws', 'aou', 'civilwar', 'iw', 'eg', 'bw'],
      relatedCharacters: ['hawkeye', 'captain-america', 'iron-man', 'hulk', 'black-panther'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350692/Natasha_Black_Widow_4k_Aesthetic_Wallpaper_bckjcj.jpg',
      identityImage: null,
      identityName: 'Natasha Romanoff',
      accent: '#e23636',
      stats: { strength: 5, speed: 8, intelligence: 9, durability: 5, power: 3, combat: 10 },
      quotes: ['"I\'m always picking up after you boys."', '"This is going to be okay."'],
      brief: 'The soul of the Avengers. Sacrificed herself on Vormir so Clint could claim the Soul Stone. Escaped the Red Room as a young agent and dedicated her life to protecting others.'
    },
    {
      id: 'hawkeye', num: 'AV-006', name: 'HAWKEYE', realName: 'Clint Barton',
      aliases: ['The World\'s Greatest Marksman', 'Ronin'],
      title: 'Founding Avenger / Master Archer',
      description: 'The only non-superpowered original Avenger. A master archer and former S.H.I.E.L.D. agent whose precision and loyalty made him indispensable. Now mentors Kate Bishop.',
      abilities: ['Master Archer', 'Expert Swordsman', 'Tactical Espionage', 'Trick Arrows', 'Peak Human Focus', 'Acrobatics'],
      teams: ['avengers', 'shield'], categories: 'avengers street',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'TALES OF SUSPENSE #57 — 1964',
      movieAppearances: ['avengers', 'aou', 'civilwar', 'iw', 'eg', 'hawkeye'],
      relatedCharacters: ['black-widow', 'captain-america', 'iron-man', 'black-panther'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350693/download_6_aebfr2.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631685/Hawkeye_Civil_War_itjott.jpg',
      identityName: 'Clint Barton',
      accent: '#ffd700',
      stats: { strength: 5, speed: 7, intelligence: 8, durability: 5, power: 4, combat: 9 },
      quotes: ['"The city is flying and I\'m sitting here talking about arrows."', '"I\'ve been here all along."'],
      brief: 'Founding Avenger with zero superpowers. Survived the Snap as a fugitive. Trained under the Ronin identity during the Blip. Now mentors Kate Bishop in New York City.'
    },
    {
      id: 'scarlet-witch', num: 'AV-007', name: 'SCARLET WITCH', realName: 'Wanda Maximoff',
      aliases: ['Nexus Being', 'Witch of Chaos'],
      title: 'Nexus Being / Chaos Magic Wielder',
      description: 'Born with chaos magic and enhanced by the Mind Stone, Wanda Maximoff is one of the most powerful beings in the multiverse. Her grief over Vision\'s death reshaped reality itself.',
      abilities: ['Chaos Magic', 'Reality Warping', 'Telekinesis', 'Telepathy', 'Energy Manipulation', 'Nexus Being'],
      teams: ['avengers', 'magic'], categories: 'avengers magic',
      universe: 'Multiverse', relatedUniverses: ['multiverse', 'avengers', 'earth-199999'],
      status: 'unknown', statusLabel: 'UNKNOWN',
      firstAppearance: 'X-MEN #4 — 1964',
      movieAppearances: ['aou', 'civilwar', 'iw', 'eg', 'wandavision', 'mom'],
      relatedCharacters: ['vision', 'captain-america', 'iron-man', 'thor', 'doctor-strange'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350692/Wanda_maximoff_iur07s.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631685/Wanda_Maximoff_1_nxaw57.jpg',
      identityName: 'Wanda Maximoff',
      accent: '#9b59b6',
      stats: { strength: 6, speed: 7, intelligence: 8, durability: 7, power: 10, combat: 7 },
      quotes: ['"You took everything from me."', '"I don\'t want to be this anymore."'],
      brief: 'A Nexus Being capable of altering the fundamental forces of reality. Created an entire false reality in Westview. Defeated the Illuminati of Earth-838. Destroyed the Darkhold across all universes.'
    },
    {
      id: 'vision', num: 'AV-008', name: 'VISION', realName: 'Vision',
      aliases: ['The Synthezoid', 'The Android of the Mind Stone'],
      title: 'Avenger / Sentient Synthezoid',
      description: 'Born from Ultron\'s design and JARVIS\'s mind, Vision was given life through the Mind Stone. He chose humanity over his creator and became one of the Avengers\' most powerful and gentle members.',
      abilities: ['Density Control', 'Mind Stone Beam', 'Flight', 'Superhuman Strength', 'Phasing', 'Solar Energy Absorption'],
      teams: ['avengers', 'magic'], categories: 'avengers magic',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'multiverse', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'AVENGERS #57 — 1968',
      movieAppearances: ['aou', 'civilwar', 'iw', 'eg', 'wandavision'],
      relatedCharacters: ['scarlet-witch', 'iron-man', 'captain-america', 'thor', 'hawkeye'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350692/download_7_rsgbct.jpg',
      identityImage: null,
      identityName: 'Vision',
      accent: '#4fc3f7',
      stats: { strength: 8, speed: 7, intelligence: 9, durability: 8, power: 9, combat: 6 },
      quotes: ['"I am Vision."', '"What is grief, if not love persevering?"'],
      brief: 'Born from Ultron\'s design and given life through the Mind Stone. Killed by Thanos to deny him the stone, restored in white by S.W.O.R.D., and rebuilt again by his love for Wanda Maximoff.'
    },
    {
      id: 'black-panther', num: 'AV-009', name: 'BLACK PANTHER', realName: 'T\'Challa',
      aliases: ['King of Wakanda', 'The Black Panther'],
      title: 'King of Wakanda / Protector',
      description: 'King of the technologically advanced nation of Wakanda. After consuming the Heart-Shaped Herb, T\'Challa gained superhuman abilities and became the Black Panther, protector of his people.',
      abilities: ['Heart-Shaped Herb', 'Vibranium Suit', 'Enhanced Senses', 'Vibranium Claws', 'Tactical Genius', 'Energy Absorption'],
      teams: ['avengers'], categories: 'avengers',
      universe: 'Wakanda', relatedUniverses: ['wakanda', 'avengers', 'earth-199999'],
      status: 'deceased', statusLabel: 'DECEASED',
      firstAppearance: 'FANTASTIC FOUR #52 — 1966',
      movieAppearances: ['civilwar', 'bp', 'iw', 'eg', 'wf'],
      relatedCharacters: ['captain-america', 'iron-man', 'thor', 'hulk', 'black-widow'],
      heroImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786350718/897623769498599299_hed6gi.jpg',
      identityImage: 'https://res.cloudinary.com/dgtdgt126/image/upload/v1786631685/97108935747412748_xuxldk.jpg',
      identityName: 'T\'Challa',
      accent: '#9b59b6',
      stats: { strength: 8, speed: 8, intelligence: 9, durability: 9, power: 8, combat: 9 },
      quotes: ['"Wakanda forever!"', '"In times of crisis, the wise build bridges while the foolish build barriers."'],
      brief: 'Ruler of Wakanda and one of the world\'s most advanced warriors. Led the Wakandan forces against Thanos\'s army. The Black Panther mantle passed to Shuri. Wakanda Forever remains the enduring mantra.'
    },
    {
      id: 'spider-man', num: 'AV-010', name: 'SPIDER-MAN', realName: 'Peter Parker',
      aliases: ['Friendly Neighborhood Spider-Man', 'The Amazing Spider-Man'],
      title: 'Youngest Avenger / Stark Protégé',
      description: 'A Queens teenager bitten by a radioactive spider gained incredible abilities and learned that with great power comes great responsibility. The youngest Avenger and protégé of Tony Stark.',
      abilities: ['Wall-Crawling', 'Spider-Sense', 'Superhuman Agility', 'Web-Shooters', 'Superhuman Strength', 'Rapid Healing'],
      teams: ['avengers'], categories: 'avengers street',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'multiverse', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'AMAZING FANTASY #15 — 1962',
      movieAppearances: ['civilwar', 'smhc', 'iw', 'eg', 'ffh', 'nwh'],
      relatedCharacters: ['iron-man', 'captain-america', 'doctor-strange', 'black-panther'],
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Spider-Man.jpg/500px-Spider-Man.jpg',
      identityImage: null,
      identityName: 'Peter Parker',
      accent: '#e23636',
      stats: { strength: 8, speed: 9, intelligence: 9, durability: 7, power: 7, combat: 8 },
      quotes: ['"With great power comes great responsibility."'],
      brief: 'Mentored by Tony Stark. Fought alongside the Avengers against Thanos. After Doctor Strange\'s spell, the world forgot his identity. Now operates as a solo hero in New York.'
    },
    {
      id: 'doctor-strange', num: 'AV-011', name: 'DOCTOR STRANGE', realName: 'Dr. Stephen Strange',
      aliases: ['Sorcerer Supreme', 'Master of the Mystic Arts'],
      title: 'Sorcerer Supreme / Keeper of the Sanctum',
      description: 'A brilliant neurosurgeon who destroyed his hands in an accident sought healing at Kamar-Taj and became Earth\'s Sorcerer Supreme, its primary defender against mystical and multiversal threats.',
      abilities: ['Mystic Arts', 'Time Stone (former)', 'Dimensional Travel', 'Astral Projection', 'Eldritch Magic', 'Mirror Dimension'],
      teams: ['avengers', 'magic'], categories: 'avengers magic',
      universe: 'Earth-616', relatedUniverses: ['multiverse', 'avengers', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'STRANGE TALES #110 — 1963',
      movieAppearances: ['ds', 'ragnarok', 'iw', 'eg', 'nwh', 'mom'],
      relatedCharacters: ['scarlet-witch', 'thor', 'iron-man', 'spider-man'],
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Dr._Strange_%2830175130414%29.jpg/500px-Dr._Strange_%2830175130414%29.jpg',
      identityImage: null,
      identityName: 'Dr. Stephen Strange',
      accent: '#4fc3f7',
      stats: { strength: 4, speed: 8, intelligence: 10, durability: 5, power: 10, combat: 7 },
      quotes: ['"Dormammu, I\'ve come to bargain."'],
      brief: 'Sorcerer Supreme and keeper of the New York Sanctum. Led the defense against Dormammu and Thanos. Manages multiversal threats across fractured timelines.'
    },
    {
      id: 'captain-marvel', num: 'AV-012', name: 'CAPTAIN MARVEL', realName: 'Carol Danvers',
      aliases: ['The Most Powerful Avenger', 'Vers'],
      title: 'Cosmic Avenger / Binary Hero',
      description: 'Former USAF pilot fused with Kree DNA through a Light-Speed Engine explosion. Carol Danvers became the most powerful superhero in the galaxy, capable of interstellar travel.',
      abilities: ['Photon Blasts', 'FTL Flight', 'Kree Physiology', 'Energy Absorption', 'Binary Mode', 'Superhuman Strength'],
      teams: ['avengers'], categories: 'avengers',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-199999'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'MARVEL SUPER-HEROES #13 — 1967',
      movieAppearances: ['cm', 'eg'],
      relatedCharacters: ['iron-man', 'captain-america', 'thor', 'black-panther'],
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Cosplay_of_Captain_Marvel_at_Brussels_Comic_Con_2019_%2832358693777%29.jpg/500px-Cosplay_of_Captain_Marvel_at_Brussels_Comic_Con_2019_%2832358693777%29.jpg',
      identityImage: null,
      identityName: 'Carol Danvers',
      accent: '#1a6bff',
      stats: { strength: 9, speed: 10, intelligence: 7, durability: 9, power: 10, combat: 8 },
      quotes: ['"Higher, further, faster, baby."'],
      brief: 'The most powerful hero in the MCU. Single-handedly destroyed Thanos\'s flagship. Patrolling deep space handling cosmic-level threats. Her binary form releases energy equivalent to a stellar explosion.'
    },
    {
      id: 'ant-man', num: 'AV-013', name: 'ANT-MAN', realName: 'Scott Lang',
      aliases: ['The Tiny Titan', 'Giant-Man'],
      title: 'Avenger / Quantum Realm Survivor',
      description: 'A reformed burglar and electrical engineer who inherited the Ant-Man suit from Hank Pym. Scott Lang can shrink to subatomic size and played a pivotal role in defeating Thanos.',
      abilities: ['Size Manipulation', 'Giant-Man Mode', 'Ant Communication', 'Quantum Realm Access', 'Pym Particle Tech', 'Electronics Expertise'],
      teams: ['avengers'], categories: 'avengers street',
      universe: 'Earth-616', relatedUniverses: ['avengers', 'earth-199999', 'multiverse'],
      status: 'active', statusLabel: 'ACTIVE',
      firstAppearance: 'AVENGERS #181 — 1979',
      movieAppearances: ['amq', 'civilwar', 'eg'],
      relatedCharacters: ['iron-man', 'captain-america', 'black-widow', 'thor'],
      heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/D23_Expo_2015_Ant-Man_%282%29.jpg/500px-D23_Expo_2015_Ant-Man_%282%29.jpg',
      identityImage: null,
      identityName: 'Scott Lang',
      accent: '#e23636',
      stats: { strength: 6, speed: 7, intelligence: 8, durability: 5, power: 7, combat: 6 },
      quotes: ['"It\'s about time. For ants."'],
      brief: 'The unsung hero who made time travel possible. Was trapped in the Quantum Realm for five years. Now navigating the consequences of the multiverse with his daughter Cassie.'
    }
  ];

  function search(q) {
    var query = (q || '').trim().toLowerCase();
    if (!query) return { characters: [], movies: [], universes: [] };
    function has(str) { return str.toLowerCase().indexOf(query) !== -1; }
    return {
      characters: CHARACTERS.filter(function (c) {
        if (has(c.name) || has(c.realName) || has(c.title) || has(c.universe) || has(c.description)) return true;
        if (c.aliases.some(has)) return true;
        if (c.abilities.some(has)) return true;
        if (c.teams.some(has)) return true;
        var unis = c.relatedUniverses.map(function (id) { return id.replace(/-/g, ' '); });
        return unis.some(has);
      }).slice(0, 5),
      movies: MOVIES.filter(function (m) {
        return has(m.title) || has(m.phase) || has(m.desc) || m.year === query;
      }).slice(0, 4),
      universes: UNIVERSES.filter(function (u) {
        return has(u.name) || has(u.tag) || has(u.desc);
      }).slice(0, 3)
    };
  }

  function universeById(id) {
    return UNIVERSES.filter(function (u) { return u.id === id; })[0] || null;
  }

  function movieById(id) {
    return MOVIES.filter(function (m) { return m.id === id; })[0] || null;
  }

  return {
    characters: CHARACTERS,
    movies: MOVIES,
    universes: UNIVERSES,
    search: search,
    universeById: universeById,
    movieById: movieById
  };
})();
