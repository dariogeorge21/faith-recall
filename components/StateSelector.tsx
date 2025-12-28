'use client'

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal'
]

export default function StateSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STATES.map((state) => (
        <button
          key={state}
          onClick={() => onChange(state)}
          className={`rounded-xl px-4 py-3 text-sm transition
            ${
              value === state
                ? 'bg-amber-500 text-black'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }
          `}
        >
          {state}
        </button>
      ))}
    </div>
  )
}
