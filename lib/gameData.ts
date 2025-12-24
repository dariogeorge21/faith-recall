export interface Saint {
  id: number
  name: string
  image: string
}

export interface QuizQuestion {
  id: number
  emojis: string[]
  question: string
  options: { label: string; text: string }[]
  correctAnswer: string
}

export const SAINTS_DATA: Saint[] = [
  { id: 1, name: 'Saint Peter', image: '/images/saints/st.peter.png' },
  { id: 2, name: 'Saint Sebastian', image: '/images/saints/st.sebastian.png' },
  { id: 3, name: 'Saint Francis of Assisi', image: '/images/saints/st.francis.png' },
  { id: 4, name: 'Saint Thérèse of Lisieux', image: '/images/saints/st.therese.png' },
  { id: 5, name: 'Saint Matthew', image: '/images/saints/st.matthew.png' },
  { id: 6, name: 'Saint Mark', image: '/images/saints/st.mark.png' },
  { id: 7, name: 'Saint Luke', image: '/images/saints/st.luke.png' },
  { id: 8, name: 'Saint John the Evangelist', image: '/images/saints/st.john.png' },
  { id: 9, name: 'Saint Paul', image: '/images/saints/st.paul.png' },
  { id: 10, name: 'Saint Joseph', image: '/images/saints/st.joseph.png' },
]


export const BIBLE_QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    emojis: ['🌊', '➗', '➡️', '🚶‍♂️'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'Jonah and the Whale' },
      { label: 'B', text: 'Moses parts the Red Sea' },
      { label: 'C', text: 'Noah\'s Ark' },
      { label: 'D', text: 'Jesus Walks on Water' }
    ],
    correctAnswer: 'B'
  },
  {
    id: 2,
    emojis: ['🌍', '🌳', '🍎', '🐍'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'The Garden of Eden' },
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
      { label: 'A', text: 'David and Goliath' },
      { label: 'B', text: 'Samson and Delilah' },
      { label: 'C', text: 'Daniel in the Lion\'s Den' },
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
      { label: 'B', text: 'Feeding of the 5000' },
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
      { label: 'A', text: 'Jonah and the Whale' },
      { label: 'B', text: 'Noah\'s Ark' },
      { label: 'C', text: 'Paul\'s Shipwreck' },
      { label: 'D', text: 'Jesus Calms the Storm' }
    ],
    correctAnswer: 'A'
  },
  {
    id: 6,
    emojis: ['🏠', '👨‍👩‍👧‍👦', '🎁', '👶'],
    question: 'What is the story?',
    options: [
      { label: 'A', text: 'The Birth of Jesus' },
      { label: 'B', text: 'The Prodigal Son' },
      { label: 'C', text: 'The Good Samaritan' },
      { label: 'D', text: 'The Nativity' }
    ],
    correctAnswer: 'D'
  },
]

