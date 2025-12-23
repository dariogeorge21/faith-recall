'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { SAINTS_DATA } from '@/lib/gameData'
import SaintCard from '@/components/SaintCard'
import Timer from '@/components/Timer'

interface CardState {
  saint: typeof SAINTS_DATA[0]
  isRevealed: boolean
  isSelected: boolean
  isMatched: boolean
  isRemoved: boolean
}

export default function Game1Page() {
  const router = useRouter()
  const { addGame1Score, addGame1Penalty, incrementGame1Combo, resetGame1Combo, game1Combo } = useGameStore()
  
  const [leftCards, setLeftCards] = useState<CardState[]>([])
  const [rightCards, setRightCards] = useState<CardState[]>([])
  const [timeRemaining, setTimeRemaining] = useState(90)
  const [initialReveal, setInitialReveal] = useState(true)
  const [firstSelected, setFirstSelected] = useState<{ side: 'left' | 'right'; index: number } | null>(null)
  const [matchStartTime, setMatchStartTime] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize cards
  useEffect(() => {
    const shuffledSaints = [...SAINTS_DATA].sort(() => Math.random() - 0.5)
    
    setLeftCards(
      shuffledSaints.map((saint) => ({
        saint,
        isRevealed: true, // Initial reveal
        isSelected: false,
        isMatched: false,
        isRemoved: false,
      }))
    )

    const shuffledSaintsRight = [...SAINTS_DATA].sort(() => Math.random() - 0.5)
    setRightCards(
      shuffledSaintsRight.map((saint) => ({
        saint,
        isRevealed: true, // Initial reveal
        isSelected: false,
        isMatched: false,
        isRemoved: false,
      }))
    )

    // After 1 second, flip all cards and start game
    const timer = setTimeout(() => {
      setInitialReveal(false)
      setGameStarted(true)
      setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
      setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Game timer
  useEffect(() => {
    if (!gameStarted || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Game over - transition to Game 2
          setTimeout(() => {
            router.push('/game2')
          }, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, timeRemaining, router])

  // Check if all matches complete
  useEffect(() => {
    const allMatched = leftCards.every((card) => card.isRemoved) && rightCards.every((card) => card.isRemoved)
    if (allMatched && gameStarted && !isProcessing) {
      setTimeout(() => {
        router.push('/game2')
      }, 500)
    }
  }, [leftCards, rightCards, gameStarted, isProcessing, router])

  const handleCardClick = useCallback((side: 'left' | 'right', index: number) => {
    if (!gameStarted || isProcessing || initialReveal) return

    if (firstSelected === null) {
      // First card selection
      setFirstSelected({ side, index })
      setMatchStartTime(Date.now())

      if (side === 'left') {
        setLeftCards((prev) =>
          prev.map((card, i) => ({
            ...card,
            isSelected: i === index,
            isRevealed: i === index,
          }))
        )
        // Reveal all right cards
        setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: true })))
      } else {
        setRightCards((prev) =>
          prev.map((card, i) => ({
            ...card,
            isSelected: i === index,
            isRevealed: i === index,
          }))
        )
        // Reveal all left cards
        setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: true })))
      }
    } else if (firstSelected.side === side) {
      // Changing first selection on same side
      if (side === 'left') {
        setLeftCards((prev) =>
          prev.map((card, i) => ({
            ...card,
            isSelected: i === index,
            isRevealed: i === index,
          }))
        )
      } else {
        setRightCards((prev) =>
          prev.map((card, i) => ({
            ...card,
            isSelected: i === index,
            isRevealed: i === index,
          }))
        )
      }
      setFirstSelected({ side, index })
    } else {
      // Second card selection (opposite side)
      setIsProcessing(true)

      const firstCard = firstSelected.side === 'left' 
        ? leftCards[firstSelected.index]
        : rightCards[firstSelected.index]
      const secondCard = side === 'left'
        ? leftCards[index]
        : rightCards[index]

      const isMatch = firstCard.saint.id === secondCard.saint.id

      if (isMatch) {
        // Correct match
        const matchTime = matchStartTime ? (Date.now() - matchStartTime) / 1000 : 0
        const matchTimeMs = matchStartTime ? Date.now() - matchStartTime : 0

        // Calculate score
        const basePoints = Math.max(100, 1000 - matchTime * 50)
        const comboMultiplier = game1Combo === 0 ? 1.0 : 
          game1Combo === 1 ? 1.2 :
          game1Combo === 2 ? 1.5 :
          game1Combo === 3 ? 2.0 : 2.5
        const tieBreaker = matchTimeMs % 10
        const matchScore = Math.round(basePoints * comboMultiplier) + tieBreaker

        addGame1Score(matchScore)
        incrementGame1Combo()

        // Show green glow
        if (firstSelected.side === 'left') {
          setLeftCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isMatched: i === firstSelected.index,
              isSelected: false,
            }))
          )
        } else {
          setRightCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isMatched: i === firstSelected.index,
              isSelected: false,
            }))
          )
        }

        if (side === 'left') {
          setLeftCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isMatched: i === index,
              isSelected: false,
            }))
          )
        } else {
          setRightCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isMatched: i === index,
              isSelected: false,
            }))
          )
        }

        // After 800ms, remove cards and reset
        setTimeout(() => {
          const matchedSaintId = firstCard.saint.id
          
          // Remove matched cards from both sides
          setLeftCards((prev) =>
            prev.map((card) => ({
              ...card,
              isRemoved: card.saint.id === matchedSaintId || card.isRemoved,
              isMatched: false,
              isRevealed: false,
            }))
          )
          
          setRightCards((prev) =>
            prev.map((card) => ({
              ...card,
              isRemoved: card.saint.id === matchedSaintId || card.isRemoved,
              isMatched: false,
              isRevealed: false,
            }))
          )

          // Flip all remaining cards face-down
          setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
          setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))

          setFirstSelected(null)
          setMatchStartTime(null)
          setIsProcessing(false)
        }, 800)
      } else {
        // Incorrect match
        addGame1Penalty(150)
        resetGame1Combo()

        // Show red shake
        if (firstSelected.side === 'left') {
          setLeftCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isSelected: false,
            }))
          )
        } else {
          setRightCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isSelected: false,
            }))
          )
        }

        if (side === 'left') {
          setLeftCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isSelected: false,
            }))
          )
        } else {
          setRightCards((prev) =>
            prev.map((card, i) => ({
              ...card,
              isSelected: false,
            }))
          )
        }

        // After 800ms, flip all cards face-down
        setTimeout(() => {
          setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
          setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))

          setFirstSelected(null)
          setMatchStartTime(null)
          setIsProcessing(false)
        }, 800)
      }
    }
  }, [firstSelected, leftCards, rightCards, matchStartTime, gameStarted, isProcessing, addGame1Score, addGame1Penalty, incrementGame1Combo, resetGame1Combo, game1Combo])

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-burgundy-700 mb-2">
          Game 1: Saints Memory Match
        </h1>
        <Timer seconds={timeRemaining} size="medium" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto w-full">
        {/* Left side - Images */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-burgundy-700">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {leftCards.map((card, index) => (
              <SaintCard
                key={`left-${card.saint.id}-${index}`}
                saint={card.saint}
                isRevealed={card.isRevealed}
                isSelected={card.isSelected}
                isMatched={card.isMatched}
                isRemoved={card.isRemoved}
                side="left"
                onClick={() => handleCardClick('left', index)}
                disabled={isProcessing || !gameStarted}
              />
            ))}
          </div>
        </div>

        {/* Right side - Names */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-burgundy-700">Names</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {rightCards.map((card, index) => (
              <SaintCard
                key={`right-${card.saint.id}-${index}`}
                saint={card.saint}
                isRevealed={card.isRevealed}
                isSelected={card.isSelected}
                isMatched={card.isMatched}
                isRemoved={card.isRemoved}
                side="right"
                onClick={() => handleCardClick('right', index)}
                disabled={isProcessing || !gameStarted}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

