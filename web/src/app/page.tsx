"use client"

import { supabase } from '@/lib/supabase'

export default function Home() {
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-[#080C14] relative overflow-hidden font-['Sora']">
      
      <div className="pm-grid fixed inset-0 pointer-events-none" />
      
      <div className="pm-glow absolute w-150 h-150 rounded-full -top-50 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative w-full max-w-100 bg-[#0D1420] border border-[rgba(55,138,221,0.2)] rounded-[20px] p-10 z-10">
        
        <div className="inline-flex items-center gap-1.5 bg-[rgba(55,138,221,0.1)] border border-[rgba(55,138,221,0.3)] rounded-full px-3 py-1 text-[11px] font-['Space_Mono'] text-[#378ADD] tracking-wider mb-6">
          <div className="pm-pulse w-1.5 h-1.5 rounded-full bg-[#378ADD]" />
          AI-powered
        </div>

        <div className="text-[32px] font-semibold text-white tracking-[-0.02em] mb-2 leading-none">
          Points<span className="text-[#378ADD]">Maxxing</span>
        </div>

        <div className="text-[14px] text-white/40 mb-8 font-light tracking-[0.01em]">
          Maximize every swipe.
        </div>

        <div className="h-px bg-[rgba(55,138,221,0.15)] mb-8" />

        <div className="grid grid-cols-2 gap-2 mb-8">
          {[
            { num: '5%', label: 'max cashback found' },
            { num: '3', label: 'cards optimized' }
          ].map((stat) => (
            <div key={stat.label} className="bg-[rgba(55,138,221,0.05)] border border-[rgba(55,138,221,0.1)] rounded-[10px] p-3">
              <div className="text-[18px] font-semibold text-[#378ADD] font-['Space_Mono']">{stat.num}</div>
              <div className="text-[10px] text-white/30 mt-0.5 tracking-[0.03em]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] font-['Space_Mono'] text-white/30 tracking-[0.08em] uppercase mb-4">
          Continue with
        </div>

        <button
          className="pm-btn w-full flex items-center justify-center gap-2.5 py-3.5 bg-white border-none rounded-xl text-[#080C14] font-['Sora'] text-[14px] font-medium cursor-pointer transition-all duration-200 tracking-[0.01em]"
          onClick={handleSignIn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-[11px] text-white/20 text-center leading-relaxed">
          By signing in you agree to our terms of service.<br />
          Your card data is stored securely and never shared.
        </div>
      </div>
    </main>
  )
}