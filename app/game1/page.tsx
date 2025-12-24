'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { SAINTS_DATA } from '@/lib/gameData'
import SaintCard from '@/components/SaintCard'
import Timer from '@/components/Timer'

type Card = {
  saint: {
    id: number
    name: string
    image: string
  }
  isRevealed: boolean
  isSelected: boolean
  isMatched: boolean
  isRemoved: boolean
}

export default function Game1Page() {
  const router = useRouter()
  const { addGame1Score } = useGameStore()

  const [leftCards, setLeftCards] = useState<Card[]>([])
  const [rightCards, setRightCards] = useState<Card[]>([])
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)
  const [lock, setLock] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)

  /* ---------- INIT ---------- */
  useEffect(() => {
    const shuffled = [...SAINTS_DATA].sort(() => Math.random() - 0.5)

    setLeftCards(
      shuffled.map((s) => ({
        saint: s,
        isRevealed: false,
        isSelected: false,
        isMatched: false,
        isRemoved: false,
      }))
    )

    setRightCards(
      [...shuffled]
        .sort(() => Math.random() - 0.5)
        .map((s) => ({
          saint: s,
          isRevealed: false,
          isSelected: false,
          isMatched: false,
          isRemoved: false,
        }))
    )
  }, [])

  /* ---------- TIMER (FIXED) ---------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/game2') // ✅ FIX: GO TO GAME 2
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  /* ---------- CLICK HANDLERS ---------- */
  const clickLeft = (index: number) => {
    if (lock || leftCards[index].isRevealed) return

    setLeftCards((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, isRevealed: true, isSelected: true } : c
      )
    )
    setSelectedLeft(index)
  }

  const clickRight = (index: number) => {
    if (lock || rightCards[index].isRevealed) return

    setRightCards((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, isRevealed: true, isSelected: true } : c
      )
    )
    setSelectedRight(index)
  }

  /* ---------- MATCH LOGIC ---------- */
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return

    setLock(true)

    const left = leftCards[selectedLeft]
    const right = rightCards[selectedRight]

    if (left.saint.id === right.saint.id) {
      addGame1Score(500)

      setTimeout(() => {
        setLeftCards((prev) =>
          prev.map((c, i) =>
            i === selectedLeft ? { ...c, isMatched: true, isRemoved: true } : c
          )
        )
        setRightCards((prev) =>
          prev.map((c, i) =>
            i === selectedRight ? { ...c, isMatched: true, isRemoved: true } : c
          )
        )
        resetSelection()
      }, 400)
    } else {
      setTimeout(() => {
        setLeftCards((prev) =>
          prev.map((c, i) =>
            i === selectedLeft
              ? { ...c, isRevealed: false, isSelected: false }
              : c
          )
        )
        setRightCards((prev) =>
          prev.map((c, i) =>
            i === selectedRight
              ? { ...c, isRevealed: false, isSelected: false }
              : c
          )
        )
        resetSelection()
      }, 600)
    }
  }, [selectedLeft, selectedRight])

  const resetSelection = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setLock(false)
  }

  /* ---------- UI ---------- */
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-black">
      <div className="pt-4 text-center">
        <h1 className="text-3xl font-bold text-red-400">
          Saints Memory Match
        </h1>
        <Timer seconds={timeRemaining} size="medium" />
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="max-w-5xl mx-auto bg-white/[0.05] rounded-3xl">
          <div className="grid grid-cols-2 gap-4 p-5 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
              {leftCards.map((c, i) => (
                <SaintCard
                  key={`l-${c.saint.id}-${i}`}
                  saint={c.saint}
                  side="left"
                  isRevealed={c.isRevealed}
                  isSelected={c.isSelected}
                  isMatched={c.isMatched}
                  isRemoved={c.isRemoved}
                  onClick={() => clickLeft(i)}
                  disabled={lock}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {rightCards.map((c, i) => (
                <SaintCard
                  key={`r-${c.saint.id}-${i}`}
                  saint={c.saint}
                  side="right"
                  isRevealed={c.isRevealed}
                  isSelected={c.isSelected}
                  isMatched={c.isMatched}
                  isRemoved={c.isRemoved}
                  onClick={() => clickRight(i)}
                  disabled={lock}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
