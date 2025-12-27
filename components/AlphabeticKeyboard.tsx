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
    <div className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
      {/* LETTER KEYS */}
      <div className="grid grid-cols-7 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => onChange(value + k)}
            className="
              rounded-lg
              bg-white/10
              py-2
              text-white
              font-medium
              hover:bg-white/20
              transition
            "
          >
            {k}
          </button>
        ))}
      </div>

      {/* ACTION KEYS */}
      <div className="mt-4 flex gap-2">
        {/* SPACE */}
        <button
          onClick={() => onChange(value + ' ')}
          className="
            flex-1
            rounded-lg
            bg-white/10
            py-2
            text-white
            hover:bg-white/20
            transition
          "
        >
          Space
        </button>

        {/* BACKSPACE */}
        <button
          onClick={() => onChange(value.slice(0, -1))}
          className="
            rounded-lg
            bg-red-500/20
            px-4
            py-2
            text-red-300
            hover:bg-red-500/30
            transition
          "
        >
          ⌫
        </button>

        {/* CLEAR */}
        <button
          onClick={() => onChange('')}
          className="
            rounded-lg
            bg-yellow-500/20
            px-4
            py-2
            text-yellow-300
            hover:bg-yellow-500/30
            transition
          "
        >
          Clear
        </button>

        {/* DONE */}
        <button
          onClick={onClose}
          className="
            rounded-lg
            bg-amber-500
            px-4
            py-2
            text-black
            font-semibold
            hover:bg-amber-400
            transition
          "
        >
          Done
        </button>
      </div>
    </div>
  )
}
