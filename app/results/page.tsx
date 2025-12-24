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

  const [saving, setSaving] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const total = calculateTotalScore()

    const saveScore = async () => {
      try {
        const { error } = await supabase.from('players').insert({
          name: playerName,
          region: playerRegion,
          score: total,
        })

        if (error) throw error
      } catch (err) {
        console.error(err)
        setSaveError('Could not save score. Please try again later.')
      } finally {
        setSaving(false)
      }
    }

    saveScore()
  }, [playerName, playerRegion, calculateTotalScore])

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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
            Game Complete
          </h1>
          <p className="text-sm tracking-widest uppercase text-amber-400">
            Faith Recall — Results
          </p>
        </div>

        {/* Player Info */}
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-white">{playerName}</p>
          <p className="text-sm text-white/60">{playerRegion}</p>
        </div>

        {/* Scores */}
        <div className="space-y-4 mb-6">
          <ScoreRow label="Saints Memory Match" value={game1Score} />
          <ScoreRow label="Emoji Bible Quiz" value={game2Score} />

          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-white">Total Score</span>
            <span className="text-3xl font-extrabold text-amber-400">
              {Math.max(0, totalScore).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Save Status */}
        <div className="text-center mb-6">
          {saving && (
            <p className="text-sm text-white/60 animate-pulse">
              Saving score to leaderboard…
            </p>
          )}

          {!saving && !saveError && (
            <p className="text-sm text-green-400 font-semibold">
              ✓ Score saved successfully
            </p>
          )}

          {saveError && (
            <p className="text-sm text-red-400 font-semibold">
              {saveError}
            </p>
          )}
        </div>

        {/* Actions */}
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

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-white/70">{label}</span>
      <span className="text-lg font-bold text-white">
        {Math.max(0, value).toLocaleString()}
      </span>
    </div>
  )
}
