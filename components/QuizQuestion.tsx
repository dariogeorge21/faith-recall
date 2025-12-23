'use client'

import { QuizQuestion as QuizQuestionType } from '@/lib/gameData'
import { useState, useEffect } from 'react'

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
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (disabled || isAnswered) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (!isAnswered) {
            handleTimeout()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [disabled, isAnswered])

  const handleAnswer = (answer: string) => {
    if (disabled || isAnswered) return

    const timeTaken = timeLimit - timeRemaining
    setSelectedAnswer(answer)
    setIsAnswered(true)

    // Show feedback for 300-500ms, then auto-advance
    setTimeout(() => {
      onAnswer(answer, timeTaken)
    }, 400)
  }

  const handleTimeout = () => {
    if (disabled || isAnswered) return

    setIsAnswered(true)
    setTimeout(() => {
      onAnswer('', timeLimit) // Timeout = wrong answer
    }, 300)
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

