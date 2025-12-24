'use client'

import Image from 'next/image'

interface SaintCardProps {
  saint: {
    id: number
    name: string
    image: string
  }
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
        relative w-full h-[120px] rounded-xl
        flex items-center justify-center
        transition-all duration-300
        bg-[#0b1224]
        ${
          isMatched
            ? 'border border-red-500 shadow-[0_0_22px_rgba(239,68,68,0.6)]'
            : isSelected
            ? 'border border-red-400'
            : 'border border-white/10 hover:border-white/30'
        }
        ${isRemoved ? 'opacity-50' : ''}
      `}
    >
      {/* HIDDEN */}
      {!isRevealed && (
        <span className="text-white/30 text-xl">?</span>
      )}

      {/* LEFT → IMAGE */}
      {isRevealed && side === 'left' && (
        <div className="relative h-[100px] w-full">
          <Image
            src={saint.image}
            alt={saint.name}
            fill
            className="object-contain"
            sizes="120px"
          />
        </div>
      )}

      {/* RIGHT → NAME */}
      {isRevealed && side === 'right' && (
        <span className="text-white text-sm font-semibold text-center px-3">
          {saint.name}
        </span>
      )}
    </button>
  )
}
