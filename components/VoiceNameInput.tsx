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
    if (keyboard) inputRef.current?.focus()
  }, [keyboard])

  return (
    <div>
      {!keyboard ? (
        <>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-4 py-4 text-white/60">
            <Mic className="text-amber-400" />
            Say your name clearly into the microphone
          </div>

          <button
            onClick={() => setKeyboard(true)}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            Use keyboard instead
          </button>
        </>
      ) : (
        <>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <button
            onClick={() => setKeyboard(false)}
            className="mt-2 text-sm text-blue-400 hover:underline"
          >
            Use voice instead
          </button>
        </>
      )}
    </div>
  )
}
