'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import QuizQuestion from '@/components/QuizQuestion'
import Timer from '@/components/Timer'

export default function Game2Page() {
  const router = useRouter()
  const { addGame2Score, quizQuestions, initGame2Questions } = useGameStore()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(90)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15)

  /* INIT - Randomize questions when Game 2 starts */
  useEffect(() => {
    initGame2Questions(10) // Get 10 random questions with shuffled options
  }, [])

  /* GLOBAL TIMER */
  useEffect(() => {
    if (totalTimeRemaining <= 0) {
      router.push('/verify-code')
      return
    }

    const t = setInterval(() => {
      setTotalTimeRemaining((p) => p - 1)
    }, 1000)

    return () => clearInterval(t)
  }, [totalTimeRemaining, router])

  /* QUESTION TIMER RESET */
  useEffect(() => {
    setQuestionTimeLeft(15)
  }, [currentQuestionIndex])

  /* QUESTION TIMER */
  useEffect(() => {
    if (questionTimeLeft <= 0) {
      next()
      return
    }

    const t = setInterval(() => {
      setQuestionTimeLeft((p) => p - 1)
    }, 1000)

    return () => clearInterval(t)
  }, [questionTimeLeft])

  const next = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1)
    } else {
      router.push('/verify-code')
    }
  }

  const onAnswer = (ans: string, time: number) => {
    const current = quizQuestions[currentQuestionIndex]
    if (!current) return

    if (ans === current.correctAnswer) {
      addGame2Score(Math.max(200, 1000 - time * 50))
    }

    next()
  }

  // 🔒 SAFETY GUARD (NO UI CHANGE)
  if (!quizQuestions.length || !quizQuestions[currentQuestionIndex]) return null

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-[#05070f] via-[#0b1020] to-[#090312]">

      {/* HEADER */}
      <div className="shrink-0 pt-3 text-center">
        <h1 className="text-4xl font-extrabold text-[#c9a24d]">
          Emoji Bible Quiz
        </h1>
        <p className="text-white/60 text-sm mb-2">
          Decode • Answer fast • Earn more points
        </p>
        <Timer seconds={totalTimeRemaining} size="small" />
      </div>

      {/* GAME CARD */}
      <div className="flex-1 px-6 pb-4 flex justify-center items-start">
        <div
          className="
            w-full max-w-6xl
            h-[78vh]
            bg-white/[0.05]
            backdrop-blur-2xl
            border border-white/10
            rounded-[32px]
            px-6 py-4
            flex flex-col
          "
        >
          <div className="text-center text-white/50 text-sm mb-1">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>

          <div className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-5xl scale-[0.92] origin-top">
              <QuizQuestion
                question={quizQuestions[currentQuestionIndex]}
                onAnswer={onAnswer}
                timeLimit={questionTimeLeft}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
