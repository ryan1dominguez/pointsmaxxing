"use client"

import { createBrowserClient } from '@supabase/ssr'

export default function Home() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#080C14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: "'Sora', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .pm-btn:hover { background: #e8e8e8 !important; transform: translateY(-1px); }
        .pm-btn:active { transform: translateY(0) !important; }
      `}</style>

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(55,138,221,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55,138,221,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(55,138,221,0.08) 0%, transparent 70%)',
        top: '-200px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        background: '#0D1420',
        border: '0.5px solid rgba(55,138,221,0.2)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(55,138,221,0.1)',
          border: '0.5px solid rgba(55,138,221,0.3)',
          borderRadius: '100px',
          padding: '4px 12px',
          fontSize: '11px',
          fontFamily: "'Space Mono', monospace",
          color: '#378ADD',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#378ADD',
            animation: 'pulse 2s infinite'
          }} />
          AI-powered
        </div>

        <div style={{
          fontSize: '32px',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
          lineHeight: 1
        }}>
          Points<span style={{ color: '#378ADD' }}>Maxxing</span>
        </div>

        <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '2rem',
          fontWeight: 300,
          letterSpacing: '0.01em'
        }}>
          Maximize every swipe.
        </div>

        <div style={{
          height: '0.5px',
          background: 'rgba(55,138,221,0.15)',
          marginBottom: '2rem'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '2rem'
        }}>
          {[
            { num: '5%', label: 'max cashback found' },
            { num: '3', label: 'cards optimized' }
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'rgba(55,138,221,0.05)',
              border: '0.5px solid rgba(55,138,221,0.1)',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#378ADD',
                fontFamily: "'Space Mono', monospace"
              }}>{stat.num}</div>
              <div style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '2px',
                letterSpacing: '0.03em'
              }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          fontSize: '11px',
          fontFamily: "'Space Mono', monospace",
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          Continue with
        </div>

        <button
          className="pm-btn"
          onClick={handleSignIn}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            color: '#080C14',
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.01em'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <div style={{
          marginTop: '1.5rem',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          lineHeight: 1.6
        }}>
          By signing in you agree to our terms of service.<br />
          Your card data is stored securely and never shared.
        </div>
      </div>
    </main>
  )
}