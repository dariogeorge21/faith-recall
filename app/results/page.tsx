'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function ResultsPage() {
  const router = useRouter()
  
  // Extract state and actions from the store
  const {
    playerName,
    playerRegion,
    game1Score,
    game2Score,
    totalScore,
    saveResults,
    reset,
  } = useGameStore()

  // LIFECYCLE GUARD: This prevents the function from running more than once
  const hasAttemptedSave = useRef(false)

  useEffect(() => {
    const handleSave = async () => {
      // If we already tried to save in this component session, stop immediately
      if (hasAttemptedSave.current) return
      
      hasAttemptedSave.current = true
      
      // Use the protected action from your store
      await saveResults()
    }

    handleSave()
  }, [saveResults])

  const handleHome = () => {
    reset()
    router.push('/')
  }

  const handleLeaderboard = () => {
    router.push('/score')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-30%] left-1/4 w-[600px] h-[600px] bg-amber-500/20 blur-[160px]" />
        <div className="absolute bottom-[-30%] right-1/4 w-[600px] h-[600px] bg-purple-700/20 blur-[180px]" />
      </div>

      <div className="w-full max-w-xl rounded-[32px] bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.9)] px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
            Game Complete
          </h1>
          <p className="text-sm tracking-widest uppercase text-amber-400">
            Faith Recall — Results
          </p>
        </div>

        <div className="text-center mb-6">
          <p className="text-xl font-bold text-white">{playerName}</p>
          <p className="text-sm text-white/60">{playerRegion}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Saints Memory Match</span>
            <span className="text-lg font-bold text-white">{game1Score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Emoji Bible Quiz</span>
            <span className="text-lg font-bold text-white">{game2Score.toLocaleString()}</span>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-white">Total Score</span>
            <span className="text-3xl font-extrabold text-amber-400">
              {totalScore.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleHome}
            className="flex-1 rounded-xl py-3 font-bold bg-white/10 text-white hover:bg-white/20 transition"
          >
            Home
          </button>

          <button
            onClick={handleLeaderboard}
            className="flex-1 rounded-xl py-3 font-bold bg-amber-500 text-black hover:bg-amber-400 transition"
          >
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}