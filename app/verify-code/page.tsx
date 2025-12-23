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
      setCode(code + digit)
      setError('')
    }
  }

  const handleBackspace = () => {
    setCode(code.slice(0, -1))
    setError('')
  }

  const handleClear = () => {
    setCode('')
    setError('')
  }

  const handleVerify = useCallback(() => {
    if (code.length !== 6) {
      setError('Please enter 6 digits')
      return
    }

    if (code === securityCode) {
      // Correct code - transition to results
      router.push('/results')
    } else {
      // Wrong code
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 2) {
        // Trigger punishment flow
        setShowPunishment(true)
      } else {
        setError(`Incorrect code. ${2 - newAttempts} attempt${2 - newAttempts === 1 ? '' : 's'} remaining.`)
        setCode('')
      }
    }
  }, [code, securityCode, router, attempts])

  const handleForgotCode = () => {
    setShowPunishment(true)
  }

  const handleHailMaryToggle = (index: number) => {
    setHailMarys((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
  }

  const handleContinue = () => {
    if (hailMarys.every((checked) => checked)) {
      router.push('/results')
    }
  }

  // Auto-verify when 6 digits entered
  useEffect(() => {
    if (code.length === 6 && !error && !showPunishment) {
      const timer = setTimeout(() => {
        handleVerify()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [code, error, showPunishment, handleVerify])

  if (showPunishment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="w-full" style={{ maxWidth: '1400px' }}>
          <div className="text-center mb-10">
            <h1 className="text-6xl font-bold text-burgundy-700 mb-4">
              Recite 5 Hail Marys to continue
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-10 mb-6">
            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => handleHailMaryToggle(index)}
                  className="w-full p-6 text-left bg-white border-2 border-burgundy-300 rounded-lg hover:bg-gold-50 hover:border-gold-400 transition-all touch-manipulation"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`
                        w-12 h-12 rounded border-2 flex items-center justify-center text-3xl
                        ${
                          hailMarys[index]
                            ? 'bg-gold-500 border-gold-600 text-white'
                            : 'bg-white border-burgundy-300 text-transparent'
                        }
                        transition-all
                      `}
                    >
                      {hailMarys[index] && '✓'}
                    </div>
                    <span className="text-3xl font-semibold text-burgundy-700">
                      Hail Mary {index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinue}
              disabled={!hailMarys.every((checked) => checked)}
              className="w-full mt-8 py-6 text-3xl font-bold bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full" style={{ maxWidth: '1400px' }}>
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold text-burgundy-700 mb-4">
            Verify Security Code
          </h1>
          <p className="text-3xl text-burgundy-600">
            Enter the security code you memorized to view results
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-6">
          {/* Code Display */}
          <div className="mb-8">
            <div className="flex justify-center gap-6 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`
                    w-24 h-24 border-4 rounded-xl flex items-center justify-center
                    text-6xl font-bold transition-all
                    ${
                      index < code.length
                        ? 'bg-gold-500 border-gold-600 text-white shadow-lg'
                        : 'bg-white border-burgundy-300 text-burgundy-300'
                    }
                  `}
                >
                  {code[index] || ''}
                </div>
              ))}
            </div>
            <p className="text-center text-2xl text-burgundy-600 font-semibold">
              {code.length}/6 digits
            </p>
          </div>

          {error && (
            <div className="mb-6 p-6 bg-red-100 border-2 border-red-400 rounded-lg text-red-700 text-2xl font-semibold text-center">
              {error}
            </div>
          )}

          {/* Keypad */}
          <NumericKeypad
            onDigitClick={handleDigitClick}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />

          <button
            onClick={handleForgotCode}
            className="w-full mt-8 py-4 text-2xl font-semibold text-burgundy-600 hover:text-burgundy-700 underline touch-manipulation"
          >
            Forgot Code?
          </button>
        </div>
      </div>
    </div>
  )
}

