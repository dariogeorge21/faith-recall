'use client'

import { Delete, RotateCcw } from 'lucide-react'

interface NumericKeypadProps {
  onDigitClick: (digit: string) => void
  onBackspace: () => void
  onClear: () => void
}

export default function NumericKeypad({
  onDigitClick,
  onBackspace,
  onClear,
}: NumericKeypadProps) {
  const digits = ['1','2','3','4','5','6','7','8','9']

  return (
    <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
      {digits.map((digit) => (
        <button
          key={digit}
          onClick={() => onDigitClick(digit)}
          className="h-12 rounded-xl bg-white/[0.03] border border-white/5 text-xl font-bold text-white/90 hover:bg-[#c9a24d] hover:text-black transition-all active:scale-95"
        >
          {digit}
        </button>
      ))}

      <button
        onClick={onClear}
        className="h-12 rounded-xl bg-white/[0.01] text-[#c9a24d]/40 flex items-center justify-center hover:text-[#c9a24d]"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <button
        onClick={() => onDigitClick('0')}
        className="h-12 rounded-xl bg-white/[0.03] border border-white/5 text-xl font-bold text-white/90 hover:bg-[#c9a24d] hover:text-black transition-all active:scale-95"
      >
        0
      </button>

      <button
        onClick={onBackspace}
        className="h-12 rounded-xl bg-white/[0.01] text-[#c9a24d]/40 flex items-center justify-center hover:text-[#c9a24d]"
      >
        <Delete className="w-5 h-5" />
      </button>
    </div>
  )
}
