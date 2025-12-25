'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Keyboard, X } from 'lucide-react'

export default function VoiceNameInput({
  value,
  onChange,
  onKeyboardTrigger, // New prop to open your virtual keyboard modal
}: {
  value: string
  onChange: (v: string) => void
  onKeyboardTrigger: () => void
}) {
  const [isListening, setIsListening] = useState(false)

  const handleVoiceToggle = () => {
    setIsListening(true)
    // Simulate listening logic
    setTimeout(() => setIsListening(false), 4000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* FIXED HEIGHT CONTAINER: Keeps the Region grid stable underneath */}
      <div className="w-full min-h-[80px] flex items-center justify-center">
        
        {!isListening ? (
          /* --- DEFAULT DUAL-TRIGGER UI --- */
          <div className="flex items-center gap-3 w-full animate-in fade-in duration-500">
            
            {/* LEFT SIDE: MIC SYMBOL */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all active:scale-90 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              <Mic className="w-6 h-6" />
            </button>

            {/* KEYBOARD TRIGGER AREA WITH LEFT-SIDE SYMBOL */}
            <div
              onClick={onKeyboardTrigger}
              className="flex-1 h-14 rounded-2xl bg-white/[0.03] border border-white/10 px-5 flex items-center gap-4 cursor-pointer group hover:bg-white/[0.07] hover:border-white/20 transition-all overflow-hidden"
            >
              {/* KEYBOARD SYMBOL ON THE LEFT */}
              <Keyboard className="w-5 h-5 text-white/20 group-hover:text-amber-400 transition-colors shrink-0" />
              
              <span className={`text-sm truncate tracking-wide ${value ? "text-white font-medium" : "text-white/20"}`}>
                {value || "Tap to input identity..."}
              </span>

              {value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="ml-auto p-1 rounded-full bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* --- SYSTEM LISTENING STATE (STABLE WIDTH) --- */
          <div className="w-full h-14 flex items-center justify-center bg-blue-500/[0.03] border border-blue-500/20 rounded-2xl animate-in zoom-in-95 duration-300 px-6">
            <div className="flex items-center gap-4 w-full">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-blue-600/30 blur-lg rounded-full animate-pulse" />
                <Mic className="text-blue-400 w-5 h-5 relative animate-bounce" />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </span>
                  <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">
                    System Listening
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsListening(false)}
                className="ml-auto text-[8px] uppercase tracking-widest text-white/30 hover:text-amber-400 transition-colors font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}