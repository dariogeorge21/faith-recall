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

  // Countdown
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
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312] px-8">

      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/4 w-[600px] h-[600px] bg-amber-500/15 blur-[160px]" />
        <div className="absolute bottom-[-35%] right-1/4 w-[600px] h-[600px] bg-purple-700/20 blur-[180px]" />
      </div>

      {/* MAIN CARD */}
      <div
        className="
          w-full max-w-5xl h-[88vh]
          flex flex-col justify-center
          bg-white/[0.05]
          backdrop-blur-2xl
          border border-white/10
          rounded-[40px]
          shadow-[0_40px_120px_rgba(0,0,0,0.8)]
          px-16 py-12
          animate-cardEnter
        "
      >
        {/* TITLE */}
        <div className="text-center mb-8 animate-fadeDown">
          <h1 className="text-5xl font-extrabold text-[#c9a24d] mb-3">
            Security Code
          </h1>
          <p className="text-white/70 text-xl">
            Memorize this code — you’ll need it later
          </p>
        </div>

        {/* COUNTDOWN */}
        <div className="flex justify-center mb-10 animate-pulseSlow">
          <div className="px-10 py-5 rounded-2xl bg-[#2b0f18] text-white text-center shadow-lg">
            <div className="text-5xl font-bold">{countdown}</div>
            <div className="text-xs uppercase tracking-wide mt-1 opacity-80">
              seconds remaining
            </div>
          </div>
        </div>

        {/* CODE */}
        <div className="flex justify-center gap-6 mb-8">
          {generatedCode.split('').map((digit, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 0.08}s` }}
              className="
                w-20 h-24 md:w-24 md:h-28
                bg-[#0b1020]
                border-2 border-[#c9a24d]
                rounded-xl
                flex items-center justify-center
                shadow-inner
                animate-digitPop
              "
            >
              <span className="text-4xl md:text-5xl font-extrabold text-[#c9a24d]">
                {digit}
              </span>
            </div>
          ))}
        </div>

        {/* INSTRUCTION */}
        <div className="text-center animate-fadeUp">
          <p className="text-white/80 text-xl font-medium">
            You will be asked to enter this code after completing the games.
          </p>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx global>{`
        @keyframes cardEnter {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes digitPop {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulseSlow {
          0%, 100% { box-shadow: 0 0 0 rgba(201,162,77,0); }
          50% { box-shadow: 0 0 36px rgba(201,162,77,0.35); }
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

        .animate-digitPop {
          animation: digitPop 0.45s ease-out forwards;
        }

        .animate-pulseSlow {
          animation: pulseSlow 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
