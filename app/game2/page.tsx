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

  const [questions, setQuestions] = useState<typeof BIBLE_QUIZ_DATA>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(90)
  const [gameStarted, setGameStarted] = useState(false)

  // Shuffle questions
  useEffect(() => {
    const shuffled = [...BIBLE_QUIZ_DATA].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setCurrentQuestionIndex(0)
    setGameStarted(true)
  }, [])

  // Global timer
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
    if (!currentQuestion) return

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
        <div className="text-3xl font-semibold text-[#c9a24d] animate-pulse">
          Preparing the challenge…
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312] animate-fadeIn">

      {/* Ambient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 blur-[160px]" />
        <div className="absolute bottom-[-35%] right-1/4 w-[600px] h-[600px] bg-purple-700/20 blur-[180px]" />
      </div>

      {/* HEADER */}
      <div className="shrink-0 pt-6 pb-4 text-center animate-slideDown">
        <h1 className="text-4xl font-extrabold text-[#c9a24d] mb-1">
          Emoji Bible Quiz
        </h1>
        <p className="text-white/60 text-base mb-3">
          Decode • Answer fast • Earn more points
        </p>
        <div className="flex justify-center">
          <Timer seconds={totalTimeRemaining} size="large" />
        </div>
      </div>

      {/* MAIN GAME AREA */}
      <div className="flex-1 flex items-center justify-center px-8 pb-6">
        <div
          className="
            relative w-full max-w-6xl h-[70vh]
            flex flex-col
            bg-white/[0.05]
            backdrop-blur-2xl
            border border-white/10
            rounded-[36px]
            shadow-[0_30px_120px_rgba(0,0,0,0.8)]
            px-8 py-6
            animate-scaleIn
          "
        >
          {/* Cross */}
          <div className="absolute top-4 right-4 text-[#c9a24d]/20 text-3xl select-none">
            ✝
          </div>

          {/* Progress */}
          <div className="shrink-0 mb-3 text-center text-white/50 text-base">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {/* QUESTION */}
          <div className="flex-1 flex items-center justify-center animate-questionFade">
            <QuizQuestion
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
              timeLimit={15}
            />
          </div>
        </div>
      </div>

      {/* LOCAL ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96) }
          to { opacity: 1; transform: scale(1) }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes questionFade {
          from { opacity: 0; transform: translateY(10px) }
          to { opacity: 1; transform: translateY(0) }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        .animate-questionFade {
          animation: questionFade 0.35s ease-out;
        }
      `}</style>

    </div>
  )
}
