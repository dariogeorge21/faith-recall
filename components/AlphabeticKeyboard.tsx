'use client'

interface Props {
  value: string
  onChange: (v: string) => void
  onClose: () => void
}

const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function AlphabeticKeyboard({
  value,
  onChange,
  onClose,
}: Props) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => onChange(value + k)}
            className="rounded-lg bg-white/10 py-2 text-white hover:bg-white/20 transition"
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onChange(value.slice(0, -1))}
          className="flex-1 rounded-lg bg-red-500/20 py-2 text-red-300"
        >
          ⌫
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-lg bg-amber-500 py-2 text-black font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  )
}
