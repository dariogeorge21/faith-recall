'use client'

import Image from 'next/image'

interface SaintCardProps {
  saint: { id: number; name: string; image: string }
  side: 'left' | 'right'
  isRevealed: boolean
  isSelected: boolean
  isMatched: boolean
  isRemoved: boolean
  disabled?: boolean
  onClick: () => void
}

export default function SaintCard({
  saint,
  side,
  isRevealed,
  isSelected,
  isMatched,
  isRemoved,
  disabled,
  onClick,
}: SaintCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isRemoved}
      className={`
        relative mx-auto rounded-2xl
        flex items-center justify-center
        transition-all duration-500 ease-out
        bg-[#0b1224]/80 backdrop-blur-md overflow-hidden
        w-full max-w-[200px] aspect-[2/2]
        ${
          isMatched
            ? 'border-2 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
            : isSelected
            ? 'border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            : 'border border-white/10 hover:border-amber-500/40'
        }
      `}
    >
      {/* HIDDEN STATE */}
      {!isRevealed && (
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#05070f]">
           <span className="text-amber-500/10 text-6xl font-black italic select-none">?</span>
        </div>
      )}

      {/* IMAGE SIDE (Focus on Face) */}
      {isRevealed && side === 'left' && (
        <div className="relative w-full h-full animate-in flip-in-y duration-500">
          <Image
            src={saint.image}
            alt={saint.name}
            fill
            className="object-cover object-top"
            sizes="200px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* NAME SIDE */}
      {isRevealed && side === 'right' && (
        <div className="w-full h-full flex flex-col items-center justify-center px-3 bg-slate-900/80 animate-in flip-in-y duration-500">
          <span className="text-white text-sm uppercase tracking-[0.2em] font-black text-center leading-tight">
            {saint.name}
          </span>
          <div className="mt-2 h-[1px] w-4 bg-amber-500/50" />
        </div>
      )}
    </button>
  )
}