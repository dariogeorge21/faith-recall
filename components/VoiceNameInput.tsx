'use client'

import { Mic, Keyboard } from 'lucide-react'
import { useState } from 'react'
import AlphabeticKeyboard from './AlphabeticKeyboard'

interface VoiceNameInputProps {
  value: string
  onChange: (v: string) => void
}

export default function VoiceNameInput({
  value,
  onChange,
}: VoiceNameInputProps) {
  const [showKeyboard, setShowKeyboard] = useState(false)

  return (
    <div className="relative">
      {/* INPUT ROW */}
      <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
        {/* MIC */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
        >
          <Mic size={18} />
        </button>

        {/* INPUT */}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tap to input identity..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
        />

        {/* KEYBOARD ICON */}
        <button
          type="button"
          onClick={() => setShowKeyboard((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition"
        >
          <Keyboard size={18} />
        </button>
      </div>

      {/* IN-APP KEYBOARD */}
      {showKeyboard && (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 rounded-2xl bg-[#0b1020] border border-white/10 shadow-2xl">
          <AlphabeticKeyboard
            value={value}
            onChange={onChange}
            onClose={() => setShowKeyboard(false)}
          />
        </div>
      )}
    </div>
  )
}
