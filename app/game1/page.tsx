'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { SAINTS_DATA } from '@/lib/gameData'
import SaintCard from '@/components/SaintCard'
import Timer from '@/components/Timer'
import Image from 'next/image'

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
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set())
  const [wrongPairs, setWrongPairs] = useState<Set<string>>(new Set())
  const timerStartedRef = useRef(false)

  /* ---------- PRELOAD IMAGES ---------- */
  useEffect(() => {
    const imageUrls = SAINTS_DATA.map(saint => saint.image)
    let loadedCount = 0
    
    const preloadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / imageUrls.length) * 100))
          resolve()
        }
        img.onerror = reject
        img.src = url
      })
    }

    Promise.all(imageUrls.map(preloadImage))
      .then(() => {
        setTimeout(() => {
          setImagesLoaded(true)
          setTimeout(() => setGameStarted(true), 300)
        }, 500)
      })
      .catch(err => {
        console.error('Error preloading images:', err)
        setImagesLoaded(true)
        setGameStarted(true)
      })
  }, [])

  /* ---------- INITIALIZE GAME ---------- */
  useEffect(() => {
    if (!imagesLoaded) return

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
  }, [imagesLoaded])

  /* ---------- AUTO-TRANSITION ON COMPLETION ---------- */
  useEffect(() => {
    if (!gameStarted) return
    // If all cards are filtered out, the game is complete
    if (leftCards.length === 0 && SAINTS_DATA.length > 0) {
      const timer = setTimeout(() => router.push('/game2'), 2000)
      return () => clearTimeout(timer)
    }
  }, [leftCards, router, gameStarted])

  /* ---------- TIMER ---------- */
  useEffect(() => {
    if (!gameStarted || timerStartedRef.current) return
    timerStartedRef.current = true
    
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
  }, [router, gameStarted])

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
      setMatchedPairs(prev => new Set(prev).add(left.saint.id))
      addGame1Score(500)
      setTimeout(() => {
        // FILTER: Removes the pair so the container shrinks and cards slide up
        setLeftCards(prev => prev.filter((_, i) => i !== selectedLeft))
        setRightCards(prev => prev.filter((_, i) => i !== selectedRight))
        resetSelection()
      }, 800) 
    } else {
      setMatchStatus('wrong')
      const pairKey = `${selectedLeft}-${selectedRight}`
      setWrongPairs(prev => new Set(prev).add(pairKey))
      setTimeout(() => {
        setLeftCards(prev => prev.map((c, i) => i === selectedLeft ? { ...c, isRevealed: false, isSelected: false } : c))
        setRightCards(prev => prev.map((c, i) => i === selectedRight ? { ...c, isRevealed: false, isSelected: false } : c))
        setWrongPairs(prev => {
          const newSet = new Set(prev)
          newSet.delete(pairKey)
          return newSet
        })
        resetSelection()
      }, 1000)
    }
  }, [selectedLeft, selectedRight, leftCards, rightCards, addGame1Score])

  const resetSelection = () => {
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatchStatus(null)
    setLock(false)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-black font-sans" style={{ overflow: 'hidden' }}>
      
      {/* LOADING SCREEN */}
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#05070f] via-[#0b1020] to-black">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="text-7xl font-black text-amber-400 animate-pulse">
                Loading Saints...
              </div>
              <div className="mt-4 h-3 w-96 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="mt-2 text-2xl text-amber-300/70 font-bold">
                {loadingProgress}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME CONTENT */}
      <div className={`flex-1 w-full flex flex-col transition-opacity duration-700 ${gameStarted ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
        {/* HEADER SECTION */}
        <div className="pt-12 pb-6 text-center shrink-0 z-10">
          <h1 className={`text-6xl font-black transition-all duration-500 tracking-tighter uppercase ${
            matchStatus === 'correct' ? 'text-green-400 scale-110 drop-shadow-[0_0_30px_rgba(74,222,128,0.6)]' : 
            matchStatus === 'wrong' ? 'text-red-500 animate-shake' : 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]'
          }`}>
            {matchStatus === 'correct' ? '🎉 Perfect Match!' : matchStatus === 'wrong' ? '❌ Try Again' : '✨ Hall of Saints'}
          </h1>
          <div className="mt-6">
            <Timer seconds={timeRemaining} size="large" />
          </div>
        </div>

        {/* GAME COMPLETION CELEBRATION */}
        {leftCards.length === 0 && SAINTS_DATA.length > 0 && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="text-center space-y-6 animate-in zoom-in duration-700">
              <div className="text-8xl">🎊</div>
              <div className="text-7xl font-black text-amber-400 drop-shadow-[0_0_40px_rgba(251,191,36,0.8)]">
                Congratulations!
              </div>
              <div className="text-3xl text-white/90">
                All Saints Matched!
              </div>
            </div>
          </div>
        )}

        {/* AUTO-SHRINKING CONTAINER */}
        <div className="flex-1 w-full flex items-start justify-center px-12 overflow-y-auto custom-scrollbar pb-10" style={{ minHeight: 0 }}>
          <div className="w-full max-w-7xl bg-white/[0.03] backdrop-blur-xl rounded-[40px] border border-white/10 p-12 shadow-2xl transition-all duration-500 ease-in-out my-auto">
            
            <div className="grid grid-cols-2 gap-16 justify-items-center">
              {/* Left Column (Images) */}
              <div className="flex flex-col gap-6 w-full max-w-md">
                {leftCards.map((c, i) => {
                  const isCurrentlyMatched = matchedPairs.has(c.saint.id) && selectedLeft === i
                  const isWrong = Array.from(wrongPairs).some(pair => pair.startsWith(`${i}-`))
                  
                  return (
                    <div 
                      key={`l-${c.saint.id}`} 
                      className="animate-in fade-in slide-in-from-left-8 duration-700"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <SaintCard
                        saint={c.saint}
                        side="left"
                        isRevealed={c.isRevealed}
                        isSelected={c.isSelected}
                        isMatched={isCurrentlyMatched}
                        isWrong={isWrong}
                        isRemoved={false}
                        onClick={() => clickLeft(i)}
                        disabled={lock}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Right Column (Names) */}
              <div className="flex flex-col gap-6 w-full max-w-md">
                {rightCards.map((c, i) => {
                  const isCurrentlyMatched = matchedPairs.has(c.saint.id) && selectedRight === i
                  const isWrong = Array.from(wrongPairs).some(pair => pair.endsWith(`-${i}`))
                  
                  return (
                    <div 
                      key={`r-${c.saint.id}`} 
                      className="animate-in fade-in slide-in-from-right-8 duration-700"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <SaintCard
                        saint={c.saint}
                        side="right"
                        isRevealed={c.isRevealed}
                        isSelected={c.isSelected}
                        isMatched={isCurrentlyMatched}
                        isWrong={isWrong}
                        isRemoved={false}
                        onClick={() => clickRight(i)}
                        disabled={lock}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(251, 191, 36, 0.2); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(251, 191, 36, 0.4); 
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}