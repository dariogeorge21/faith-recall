'use client'

import { LucideDelete, LucideRotateCcw } from 'lucide-react'

interface NumericKeypadProps {
  onDigitClick: (digit: string) => void
  onBackspace: () => void
  onClear: () => void
}

export default function NumericKeypad({ onDigitClick, onBackspace, onClear }: NumericKeypadProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className="w-full max-w-sm mx-auto grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
      {digits.map((digit) => (
        <button
          key={digit}
          onClick={() => onDigitClick(digit)}
          className="h-14 md:h-16 rounded-2xl bg-white/[0.03] border border-white/5 text-2xl font-bold text-white/90 hover:bg-[#c9a24d] hover:text-black transition-all active:scale-95"
        >
          {digit}
        </button>
      ))}
      <button 
        onClick={onClear} 
        className="h-14 md:h-16 rounded-2xl bg-white/[0.01] text-[#c9a24d]/40 flex items-center justify-center hover:text-[#c9a24d] transition-colors"
      >
        <LucideRotateCcw className="w-6 h-6" />
      </button>
      <button 
        onClick={() => onDigitClick('0')} 
        className="h-14 md:h-16 rounded-2xl bg-white/[0.03] border border-white/5 text-2xl font-bold text-white/90 hover:bg-[#c9a24d] hover:text-black transition-all active:scale-95"
      >
        0
      </button>
      <button 
        onClick={onBackspace} 
        className="h-14 md:h-16 rounded-2xl bg-white/[0.01] text-[#c9a24d]/40 flex items-center justify-center hover:text-[#c9a24d] transition-colors"
      >
        <LucideDelete className="w-6 h-6" />
      </button>
    </div>
  )
}