'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import confetti from 'canvas-confetti'

export default function ResultsPage() {
  const router = useRouter()

  const {
    playerName,
    playerRegion,
    game1Score,
    game2Score,
    totalScore,
    saveResults,
    reset,
  } = useGameStore()

  const hasAttemptedSave = useRef(false)
  const hasPlayedConfetti = useRef(false)

  // 🔢 Animated total score
  const [animatedScore, setAnimatedScore] = useState(0)

  // ✅ Save results (UNCHANGED)
  useEffect(() => {
    if (hasAttemptedSave.current) return
    hasAttemptedSave.current = true
    saveResults()
  }, [saveResults])

  // 🎉 Confetti celebration
  useEffect(() => {
    if (hasPlayedConfetti.current) return
    hasPlayedConfetti.current = true

    const duration = 2200
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ['#c9a24d', '#ffffff', '#7c3aed'],
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ['#c9a24d', '#ffffff', '#7c3aed'],
      })

      if (Date.now() < end) requestAnimationFrame(frame)
    }

    frame()
  }, [])

  // 🔢 Score count-up animation
  useEffect(() => {
    let start = 0
    const duration = 900
    const startTime = performance.now()

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1)
      setAnimatedScore(Math.floor(progress * totalScore))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [totalScore])

  const handleHome = () => {
    reset()
    router.push('/')
  }

  const handleLeaderboard = () => {
    router.push('/score')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4 overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-30%] left-1/4 w-[600px] h-[600px] bg-amber-500/20 blur-[160px]" />
        <div className="absolute bottom-[-30%] right-1/4 w-[600px] h-[600px] bg-purple-700/20 blur-[180px]" />
      </div>

      {/* RESULTS CARD — ANIMATED */}
      <div
        className="
          w-full max-w-5xl rounded-[32px]
          bg-white/[0.06] backdrop-blur-2xl
          border border-white/10
          shadow-[0_40px_120px_rgba(0,0,0,0.9)]
          px-12 py-12
          animate-[fadeInScale_0.8s_ease-out]
        "
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            Game Complete
          </h1>
          <p className="text-sm tracking-widest uppercase text-amber-400">
            Faith Recall — Results
          </p>
        </div>

        {/* Player info */}
        <div className="text-center mb-10">
          <p className="text-2xl font-bold text-white">{playerName}</p>
          <p className="text-lg text-white/60">{playerRegion}</p>
        </div>

        {/* Scores */}
        <div className="space-y-8 mb-10">
          <div className="flex justify-between items-center">
            <span className="text-lg text-white/70">Saints Memory Match</span>
            <span className="text-2xl font-bold text-white">
              {game1Score.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg text-white/70">Emoji Bible Quiz</span>
            <span className="text-2xl font-bold text-white">
              {game2Score.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-white/10 pt-8 flex justify-between items-center">
            <span className="text-2xl font-bold text-white">Total Score</span>
            <span className="text-5xl font-extrabold text-amber-400 tabular-nums">
              {animatedScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-8 animate-[fadeIn_1.2s_ease-out]">
          <button
            onClick={handleHome}
            className="flex-1 rounded-xl py-6 text-lg font-bold bg-white/10 text-white hover:bg-white/20 transition"
          >
            Home
          </button>

          <button
            onClick={handleLeaderboard}
            className="flex-1 rounded-xl py-6 text-lg font-bold bg-amber-500 text-black hover:bg-amber-400 transition"
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Tailwind keyframes */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
