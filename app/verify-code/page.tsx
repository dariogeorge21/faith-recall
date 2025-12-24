'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import NumericKeypad from '@/components/NumericKeypad'

export default function VerifyCodePage() {
  const router = useRouter()
  const { securityCode } = useGameStore()

  const [code, setCode] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')
  const [showPunishment, setShowPunishment] = useState(false)
  const [hailMarys, setHailMarys] = useState([false, false, false, false, false])

  const handleDigitClick = (digit: string) => {
    if (code.length < 6) {
      setCode((prev) => prev + digit)
      setError('')
    }
  }

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1))
    setError('')
  }

  const handleClear = () => {
    setCode('')
    setError('')
  }

  const handleVerify = useCallback(() => {
    if (code.length !== 6) {
      setError('Enter all 6 digits')
      return
    }

    if (code === securityCode) {
      router.push('/results')
    } else {
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)

      if (nextAttempts >= 2) {
        setShowPunishment(true)
      } else {
        setError('Incorrect code. One attempt left.')
        setCode('')
      }
    }
  }, [code, securityCode, attempts, router])

  const handleForgotCode = () => {
    setShowPunishment(true)
  }

  const toggleHailMary = (index: number) => {
    setHailMarys((prev) => {
      const copy = [...prev]
      copy[index] = !copy[index]
      return copy
    })
  }

  const handleContinue = () => {
    if (hailMarys.every(Boolean)) {
      router.push('/results')
    }
  }

  useEffect(() => {
    if (code.length === 6 && !error && !showPunishment) {
      const t = setTimeout(handleVerify, 150)
      return () => clearTimeout(t)
    }
  }, [code, error, showPunishment, handleVerify])

  /* ================= PUNISHMENT SCREEN ================= */
  if (showPunishment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312] px-4">
        <div className="w-full max-w-md bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl">

          <h1 className="text-2xl font-extrabold text-[#c9a24d] text-center mb-6">
            Recite 5 Hail Marys
          </h1>

          <div className="space-y-3">
            {hailMarys.map((checked, i) => (
              <button
                key={i}
                onClick={() => toggleHailMary(i)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition touch-manipulation"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded border ${
                    checked
                      ? 'bg-[#c9a24d] text-black border-[#c9a24d]'
                      : 'border-white/30'
                  }`}
                >
                  {checked && '✓'}
                </div>
                <span className="text-base text-white">
                  Hail Mary {i + 1}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!hailMarys.every(Boolean)}
            className="w-full mt-6 py-3 rounded-lg text-lg font-bold bg-[#c9a24d] text-black disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  /* ================= VERIFY SCREEN ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312] px-4">
      <div className="w-full max-w-lg bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl">

        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold text-[#c9a24d] mb-1">
            Verify Security Code
          </h1>
          <p className="text-white/70 text-sm">
            Enter the code you memorized
          </p>
        </div>

        {/* CODE BOXES */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-12 rounded-md flex items-center justify-center text-xl font-bold ${
                i < code.length
                  ? 'bg-[#c9a24d] text-black'
                  : 'border border-white/30 text-white/40'
              }`}
            >
              {code[i] || ''}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-200 text-center text-sm">
            {error}
          </div>
        )}

        <NumericKeypad
          onDigitClick={handleDigitClick}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />

        <button
          onClick={handleForgotCode}
          className="w-full mt-4 text-white/60 hover:text-white underline text-sm touch-manipulation"
        >
          Forgot Code?
        </button>
      </div>
    </div>
  )
}
