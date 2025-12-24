'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Player } from '@/lib/supabase'

export default function LeaderboardPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tapCount, setTapCount] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    fetchLeaderboard()

    const channel = supabase
      .channel('players-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        fetchLeaderboard
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
      console.error(err)
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSecretTap = () => {
    const next = tapCount + 1
    setTapCount(next)
    if (next >= 5) {
      setConfirmDelete(true)
      setTapCount(0)
    }
  }

  const deleteAllScores = async () => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) throw error
      setConfirmDelete(false)
      fetchLeaderboard()
    } catch {
      alert('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4 py-10 flex justify-center">

      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-amber-500/20 blur-[160px]" />
        <div className="absolute bottom-[-20%] right-1/4 w-[600px] h-[600px] bg-purple-700/20 blur-[180px]" />
      </div>

      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            onClick={handleSecretTap}
            className="text-3xl md:text-4xl font-extrabold text-white cursor-pointer"
          >
            Leaderboard
          </h1>
          <p className="text-sm tracking-widest uppercase text-amber-400 mt-1">
            Faith Recall — Top Scores
          </p>
        </div>

        {/* Delete Confirm */}
        {confirmDelete && (
          <div className="mb-6 rounded-xl bg-red-500/20 border border-red-500 p-4 text-center">
            <p className="text-white font-semibold mb-4">
              Delete all scores?
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteAllScores}
                className="flex-1 rounded-lg bg-red-600 py-2 font-bold text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg bg-white/10 py-2 font-bold text-white hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center text-white/60 py-20 animate-pulse">
            Loading leaderboard…
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">
            {error}
          </div>
        ) : players.length === 0 ? (
          <div className="text-center text-white/60 py-20">
            No scores yet. Be the first!
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player, index) => (
              <LeaderboardRow
                key={player.id}
                rank={index + 1}
                player={player}
              />
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="rounded-xl bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Components ---------- */

function LeaderboardRow({
  rank,
  player,
}: {
  rank: number
  player: Player
}) {
  const isTop = rank <= 3

  const medal =
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 border
        ${
          isTop
            ? 'bg-gradient-to-r from-amber-500/20 to-amber-700/10 border-amber-400/30'
            : 'bg-white/5 border-white/10'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold text-amber-400 w-8">
          {medal}
        </div>
        <div>
          <p className="font-semibold text-white">{player.name}</p>
          <p className="text-xs text-white/50">{player.region}</p>
        </div>
      </div>

      <div className="text-lg font-extrabold text-white">
        {player.score.toLocaleString()}
      </div>
    </div>
  )
}
