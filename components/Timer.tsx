'use client'

interface TimerProps {
  seconds: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function Timer({ seconds, size = 'medium', className = '' }: TimerProps) {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl md:text-5xl',
    large: 'text-6xl md:text-7xl',
  }

  const isLowTime = seconds <= 10

  return (
    <div className={`${className} ${sizeClasses[size]} font-bold text-center`}>
      <div
        className={`inline-block px-6 py-3 rounded-lg ${
          isLowTime
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gold-500 text-white'
        } transition-all`}
      >
        {formatTime(seconds)}
      </div>
    </div>
  )
}

