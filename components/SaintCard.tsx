'use client'

import Image from 'next/image'
import { Saint } from '@/lib/gameData'

interface SaintCardProps {
  saint: Saint
  isRevealed: boolean
  isSelected: boolean
  isMatched: boolean
  isRemoved: boolean
  side: 'left' | 'right'
  onClick: () => void
  disabled: boolean
}

export default function SaintCard({
  saint,
  isRevealed,
  isSelected,
  isMatched,
  isRemoved,
  side,
  onClick,
  disabled,
}: SaintCardProps) {
  if (isRemoved) {
    return <div className="w-full aspect-[3/4]"></div>
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full aspect-[3/4] rounded-lg shadow-lg transition-all duration-300 touch-manipulation
        ${isRemoved ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
        ${isSelected ? 'ring-4 ring-gold-500 ring-offset-2' : ''}
        ${isMatched ? 'animate-glow-green' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}
      `}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          w-full h-full rounded-lg relative overflow-hidden
          ${isRevealed ? 'bg-white' : 'bg-burgundy-600'}
          transform transition-transform duration-400
        `}
      >
        {isRevealed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
            {side === 'left' ? (
              <div className="relative w-full h-full">
                <Image
                  src={saint.image}
                  alt={saint.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-burgundy-700 break-words">
                  {saint.name}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl md:text-6xl text-white">?</span>
          </div>
        )}
      </div>
    </button>
  )
}

