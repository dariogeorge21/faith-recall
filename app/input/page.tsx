'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import VoiceNameInput from '@/components/VoiceNameInput'
import StateSelector from '@/components/StateSelector'

export default function InputPage() {
  const router = useRouter()
  
  // FIXED: Using selectors ensures actions are correctly mapped and stable
  const setPlayerName = useGameStore((state) => state.setPlayerName)
  const setPlayerRegion = useGameStore((state) => state.setPlayerRegion)
  const reset = useGameStore((state) => state.reset)

  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Standard practice to clear previous session data on mount
    reset()
  }, [reset])

  const handleStart = () => {
    if (!name.trim()) return setError('Please enter your name')
    if (!region) return setError('Please select your state')

    setPlayerName(name.trim())
    setPlayerRegion(region)
    router.push('/security-code')
  }

  const canStart = name && region

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4">

      {/* Animated Card */}
      <div className="animate-fade-up w-full max-w-md rounded-[32px] bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_50px_140px_rgba(0,0,0,0.85)] px-7 py-9">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Profile Setup
          </h1>
          <p className="mt-2 text-xs tracking-[0.35em] uppercase text-amber-400">
            Prepare for the Challenge
          </p>
        </div>

        {/* Player Name */}
        <div className="mb-7">
          <label className="block text-sm text-white/70 mb-2">
            Player Name
          </label>
          {/* Passing local state setter to ensure keyboard typing works instantly */}
          <VoiceNameInput value={name} onChange={setName} />
        </div>

        {/* Region */}
        <div className="mb-7">
          <label className="block text-sm text-white/70 mb-2">
            Region (State)
          </label>
          <div className="max-h-[200px] overflow-y-auto pr-1 rounded-lg">
            <StateSelector value={region} onChange={setRegion} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-500/15 border border-red-400/30 p-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`
            w-full rounded-xl py-4 font-bold tracking-wide transition-all duration-200
            ${
              canStart
                ? 'bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.02] animate-pulse-soft'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }
          `}
        >
          Start Game
        </button>

      </div>
    </div>
  )
}