'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import VoiceNameInput from '@/components/VoiceNameInput'
import StateSelector from '@/components/StateSelector'

export default function InputPage() {
  const router = useRouter()
  const { setPlayerName, setPlayerRegion } = useGameStore()

  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    useGameStore.getState().reset()
  }, [])

  const handleStart = () => {
    if (!name.trim()) return setError('Please enter your name')
    if (!region) return setError('Please select your state')

    setPlayerName(name.trim())
    setPlayerRegion(region)
    router.push('/security-code')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4">

      <div className="w-full max-w-md rounded-[30px] bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.9)] px-6 py-8">

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-extrabold text-white">Profile Setup</h1>
          <p className="mt-1 text-xs tracking-widest uppercase text-amber-400">
            ✨ Prepare for the challenge ✨
          </p>
        </div>

        {/* Name */}
        <div className="mb-6">
          <p className="text-sm text-white/70 mb-2">Player Name</p>
          <VoiceNameInput value={name} onChange={setName} />
        </div>

        {/* State */}
        <div className="mb-6">
          <p className="text-sm text-white/70 mb-2">Region (State)</p>
          <div className="max-h-[220px] overflow-y-auto pr-1">
            <StateSelector value={region} onChange={setRegion} />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!name || !region}
          className={`w-full mt-2 rounded-xl py-4 font-bold tracking-wide transition
            ${
              name && region
                ? 'bg-amber-500 text-black hover:bg-amber-400'
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
