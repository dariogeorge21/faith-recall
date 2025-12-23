'use client'

interface NumericKeypadProps {
  onDigitClick: (digit: string) => void
  onBackspace: () => void
  onClear?: () => void
  disabled?: boolean
}

export default function NumericKeypad({ 
  onDigitClick, 
  onBackspace, 
  onClear,
  disabled = false 
}: NumericKeypadProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {digits.map((digit) => (
          <button
            key={digit}
            onClick={() => onDigitClick(digit)}
            disabled={disabled}
            className="h-16 md:h-20 text-2xl md:text-3xl font-bold bg-white text-burgundy-700 border-2 border-burgundy-300 rounded-lg shadow-md hover:bg-gold-50 hover:border-gold-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={onBackspace}
          disabled={disabled}
          className="h-16 md:h-20 text-xl md:text-2xl font-bold bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300 rounded-lg shadow-md hover:bg-burgundy-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          ⌫
        </button>
        {onClear && (
          <button
            onClick={onClear}
            disabled={disabled}
            className="h-16 md:h-20 text-lg md:text-xl font-bold bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300 rounded-lg shadow-md hover:bg-burgundy-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

