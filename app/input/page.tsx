'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import StateSelector from '@/components/StateSelector'
import NumericKeypad from '@/components/NumericKeypad'
import VoiceNameInput from '@/components/VoiceNameInput'

export default function InputPage() {
  const router = useRouter()
  
  // CORRECTED: Extract actions using selectors to avoid 'is not a function' errors
  const setPlayerName = useGameStore((state) => state.setPlayerName)
  const setPlayerRegion = useGameStore((state) => state.setPlayerRegion)
  const reset = useGameStore((state) => state.reset)

  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4">
      {/* Central Profile Setup Card */}
      <div className="animate-fade-up w-full max-w-md rounded-[32px] bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_50px_140px_rgba(0,0,0,0.85)] px-7 py-9">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Setup</h1>
          <p className="mt-2 text-xs tracking-[0.35em] uppercase text-amber-400">Prepare for the Challenge</p>
        </div>

        {/* Unified Input - Voice on Left, Keyboard Icon inside right area */}
        <div className="mb-8">
          <label className="block text-sm text-white/70 mb-3 ml-1 uppercase tracking-widest text-[10px] font-bold">Player Identity</label>
          <VoiceNameInput 
            value={name} 
            onChange={setName} // Pass local setter for immediate keyboard updates
            onKeyboardTrigger={() => setIsKeyboardOpen(true)} 
          />
        </div>

        {/* Region Selector with Grid Scrolling */}
        <div className="mb-8">
          <label className="block text-sm text-white/70 mb-3 ml-1 uppercase tracking-widest text-[10px] font-bold">Region (State)</label>
          <div className="max-h-[220px] overflow-y-auto pr-2 rounded-xl custom-scrollbar">
            <StateSelector value={region} onChange={setRegion} />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-xs font-bold uppercase tracking-widest text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!name || !region}
          className={`w-full rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 ${
            name && region 
              ? 'bg-amber-500 text-black shadow-[0_15px_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 hover:scale-[1.02] active:scale-95' 
              : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
          }`}
        >
          Start Game
        </button>
      </div>

      {/* Virtual Keyboard Integration */}
      <NumericKeypad 
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInput={(char) => setName(prev => prev + char)}
        onClear={() => setName('')}
        onBackspace={() => setName(prev => prev.slice(0, -1))}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  )
 }