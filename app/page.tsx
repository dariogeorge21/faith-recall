'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#05070f] px-6 overflow-hidden">

      {/* Ambient color layers (static but deep) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f24] via-[#05070f] to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[700px] h-[700px] bg-amber-500/15 blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 
                        w-[400px] h-[400px] bg-[#800020]/20 blur-[180px]" />
      </div>

      {/* Main Card */}
      <main className="w-full max-w-3xl rounded-[28px] 
                       bg-[#0b1120]/95 backdrop-blur-xl 
                       border border-white/10 
                       shadow-[0_40px_120px_rgba(0,0,0,0.85)]
                       px-8 md:px-12 py-14 text-center">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/25 blur-3xl rounded-full" />
            <Image
              src="/jaago.png"
              alt="JAAGO Logo"
              width={180}
              height={180}
              priority
              className="relative drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]"
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            Faith Recall
          </h1>

          <p className="text-sm md:text-base tracking-[0.4em] uppercase text-amber-400">
            JAAGO 2025
          </p>

          <p className="text-sm md:text-base text-white/65 max-w-xl mx-auto leading-relaxed">
            A premium church event experience that blends memory,
            focus, and faith into one meaningful journey.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-5 max-w-xl mx-auto">

          <button
            onClick={() => router.push('/input')}
            className="flex-1 rounded-xl bg-amber-500 py-4 text-lg font-semibold text-black
                       shadow-lg shadow-amber-500/20
                       hover:bg-amber-400 hover:shadow-amber-400/30
                       active:scale-[0.97] transition-all"
          >
            Start Game
          </button>

          <button
            onClick={() => router.push('/score')}
            className="flex-1 rounded-xl bg-white/10 border border-white/15 py-4 text-lg font-semibold text-white
                       hover:bg-white/20
                       active:scale-[0.97] transition-all"
          >
            Leaderboard
          </button>
        </div>

        {/* Footer Accent */}
        <div className="mt-12 flex flex-col items-center gap-3 opacity-70">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          <p className="text-[11px] tracking-[0.45em] uppercase text-white/50">
            Church Event Experience
          </p>
        </div>

      </main>
    </div>
  )
}
