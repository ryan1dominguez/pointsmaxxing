"use client"

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

interface Reward {
  id: string
  category: string
  reward_percentage: number
  is_rotating: boolean
  start_date: string | null
  end_date: string | null
}

interface Card {
  id: string
  name: string
  card_issuer: string
  rewards: Reward[]
}

export default function Dashboard() {
  const router = useRouter()
  const [purchase, setPurchase] = useState('')
  const [result, setResult] = useState<{ message: string; card: string; category: string; percentage: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }
      const name = session.user.user_metadata?.full_name || 'User'
      setUserName(name)
      fetchCards()
    }
    checkAuth()
  }, [])

  const fetchCards = async () => {
    const { data } = await supabase
      .from('credit_cards')
      .select('*, rewards(*)')
    if (data) setCards(data)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'good morning'
    if (hour < 17) return 'good afternoon'
    return 'good evening'
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleRecommend = async () => {
    if (!purchase.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchase_description: purchase })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRecommend()
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#080C14',
      fontFamily: "'Sora', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        .pm-input:focus { border-color: rgba(55,138,221,0.5) !important; outline: none; }
        .pm-input::placeholder { color: rgba(255,255,255,0.25); }
        .pm-submit:hover { background: #185FA5 !important; }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(55,138,221,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55,138,221,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 1.5rem',
        borderBottom: '0.5px solid rgba(55,138,221,0.1)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
          Points<span style={{ color: '#378ADD' }}>Maxxing</span>
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(55,138,221,0.15)',
          border: '0.5px solid rgba(55,138,221,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
          color: '#378ADD',
          fontFamily: "'Space Mono', monospace"
        }}>
          {getInitials(userName)}
        </div>
      </div>

      <div style={{
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 2,
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '0.25rem',
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em'
        }}>
          // {getGreeting()}
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: '2rem',
          lineHeight: 1.2
        }}>
          Which card should<br />you <span style={{ color: '#378ADD' }}>swipe?</span>
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '18px',
            pointerEvents: 'none'
          }}>🔍</span>
          <input
            className="pm-input"
            placeholder="Cheesecake Factory, Chevron, Amazon..."
            value={purchase}
            onChange={(e) => setPurchase(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              background: '#0D1420',
              border: '0.5px solid rgba(55,138,221,0.2)',
              borderRadius: '14px',
              padding: '18px 60px 18px 46px',
              fontFamily: "'Sora', sans-serif",
              fontSize: '15px',
              color: '#fff',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
          />
          <button
            className="pm-submit"
            onClick={handleRecommend}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#378ADD',
              border: 'none',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '18px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? '...' : '→'}
          </button>
        </div>

        {result && (
          <div style={{
            background: '#0D1420',
            border: '0.5px solid rgba(55,138,221,0.3)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              fontSize: '10px',
              fontFamily: "'Space Mono', monospace",
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              Recommendation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
              <div style={{
                width: '44px',
                height: '30px',
                background: 'rgba(55,138,221,0.1)',
                border: '0.5px solid rgba(55,138,221,0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>💳</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>{result.card}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{result.category}</div>
              </div>
              <div style={{
                marginLeft: 'auto',
                fontSize: '22px',
                fontWeight: 600,
                color: '#378ADD',
                fontFamily: "'Space Mono', monospace"
              }}>
                {result.percentage}%
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.5,
              borderTop: '0.5px solid rgba(55,138,221,0.1)',
              paddingTop: '0.75rem'
            }}>
              {result.message}
            </div>
          </div>
        )}

        {cards.length > 0 && (
          <>
            <div style={{
              fontSize: '10px',
              fontFamily: "'Space Mono', monospace",
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              Your cards
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {cards.map((card) => (
                <div key={card.id} style={{
                  background: '#0D1420',
                  border: '0.5px solid rgba(55,138,221,0.1)',
                  borderRadius: '12px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>
                    {card.name}
                  </div>
                  {card.rewards?.map((reward) => (
                    <div key={reward.id}>
                      <div style={{ fontSize: '10px', color: '#378ADD', fontFamily: "'Space Mono', monospace" }}>
                        {reward.reward_percentage}% · {reward.category}
                      </div>
                      {reward.is_rotating && (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(55,138,221,0.1)',
                          border: '0.5px solid rgba(55,138,221,0.2)',
                          borderRadius: '100px',
                          padding: '2px 7px',
                          fontSize: '9px',
                          color: '#378ADD',
                          fontFamily: "'Space Mono', monospace",
                          marginTop: '4px'
                        }}>
                          ⟳ rotating
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}