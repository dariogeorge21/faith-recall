'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

interface VoiceNameInputProps {
  value: string
  onChange: (value: string) => void
}

const KEYS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

export default function VoiceNameInput({ value, onChange }: VoiceNameInputProps) {
  const [open, setOpen] = useState(false)

  const addChar = (char: string) => {
    onChange(value + char)
  }

  const backspace = () => {
    onChange(value.slice(0, -1))
  }

  return (
    <>
      {/* DISPLAY INPUT */}
      <div
        onClick={() => setOpen(true)}
        className="
          flex items-center justify-between
          px-5 py-4
          rounded-xl
          bg-white/[0.06]
          border border-white/10
          backdrop-blur-xl
          cursor-pointer
          hover:bg-white/[0.08]
          transition
        "
      >
        <span className={value ? 'text-white' : 'text-white/40'}>
          {value || 'Tap to input identity...'}
        </span>

        <span className="text-white/60 text-lg">⌨</span>
      </div>

      {/* KEYBOARD OVERLAY */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center">
          <div
            className="
              w-full max-w-5xl
              rounded-t-[36px]
              px-10 py-8
              bg-gradient-to-b from-[#0b1020] to-[#070b14]
              border-t border-white/10
              shadow-[0_-40px_120px_rgba(0,0,0,0.9)]
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-semibold tracking-wide">
                On-Screen Keyboard
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Current Input Display */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white bg-white/10 rounded-xl py-4 px-6 border border-white/20">
                {value || 'Start typing...'}
              </div>
            </div>

            {/* Keys */}
            <div className="space-y-3">
              {KEYS.map((row, r) => (
                <div key={r} className={`flex justify-center gap-2 ${r === 1 ? 'ml-6' : r === 2 ? 'ml-12' : ''}`}>
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => addChar(key)}
                      className="
                        w-14 h-14 rounded-lg
                        bg-white/10
                        text-white
                        font-medium
                        hover:bg-white/20
                        transition
                        flex items-center justify-center
                      "
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={() => addChar(' ')}
                className="
                  flex-1 py-4 rounded-xl
                  bg-white/10
                  text-white
                  hover:bg-white/20
                  transition
                "
              >
                Space
              </button>

              <button
                onClick={backspace}
                className="
                  px-6 py-4 rounded-xl
                  bg-red-500/20
                  text-red-300
                  hover:bg-red-500/30
                  transition
                "
              >
                ⌫
              </button>

              <button
                onClick={() => onChange('')}
                className="
                  px-6 py-4 rounded-xl
                  bg-yellow-500/20
                  text-yellow-300
                  hover:bg-yellow-500/30
                  transition
                "
              >
                Clear
              </button>

              <button
                onClick={() => setOpen(false)}
                className="
                  px-6 py-4 rounded-xl
                  bg-amber-500
                  text-black
                  font-semibold
                  hover:bg-amber-400
                  transition
                "
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
