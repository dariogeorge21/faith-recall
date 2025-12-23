'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import { BIBLE_QUIZ_DATA } from '@/lib/gameData'
import QuizQuestion from '@/components/QuizQuestion'
import Timer from '@/components/Timer'

export default function Game2Page() {
  const router = useRouter()
  const { addGame2Score } = useGameStore()
  const [questions, setQuestions] = useState([...BIBLE_QUIZ_DATA])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(90)
  const [gameStarted, setGameStarted] = useState(false)

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...BIBLE_QUIZ_DATA].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setGameStarted(true)
  }, [])

  // Total game timer
  useEffect(() => {
    if (!gameStarted || totalTimeRemaining <= 0) return

    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          // Game over - transition to verification
          setTimeout(() => {
            router.push('/verify-code')
          }, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStarted, totalTimeRemaining, router])

  const handleAnswer = (answer: string, timeTaken: number) => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correctAnswer

    if (isCorrect) {
      // Calculate score: 1000 - (time_in_seconds × 50), minimum 250
      const points = Math.max(250, 1000 - timeTaken * 50)
      addGame2Score(points)
    }

    // Auto-advance to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // All questions answered - transition to verification
      setTimeout(() => {
        router.push('/verify-code')
      }, 500)
    }
  }

  if (!gameStarted || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-3xl font-bold text-burgundy-700">Loading...</div>
      </div>
    )
  }

  if (currentQuestionIndex >= questions.length) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-burgundy-700 mb-2">
          Game 2: Emoji Bible Quiz
        </h1>
        <Timer seconds={totalTimeRemaining} size="medium" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <QuizQuestion
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          timeLimit={15}
        />
      </div>
    </div>
  )
}

