'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function SecurityCodePage() {
  const router = useRouter()
  const { setSecurityCode } = useGameStore()

  const [generatedCode, setGeneratedCode] = useState('')
  const [countdown, setCountdown] = useState(5)
  const [isDisplaying, setIsDisplaying] = useState(true)

  // Generate 6-digit code
  useEffect(() => {
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    setGeneratedCode(code)
    setSecurityCode(code)
  }, [setSecurityCode])

  // Countdown logic
  useEffect(() => {
    if (!isDisplaying || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsDisplaying(false)
          setTimeout(() => router.push('/game1'), 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, isDisplaying, router])

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312] px-6">

      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-30%] left-1/4 w-[500px] h-[500px] bg-gold-500/10 blur-[140px]" />
        <div className="absolute bottom-[-30%] right-1/4 w-[500px] h-[500px] bg-burgundy-700/20 blur-[160px]" />
      </div>

      <div className="w-full max-w-4xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_30px_120px_rgba(0,0,0,0.8)] p-8 md:p-12">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#c9a24d] mb-3">
            Security Code
          </h1>
          <p className="text-white/70 text-lg md:text-xl">
            Memorize this code — you’ll need it later
          </p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center mb-10">
          <div className="px-10 py-5 rounded-2xl bg-burgundy-700 text-white text-center shadow-lg">
            <div className="text-5xl font-bold">{countdown}</div>
            <div className="text-sm uppercase tracking-wide mt-1 opacity-80">
              seconds remaining
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="flex justify-center gap-4 md:gap-6 mb-8">
          {generatedCode.split('').map((digit, index) => (
            <div
              key={index}
              className="w-16 h-20 md:w-20 md:h-24 bg-[#0b1020] border-2 border-[#c9a24d] rounded-xl flex items-center justify-center shadow-inner"
            >
              <span className="text-3xl md:text-4xl font-extrabold text-[#c9a24d]">
                {digit}
              </span>
            </div>
          ))}
        </div>

        {/* Instruction */}
        <div className="text-center">
          <p className="text-white/80 text-lg md:text-xl font-medium">
            Remember this code carefully.  
            You will be asked to enter it after completing the games.
          </p>
        </div>
      </div>
    </div>
  )
}
