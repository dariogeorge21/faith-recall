'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  seconds: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function Timer({ seconds, size = 'medium', className = '' }: TimerProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (seconds <= 10 && seconds > 0) {
      setPulse(true)
      const timer = setTimeout(() => setPulse(false), 500)
      return () => clearTimeout(timer)
    }
  }, [seconds])

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const sizeClasses = {
    small: 'text-3xl px-4 py-2',
    medium: 'text-5xl px-6 py-3',
    large: 'text-7xl px-10 py-5',
  }

  const isLowTime = seconds <= 10
  const isVeryLowTime = seconds <= 5

  return (
    <div className={`${className} font-bold text-center`}>
      <div
        className={`
          inline-flex items-center justify-center rounded-2xl
          ${sizeClasses[size]}
          transition-all duration-300 ease-out
          transform
          ${
            isVeryLowTime
              ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-[0_0_50px_rgba(220,38,38,0.7)] scale-110 animate-ping-slow'
              : isLowTime
              ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-[0_0_35px_rgba(249,115,22,0.6)] scale-105'
              : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_25px_rgba(251,191,36,0.4)]'
          }
          ${pulse ? 'animate-pulse-once' : ''}
        `}
      >
        <span className="drop-shadow-lg font-black tracking-wider">
          ⏱️ {formatTime(seconds)}
        </span>
      </div>
      
      {isLowTime && (
        <div className="mt-3 text-xl font-bold text-red-400 animate-bounce">
          Hurry Up! ⚡
        </div>
      )}

      <style jsx>{`
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        
        @keyframes pulse-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-once {
          animation: pulse-once 0.5s cubic-bezier(0.4, 0, 0.6, 1);
        }
      `}</style>
    </div>
  )
}
