'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Player } from '@/lib/supabase'
import { useGameStore } from '@/store/gameStore'

export default function LeaderboardPage() {
  const router = useRouter()
  const isPunished = useGameStore((state) => state.isPunished)
  const setIsPunished = useGameStore((state) => state.setIsPunished)

  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tapCount, setTapCount] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [hailMarys, setHailMarys] = useState([false, false, false, false, false])

  useEffect(() => {
    if (!isPunished) {
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
    }
  }, [isPunished])

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
    } catch {
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
    await supabase
      .from('players')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    setConfirmDelete(false)
    fetchLeaderboard()
  }

  /* ======================= 🔥 PUNISHMENT UI (UI FIX ONLY) ======================= */

  if (isPunished) {
    const completed = hailMarys.filter(Boolean).length
    const allChecked = completed === 5

    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#05070f] via-[#070b14] to-black px-6">
        <div className="w-full max-w-3xl rounded-[32px] bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)] px-10 py-10 flex flex-col">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
              <span className="text-red-400 text-2xl">🔥</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl font-extrabold text-white">
            Verification Failed
          </h1>
          <p className="text-center text-white/60 mt-2">
            Recite 5 Hail Marys to continue
          </p>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span className="tracking-widest">PENANCE PROGRESS</span>
              <span className="text-amber-400">{completed} / 5</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${(completed / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="mt-8 space-y-4 flex-1">
            {hailMarys.map((checked, index) => (
              <button
                key={index}
                onClick={() => {
                  const next = [...hailMarys]
                  next[index] = !next[index]
                  setHailMarys(next)
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition
                  ${
                    checked
                      ? 'bg-amber-500/15 border-amber-400/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center
                    ${
                      checked
                        ? 'bg-amber-400 border-amber-400'
                        : 'border-white/30'
                    }`}
                >
                  {checked && <span className="text-black font-bold">✓</span>}
                </div>

                <span className="text-lg font-medium text-white">
                  Hail Mary {index + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Continue */}
          <div className="mt-8">
            <button
              onClick={() => {
                setIsPunished(false)
                router.push('/results')
              }}
              disabled={!allChecked}
              className={`w-full py-5 rounded-xl text-xl font-semibold tracking-wide transition-all
                ${
                  allChecked
                    ? 'bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.01]'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
            >
              Complete your Penance
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ======================= 🏆 LEADERBOARD (UNCHANGED) ======================= */

  return (
    <div className="h-screen bg-gradient-to-br from-[#060b1e] via-[#070b14] to-black px-4 py-8 flex justify-center">
        <div className="w-full max-w-5xl flex flex-col h-full">

        <div className="text-center mb-6 shrink-0">
          <h1
            onClick={handleSecretTap}
            className="text-4xl md:text-5xl font-extrabold text-white cursor-pointer"
          >
            Leaderboard
          </h1>
          <p className="text-base tracking-widest uppercase text-amber-400 mt-1">
            Faith Recall — Top Scores
          </p>
        </div>

        {confirmDelete && (
          <div className="mb-6 rounded-xl bg-red-500/20 border border-red-500 p-6 text-center shrink-0">
            <p className="text-white font-semibold mb-4 text-lg">
              Delete all scores?
            </p>
            <div className="flex gap-4">
              <button
                onClick={deleteAllScores}
                className="flex-1 rounded-lg bg-red-600 py-4 font-bold text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg bg-white/10 py-4 font-bold text-white hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center text-white/60 py-20">Loading…</div>
          ) : error ? (
            <div className="text-center text-red-400 py-20">{error}</div>
          ) : (
            players.map((player, index) => (
              <LeaderboardRow
                key={player.id}
                rank={index + 1}
                player={player}
              />
            ))
          )}
        </div>

        <div className="mt-8 text-center shrink-0">
          <button
            onClick={() => router.push('/')}
            className="rounded-xl bg-white/10 px-8 py-4 font-bold text-white hover:bg-white/20 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

/* ======================= ROW ======================= */

function LeaderboardRow({
  rank,
  player,
}: {
  rank: number
  player: Player
}) {
  const medal =
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank

  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10">
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
