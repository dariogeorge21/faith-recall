'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import NumericKeypad from '@/components/NumericKeypad'
import { LucideShieldCheck } from 'lucide-react'

export default function VerifyCodePage() {
  const router = useRouter()
  const { securityCode } = useGameStore()

  const [code, setCode] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')

  const handleDigitClick = (digit: string) => {
    if (code.length < 6) {
      setCode(prev => prev + digit)
      setError('')
    }
  }

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1))
    setError('')
  }

  const handleClear = () => {
    setCode('')
    setError('')
  }

  const triggerPunishment = () => {
    // punishment happens BEFORE score,
    // but navigation still goes to score
    useGameStore.getState().setIsPunished(true)
    router.push('/score')
  }

  const handleVerify = useCallback(() => {
    if (code.length !== 6) return

    if (code === securityCode) {
      // ✅ correct → results → leaderboard
      router.push('/results')
    } else {
      setAttempts(prev => {
        const next = prev + 1

        if (next >= 2) {
          // ❌ wrong twice → punishment → score
          triggerPunishment()
        } else {
          setError('Incorrect code. One attempt left.')
          setCode('')
        }

        return next
      })
    }
  }, [code, securityCode, router])

  useEffect(() => {
    if (code.length === 6) {
      const t = setTimeout(handleVerify, 300)
      return () => clearTimeout(t)
    }
  }, [code, handleVerify])

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#020617] overflow-hidden">
      <div className="w-full max-w-4xl h-[88vh] flex flex-col bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] px-12 py-10 shadow-2xl">

        {/* HEADER */}
        <div className="shrink-0 flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#c9a24d]/10 rounded-[24px] flex items-center justify-center border border-[#c9a24d]/20 mb-4">
            <LucideShieldCheck className="w-8 h-8 text-[#c9a24d]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Identity Check
          </h1>
          <p className="text-[#c9a24d]/40 text-xs uppercase tracking-[0.4em] font-bold mt-1">
            Sacred 6-Digit Cipher
          </p>
        </div>

        {/* PIN DISPLAY */}
        <div className="shrink-0 flex justify-center gap-3 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-16 h-20 rounded-[20px] flex items-center justify-center border-2 ${i < code.length
                  ? 'border-[#c9a24d] bg-[#c9a24d]/10'
                  : 'border-white/5 bg-white/[0.01]'
                }`}
            >
              <div
                className={`rounded-full ${i < code.length
                    ? 'w-2 h-2 bg-[#c9a24d]'
                    : 'w-1 h-1 bg-white/10'
                  }`}
              />
            </div>
          ))}
        </div>

        {/* ERROR (FIXED HEIGHT) */}
        <div className="shrink-0 h-[48px] mb-3 flex items-center justify-center">
          {error && (
            <div className="w-full text-center px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-[0.2em] font-bold">
              {error}
            </div>
          )}
        </div>

        {/* KEYPAD */}
        <div className="flex-1 flex items-center justify-center">
          <NumericKeypad
            onDigitClick={handleDigitClick}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        </div>

        {/* FORGOTTEN */}
        <div className="shrink-0 mt-4 text-center">
          <button
            type="button"
            onClick={triggerPunishment}
            className="text-white/20 hover:text-[#c9a24d]/60 text-[9px] uppercase tracking-[0.5em] font-black transition-colors"
          >
            Forgotten the Sacred Code?
          </button>
        </div>

      </div>
    </div>
  )
}
