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
  const [showTutorial, setShowTutorial] = useState(false)
  const [isFirstCardSelected, setIsFirstCardSelected] = useState(false)
  const [showIdleHint, setShowIdleHint] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const timerStartedRef = useRef(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastInteractionRef = useRef<number>(0)

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
          setTimeout(() => {
            setGameStarted(true)
            lastInteractionRef.current = Date.now()
            startIdleTimer()
          }, 300)
        }, 500)
      })
      .catch(err => {
        console.error('Error preloading images:', err)
        setImagesLoaded(true)
        setGameStarted(true)
        lastInteractionRef.current = Date.now()
        startIdleTimer()
      })
  }, [])

  /* ---------- IDLE DETECTION FOR HINTS ---------- */
  const startIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      if (!hasInteracted && gameStarted && showTutorial) {
        setShowIdleHint(true)
      }
    }, 8000) // Show hint after 8 seconds of no interaction
  }

  const handleUserInteraction = () => {
    setHasInteracted(true)
    setShowIdleHint(false)
    lastInteractionRef.current = Date.now()
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
  }

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
    handleUserInteraction()
    if (!isFirstCardSelected) {
      setIsFirstCardSelected(true)
      setShowTutorial(false)
    }
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
    handleUserInteraction()
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
        <div className="pt-6 pb-6 text-center shrink-0 z-10 w-full">
          
          <div className="mt-0">
            <Timer seconds={timeRemaining} size="small" />
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

        {/* TUTORIAL OVERLAY - First Time Guidance */}
        {showTutorial && gameStarted && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="text-center space-y-6 px-6 animate-in zoom-in duration-700">
              <div className="text-6xl animate-bounce">👇</div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                Click any card to begin
              </div>
              <div className="text-xl text-white/80 max-w-md mx-auto">
                Match saints with their names
              </div>
              <div className="pt-4 text-sm text-white/60 animate-pulse">
                (Click to dismiss)
              </div>
            </div>
          </div>
        )}

        {/* IDLE HINT - Gentle Reminder */}
        {showIdleHint && !isFirstCardSelected && !showTutorial && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-amber-400/20 border border-amber-400/40 rounded-full px-6 py-3 backdrop-blur-sm">
              <p className="text-amber-200 font-semibold text-center">
                ✨ Tap any card to start matching
              </p>
            </div>
          </div>
        )}

        {/* FIRST CARD GUIDANCE - After First Selection */}
        {isFirstCardSelected && selectedLeft !== null && selectedRight === null && !showTutorial && (
          <div className="absolute top-40 right-12 z-20 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-green-400/20 border border-green-400/40 rounded-2xl px-6 py-4 backdrop-blur-sm flex items-center gap-3">
              <span className="text-2xl animate-pulse">👉</span>
              <div>
                <p className="text-green-200 font-semibold">Find the match</p>
                <p className="text-green-100/70 text-sm">on this side</p>
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
                  const shouldHighlight = !isFirstCardSelected && !showTutorial
                  
                  return (
                    <div 
                      key={`l-${c.saint.id}`} 
                      className={`animate-in fade-in slide-in-from-left-8 duration-700 ${shouldHighlight && !c.isRevealed ? 'animate-pulse-gentle' : ''}`}
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
                        shouldPulse={shouldHighlight && !c.isRevealed}
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
                  const shouldHighlight = isFirstCardSelected && selectedLeft !== null && selectedRight === null
                  
                  return (
                    <div 
                      key={`r-${c.saint.id}`} 
                      className={`animate-in fade-in slide-in-from-right-8 duration-700 ${shouldHighlight && !c.isRevealed ? 'animate-pulse-strong' : ''}`}
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
                        shouldHighlight={shouldHighlight && !c.isRevealed}
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
        
        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.8;
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.2);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 30px 0 rgba(251, 191, 36, 0.3);
          }
        }
        
        @keyframes pulse-strong {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        .animate-pulse-strong {
          animation: pulse-strong 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}