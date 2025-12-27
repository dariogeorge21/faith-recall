'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Trophy, Sparkles, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#02040a] px-6 overflow-hidden">
      
      {/* 1. DYNAMIC AMBIENCE & PARTICLES */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vh] bg-blue-600/10 blur-[120px] rounded-full animate-ethereal-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-amber-500/10 blur-[150px] rounded-full animate-ethereal-2" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-float-particle"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's',
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. MAIN INTERFACE */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        
        {/* HERO LOGO - STABLE WITH SCALE BURST */}
        <div className="relative mb-14 animate-reveal-down flex items-center justify-center">
          {/* Breathing aura sits directly behind the image */}
          <div className="absolute w-[240px] h-[240px] bg-amber-400/20 blur-[60px] rounded-full animate-pulse-gentle" />
          
          {/* Logo is kept straight; only performs a sudden scale pulse */}
          <div className="relative animate-sudden-scale">
            <Image
              src="/jaago.png"
              alt="JAAGO Logo"
              width={200}
              height={200}
              priority
              className="drop-shadow-[0_0_35px_rgba(251,191,36,0.4)]"
            />
          </div>
        </div>

        {/* CINEMATIC TYPOGRAPHY */}
        <div className="text-center space-y-6 mb-16 px-4">
          <div className="flex items-center justify-center gap-4 animate-reveal" style={{ animationDelay: '0.2s' }}>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-amber-400 font-bold text-[11px] uppercase tracking-[0.8em] drop-shadow-glow">
              JAAGO 2025
            </span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none animate-reveal" style={{ animationDelay: '0.4s' }}>
            Faith <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 animate-shimmer">Recall</span>
          </h1>

          <p className="text-white/40 text-base md:text-xl max-w-lg mx-auto font-light tracking-wide leading-relaxed animate-reveal" style={{ animationDelay: '0.6s' }}>
            A premium experience that blends <span className="text-white/80 font-medium italic">memory</span>, 
            <span className="text-white/80 font-medium italic"> focus</span>, and 
            <span className="text-white/80 font-medium italic"> faith</span>.
          </p>
        </div>

        {/* ACTION PANEL */}
        <div className="w-full max-w-lg flex flex-col gap-6 px-6 animate-reveal" style={{ animationDelay: '0.8s' }}>
          
          <button
            onClick={() => router.push('/input')}
            className="group relative w-full bg-amber-500 py-6 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] active:scale-95"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
            <span className="relative flex items-center justify-center gap-3 text-black font-black uppercase tracking-[0.25em] text-sm">
              Begin Journey <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <button
            onClick={() => router.push('/score')}
            className="group relative w-full bg-white/[0.03] border border-white/5 py-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20"
          >
            <span className="flex items-center justify-center gap-3 text-white/50 font-bold uppercase tracking-[0.2em] text-sm group-hover:text-white transition-colors">
              <Trophy className="w-5 h-5 text-amber-500/30 group-hover:text-amber-500/60" />
              Hall of Faith
            </span>
          </button>
        </div>

        {/* STATUS BAR */}
        <div className="mt-20 flex items-center gap-4 text-white/20 animate-fade-in-slow">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.5em] font-medium italic">
            Parish Accredited Experience
          </span>
          <Sparkles className="w-3 h-3 animate-pulse" />
        </div>

      </main>

      {/* 3. SENIOR ENGINEER ANIMATION ENGINE */}
      <style jsx global>{`
        /* SCALE BURST: Logo stays straight, but "beats" like a heart every few seconds */
        @keyframes sudden-scale {
          0%, 85% { transform: scale(1); filter: brightness(1); }
          90% { transform: scale(1.1); filter: brightness(1.3); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        
        .animate-sudden-scale {
          animation: sudden-scale 5s cubic-bezier(0.19, 1, 0.22, 1) infinite;
        }

        @keyframes ethereal-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.1); }
        }
        @keyframes ethereal-2 {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-5%, -5%) scale(1); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes reveal-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-ethereal-1 { animation: ethereal-1 15s ease-in-out infinite; }
        .animate-ethereal-2 { animation: ethereal-2 18s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle linear infinite; }
        .animate-pulse-gentle { animation: pulse 4s ease-in-out infinite; }
        .animate-reveal { animation: reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .animate-reveal-down { animation: reveal-down 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-fade-in-slow { animation: opacity 3s ease-in; }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4));
        }
      `}</style>
    </div>
  )
}