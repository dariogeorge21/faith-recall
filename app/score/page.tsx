'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Player } from '@/lib/supabase'

export default function LeaderboardPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchLeaderboard()

    // Set up real-time subscription
    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        () => {
          fetchLeaderboard()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('score', { ascending: false })
        .limit(100)

      if (error) throw error
      setPlayers(data || [])
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const handleHeaderClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    if (newCount >= 3) {
      setShowDeleteConfirm(true)
      setClickCount(0)
    }
  }

  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) throw error
      setShowDeleteConfirm(false)
      fetchLeaderboard()
    } catch (err) {
      console.error('Error deleting scores:', err)
      alert('Failed to delete scores')
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
    return 'bg-white text-burgundy-700'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1
            onClick={handleHeaderClick}
            className="text-4xl md:text-6xl font-bold text-burgundy-700 mb-4 cursor-pointer touch-manipulation"
          >
            Leaderboard
          </h1>
          <p className="text-2xl md:text-3xl text-gold-600 font-semibold">
            Top Scores
          </p>
        </div>

        {showDeleteConfirm && (
          <div className="mb-6 p-6 bg-red-100 border-4 border-red-500 rounded-lg">
            <p className="text-2xl font-bold text-red-700 mb-4 text-center">
              Are you sure you want to delete all scores?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-3 text-xl font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all touch-manipulation"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 text-xl font-bold bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-3xl font-bold text-burgundy-700 py-20">
            Loading leaderboard...
          </div>
        ) : error ? (
          <div className="text-center text-2xl font-bold text-red-600 py-20">
            {error}
          </div>
        ) : players.length === 0 ? (
          <div className="text-center text-2xl font-bold text-burgundy-700 py-20">
            No scores yet. Be the first!
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-burgundy-600 text-white">
                    <th className="px-4 py-4 text-left text-xl md:text-2xl font-bold">Rank</th>
                    <th className="px-4 py-4 text-left text-xl md:text-2xl font-bold">Name</th>
                    <th className="px-4 py-4 text-left text-xl md:text-2xl font-bold">Region</th>
                    <th className="px-4 py-4 text-right text-xl md:text-2xl font-bold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => {
                    const rank = index + 1
                    return (
                      <tr
                        key={player.id}
                        className={`border-b-2 border-burgundy-100 ${getRankColor(rank)}`}
                      >
                        <td className="px-4 py-4 text-xl md:text-2xl font-bold">
                          {getRankIcon(rank)} {rank}
                        </td>
                        <td className="px-4 py-4 text-xl md:text-2xl font-semibold">
                          {player.name}
                        </td>
                        <td className="px-4 py-4 text-xl md:text-2xl font-semibold">
                          {player.region}
                        </td>
                        <td className="px-4 py-4 text-right text-xl md:text-2xl font-bold">
                          {player.score.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 text-xl md:text-2xl font-bold bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-all touch-manipulation"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

