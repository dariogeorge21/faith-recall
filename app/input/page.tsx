'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import VoiceNameInput from '@/components/VoiceNameInput'
import StateSelector from '@/components/StateSelector'

export default function InputPage() {
  const router = useRouter()

  const setPlayerName = useGameStore((state) => state.setPlayerName)
  const setPlayerRegion = useGameStore((state) => state.setPlayerRegion)
  const reset = useGameStore((state) => state.reset)

  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
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
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-8">

      {/* MAIN CARD */}
      <div
        className="
          w-full max-w-5xl h-[88vh]
          flex flex-col
          rounded-[40px]
          bg-white/[0.06]
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_60px_160px_rgba(0,0,0,0.85)]
          px-16 py-12
          animate-cardEnter
        "
      >
        {/* HEADER */}
        <div className="shrink-0 text-center mb-8 animate-fadeDown">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            We want to know you
          </h1>
          <p className="mt-2 text-base text-white/70">
            Prepare for the challenge!
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">

          {/* NAME */}
          <div className="shrink-0 animate-fadeUp delay-100">
            <label className="block text-base text-white/70 mb-3">
              Player Name
            </label>
            <VoiceNameInput value={name} onChange={setName} />
            <p className="mt-2 text-sm text-purple-400">
              Keyboard mode active
            </p>
          </div>

          {/* REGION */}
          <div className="flex-1 flex flex-col overflow-hidden animate-fadeUp delay-200">
            <label className="block text-base text-white/70 mb-3 shrink-0">
              Region (State)
            </label>

            <div className="flex-1 overflow-y-auto pr-2 rounded-xl">
              <StateSelector value={region} onChange={setRegion} />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="shrink-0 rounded-xl bg-red-500/15 border border-red-400/30 p-4 text-center text-sm text-red-300 animate-shake">
              {error}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="shrink-0 pt-6 animate-fadeUp delay-300">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`
              w-full rounded-xl py-6 text-xl font-semibold tracking-wide
              transition-all duration-200
              ${
                canStart
                  ? 'bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.01] animate-softPulse'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }
            `}
          >
            Start Game
          </button>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        @keyframes softPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(251,191,36,0); }
          50% { box-shadow: 0 0 32px rgba(251,191,36,0.35); }
        }

        .animate-cardEnter {
          animation: cardEnter 0.6s ease-out forwards;
        }

        .animate-fadeDown {
          animation: fadeDown 0.5s ease-out forwards;
        }

        .animate-fadeUp {
          animation: fadeUp 0.5s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .animate-softPulse {
          animation: softPulse 2.5s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  )
}
