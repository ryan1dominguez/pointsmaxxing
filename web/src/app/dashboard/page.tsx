"use client"

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import CreditCard from '../components/CreditCard'
import { formatCategory } from '../utils/formatCategory'

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

interface Result {
  message: string
  card: string
  issuer: string
  category: string
  percentage: number
}

export default function Dashboard() {
  const router = useRouter()
  const [purchase, setPurchase] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [userName, setUserName] = useState('')
  const [avatarDropdown, setAvatarDropdown] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/')
        return
      }
      const name = session.user.user_metadata?.full_name || 'User'
      setUserName(name)
      fetchCards()
    })

    return () => subscription.unsubscribe()
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

      if (!response.ok) {
        setResult({
          message: data.message || 'Something went wrong, please try again',
          card: '',
          issuer: '',
          category: '',
          percentage: 0
        })
        setLoading(false)
        return
      }

      setResult(data)
    } catch (err) {
      setResult({
        message: 'Network error, please check your connection',
        card: '',
        issuer: '',
          category: '',
          percentage: 0
      })
      console.error(err)
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRecommend()
  }

  const handleSignOut = async() => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <main className="min-h-screen bg-[#080C14] font-['Sora'] relative overflow-hidden">
      <div className="pm-grid fixed inset-0 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(55,138,221,0.1)] relative z-60">
        <div className="text-[18px] font-semibold text-white tracking-[-0.02em]">
          Points<span className="text-[#378ADD]">Maxxing</span>
        </div>

        {/* Avatar + Dropdown wrapper */}
        <div className="relative z-50">
          <button className="w-8 h-8 rounded-full bg-[rgba(55,138,221,0.15)] border border-[rgba(55,138,221,0.3)] flex items-center justify-center text-[11px] font-semibold text-[#378ADD] font-['Space_Mono'] hover:bg-[rgba(55,138,221,0.25)] transition-colors duration-150 cursor-pointer"
            onClick={() => setAvatarDropdown(!avatarDropdown)}
          >
            {getInitials(userName)}
          </button>

          {avatarDropdown && (
            <div className="absolute top-10 right-0 w-36 bg-[#0D1420] border border-[rgba(55,138,221,0.2)] rounded-xl shadow-lg z-100 p-1">
              <button
                onClick={() => router.push('/cards')}
                className="pm-dropdown-item w-full text-left px-4 py-2 text-[13px] text-white/70 rounded-lg cursor-pointer"
              >
                Manage Cards
              </button>
              <button
                onClick={handleSignOut}
                className="pm-dropdown-item w-full text-left px-4 py-2 text-[13px] text-white/70 rounded-lg cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-8 relative z-1 max-w-120 mx-auto">
        <div className="text-[13px] text-white/35 mb-1 font-['Space_Mono'] tracking-wider">
          // {getGreeting()}
        </div>
        <div className="text-[24px] font-semibold text-white tracking-[-0.02em] mb-8 leading-[1.2]">
          Which card should<br />you <span className="text-[#378ADD]">swipe?</span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-lg pointer-events-none">🔍</span>
          <input
            className="w-full bg-[#0D1420] border border-[rgba(55,138,221,0.2)] rounded-[14px] py-4.5 pl-11.5 pr-15t-['Sora'] text-[15px] text-white box-border transition-colors duration-200 focus:outline-none focus:border-[rgba(55,138,221,0.5)] placeholder:text-white/25"
            placeholder="Cheesecake Factory, Chevron, Amazon..."
            value={purchase}
            onChange={(e) => setPurchase(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleRecommend}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#378ADD] hover:bg-[#185FA5] border-none rounded-[10px] w-10 h-10 flex items-center justify-center cursor-pointer text-white text-lg transition-colors duration-200"
          >
            {loading ? '...' : '→'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-[#0D1420] border border-[rgba(55,138,221,0.3)] rounded-2xl p-5 mb-6">
            <div className="text-[10px] font-['Space_Mono'] text-white/30 tracking-[0.08em] uppercase mb-3">
              Recommendation
            </div>
            <div className="flex items-center gap-3 mb-3">
              {result.card && (
                <CreditCard name={result.card} issuer={result.issuer} percentage={result.percentage} category={result.category}/>
              )}
              <div>
                <div className="text-[16px] font-medium text-white">{result.card}</div>
                <div className="text-[11px] text-white/30 mt-0.5">{formatCategory(result.category)}</div>
              </div>
              <div className="ml-auto text-[22px] font-semibold text-[#378ADD] font-['Space_Mono']">
                {result.percentage}%
              </div>
            </div>
            <div className="text-[12px] text-white/35 leading-relaxed border-t border-[rgba(55,138,221,0.1)] pt-3">
              {result.message}
            </div>
          </div>
        )}

        {/* Cards */}
        {cards.length > 0 && (
          <>
            <div className="text-[10px] font-['Space_Mono'] text-white/30 tracking-[0.08em] uppercase mb-3">
              Your cards
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cards.map((card) => (
                <div key={card.id} className="bg-[#0D1420] border border-[rgba(55,138,221,0.1)] rounded-xl p-3">
                  <div className="text-[12px] font-medium text-white mb-1">{card.name}</div>
                  {card.rewards?.map((reward) => (
                    <div key={reward.id}>
                      <div className="text-[10px] text-[#378ADD] font-['Space_Mono']">
                        {reward.reward_percentage}% · {reward.category}
                      </div>
                      {reward.is_rotating && (
                        <div className="inline-flex items-center gap-1 bg-[rgba(55,138,221,0.1)] border border-[rgba(55,138,221,0.2)] rounded-full px-1.5 py-0.5 text-[9px] text-[#378ADD] font-['Space_Mono'] mt-1">
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