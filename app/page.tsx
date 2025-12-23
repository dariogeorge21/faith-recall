'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  const handleStartGame = () => {
    router.push('/input')
  }

  const handleViewLeaderboard = () => {
    router.push('/score')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl text-center">
        {/* JAAGO Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/jaago.png"
            alt="JAAGO Logo"
            width={300}
            height={300}
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
            priority
          />
        </div>

        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-burgundy-700 mb-4">
            Faith Recall
          </h1>
          <p className="text-3xl md:text-5xl text-gold-600 font-semibold mb-2">
            JAAGO
          </p>
          <p className="text-xl md:text-2xl text-burgundy-600">
            Church Event Game
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-xl mx-auto mb-8">
          <button
            onClick={handleStartGame}
            className="flex-1 py-6 text-2xl md:text-3xl font-bold bg-gold-500 text-white rounded-xl shadow-lg hover:bg-gold-600 active:scale-95 transition-all touch-manipulation"
          >
            Start Game
          </button>
          <button
            onClick={handleViewLeaderboard}
            className="flex-1 py-6 text-2xl md:text-3xl font-bold bg-burgundy-600 text-white rounded-xl shadow-lg hover:bg-burgundy-700 active:scale-95 transition-all touch-manipulation"
          >
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}
