'use client'

import { useRouter } from 'next/navigation'

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
      <div className="w-full max-w-4xl text-center">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-burgundy-700 mb-6 animate-fade-in">
            Faith Recall
          </h1>
          <p className="text-3xl md:text-5xl text-gold-600 font-semibold mb-4">
            JAAGO
          </p>
          <p className="text-xl md:text-3xl text-burgundy-600">
            Church Event Game
          </p>
        </div>

        {/* Game Description */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="space-y-6 text-lg md:text-2xl text-burgundy-700">
            <p className="font-semibold">
              Test your memory and knowledge of Catholic faith!
            </p>
            <div className="border-t-2 border-burgundy-200 pt-6">
              <h2 className="text-2xl md:text-3xl font-bold text-burgundy-700 mb-4">
                Game Features:
              </h2>
              <ul className="space-y-3 text-left max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="text-gold-600 text-2xl">🎮</span>
                  <span><strong>Game 1:</strong> Match saints with their images (90 seconds)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-600 text-2xl">📖</span>
                  <span><strong>Game 2:</strong> Identify Bible stories from emojis (90 seconds)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-600 text-2xl">🏆</span>
                  <span>Compete on the leaderboard for top scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-600 text-2xl">⏱️</span>
                  <span>Total gameplay: 180 seconds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-2xl mx-auto">
          <button
            onClick={handleStartGame}
            className="flex-1 py-6 text-2xl md:text-3xl font-bold bg-gold-500 text-white rounded-xl shadow-lg hover:bg-gold-600 active:scale-95 transition-all touch-manipulation"
          >
            🎯 Start Game
          </button>
          <button
            onClick={handleViewLeaderboard}
            className="flex-1 py-6 text-2xl md:text-3xl font-bold bg-burgundy-600 text-white rounded-xl shadow-lg hover:bg-burgundy-700 active:scale-95 transition-all touch-manipulation"
          >
            🏆 View Leaderboard
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-sm md:text-base text-burgundy-600 max-w-2xl mx-auto">
          <p className="mb-2">
            💡 <strong>Tip:</strong> All interactions use touch/mouse - no keyboard needed!
          </p>
          <p>
            Have fun and may the best player win! 🙏
          </p>
        </div>
      </div>
    </div>
  )
}
