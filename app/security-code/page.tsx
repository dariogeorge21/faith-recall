'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import NumericKeypad from '@/components/NumericKeypad'

export default function SecurityCodePage() {
  const router = useRouter()
  const { setSecurityCode } = useGameStore()
  const [code, setCode] = useState('')

  const handleDigitClick = (digit: string) => {
    if (code.length < 6) {
      setCode(code + digit)
    }
  }

  const handleBackspace = () => {
    setCode(code.slice(0, -1))
  }

  const handleClear = () => {
    setCode('')
  }

  // Auto-transition when 6 digits entered
  useEffect(() => {
    if (code.length === 6) {
      setSecurityCode(code)
      // Small delay before transition
      setTimeout(() => {
        router.push('/game1')
      }, 300)
    }
  }, [code, setSecurityCode, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-burgundy-700 mb-4">
            Create Security Code
          </h1>
          <p className="text-xl md:text-2xl text-burgundy-600">
            Enter a 6-digit code to verify your identity later
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          {/* Code Display */}
          <div className="mb-8">
            <div className="flex justify-center gap-2 md:gap-4">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 border-2 rounded-lg flex items-center justify-center
                    text-2xl md:text-3xl font-bold
                    ${
                      index < code.length
                        ? 'bg-gold-500 border-gold-600 text-white'
                        : 'bg-white border-burgundy-300 text-burgundy-300'
                    }
                    transition-all
                  `}
                >
                  {code[index] || ''}
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-lg text-burgundy-600">
              {code.length}/6 digits
            </p>
          </div>

          {/* Keypad */}
          <NumericKeypad
            onDigitClick={handleDigitClick}
            onBackspace={handleBackspace}
            onClear={handleClear}
            disabled={code.length === 6}
          />
        </div>
      </div>
    </div>
  )
}

