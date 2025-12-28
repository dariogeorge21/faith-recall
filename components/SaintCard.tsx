'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface SaintCardProps {
  saint: { id: number; name: string; image: string }
  side: 'left' | 'right'
  isRevealed: boolean
  isSelected: boolean
  isMatched: boolean
  isWrong?: boolean
  isRemoved: boolean
  disabled?: boolean
  onClick: () => void
  shouldPulse?: boolean
  shouldHighlight?: boolean
}

export default function SaintCard({
  saint,
  side,
  isRevealed,
  isSelected,
  isMatched,
  isWrong,
  isRemoved,
  disabled,
  onClick,
  shouldPulse,
  shouldHighlight,
}: SaintCardProps) {
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (isRevealed) {
      setIsFlipping(true)
      const timer = setTimeout(() => setIsFlipping(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isRevealed])

  return (
    <button
      onClick={onClick}
      disabled={disabled || isRemoved}
      className={`
        relative mx-auto rounded-3xl
        flex items-center justify-center
        transition-all duration-500 ease-out
        bg-[#0b1224]/80 backdrop-blur-md overflow-hidden
        w-full max-w-[280px] aspect-[4/5]
        transform-gpu
        ${
          isMatched
            ? 'border-4 border-green-400 shadow-[0_0_40px_rgba(74,222,128,0.6)] scale-105 animate-pulse'
            : isWrong
            ? 'border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-shake-card'
            : shouldHighlight
            ? 'border-3 border-green-400 shadow-[0_0_40px_rgba(74,222,128,0.5)] animate-pulse-highlight'
            : isSelected
            ? 'border-3 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.4)] scale-105'
            : 'border-2 border-white/10 hover:border-amber-500/50 hover:scale-102 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]'
        }
        ${shouldPulse && !isRevealed ? 'animate-pulse-gentle-card' : ''}
        ${isFlipping ? 'animate-flip-in' : ''}
        ${disabled && !isMatched ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
      `}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* HIDDEN STATE */}
      {!isRevealed && (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-[#05070f] to-[#0b1224] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-purple-500/5 animate-pulse" />
          <span className="text-amber-500/20 text-8xl font-black italic select-none drop-shadow-lg">?</span>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500/30 animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-500/30 animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-500/30 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* IMAGE SIDE (Focus on Face) */}
      {isRevealed && side === 'left' && (
        <div className="relative w-full h-full">
          <Image
            src={saint.image}
            alt={saint.name}
            fill
            className="object-cover object-top scale-110 transition-transform duration-700"
            sizes="280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {isMatched && (
            <div className="absolute inset-0 bg-green-400/20 animate-pulse" />
          )}
        </div>
      )}

      {/* NAME SIDE */}
      {isRevealed && side === 'right' && (
        <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 relative">
          {isMatched && (
            <div className="absolute inset-0 bg-green-400/20 animate-pulse" />
          )}
          <span className="text-white text-lg uppercase tracking-[0.25em] font-black text-center leading-snug drop-shadow-lg relative z-10">
            {saint.name}
          </span>
          <div className="mt-4 h-[2px] w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent relative z-10" />
          {isMatched && (
            <div className="mt-4 text-4xl animate-bounce">✨</div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes flip-in {
          0% {
            transform: perspective(1000px) rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: perspective(1000px) rotateY(0deg);
            opacity: 1;
          }
        }
        
        @keyframes shake-card {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-8px) rotate(-2deg); }
          75% { transform: translateX(8px) rotate(2deg); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.2);
          }
          50% {
            box-shadow: 0 0 25px 8px rgba(251, 191, 36, 0.15);
          }
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.4), inset 0 0 20px rgba(74, 222, 128, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(74, 222, 128, 0.6), inset 0 0 25px rgba(74, 222, 128, 0.15);
          }
        }
        
        .animate-flip-in {
          animation: flip-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-shake-card {
          animation: shake-card 0.5s ease-in-out;
        }
        
        .animate-pulse-gentle-card {
          animation: pulse-gentle 2.5s ease-in-out infinite;
        }
        
        .animate-pulse-highlight {
          animation: pulse-highlight 1.5s ease-in-out infinite;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </button>
  )
}