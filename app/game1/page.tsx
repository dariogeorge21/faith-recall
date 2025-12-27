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
    })))

    setRightCards([...shuffled].sort(() => Math.random() - 0.5).map((s) => ({
      saint: s,
      isRevealed: false,
      isSelected: false,
      isMatched: false,
    })))
  }, [])

  /* ---------- AUTO-TRANSITION ON COMPLETION ---------- */
  useEffect(() => {
    // If all cards are filtered out, the game is complete
    if (leftCards.length === 0 && SAINTS_DATA.length > 0) {
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

  /* ---------- CLICK HANDLERS ---------- */
  const clickLeft = (index: number) => {
    if (lock) return
    if (selectedLeft === index) {
      setLeftCards(prev => prev.map((c, i) => i === index ? { ...c, isRevealed: false, isSelected: false } : c))
      setSelectedLeft(null)
      return
    }
    setLeftCards(prev => prev.map((c, i) => {
      if (i === selectedLeft) return { ...c, isRevealed: false, isSelected: false }
      if (i === index) return { ...c, isRevealed: true, isSelected: true }
      return c
    }))
    setSelectedLeft(index)
  }

  const clickRight = (index: number) => {
    if (lock) return
    if (selectedRight === index) {
      setRightCards(prev => prev.map((c, i) => i === index ? { ...c, isRevealed: false, isSelected: false } : c))
      setSelectedRight(null)
      return
    }
    setRightCards(prev => prev.map((c, i) => {
      if (i === selectedRight) return { ...c, isRevealed: false, isSelected: false }
      if (i === index) return { ...c, isRevealed: true, isSelected: true }
      return c
    }))
    setSelectedRight(index)
  }

  /* ---------- MATCH LOGIC: Physically removes cards to slide up below items ---------- */
  useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return

    setLock(true)
    const left = leftCards[selectedLeft]
    const right = rightCards[selectedRight]

    if (left.saint.id === right.saint.id) {
      setMatchStatus('correct')
      addGame1Score(500)
      setTimeout(() => {
        // FILTER: Removes the pair so the container shrinks and cards slide up
        setLeftCards(prev => prev.filter((_, i) => i !== selectedLeft))
        setRightCards(prev => prev.filter((_, i) => i !== selectedRight))
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
  }, [selectedLeft, selectedRight, leftCards, rightCards, addGame1Score])

  const resetSelection = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatchStatus(null)
    setLock(false)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-black overflow-hidden font-sans">
      
      {/* HEADER SECTION */}
      <div className="pt-8 pb-4 text-center shrink-0 z-10">
        <h1 className={`text-4xl font-black transition-all duration-500 tracking-tighter uppercase ${
          matchStatus === 'correct' ? 'text-green-400 scale-105' : 
          matchStatus === 'wrong' ? 'text-red-500' : 'text-amber-400'
        }`}>
          {matchStatus === 'correct' ? 'Great Match!' : matchStatus === 'wrong' ? 'Not a Pair' : 'Hall of Saints'}
        </h1>
        <div className="mt-4">
          <Timer seconds={timeRemaining} size="large" />
        </div>
      </div>

      {/* AUTO-SHRINKING CONTAINER */}
      <div className="flex-1 w-full flex items-start justify-center px-4 overflow-y-auto custom-scrollbar pb-10">
        <div className="w-full max-w-5xl bg-white/[0.03] backdrop-blur-xl rounded-[40px] border border-white/10 p-8 sm:p-12 shadow-2xl transition-all duration-500 ease-in-out">
          
          <div className="grid grid-cols-2 gap-6 sm:gap-10 justify-items-center">
            {/* Left Column (Images) */}
            <div className="flex flex-col gap-4 w-full">
              {leftCards.map((c, i) => (
                <div key={`l-${c.saint.id}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SaintCard
                    saint={c.saint}
                    side="left"
                    isRevealed={c.isRevealed}
                    isSelected={c.isSelected}
                    isMatched={false}
                    isRemoved={false}
                    onClick={() => clickLeft(i)}
                    disabled={lock}
                  />
                </div>
              ))}
            </div>

            {/* Right Column (Names) */}
            <div className="flex flex-col gap-4 w-full">
              {rightCards.map((c, i) => (
                <div key={`r-${c.saint.id}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SaintCard
                    saint={c.saint}
                    side="right"
                    isRevealed={c.isRevealed}
                    isSelected={c.isSelected}
                    isMatched={false}
                    isRemoved={false}
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  )
}