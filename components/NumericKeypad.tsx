'use client'

import { X, Delete } from 'lucide-react'

export default function NumericKeypad({ 
  isOpen, 
  onClose, 
  onInput, 
  onClear, 
  onBackspace 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onInput: (char: string) => void,
  onClear: () => void,
  onBackspace: () => void
}) {
  if (!isOpen) return null;

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0a0f1d] border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">On-Screen Keyboard</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((row, idx) => (
            <div key={idx} className="flex justify-center gap-1.5 md:gap-2">
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => onInput(key)}
                  className="w-8 h-12 md:w-14 md:h-16 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-amber-500 hover:text-black transition-all active:scale-90"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
          
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => onInput(' ')} className="flex-[3] h-12 md:h-16 bg-white/5 border border-white/10 rounded-xl text-white uppercase tracking-widest text-[10px]">Space</button>
            <button onClick={onBackspace} className="flex-1 h-12 md:h-16 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center"><Delete className="w-5 h-5 text-red-400" /></button>
            <button onClick={onClear} className="flex-1 h-12 md:h-16 bg-white/5 border border-white/10 rounded-xl text-white uppercase text-[9px]">Clear</button>
          </div>
        </div>
      </div>
    </div>
  )
}