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
    if (code.length !== 6) return

    if (code === securityCode) {
      router.push('/results')
    } else {
      setAttempts((prev) => {
        const next = prev + 1
        if (next >= 2) {
          setShowPunishment(true)
        } else {
          setError('Incorrect code. One attempt left.')
          setCode('')
        }
        return next
      })
    }
  }, [code, securityCode, router])

  useEffect(() => {
    if (code.length === 6 && !error && !showPunishment) {
      const t = setTimeout(handleVerify, 300)
      return () => clearTimeout(t)
    }
  }, [code, error, showPunishment, handleVerify])

  const toggleHailMary = (index: number) => {
    setHailMarys((p) => p.map((v, i) => (i === index ? !v : v)))
  }

  /* ================= PUNISHMENT SCREEN (Sacred Amber UI) ================= */
  if (showPunishment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070f] px-4">
        <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <h1 className="text-2xl font-black text-[#c9a24d] text-center mb-8 uppercase tracking-[0.3em]">
            Penance Required
          </h1>
          <div className="space-y-4">
            {hailMarys.map((checked, i) => (
              <button
                key={i}
                onClick={() => toggleHailMary(i)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                  checked ? 'border-[#c9a24d] bg-[#c9a24d]/10' : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                  checked ? 'bg-[#c9a24d] border-[#c9a24d] text-black' : 'border-white/20'
                }`}>
                  {checked && <span className="text-xs font-bold">✓</span>}
                </div>
                <span className={`text-sm font-bold tracking-widest ${checked ? 'text-[#c9a24d]' : 'text-white/40'}`}>
                  HAIL MARY {i + 1}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => hailMarys.every(Boolean) && router.push('/results')}
            disabled={!hailMarys.every(Boolean)}
            className="w-full mt-10 py-5 rounded-2xl text-xs font-black bg-[#c9a24d] text-black uppercase tracking-[0.4em] disabled:opacity-20 shadow-[0_0_30px_rgba(201,162,77,0.2)]"
          >
            Absolution Granted
          </button>
        </div>
      </div>
    )
  }

  /* ================= VERIFICATION SCREEN (Sacred Amber UI) ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#020617] px-4">
      <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
        
        {/* ICON & TITLE */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#c9a24d]/10 rounded-[24px] flex items-center justify-center border border-[#c9a24d]/20 mb-6 shadow-[0_0_20px_rgba(201,162,77,0.1)]">
            <LucideShieldCheck className="w-8 h-8 text-[#c9a24d]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Identity Check</h1>
          <p className="text-[#c9a24d]/40 text-[10px] uppercase tracking-[0.4em] font-bold">Sacred 6-Digit Cipher</p>
        </div>

        {/* PIN DISPLAY */}
        <div className="flex justify-center gap-3 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-12 h-16 rounded-[20px] flex items-center justify-center text-2xl font-black transition-all duration-500 border-2 ${
                i < code.length
                  ? 'bg-[#c9a24d]/10 border-[#c9a24d] text-white shadow-[0_0_15px_rgba(201,162,77,0.3)]'
                  : 'border-white/5 bg-white/[0.01] text-white/10'
              }`}
            >
              {code[i] ? (
                <div className="w-2 h-2 bg-[#c9a24d] rounded-full animate-in zoom-in duration-300" />
              ) : (
                <div className="w-1 h-1 bg-white/10 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-[10px] uppercase tracking-[0.2em] font-bold animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* KEYPAD COMPONENT */}
        <div className="mb-4">
          <NumericKeypad
            onDigitClick={handleDigitClick}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        </div>

        <button 
          onClick={() => setShowPunishment(true)} 
          className="w-full text-center text-white/10 hover:text-[#c9a24d]/40 text-[9px] uppercase tracking-[0.5em] font-black transition-colors mt-6"
        >
          Forgotten the Sacred Code?
        </button>
      </div>
    </div>
  )
}