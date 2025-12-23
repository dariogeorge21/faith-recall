'use client'

import { QuizQuestion as QuizQuestionType } from '@/lib/gameData'
import { useState, useEffect, useRef, useCallback } from 'react'

interface QuizQuestionProps {
  question: QuizQuestionType
  onAnswer: (answer: string, timeTaken: number) => void
  timeLimit: number
  disabled?: boolean
}

export default function QuizQuestion({
  question,
  onAnswer,
  timeLimit,
  disabled = false,
}: QuizQuestionProps) {
  // State for current question
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const questionIdRef = useRef<number>(question.id)
  const isAnsweredRef = useRef<boolean>(false)

  // Keep ref in sync with state
  useEffect(() => {
    isAnsweredRef.current = isAnswered
  }, [isAnswered])

  // Reset all state when question changes
  useEffect(() => {
    // Check if question has actually changed
    if (questionIdRef.current !== question.id) {
      // Reset all state for new question
      setTimeRemaining(timeLimit)
      setSelectedAnswer(null)
      setIsAnswered(false)
      isAnsweredRef.current = false
      startTimeRef.current = Date.now()
      questionIdRef.current = question.id
    }
  }, [question.id, timeLimit])

  // Handle timeout callback
  const handleTimeout = useCallback(() => {
    if (disabled || isAnsweredRef.current) return

    setIsAnswered(true)
    isAnsweredRef.current = true
    setTimeout(() => {
      onAnswer('', timeLimit) // Timeout = wrong answer
    }, 300)
  }, [disabled, timeLimit, onAnswer])

  // Timer effect - resets when question changes
  useEffect(() => {
    // Reset timer when question changes
    setTimeRemaining(timeLimit)
    startTimeRef.current = Date.now()
    setIsAnswered(false)
    isAnsweredRef.current = false
    
    if (disabled) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (!isAnsweredRef.current) {
            handleTimeout()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [question.id, disabled, timeLimit, handleTimeout])

  const handleAnswer = (answer: string) => {
    if (disabled || isAnswered) return

    const timeTaken = timeLimit - timeRemaining
    setSelectedAnswer(answer)
    setIsAnswered(true)
    isAnsweredRef.current = true

    // Show feedback for 300-500ms, then auto-advance
    setTimeout(() => {
      onAnswer(answer, timeTaken)
    }, 400)
  }

  const isCorrect = selectedAnswer === question.correctAnswer
  const showFeedback = isAnswered && selectedAnswer !== null

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Timer */}
      <div className="mb-6 text-center">
        <div className="inline-block px-6 py-2 bg-burgundy-600 text-white rounded-lg text-2xl font-bold">
          {timeRemaining}s
        </div>
      </div>

      {/* Emojis */}
      <div className="mb-8 text-center">
        <div className="flex justify-center gap-4 text-6xl md:text-8xl">
          {question.emojis.map((emoji, index) => (
            <span key={index}>{emoji}</span>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy-700">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.label
          const showCorrect = showFeedback && option.label === question.correctAnswer
          const showWrong = showFeedback && isSelected && !isCorrect

          return (
            <button
              key={option.label}
              onClick={() => handleAnswer(option.label)}
              disabled={disabled || isAnswered}
              className={`
                px-6 py-4 text-left rounded-lg text-xl md:text-2xl font-semibold
                transition-all touch-manipulation min-h-[80px]
                ${
                  showCorrect
                    ? 'bg-green-500 text-white border-4 border-green-600 animate-flicker'
                    : showWrong
                    ? 'bg-red-500 text-white border-4 border-red-600 animate-flicker'
                    : isSelected
                    ? 'bg-gold-300 text-burgundy-700 border-4 border-gold-500'
                    : 'bg-white text-burgundy-700 border-4 border-burgundy-300 hover:bg-gold-50 hover:border-gold-400'
                }
                disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
              `}
            >
              <span className="font-bold mr-2">{option.label}.</span>
              {option.text}
              {showCorrect && <span className="ml-2">✅</span>}
              {showWrong && <span className="ml-2">❌</span>}
            </button>
          )
        })}
      </div>

      {/* Time's up message */}
      {timeRemaining === 0 && !isAnswered && (
        <div className="mt-4 text-center text-2xl font-bold text-red-600">
          Time's up!
        </div>
      )}
    </div>
  )
}
