import { create } from 'zustand'

interface GameState {
  // Session (IMPORTANT for leaderboard)
  sessionId: string

  // Player info
  playerName: string
  playerRegion: string
  securityCode: string

  // Game 1 state
  game1Score: number
  game1Matches: number
  game1Combo: number

  // Game 2 state
  game2Score: number
  game2Answers: number

  // Total score
  totalScore: number

  // Actions
  setPlayerName: (name: string) => void
  setPlayerRegion: (region: string) => void
  setSecurityCode: (code: string) => void
  addGame1Score: (points: number) => void
  addGame1Penalty: (points: number) => void
  incrementGame1Combo: () => void
  resetGame1Combo: () => void
  addGame2Score: (points: number) => void
  calculateTotalScore: () => number
  reset: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  sessionId: crypto.randomUUID(),

  playerName: '',
  playerRegion: '',
  securityCode: '',

  game1Score: 0,
  game1Matches: 0,
  game1Combo: 0,

  game2Score: 0,
  game2Answers: 0,

  totalScore: 0,

  // Actions
  setPlayerName: (name) => set({ playerName: name }),
  setPlayerRegion: (region) => set({ playerRegion: region }),
  setSecurityCode: (code) => set({ securityCode: code }),

  addGame1Score: (points) =>
    set((state) => ({
      game1Score: Math.max(0, state.game1Score + points),
      game1Matches: state.game1Matches + 1,
    })),

  addGame1Penalty: (points) =>
    set((state) => ({
      game1Score: Math.max(0, state.game1Score - points),
    })),

  incrementGame1Combo: () =>
    set((state) => ({
      game1Combo: Math.min(5, state.game1Combo + 1),
    })),

  resetGame1Combo: () => set({ game1Combo: 0 }),

  addGame2Score: (points) =>
    set((state) => ({
      game2Score: state.game2Score + points,
      game2Answers: state.game2Answers + 1,
    })),

  calculateTotalScore: () => {
    const state = get()
    const total = Math.max(0, state.game1Score + state.game2Score)
    set({ totalScore: total })
    return total
  },

  reset: () =>
    set({
      sessionId: crypto.randomUUID(), // NEW SESSION for next player

      playerName: '',
      playerRegion: '',
      securityCode: '',

      game1Score: 0,
      game1Matches: 0,
      game1Combo: 0,

      game2Score: 0,
      game2Answers: 0,

      totalScore: 0,
    }),
}))
