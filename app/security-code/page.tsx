'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function SecurityCodePage() {
  const router = useRouter()
  const { setSecurityCode } = useGameStore()
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [countdown, setCountdown] = useState(5)
  const [isDisplaying, setIsDisplaying] = useState(true)

  // Generate 6-digit code on mount
  useEffect(() => {
    // Generate random 6-digit code (000000-999999)
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    setGeneratedCode(code)
    setSecurityCode(code)
  }, [setSecurityCode])

  // Countdown timer
  useEffect(() => {
    if (!isDisplaying || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsDisplaying(false)
          // Auto-navigate to game after countdown
          setTimeout(() => {
            router.push('/game1')
          }, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, isDisplaying, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full" style={{ maxWidth: '1400px' }}>
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold text-burgundy-700 mb-4">
            Security Code
          </h1>
          <p className="text-3xl text-burgundy-600 mb-2">
            Memorize this code - you'll need it later!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-6">
          {/* Countdown Timer */}
          <div className="text-center mb-8">
            <div className="inline-block px-8 py-4 bg-burgundy-600 text-white rounded-xl">
              <div className="text-5xl font-bold mb-2">{countdown}</div>
              <div className="text-2xl">seconds remaining</div>
            </div>
          </div>

          {/* Code Display */}
          <div className="mb-8">
            <div className="flex justify-center gap-6 mb-6">
              {generatedCode.split('').map((digit, index) => (
                <div
                  key={index}
                  className="w-24 h-24 border-4 border-gold-500 rounded-xl flex items-center justify-center bg-gold-50 shadow-lg"
                >
                  <span className="text-6xl font-bold text-burgundy-700">
                    {digit}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-2xl text-burgundy-600 font-semibold">
              {generatedCode}
            </p>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-2xl text-burgundy-700 font-semibold">
              Remember this code! You'll need to enter it after completing the games.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
