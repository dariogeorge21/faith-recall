import { create } from 'zustand'
import { supabase } from '@/lib/supabase' 

interface GameState {
  sessionId: string
  isSubmitting: boolean
  hasSaved: boolean
  playerName: string
  playerRegion: string
  securityCode: string
  game1Score: number
  game1Matches: number
  game1Combo: number
  game2Score: number
  game2Answers: number
  totalScore: number

  setPlayerName: (name: string) => void
  setPlayerRegion: (region: string) => void
  setSecurityCode: (code: string) => void
  addGame1Score: (points: number) => void
  addGame1Penalty: (points: number) => void
  incrementGame1Combo: () => void
  resetGame1Combo: () => void
  addGame2Score: (points: number) => void
  saveResults: () => Promise<{ success: boolean; error?: any }>
  reset: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
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

  setPlayerName: (name) => set({ playerName: name }),
  setPlayerRegion: (region) => set({ playerRegion: region }),
  setSecurityCode: (code) => set({ securityCode: code }),

  // FIX: Automatically update totalScore whenever game1Score changes
  addGame1Score: (points) =>
    set((state) => {
      const newGame1Score = Math.max(0, state.game1Score + points);
      return {
        game1Score: newGame1Score,
        game1Matches: state.game1Matches + 1,
        totalScore: newGame1Score + state.game2Score
      };
    }),

  addGame1Penalty: (points) =>
    set((state) => {
      const newGame1Score = Math.max(0, state.game1Score - points);
      return {
        game1Score: newGame1Score,
        totalScore: newGame1Score + state.game2Score
      };
    }),

  incrementGame1Combo: () =>
    set((state) => ({
      game1Combo: Math.min(5, state.game1Combo + 1),
    })),

  resetGame1Combo: () => set({ game1Combo: 0 }),

  // FIX: Automatically update totalScore whenever game2Score changes
  addGame2Score: (points) =>
    set((state) => {
      const newGame2Score = state.game2Score + points;
      return {
        game2Score: newGame2Score,
        game2Answers: state.game2Answers + 1,
        totalScore: state.game1Score + newGame2Score
      };
    }),

  saveResults: async () => {
    const state = get()
    if (state.isSubmitting || state.hasSaved) return { success: false, error: 'Already submitted' }
    if (!state.playerName || state.playerName.trim() === '') return { success: false, error: 'No player name' }

    set({ isSubmitting: true })

    try {
      // Use the live total for saving
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