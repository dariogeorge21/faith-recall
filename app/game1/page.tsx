'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { SAINTS_DATA } from '@/lib/gameData'
import SaintCard from '@/components/SaintCard'
import Timer from '@/components/Timer'

/**
 * CardState Interface
 * 
 * Represents the state of a single card in the memory matching game.
 * Each card tracks its saint data and various visual/interaction states.
 */
interface CardState {
  saint: typeof SAINTS_DATA[0]  // Reference to the saint data (id, name, image)
  isRevealed: boolean            // Whether the card is currently face-up
  isSelected: boolean            // Whether this card is the currently selected first card
  isMatched: boolean             // Whether this card is part of a successful match (shows green glow)
  isRemoved: boolean             // Whether this card has been removed after successful match
}

/**
 * Game 1: Saints Memory Match
 * 
 * A memory matching game where players match saint images (left side) with their names (right side).
 * 
 * Game Mechanics:
 * - Initial 1-second reveal of all cards
 * - 90-second timer
 * - Players select one card from either side, then match it with a card from the opposite side
 * - Scoring based on match time and combo multiplier
 * - Automatic transition to Game 2 when all matches complete or timer expires
 * 
 * @returns {JSX.Element} The Game 1 page component
 */
export default function Game1Page() {
  const router = useRouter()
  
  // Zustand store actions and state for game scoring
  const { 
    addGame1Score,      // Add points for correct match
    addGame1Penalty,    // Subtract points for incorrect match
    incrementGame1Combo, // Increase combo multiplier
    resetGame1Combo,    // Reset combo after wrong match
    game1Combo          // Current combo level (0-5)
  } = useGameStore()
  
  // ==================== State Management ====================
  
  /** Array of card states for the left side (saint images) */
  const [leftCards, setLeftCards] = useState<CardState[]>([])
  
  /** Array of card states for the right side (saint names) */
  const [rightCards, setRightCards] = useState<CardState[]>([])
  
  /** Remaining game time in seconds (90 seconds total) */
  const [timeRemaining, setTimeRemaining] = useState(90)
  
  /** Whether cards are in initial reveal phase (first 1 second) */
  const [initialReveal, setInitialReveal] = useState(true)
  
  /** 
   * Tracks the first selected card in a match attempt.
   * null = no card selected yet
   * { side, index } = first card selected
   */
  const [firstSelected, setFirstSelected] = useState<{ side: 'left' | 'right'; index: number } | null>(null)
  
  /** Timestamp when first card was selected (for calculating match time and score) */
  const [matchStartTime, setMatchStartTime] = useState<number | null>(null)
  
  /** Whether a match is currently being processed (prevents multiple clicks during animation) */
  const [isProcessing, setIsProcessing] = useState(false)
  
  /** Whether the game has started (after initial 1-second reveal) */
  const [gameStarted, setGameStarted] = useState(false)

  // ==================== Card Initialization ====================
  
  /**
   * useEffect: Initialize game cards on component mount
   * 
   * This effect:
   * 1. Shuffles saints data for both left and right sides independently
   * 2. Creates initial card states with all cards revealed
   * 3. After 1 second, flips all cards face-down and starts the game
   * 
   * Dependencies: [] (runs once on mount)
   */
  useEffect(() => {
    // Shuffle saints for left side (images)
    const shuffledSaints = [...SAINTS_DATA].sort(() => Math.random() - 0.5)
    
    setLeftCards(
      shuffledSaints.map((saint) => ({
        saint,
        isRevealed: true,  // Initially revealed for 1 second
        isSelected: false,
        isMatched: false,
        isRemoved: false,
      }))
    )

    // Shuffle saints for right side (names) independently
    const shuffledSaintsRight = [...SAINTS_DATA].sort(() => Math.random() - 0.5)
    setRightCards(
      shuffledSaintsRight.map((saint) => ({
        saint,
        isRevealed: true,  // Initially revealed for 1 second
        isSelected: false,
        isMatched: false,
        isRemoved: false,
      }))
    )

    // After 1 second, flip all cards and start game
    const timer = setTimeout(() => {
      setInitialReveal(false)
      setGameStarted(true)
      // Flip all cards face-down
      setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
      setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // ==================== Game Timer ====================
  
  /**
   * useEffect: Game countdown timer
   * 
   * Decrements timeRemaining every second once game has started.
   * When timer reaches 0, automatically transitions to Game 2.
   * 
   * Dependencies: [gameStarted, timeRemaining, router]
   * - Triggers when game starts or time changes
   */
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

  // ==================== Win Condition Check ====================
  
  /**
   * useEffect: Check for game completion
   * 
   * Monitors card states to detect when all 10 pairs have been matched.
   * When all cards are removed (matched), automatically transitions to Game 2.
   * 
   * Dependencies: [leftCards, rightCards, gameStarted, isProcessing, router]
   * - Triggers whenever card states change
   */
  useEffect(() => {
    // Check if all cards on both sides have been removed (matched)
    const allMatched = leftCards.every((card) => card.isRemoved) && rightCards.every((card) => card.isRemoved)
    
    if (allMatched && gameStarted && !isProcessing) {
      // Small delay before transition for smooth UX
      setTimeout(() => {
        router.push('/game2')
      }, 500)
    }
  }, [leftCards, rightCards, gameStarted, isProcessing, router])

  // ==================== Card Click Handler ====================
  
  /**
   * handleCardClick: Main game logic for card selection and matching
   * 
   * Implements the three-phase card selection system:
   * 1. First card selection: Reveals selected card and all cards on opposite side
   * 2. Changing first selection: Allows player to change their first card choice
   * 3. Second card selection: Validates match and handles scoring/animations
   * 
   * @param {string} side - Which side was clicked ('left' or 'right')
   * @param {number} index - Index of the clicked card in its array
   * 
   * Algorithm:
   * - If no card selected: Select first card, reveal opposite side
   * - If same side clicked: Change first selection (opposite side stays revealed)
   * - If opposite side clicked: Validate match, calculate score, animate result
   */
  const handleCardClick = useCallback((side: 'left' | 'right', index: number) => {
    // Prevent clicks during initial reveal, before game starts, or during match processing
    if (!gameStarted || isProcessing || initialReveal) return

    // ========== Phase 1: First Card Selection ==========
    if (firstSelected === null) {
      // No card selected yet - this is the first selection
      setFirstSelected({ side, index })
      setMatchStartTime(Date.now())  // Start timing for score calculation

      if (side === 'left') {
        // Left card selected: reveal it and all right cards
        setLeftCards((prev) =>
          prev.map((card, i) => ({
            ...card,
            isSelected: i === index,  // Highlight selected card
            isRevealed: i === index,  // Show selected card content
          }))
        )
        // Reveal all right cards so player can see options
        setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: true })))
      } else {
        // Right card selected: reveal it and all left cards
        setRightCards((prev) =>
          prev.map((card, i) => ({
            ...card,
            isSelected: i === index,
            isRevealed: i === index,
          }))
        )
        // Reveal all left cards so player can see options
        setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: true })))
      }
    } 
    // ========== Phase 2: Changing First Selection ==========
    else if (firstSelected.side === side) {
      // Player clicked a different card on the same side as their first selection
      // Update selection without re-hiding opposite side
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
      setMatchStartTime(Date.now())  // Reset timer for new selection
    } 
    // ========== Phase 3: Second Card Selection (Match Validation) ==========
    else {
      // Player clicked a card on the opposite side - validate match
      setIsProcessing(true)  // Lock interactions during processing

      // Get both selected cards
      const firstCard = firstSelected.side === 'left' 
        ? leftCards[firstSelected.index]
        : rightCards[firstSelected.index]
      const secondCard = side === 'left'
        ? leftCards[index]
        : rightCards[index]

      // Check if cards match (same saint ID)
      const isMatch = firstCard.saint.id === secondCard.saint.id

      if (isMatch) {
        // ========== CORRECT MATCH ==========
        
        // Calculate match time for scoring
        const matchTime = matchStartTime ? (Date.now() - matchStartTime) / 1000 : 0
        const matchTimeMs = matchStartTime ? Date.now() - matchStartTime : 0

        // ========== Score Calculation ==========
        // Base Points Formula: 1000 - (match_time_seconds × 50), minimum 100
        const basePoints = Math.max(100, 1000 - matchTime * 50)
        
        // Combo Multiplier progression:
        // 0 matches: 1.0x, 1 match: 1.2x, 2 matches: 1.5x, 3 matches: 2.0x, 4+ matches: 2.5x
        const comboMultiplier = game1Combo === 0 ? 1.0 : 
          game1Combo === 1 ? 1.2 :
          game1Combo === 2 ? 1.5 :
          game1Combo === 3 ? 2.0 : 2.5
        
        // Tie-breaker: milliseconds modulo 10 (adds 0-9 points for ranking)
        const tieBreaker = matchTimeMs % 10
        
        // Final match score
        const matchScore = Math.round(basePoints * comboMultiplier) + tieBreaker

        // Update game state
        addGame1Score(matchScore)
        incrementGame1Combo()

        // ========== Visual Feedback: Green Glow Animation ==========
        // Mark both cards as matched to trigger green glow animation
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

        // ========== Remove Matched Cards After Animation ==========
        // After 800ms (green glow animation duration), remove matched cards
        setTimeout(() => {
          const matchedSaintId = firstCard.saint.id
          
          // Remove matched cards from both sides by matching saint ID
          setLeftCards((prev) =>
            prev.map((card) => ({
              ...card,
              isRemoved: card.saint.id === matchedSaintId || card.isRemoved,
              isMatched: false,  // Clear match animation state
              isRevealed: false, // Hide card
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

          // Flip all remaining cards face-down for next match attempt
          setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
          setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))

          // Reset selection state for next match
          setFirstSelected(null)
          setMatchStartTime(null)
          setIsProcessing(false)
        }, 800)
      } else {
        // ========== INCORRECT MATCH ==========
        
        // Apply penalty: -150 points
        addGame1Penalty(150)
        resetGame1Combo()  // Reset combo multiplier to 1.0x

        // ========== Visual Feedback: Red Shake Animation ==========
        // Clear selection highlights (shake animation handled by SaintCard component)
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

        // ========== Reset Cards After Animation ==========
        // After 800ms (red shake animation duration), flip all cards face-down
        setTimeout(() => {
          setLeftCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))
          setRightCards((prev) => prev.map((card) => ({ ...card, isRevealed: false })))

          // Reset selection state for next match attempt
          setFirstSelected(null)
          setMatchStartTime(null)
          setIsProcessing(false)
        }, 800)
      }
    }
  }, [firstSelected, leftCards, rightCards, matchStartTime, gameStarted, isProcessing, addGame1Score, addGame1Penalty, incrementGame1Combo, resetGame1Combo, game1Combo, initialReveal])

  // ==================== Render ====================
  
  return (
    <div className="min-h-screen flex flex-col p-8">
      {/* Header Section: Game Title and Timer */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-burgundy-700 mb-4">
          Game 1: Saints Memory Match
        </h1>
        <Timer seconds={timeRemaining} size="medium" />
      </div>

      {/* Main Game Container: Constrained width for better focus */}
      <div className="flex-1 grid grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        {/* Left Column: Saint Images */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-burgundy-700">Images</h2>
          <div className="grid grid-cols-1 gap-4">
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

        {/* Right Column: Saint Names */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-burgundy-700">Names</h2>
          <div className="grid grid-cols-1 gap-4">
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
