'use client'

import { useState } from 'react'

interface NameInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const NUMBERS = '0123456789'.split('')
const SPECIAL = [' ', '-', "'"].filter(Boolean)

export default function NameInput({ value, onChange, disabled = false }: NameInputProps) {
  const [showNumbers, setShowNumbers] = useState(false)
  const [showSpecial, setShowSpecial] = useState(false)

  const handleCharClick = (char: string) => {
    if (disabled) return
    onChange(value + char)
  }

  const handleBackspace = () => {
    if (disabled || value.length === 0) return
    onChange(value.slice(0, -1))
  }

  const currentChars = showNumbers ? NUMBERS : showSpecial ? SPECIAL : ALPHABET

  return (
    <div className="w-full">
      <div className="mb-6">
        <input
          type="text"
          value={value}
          readOnly
          className="w-full px-6 py-4 text-3xl text-center bg-white border-2 border-burgundy-300 rounded-lg focus:outline-none focus:border-gold-500"
          placeholder="Enter your name"
        />
      </div>
      
      <div className="mb-6 flex gap-4 justify-center">
        <button
          onClick={() => {
            setShowNumbers(false)
            setShowSpecial(false)
          }}
          disabled={disabled}
          className={`px-6 py-3 text-2xl rounded-lg font-semibold transition-all ${
            !showNumbers && !showSpecial
              ? 'bg-gold-500 text-white'
              : 'bg-white text-burgundy-700 border-2 border-burgundy-300'
          } disabled:opacity-50 touch-manipulation`}
        >
          ABC
        </button>
        <button
          onClick={() => {
            setShowNumbers(true)
            setShowSpecial(false)
          }}
          disabled={disabled}
          className={`px-6 py-3 text-2xl rounded-lg font-semibold transition-all ${
            showNumbers
              ? 'bg-gold-500 text-white'
              : 'bg-white text-burgundy-700 border-2 border-burgundy-300'
          } disabled:opacity-50 touch-manipulation`}
        >
          123
        </button>
        <button
          onClick={() => {
            setShowNumbers(false)
            setShowSpecial(true)
          }}
          disabled={disabled}
          className={`px-6 py-3 text-2xl rounded-lg font-semibold transition-all ${
            showSpecial
              ? 'bg-gold-500 text-white'
              : 'bg-white text-burgundy-700 border-2 border-burgundy-300'
          } disabled:opacity-50 touch-manipulation`}
        >
          #@
        </button>
      </div>

      <div className="grid grid-cols-9 gap-3 mb-6">
        {currentChars.map((char) => (
          <button
            key={char}
            onClick={() => handleCharClick(char)}
            disabled={disabled}
            className="h-16 text-2xl font-bold bg-white text-burgundy-700 border-2 border-burgundy-300 rounded-lg shadow-md hover:bg-gold-50 hover:border-gold-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {char}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleBackspace}
          disabled={disabled || value.length === 0}
          className="h-16 px-12 text-2xl font-bold bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300 rounded-lg shadow-md hover:bg-burgundy-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          ⌫ Backspace
        </button>
      </div>
    </div>
  )
}
