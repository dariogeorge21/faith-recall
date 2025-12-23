'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'
import NameInput from '@/components/NameInput'
import StateSelector from '@/components/StateSelector'

export default function HomePage() {
  const router = useRouter()
  const { playerName, playerRegion, setPlayerName, setPlayerRegion } = useGameStore()
  const [name, setName] = useState(playerName)
  const [region, setRegion] = useState(playerRegion)
  const [error, setError] = useState('')

  useEffect(() => {
    // Reset game state when landing on registration
    useGameStore.getState().reset()
  }, [])

  const handleNameChange = (value: string) => {
    setName(value)
    setError('')
  }

  const handleRegionChange = (value: string) => {
    setRegion(value)
    setError('')
  }

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!region) {
      setError('Please select your state')
      return
    }

    setPlayerName(name.trim())
    setPlayerRegion(region)
    
    // Auto-transition to security code entry
    router.push('/security-code')
  }

  // Auto-continue when both fields are filled (as per requirements)
  useEffect(() => {
    if (name.trim() && region && !error) {
      const timer = setTimeout(() => {
        if (name.trim() && region) {
          setPlayerName(name.trim())
          setPlayerRegion(region)
          router.push('/security-code')
        }
      }, 1000) // 1 second delay to show validation
      return () => clearTimeout(timer)
    }
  }, [name, region, error, setPlayerName, setPlayerRegion, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-burgundy-700 mb-4">
            Faith Recall
          </h1>
          <p className="text-2xl md:text-3xl text-gold-600 font-semibold">
            JAAGO
          </p>
          <p className="text-xl md:text-2xl text-burgundy-600 mt-4">
            Church Event Game
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <label className="block text-xl md:text-2xl font-bold text-burgundy-700 mb-4">
              Enter Your Name
            </label>
            <NameInput
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xl md:text-2xl font-bold text-burgundy-700 mb-4">
              Select Your State
            </label>
            <StateSelector
              value={region}
              onChange={handleRegionChange}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700 text-lg font-semibold text-center">
              {error}
            </div>
          )}

          {name.trim() && region && !error && (
            <div className="text-center text-lg text-green-600 font-semibold animate-pulse">
              ✓ Ready to continue...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

