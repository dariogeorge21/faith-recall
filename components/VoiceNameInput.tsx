'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic } from 'lucide-react'

export default function VoiceNameInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [keyboard, setKeyboard] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (keyboard) {
      inputRef.current?.focus()
    }
  }, [keyboard])

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {!keyboard ? (
        <>
          {/* Voice Prompt Box */}
          <div className="flex items-center justify-center gap-3 w-full rounded-xl bg-white/10 border border-white/20 px-4 py-4 text-white/60">
            <Mic className="text-amber-400 shrink-0" />
            <span className="text-center">Say your name clearly into the microphone</span>
          </div>

          {/* Centered Toggle Button */}
          <button
            onClick={() => setKeyboard(true)}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
          >
            Use keyboard instead
          </button>
        </>
      ) : (
        <>
          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
          />

          {/* Centered Toggle Button */}
          <button
            onClick={() => setKeyboard(false)}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
          >
            Use voice instead
          </button>
        </>
      )}
    </div>
  )
}