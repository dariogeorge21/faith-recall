'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { supabase } from '@/lib/supabase'

export default function ResultsPage() {
  const router = useRouter()
  const {
    playerName,
    playerRegion,
    game1Score,
    game2Score,
    totalScore,
    calculateTotalScore,
    reset,
  } = useGameStore()
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(true)

  useEffect(() => {
    // Calculate total score
    const total = calculateTotalScore()

    // Save to Supabase
    const saveScore = async () => {
      try {
        const { error } = await supabase.from('players').insert({
          name: playerName,
          region: playerRegion,
          score: total,
        })

        if (error) {
          console.error('Error saving score:', error)
          setSaveError('Failed to save score to leaderboard')
        }
      } catch (err) {
        console.error('Error saving score:', err)
        setSaveError('Failed to save score to leaderboard')
      } finally {
        setSaving(false)
      }
    }

    saveScore()
  }, [playerName, playerRegion, calculateTotalScore])

  const handlePlayAgain = () => {
    reset()
    router.push('/')
  }

  const handleViewLeaderboard = () => {
    router.push('/score')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-burgundy-700 mb-4">
            Game Complete!
          </h1>
          <p className="text-2xl md:text-3xl text-gold-600 font-semibold">
            Your Results
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-burgundy-700 mb-2">
                {playerName}
              </p>
              <p className="text-xl md:text-2xl text-burgundy-600">
                {playerRegion}
              </p>
            </div>

            <div className="border-t-2 border-burgundy-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl md:text-2xl font-semibold text-burgundy-700">
                  Game 1 Score:
                </span>
                <span className="text-2xl md:text-3xl font-bold text-burgundy-700">
                  {Math.max(0, game1Score).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xl md:text-2xl font-semibold text-burgundy-700">
                  Game 2 Score:
                </span>
                <span className="text-2xl md:text-3xl font-bold text-burgundy-700">
                  {game2Score.toLocaleString()}
                </span>
              </div>

              <div className="border-t-4 border-gold-500 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl md:text-4xl font-bold text-burgundy-700">
                    Total Score:
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-gold-600">
                    {Math.max(0, totalScore).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {saving && (
              <div className="text-center text-lg text-burgundy-600">
                Saving to leaderboard...
              </div>
            )}

            {saveError && (
              <div className="p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-yellow-700 text-lg font-semibold text-center">
                {saveError}
              </div>
            )}

            {!saving && !saveError && (
              <div className="text-center text-lg text-green-600 font-semibold">
                ✓ Score saved to leaderboard!
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-4 text-xl md:text-2xl font-bold bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all touch-manipulation"
          >
            Play Again
          </button>
          <button
            onClick={handleViewLeaderboard}
            className="flex-1 py-4 text-xl md:text-2xl font-bold bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-all touch-manipulation"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}

