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
    useGameStore.getState().setIsPunished(true)
    router.push('/score')
  }

  const handleVerify = useCallback(() => {
    if (code.length !== 6) return

    if (code === securityCode) {
      router.push('/results')
    } else {
      setAttempts(prev => {
        const next = prev + 1

        if (next >= 2) {
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
      <div className="w-full max-w-3xl h-[82vh] flex flex-col bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[36px] px-10 py-6 shadow-2xl">

        {/* HEADER */}
        <div className="shrink-0 flex flex-col items-center mb-4">
          <div className="w-14 h-14 bg-[#c9a24d]/10 rounded-[20px] flex items-center justify-center border border-[#c9a24d]/20 mb-3">
            <LucideShieldCheck className="w-7 h-7 text-[#c9a24d]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Identity Check
          </h1>
          <p className="text-[#c9a24d]/40 text-[10px] uppercase tracking-[0.35em] font-bold mt-1">
            Sacred 6-Digit Cipher
          </p>
        </div>

        {/* PIN DISPLAY */}
        <div className="shrink-0 flex justify-center gap-2 mb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-14 h-16 rounded-[18px] flex items-center justify-center border-2 ${
                i < code.length
                  ? 'border-[#c9a24d] bg-[#c9a24d]/10'
                  : 'border-white/5 bg-white/[0.01]'
              }`}
            >
              <div
                className={`rounded-full ${
                  i < code.length
                    ? 'w-2 h-2 bg-[#c9a24d]'
                    : 'w-1 h-1 bg-white/10'
                }`}
              />
            </div>
          ))}
        </div>

        {/* ERROR */}
        <div className="shrink-0 h-[40px] mb-2 flex items-center justify-center">
          {error && (
            <div className="w-full text-center px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-[0.2em] font-bold">
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
        <div className="shrink-0 mt-3 text-center">
          <button
            type="button"
            onClick={triggerPunishment}
            className="text-white/20 hover:text-[#c9a24d]/60 text-[9px] uppercase tracking-[0.45em] font-black transition-colors"
          >
            Forgotten the Sacred Code?
          </button>
        </div>

      </div>
    </div>
  )
}
