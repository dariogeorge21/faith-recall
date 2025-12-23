'use client'

import { useState, useEffect, useRef } from 'react'
import NameInput from './NameInput'

interface VoiceNameInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function VoiceNameInput({ value, onChange, disabled = false }: VoiceNameInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setStatusMessage('Listening... Say your name clearly')
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')
          .trim()

        if (transcript) {
          onChange(transcript)
          setStatusMessage('Name captured!')
          setFailedAttempts(0) // Reset on success
          
          // Stop listening after successful capture
          setTimeout(() => {
            recognition.stop()
          }, 500)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        
        let errorMessage = ''
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try again.'
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Microphone not found. Please use keyboard.'
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone permission denied. Please use keyboard.'
          setShowKeyboard(true) // Auto-switch to keyboard
        } else {
          errorMessage = 'Voice input failed. Please try again.'
        }

        setStatusMessage(errorMessage)
        setIsListening(false)

        // Increment failed attempts
        setFailedAttempts((prev) => {
          const newAttempts = prev + 1
          if (newAttempts >= 2) {
            setShowKeyboard(true)
            setStatusMessage('Switching to keyboard input...')
          }
          return newAttempts
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
      setShowKeyboard(true)
      setStatusMessage('Voice input not supported. Using keyboard.')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onChange])

  const handleStartListening = () => {
    if (disabled || !isSupported || showKeyboard) return

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting recognition:', error)
        setFailedAttempts((prev) => {
          const newAttempts = prev + 1
          if (newAttempts >= 2) {
            setShowKeyboard(true)
            setStatusMessage('Switching to keyboard input...')
          }
          return newAttempts
        })
      }
    }
  }

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleSwitchToKeyboard = () => {
    handleStopListening()
    setShowKeyboard(true)
    setStatusMessage('Using keyboard input')
  }

  // Auto-fallback after 2 failed attempts
  useEffect(() => {
    if (failedAttempts >= 2 && !showKeyboard) {
      setShowKeyboard(true)
      setStatusMessage('Switching to keyboard input...')
    }
  }, [failedAttempts, showKeyboard])

  // If voice is not supported or keyboard is shown, use keyboard component
  if (!isSupported || showKeyboard || failedAttempts >= 2) {
    return (
      <div className="w-full">
        {statusMessage && (
          <div className="mb-6 p-4 bg-blue-100 border-2 border-blue-400 rounded-lg text-blue-700 text-2xl font-semibold text-center">
            {statusMessage}
          </div>
        )}
        <NameInput value={value} onChange={onChange} disabled={disabled} />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Instructions */}
      <div className="mb-6 text-center">
        <p className="text-2xl text-burgundy-700 font-semibold mb-2">
          Say your name clearly into the microphone
        </p>
      </div>

      {/* Name Display */}
      <div className="mb-6">
        <input
          type="text"
          value={value}
          readOnly
          className={`w-full px-6 py-4 text-3xl text-center bg-white border-2 rounded-lg focus:outline-none transition-all ${
            isListening
              ? 'border-gold-500 shadow-lg shadow-gold-200 animate-pulse'
              : 'border-burgundy-300'
          }`}
          placeholder={isListening ? 'Listening...' : 'Your name will appear here'}
        />
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`mb-6 p-4 rounded-lg text-2xl font-semibold text-center ${
            statusMessage.includes('captured') || statusMessage.includes('Listening')
              ? 'bg-green-100 border-2 border-green-400 text-green-700'
              : statusMessage.includes('failed') || statusMessage.includes('No speech')
              ? 'bg-red-100 border-2 border-red-400 text-red-700'
              : 'bg-blue-100 border-2 border-blue-400 text-blue-700'
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* Voice Input Button */}
      <div className="flex flex-col gap-6 items-center">
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={disabled}
          className={`w-full max-w-2xl py-8 text-4xl font-bold rounded-xl shadow-lg active:scale-95 transition-all touch-manipulation ${
            isListening
              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
              : 'bg-gold-500 text-white hover:bg-gold-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? (
            <span className="flex items-center justify-center gap-4">
              <span className="w-6 h-6 bg-white rounded-full animate-pulse"></span>
              Stop Recording
            </span>
          ) : (
            <span className="flex items-center justify-center gap-4">
              🎤 Speak Name
            </span>
          )}
        </button>

        {/* Manual Switch Button */}
        <button
          onClick={handleSwitchToKeyboard}
          disabled={disabled}
          className="px-8 py-4 text-2xl font-semibold text-burgundy-600 hover:text-burgundy-700 underline touch-manipulation disabled:opacity-50"
        >
          Use Keyboard Instead
        </button>

        {/* Failed Attempts Indicator */}
        {failedAttempts > 0 && failedAttempts < 2 && (
          <p className="text-xl text-burgundy-600">
            Attempt {failedAttempts} of 2. Will switch to keyboard after 2 failed attempts.
          </p>
        )}
      </div>
    </div>
  )
}
