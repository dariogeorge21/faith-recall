import { create } from 'zustand'
import { supabase } from '@/lib/supabase' // Adjust path if necessary

interface GameState {
  // Session & Submission status
  sessionId: string
  isSubmitting: boolean
  hasSaved: boolean

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
  saveResults: () => Promise<{ success: boolean; error?: any }>
  reset: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36),
  isSubmitting: false,
  hasSaved: false,

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

  // NEW: Save Results logic with double-entry protection
  saveResults: async () => {
    const state = get()

    // 1. Guard: If already submitting or already saved, STOP.
    if (state.isSubmitting || state.hasSaved) {
      return { success: false, error: 'Already submitted' }
    }

    // 2. Guard: Don't save empty/invalid players
    if (!state.playerName || state.playerName.trim() === '') {
      return { success: false, error: 'No player name' }
    }

    set({ isSubmitting: true })

    try {
      const finalScore = state.game1Score + state.game2Score
      
      const { error } = await supabase
        .from('players')
        .insert([
          {
            name: state.playerName,
            region: state.playerRegion,
            score: finalScore,
          },
        ])

      if (error) throw error

      // 3. Mark as successfully saved
      set({ hasSaved: true, isSubmitting: false })
      return { success: true }
    } catch (error) {
      console.error('Leaderboard Save Error:', error)
      set({ isSubmitting: false })
      return { success: false, error }
    }
  },

  reset: () =>
    set({
      sessionId: typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36),
      isSubmitting: false,
      hasSaved: false,

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