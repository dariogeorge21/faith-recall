// lib/gameData.ts

export interface Saint {
  id: number
  name: string
  image: string
}

export interface QuizQuestion {
  id: number
  emojis: string[] // Renamed from 'emojis' to 'clue' for simplicity in new data
  question: string
  options: { label: string; text: string }[]
  correctAnswer: string // e.g., 'A', 'B', 'C', or 'D'
}

// Updated list: Only includes the 6 newly uploaded saints
export const SAINTS_DATA: Saint[] = [
  { id: 1, name: 'Saint Carlo Acutis', image: '/images/saints/st.carlo.jpg' },
  { id: 2, name: 'Saint Francisco Marto', image: '/images/saints/st.francisco.jpg' },
  { id: 3, name: 'Saint Jacinta Marto', image: '/images/saints/st.jacinta.jpg' },
  { id: 4, name: 'Saint Maria Goretti', image: '/images/saints/st.mariagoretti.jpg' },
  { id: 5, name: 'Saint Pedro Calungsod', image: '/images/saints/st.pedro.jpg' },
  { id: 6, name: 'Saint Rose of Lima', image: '/images/saints/st.rose.jpg' },
]

// --- FULL 50 MULTIPLE-CHOICE QUIZ DATA ---
export const BIBLE_QUIZ_DATA: QuizQuestion[] = [
  // Existing 6 questions (IDs 1-6)
  {
    id: 1,
    emojis: ['🌊', '➗', '➡️', '🚶‍♂️'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'Jonah and the Whale' },
      { label: 'B', text: 'Moses parts the Red Sea' }, // Existing Correct Answer
      { label: 'C', text: "Noah's Ark" },
      { label: 'D', text: 'Jesus Walks on Water' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 2,
    emojis: ['🌍', '🌳', '🍎', '🐍'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'The Garden of Eden' }, // Existing Correct Answer
      { label: 'B', text: 'The Tower of Babel' },
      { label: 'C', text: 'The Flood' },
      { label: 'D', text: 'The Exodus' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 3,
    emojis: ['👦', '🪨', '🎯', '👹'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'David and Goliath' }, // Existing Correct Answer
      { label: 'B', text: 'Samson and Delilah' },
      { label: 'C', text: "Daniel in the Lion's Den" },
      { label: 'D', text: 'Joshua and the Battle of Jericho' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 4,
    emojis: ['🍞', '🐟', '👥', '✋'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'The Last Supper' },
      { label: 'B', text: 'Feeding of the 5000' }, // Existing Correct Answer
      { label: 'C', text: 'The Wedding at Cana' },
      { label: 'D', text: 'The Parable of the Loaves' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 5,
    emojis: ['🚢', '🌊', '🐋', '🙏'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'Jonah and the Whale' }, // Existing Correct Answer
      { label: 'B', text: "Noah's Ark" },
      { label: 'C', text: "Paul's Shipwreck" },
      { label: 'D', text: 'Jesus Calms the Storm' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 6,
    emojis: ['🏠', '👨‍👩‍👧‍👦', '🎁', '👶'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'The Birth of Jesus' }, // Existing Correct Answer
      { label: 'B', text: 'The Prodigal Son' },
      { label: 'C', text: 'The Good Samaritan' },
      { label: 'D', text: 'The Nativity' }
    ],
    correctAnswer: 'A'
  },
  // --- New Questions Q7 - Q50 (Using the data we generated) ---
  {
    id: 7,
    emojis: ['🌟', '👶', '🐐', '🎁'],
    question: 'The Magi brought which three gifts to the Christ child?',
    options: [
      { label: 'A', text: 'Gold, Frankincense, and Myrrh' },
      { label: 'B', text: 'Silver, Oil, and Incense' },
      { label: 'C', text: 'Jewels, Silk, and Wine' },
      { label: 'D', text: 'Spices, Cedar, and Coins' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 8,
    emojis: ['🎣', '🚶‍♂️', '➡️', '🧍‍♂️'],
    question: 'Which event involves Jesus telling fishermen to become "fishers of men"?',
    options: [
      { label: 'A', text: 'Calling of the first disciples' },
      { label: 'B', text: 'Feeding of the 5,000' },
      { label: 'C', text: 'Sermon on the Mount' },
      { label: 'D', text: 'Parable of the Sower' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 9,
    emojis: ['🍇', '💧', '🍷', '🎉'],
    question: 'Where did Jesus perform His first miracle, changing water into wine?',
    options: [
      { label: 'A', text: 'Wedding at Cana' },
      { label: 'B', text: 'Healing the paralytic' },
      { label: 'C', text: 'Raising of Lazarus' },
      { label: 'D', text: 'Last Supper' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 10,
    emojis: ['🥖', '🐟', '5000', '👤'],
    question: 'The miracle of multiplying 5 loaves and 2 fish fed approximately how many people?',
    options: [
      { label: 'A', text: 'Feeding of the 5,000' },
      { label: 'B', text: 'Loaves and Fishes for 4,000' },
      { label: 'C', text: 'Miraculous Catch of Fish' },
      { label: 'D', text: 'Bread from Heaven' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 11,
    emojis: ['🌩️', '🌊', '🛥️', '🛌'],
    question: 'What miracle did Jesus perform after the disciples panicked on the sea?',
    options: [
      { label: 'A', text: 'Jesus calming the storm' },
      { label: 'B', text: 'Walking on Water' },
      { label: 'C', text: 'The Centurion\'s Servant' },
      { label: 'D', text: 'Cleansing the Temple' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 12,
    emojis: ['💰', '🌳', '📉'],
    question: 'Who was the short tax collector who climbed a sycamore tree to see Jesus?',
    options: [
      { label: 'A', text: 'Zacchaeus the tax collector' },
      { label: 'B', text: 'Matthew the Tax Collector' },
      { label: 'C', text: 'Judas Iscariot' },
      { label: 'D', text: 'Simon the Leper' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 13,
    emojis: ['👨‍⚖️', '🪓', '🌳'],
    question: 'Who baptized Jesus and proclaimed, "Prepare the way of the Lord?"',
    options: [
      { label: 'A', text: 'John the Baptist' },
      { label: 'B', text: 'Peter' },
      { label: 'C', text: 'Elijah' },
      { label: 'D', text: 'Elisha' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 14,
    emojis: ['👂', '🤫', '🗣️'],
    question: 'Which healing involves Jesus placing his fingers in a man\'s ears and saying "Ephphatha?"',
    options: [
      { label: 'A', text: 'Healing the deaf and mute man' },
      { label: 'B', text: 'Healing a blind man' },
      { label: 'C', text: 'Raising of Jairus\' Daughter' },
      { label: 'D', text: 'Casting out demons' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 15,
    emojis: ['⛰️', '📜', '🙏'],
    question: 'Where did Jesus deliver the Beatitudes?',
    options: [
      { label: 'A', text: 'Sermon on the Mount' },
      { label: 'B', text: 'Transfiguration' },
      { label: 'C', text: 'Prayer in Gethsemane' },
      { label: 'D', text: 'Calling of Moses' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 16,
    emojis: ['🐐', '🐑', 'گمشدہ'],
    question: 'Which parable illustrates God\'s pursuit of a single soul that has strayed?',
    options: [
      { label: 'A', text: 'Parable of the Lost Sheep' },
      { label: 'B', text: 'Parable of the Unmerciful Servant' },
      { label: 'C', text: 'Parable of the Sower' },
      { label: 'D', text: 'Parable of the Rich Fool' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 17,
    emojis: ['🛢️', '💰', '💔', '🏡'],
    question: 'In which parable does a son demand his inheritance, waste it, and return home poor?',
    options: [
      { label: 'A', text: 'Parable of the Prodigal Son' },
      { label: 'B', text: 'Parable of the Ten Talents' },
      { label: 'C', text: 'Parable of the Rich Fool' },
      { label: 'D', text: 'Parable of the Good Shepherd' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 18,
    emojis: ['✝️', '👑', '🌵'],
    question: 'Which event symbolizes the humiliation of Jesus before the crucifixion?',
    options: [
      { label: 'A', text: 'The Crowning with Thorns' },
      { label: 'B', text: 'The Scourging' },
      { label: 'C', text: 'The Mocking of Jesus' },
      { label: 'D', text: 'The Crucifixion' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 19,
    emojis: ['🤝', '🦶', '🧼'],
    question: 'What humble act did Jesus perform for His disciples at the Last Supper?',
    options: [
      { label: 'A', text: 'The Washing of the Disciples\' Feet' },
      { label: 'B', text: 'The Last Supper' },
      { label: 'C', text: 'The Ascension' },
      { label: 'D', text: 'The Anointing at Bethany' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 20,
    emojis: ['🪦', '🚪', '☀️'],
    question: 'Which event is the foundation of the Christian faith, proving Jesus\' divinity?',
    options: [
      { label: 'A', text: 'The Resurrection' },
      { label: 'B', text: 'The Ascension' },
      { label: 'C', text: 'The Agony in the Garden' },
      { label: 'D', text: 'Pentecost' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 21,
    emojis: ['😇', '✉️', '👧', '🤰'],
    question: 'The Angel Gabriel\'s announcement to Mary is known as the...?',
    options: [
      { label: 'A', text: 'The Annunciation' },
      { label: 'B', text: 'The Visitation' },
      { label: 'C', text: 'The Presentation' },
      { label: 'D', text: 'The Nativity' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 22,
    emojis: ['🧱', '🏠', '🌬️', '🌊'],
    question: 'This parable compares two types of builders based on what their house is built upon.',
    options: [
      { label: 'A', text: 'Parable of the Wise and Foolish Builders' },
      { label: 'B', text: 'Parable of the Sower' },
      { label: 'C', text: 'Parable of the Talents' },
      { label: 'D', text: 'Parable of the Yeast' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 23,
    emojis: ['🤒', '🛌', 'उठो', '!'],
    question: 'Jesus commanded the man to "Take up your mat and go home" after what healing?',
    options: [
      { label: 'A', text: 'Healing of the paralytic' },
      { label: 'B', text: 'Healing of the man born blind' },
      { label: 'C', text: 'Healing of the lepers' },
      { label: 'D', text: 'Raising of Lazarus' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 24,
    emojis: ['🚪', '🚪', '🚪', '🙏'],
    question: 'Jesus said, "______, and it will be given to you; seek, and you will find."',
    options: [
      { label: 'A', text: 'Ask, and it will be given to you' },
      { label: 'B', text: 'Judge not, lest you be judged' },
      { label: 'C', text: 'Love your enemies' },
      { label: 'D', text: 'Do not worry' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 25,
    emojis: ['🕊️', '🔥', '🌬️'],
    question: 'The descent of the Holy Spirit upon the Apostles is celebrated on which feast?',
    options: [
      { label: 'A', text: 'Pentecost' },
      { label: 'B', text: 'The Ascension' },
      { label: 'C', text: 'The Rapture' },
      { label: 'D', text: 'Jesus\' Baptism' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 26,
    emojis: ['🌳', '🔪', '🌿', '✝️'],
    question: 'Which apostle betrayed Jesus for thirty pieces of silver?',
    options: [
      { label: 'A', text: 'Judas Iscariot' },
      { label: 'B', text: 'Caiaphas' },
      { label: 'C', 'text': 'Pontius Pilate' },
      { label: 'D', text: 'Simon Peter' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 27,
    emojis: ['🛣️', '🚑', '🤝'],
    question: 'Which parable teaches us to love and care for strangers, even our enemies?',
    options: [
      { label: 'A', text: 'Parable of the Good Samaritan' },
      { label: 'B', text: 'Parable of the Ten Virgins' },
      { label: 'C', text: 'Parable of the Rich Man and Lazarus' },
      { label: 'D', text: 'Parable of the Vineyard' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 28,
    emojis: ['💰', '🌍', '🗑️'],
    question: 'Jesus advises storing up this kind of wealth, where moths and rust cannot destroy.',
    options: [
      { label: 'A', text: 'Treasure in Heaven' },
      { label: 'B', text: 'Kingdom of God' },
      { label: 'C', text: 'Pearl of Great Price' },
      { label: 'D', text: 'The Widow\'s Mite' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 29,
    emojis: ['🌅', '🐟', '🍖', '🔥'],
    question: 'What did the disciples share with the Risen Christ on the shore of the Sea of Tiberias?',
    options: [
      { label: 'A', text: 'Breakfast by the Sea (Post-Resurrection)' },
      { label: 'B', text: 'Wedding at Cana' },
      { label: 'C', text: 'Miraculous Catch of Fish' },
      { label: 'D', text: 'Last Supper' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 30,
    emojis: ['🧂', '💡'],
    question: 'Jesus famously described his followers as the ______ and the ______.',
    options: [
      { label: 'A', text: 'Salt of the Earth / Light of the World' },
      { label: 'B', text: 'Bread of Life' },
      { label: 'C', text: 'Water of Life' },
      { label: 'D', text: 'Good Shepherd' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 31,
    emojis: ['🪙', '✋'],
    question: 'What phrase did Jesus use when asked about paying taxes to Rome?',
    options: [
      { label: 'A', text: 'Render unto Caesar' },
      { label: 'B', text: 'Pay your taxes' },
      { label: 'C', text: 'The Temple Tax' },
      { label: 'D', text: 'Widow\'s Mite' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 32,
    emojis: ['👰‍♀️', '💡', '😴', '🛌'],
    question: 'Five of the women in this parable were wise and five were foolish.',
    options: [
      { label: 'A', text: 'Parable of the Ten Virgins' },
      { label: 'B', text: 'Parable of the Wedding Feast' },
      { label: 'C', text: 'Parable of the Two Sons' },
      { label: 'D', text: 'Parable of the Yeast' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 33,
    emojis: ['👂', '🔪', '🤕', '🧑‍⚕️'],
    question: 'Which servant of the High Priest had his ear cut off by Peter?',
    options: [
      { label: 'A', text: 'Malchus (Servant whose ear Peter cut off)' },
      { label: 'B', text: 'Barabbas' },
      { label: 'C', text: 'Annas' },
      { label: 'D', text: 'Caiaphas' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 34,
    emojis: ['🏺', '🌊', '🧹', '💦'],
    question: 'What symbolic action did Pilate perform before handing Jesus over for crucifixion?',
    options: [
      { label: 'A', text: 'Ritual Washing of Hands (Pilate\'s act)' },
      { label: 'B', text: 'Cleansing of the Temple' },
      { label: 'C', text: 'Baptism of John' },
      { label: 'D', text: 'Wedding at Cana' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 35,
    emojis: ['🕊️', '🚿', '👑'],
    question: 'What unique event occurred when Jesus was baptized by John?',
    options: [
      { label: 'A', text: 'Jesus\' Baptism (The voice and the dove)' },
      { label: 'B', text: 'The Transfiguration' },
      { label: 'C', text: 'Pentecost' },
      { label: 'D', text: 'The Ascension' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 36,
    emojis: ['👑', 'x3'],
    question: 'Which of the following was NOT one of the gifts brought by the Magi?',
    options: [
      { label: 'A', text: 'Silver' },
      { label: 'B', text: 'Gold' },
      { label: 'C', text: 'Frankincense' },
      { label: 'D', text: 'Myrrh' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 37,
    emojis: ['🧱', '🪨', '🏗️', '🔑'],
    question: 'To which Apostle did Jesus say, "You are Peter, and on this rock I will build my church?"',
    options: [
      { label: 'A', text: 'Peter (The Rock)' },
      { label: 'B', text: 'John' },
      { label: 'C', text: 'James' },
      { label: 'D', text: 'Matthew' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 38,
    emojis: ['🤫', '💰', '🔔'],
    question: 'This teaching warns against performing acts of piety for public praise.',
    options: [
      { label: 'A', text: 'Almsgiving (Do not let your left hand know)' },
      { label: 'B', text: 'Praying in Public' },
      { label: 'C', text: 'Fasting' },
      { label: 'D', text: 'Forgiveness' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 39,
    emojis: ['🪱', '🔥', '💀'],
    question: 'Jesus used the word Gehenna to refer to what place of punishment?',
    options: [
      { label: 'A', text: 'Gehenna (Valley of Hinnom/Hell)' },
      { label: 'B', text: 'Hades' },
      { label: 'C', text: 'Tartarus' },
      { label: 'D', text: 'Limbo' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 40,
    emojis: ['🍇', '🧺', '📦'],
    question: 'Which parable challenges the concept of fairness in receiving God\'s grace?',
    options: [
      { label: 'A', text: 'Parable of the Laborers in the Vineyard' },
      { label: 'B', text: 'Parable of the Unmerciful Servant' },
      { label: 'C', text: 'Parable of the Fig Tree' },
      { label: 'D', text: 'Parable of the Rich Fool' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 41,
    emojis: ['👨‍👧‍👦', 'x2'],
    question: 'A father asks his children to go work in the vineyard in this parable.',
    options: [
      { label: 'A', text: 'Parable of the Two Sons' },
      { label: 'B', text: 'Parable of the Prodigal Son' },
      { label: 'C', text: 'Parable of the Talents' },
      { label: 'D', text: 'Parable of the Lost Sheep' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 42,
    emojis: ['🌾', '🌿', '🔪', '🧺'],
    question: 'This parable explains that evil people (weeds) grow with good people (wheat) until the harvest (end of the age).',
    options: [
      { label: 'A', text: 'Parable of the Weeds (Tares)' },
      { label: 'B', text: 'Parable of the Mustard Seed' },
      { label: 'C', text: 'Parable of the Sower' },
      { label: 'D', text: 'Parable of the Leaven' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 43,
    emojis: ['🤒', '✝️', '🚪'],
    question: 'Whose servant was healed because of his master\'s great faith, even though Jesus did not enter the house?',
    options: [
      { label: 'A', text: 'The Centurion\'s Servant' },
      { label: 'B', text: 'Lazarus' },
      { label: 'C', text: 'Jairus\' Daughter' },
      { label: 'D', text: 'Woman with Hemorrhage' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 44,
    emojis: ['💰', '🌊', '🐟'],
    question: 'Peter found the necessary payment for the Temple Tax in the mouth of a...',
    options: [
      { label: 'A', text: 'Coin in the Fish\'s Mouth' },
      { label: 'B', text: 'Tribute Money' },
      { label: 'C', text: 'Miraculous Catch' },
      { label: 'D', text: 'Selling all possessions' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 45,
    emojis: ['🪢', '⚖️', '❌'],
    question: 'A servant who was forgiven a large debt refuses to forgive a smaller debt in this parable.',
    options: [
      { label: 'A', text: 'Parable of the Unmerciful Servant' },
      { label: 'B', text: 'Parable of the Talents' },
      { label: 'C', text: 'Parable of the Lost Sheep' },
      { label: 'D', text: 'Parable of the Rich Fool' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 46,
    emojis: ['💍', '👠', '🍽️'],
    question: 'The father celebrated his returning son by preparing a feast with the...',
    options: [
      { label: 'A', text: 'The Fatted Calf (Prodigal Son\'s Return)' },
      { label: 'B', text: 'Wedding at Cana' },
      { label: 'C', text: 'Last Supper' },
      { label: 'D', text: 'Feeding of the 5,000' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 47,
    emojis: ['✝️', '👤'],
    question: 'Which man was compelled by the Romans to carry Jesus\' cross?',
    options: [
      { label: 'A', text: 'Simon of Cyrene' },
      { label: 'B', text: 'Joseph of Arimathea' },
      { label: 'C', text: 'Nicodemus' },
      { label: 'D', text: 'Dismas (Good Thief)' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 48,
    emojis: ['💰', '💸', '🕯️'],
    question: 'A woman searches diligently for one missing piece of currency in this parable.',
    options: [
      { label: 'A', text: 'Parable of the Lost Coin' },
      { label: 'B', text: 'Parable of the Hidden Treasure' },
      { label: 'C', text: 'Parable of the Talents' },
      { label: 'D', text: 'Parable of the Pearl' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 49,
    emojis: ['🌅', '👤', '👤', '👤'],
    question: 'Jesus, Moses, and Elijah were seen together in this radiant event.',
    options: [
      { label: 'A', text: 'The Transfiguration' },
      { label: 'B', text: 'Ascension' },
      { label: 'C', text: 'Pentecost' },
      { label: 'D', text: 'Calling of the Twelve' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 50,
    emojis: ['🕳️', '⛓️', '🐷'],
    question: 'Which famous demoniac\'s demons were cast into a herd of swine?',
    options: [
      { label: 'A', text: 'Legion (Gerasene Demoniac)' },
      { label: 'B', text: 'Blind Bartimaeus' },
      { label: 'C', text: 'Woman at the Well' },
      { label: 'D', text: 'Lazarus' }
    ],
    correctAnswer: 'A'
  },
]

// Helper function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to shuffle answer options while maintaining correct answer mapping
const shuffleQuestionOptions = (question: QuizQuestion): QuizQuestion => {
  // Create a copy of the question
  const shuffledQuestion = { ...question };

  // Find the current correct answer text
  const correctOption = question.options.find(opt => opt.label === question.correctAnswer);
  if (!correctOption) return question; // Safety check

  // Shuffle the options array
  const shuffledOptions = shuffleArray(question.options);

  // Reassign labels A, B, C, D to shuffled options
  const relabeledOptions = shuffledOptions.map((opt, index) => ({
    ...opt,
    label: String.fromCharCode(65 + index) // 65 is 'A' in ASCII
  }));

  // Find the new label for the correct answer
  const newCorrectLabel = relabeledOptions.find(opt => opt.text === correctOption.text)?.label || 'A';

  return {
    ...shuffledQuestion,
    options: relabeledOptions,
    correctAnswer: newCorrectLabel
  };
};

// Function to select N random questions from the full list and shuffle their options
export const getRandomQuizQuestions = (count: number = 10): QuizQuestion[] => {
  // 1. Create a shallow copy of the array
  const quizCopy = [...BIBLE_QUIZ_DATA];

  // 2. Shuffle the copy using the Fisher-Yates algorithm
  for (let i = quizCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizCopy[i], quizCopy[j]] = [quizCopy[j], quizCopy[i]];
  }

  // 3. Take the first 'count' elements and shuffle their options
  return quizCopy.slice(0, count).map(shuffleQuestionOptions);
};

// Function to shuffle saints data for Game 1
export const getShuffledSaints = (): Saint[] => {
  return shuffleArray(SAINTS_DATA);
};