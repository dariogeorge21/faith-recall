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

  useEffect(() => {
    const shuffled = [...BIBLE_QUIZ_DATA].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setGameStarted(true)
  }, [])

  useEffect(() => {
    if (!gameStarted || totalTimeRemaining <= 0) return

    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimeout(() => router.push('/verify-code'), 500)
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
      const points = Math.max(250, 1000 - timeTaken * 50)
      addGame2Score(points)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setTimeout(() => router.push('/verify-code'), 500)
    }
  }

  if (!gameStarted || questions.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#05070f]">
        <div className="text-2xl font-semibold text-[#c9a24d] animate-pulse">
          Preparing the challenge…
        </div>
      </div>
    )
  }

  if (currentQuestionIndex >= questions.length) return null

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312]">

      {/* Ambient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 blur-[160px]" />
        <div className="absolute bottom-[-35%] right-1/4 w-[600px] h-[600px] bg-purple-700/20 blur-[180px]" />
      </div>

      {/* Header (COMPACT) */}
      <div className="shrink-0 pt-4 pb-3 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#c9a24d] mb-1">
          Emoji Bible Quiz
        </h1>
        <p className="text-white/60 text-sm mb-3">
          Decode • Answer fast • Earn more points
        </p>
        <div className="flex justify-center">
          <Timer seconds={totalTimeRemaining} size="medium" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <div
          className="
            relative w-full max-w-4xl
            max-h-[78vh]
            flex flex-col
            bg-white/[0.05]
            backdrop-blur-2xl
            border border-white/10
            rounded-3xl
            shadow-[0_30px_120px_rgba(0,0,0,0.8)]
            p-5 md:p-8
          "
        >
          {/* Cross */}
          <div className="absolute top-4 right-4 text-[#c9a24d]/20 text-3xl select-none">
            ✝
          </div>

          {/* Progress */}
          <div className="shrink-0 mb-3 text-center text-white/50 text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {/* Question Area */}
          <div className="flex-1 flex items-center justify-center">
            <QuizQuestion
              key={questions[currentQuestionIndex].id}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              timeLimit={15}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
