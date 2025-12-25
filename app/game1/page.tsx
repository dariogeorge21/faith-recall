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
  const [matchStatus, setMatchStatus] = useState<'correct' | 'wrong' | null>(null)

  /* ---------- INITIALIZE GAME ---------- */
  useEffect(() => {
    const shuffled = [...SAINTS_DATA].sort(() => Math.random() - 0.5)

    setLeftCards(shuffled.map((s) => ({
      saint: s,
      isRevealed: false,
      isSelected: false,
      isMatched: false,
      isRemoved: false,
    })))

    setRightCards([...shuffled].sort(() => Math.random() - 0.5).map((s) => ({
      saint: s,
      isRevealed: false,
      isSelected: false,
      isMatched: false,
      isRemoved: false,
    })))
  }, [])

  /* ---------- AUTO-TRANSITION ON COMPLETION ---------- */
  useEffect(() => {
    const allMatched = leftCards.length > 0 && leftCards.every(c => c.isMatched)
    if (allMatched) {
      const timer = setTimeout(() => router.push('/game2'), 1200)
      return () => clearTimeout(timer)
    }
  }, [leftCards, router])

  /* ---------- TIMER ---------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/game2')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])

  /* ---------- CLICK HANDLERS (UPDATED FOR SINGLE-SIDE LOCK) ---------- */
  const clickLeft = (index: number) => {
    if (lock || leftCards[index].isMatched) return

    // If clicking the same card that is already open, just close it
    if (selectedLeft === index) {
      setLeftCards(prev => prev.map((c, i) => i === index ? { ...c, isRevealed: false, isSelected: false } : c))
      setSelectedLeft(null)
      return
    }

    setLeftCards(prev => prev.map((c, i) => {
      // Close the previously selected card on this side
      if (i === selectedLeft) return { ...c, isRevealed: false, isSelected: false }
      // Open the newly clicked card
      if (i === index) return { ...c, isRevealed: true, isSelected: true }
      return c
    }))
    setSelectedLeft(index)
  }

  const clickRight = (index: number) => {
    if (lock || rightCards[index].isMatched) return

    // If clicking the same card that is already open, just close it
    if (selectedRight === index) {
      setRightCards(prev => prev.map((c, i) => i === index ? { ...c, isRevealed: false, isSelected: false } : c))
      setSelectedRight(null)
      return
    }

    setRightCards(prev => prev.map((c, i) => {
      // Close the previously selected card on this side
      if (i === selectedRight) return { ...c, isRevealed: false, isSelected: false }
      // Open the newly clicked card
      if (i === index) return { ...c, isRevealed: true, isSelected: true }
      return c
    }))
    setSelectedRight(index)
  }

  /* ---------- MATCH LOGIC ---------- */
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return

    setLock(true)
    const left = leftCards[selectedLeft]
    const right = rightCards[selectedRight]

    if (left.saint.id === right.saint.id) {
      setMatchStatus('correct')
      addGame1Score(500)
      setTimeout(() => {
        setLeftCards(prev => prev.map((c, i) => i === selectedLeft ? { ...c, isMatched: true, isRemoved: true } : c))
        setRightCards(prev => prev.map((c, i) => i === selectedRight ? { ...c, isMatched: true, isRemoved: true } : c))
        resetSelection()
      }, 600) 
    } else {
      setMatchStatus('wrong')
      setTimeout(() => {
        setLeftCards(prev => prev.map((c, i) => i === selectedLeft ? { ...c, isRevealed: false, isSelected: false } : c))
        setRightCards(prev => prev.map((c, i) => i === selectedRight ? { ...c, isRevealed: false, isSelected: false } : c))
        resetSelection()
      }, 800)
    }
  }, [selectedLeft, selectedRight])

  const resetSelection = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatchStatus(null)
    setLock(false)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-black overflow-hidden font-sans">
      
      {/* Dynamic Header */}
      <div className="pt-8 text-center shrink-0 z-10">
        <h1 className={`text-4xl font-extrabold transition-all duration-300 tracking-tight ${
          matchStatus === 'correct' ? 'text-green-400 scale-105' : 
          matchStatus === 'wrong' ? 'text-red-500' : 
          'text-amber-400'
        }`}>
          {matchStatus === 'correct' ? 'GREAT MATCH!' : matchStatus === 'wrong' ? 'NOT A PAIR' : 'Saints Memory Match'}
        </h1>
        <div className="mt-4">
          <Timer seconds={timeRemaining} size="medium" />
        </div>
      </div>

      {/* Unified Scrolling Container */}
      <div className="flex-1 px-6 pb-6 overflow-hidden flex items-center justify-center">
        <div className="max-w-4xl w-full max-h-[75vh] bg-white/[0.03] rounded-3xl border border-white/10 p-8 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {leftCards.map((c, i) => (
                <div 
                  key={`l-${c.saint.id}-${i}`} 
                  className={`transition-all duration-500 ${c.isRemoved ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
                >
                  <SaintCard
                    saint={c.saint}
                    side="left"
                    isRevealed={c.isRevealed}
                    isSelected={c.isSelected}
                    isMatched={c.isMatched}
                    isRemoved={c.isRemoved}
                    onClick={() => clickLeft(i)}
                    disabled={lock}
                  />
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {rightCards.map((c, i) => (
                <div 
                  key={`r-${c.saint.id}-${i}`} 
                  className={`transition-all duration-500 ${c.isRemoved ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
                >
                  <SaintCard
                    saint={c.saint}
                    side="right"
                    isRevealed={c.isRevealed}
                    isSelected={c.isSelected}
                    isMatched={c.isMatched}
                    isRemoved={c.isRemoved}
                    onClick={() => clickRight(i)}
                    disabled={lock}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  )
}