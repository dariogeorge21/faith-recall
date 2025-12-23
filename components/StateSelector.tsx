'use client'

interface StateSelectorProps {
  value: string
  onChange: (state: string) => void
  disabled?: boolean
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export default function StateSelector({ value, onChange, disabled = false }: StateSelectorProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="px-6 py-4 text-3xl text-center bg-white border-2 border-burgundy-300 rounded-lg min-h-[80px] flex items-center justify-center">
          {value || <span className="text-gray-400">Select your state</span>}
        </div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto border-2 border-burgundy-300 rounded-lg bg-white">
        <div className="grid grid-cols-4 gap-3 p-4">
          {INDIAN_STATES.map((state) => (
            <button
              key={state}
              onClick={() => onChange(state)}
              disabled={disabled}
              className={`px-6 py-4 text-left text-2xl font-semibold rounded-lg transition-all touch-manipulation ${
                value === state
                  ? 'bg-gold-500 text-white border-2 border-gold-600'
                  : 'bg-white text-burgundy-700 border-2 border-burgundy-200 hover:bg-gold-50 hover:border-gold-300'
              } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
