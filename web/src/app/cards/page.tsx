"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { PREDEFINED_CARDS, PredefinedCard } from "../constants/cards"

interface Reward {
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
  last_four_digits: string
  rewards: Reward[]
}

export default function Cards() {
    const router = useRouter()
    const [cards, setCards] = useState<Card[]>([])
    const [showForm, setShowForm] = useState(false)
    const [selectedCard, setSelectedCard] = useState<PredefinedCard | null>(null)
    const [lastFourDigits, setLastFourDigits] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(true)
    

    const handleSubmit = async() => {
        if (!selectedCard|| !lastFourDigits) {
            setError('Please fill in all required fields')
            return
        }

        const trimmedLastFour = lastFourDigits.trim()

        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user.id

        const { data: cardData, error: cardError } = await supabase
            .from('credit_cards')
            .insert({ 
                user_id: userId,
                name: selectedCard.name, 
                card_issuer: selectedCard.issuer,
                last_four_digits: trimmedLastFour 
            })
            .select()
            .single()

        if (cardError) {
            setError('An error occured')
            return
        }

        if (cardData && selectedCard.rewards.length > 0) {
            const { error: rewardsError } = await supabase
            .from('rewards')
            .insert(
                selectedCard.rewards.map(reward => ({
                    credit_card_id: cardData.id,
                    category: reward.category,
                    reward_percentage: reward.reward_percentage,
                    is_rotating: reward.is_rotating,
                    start_date: reward.start_date,
                    end_date: reward.end_date
                }))
            )
            if (rewardsError) {
                setError('Card was saved but rewards failed to save.')
                return
            }

           
        setSelectedCard(null)
        setLastFourDigits('')
        setError('')
        setSuccess('Card added successfully!')
        setTimeout(() => setSuccess(''), 3000)
        setShowForm(false)
        fetchCards()
            
        }

    }

    const fetchCards = async () => {
        const { data } = await supabase
        .from('credit_cards')
        .select('*, rewards(*)')
        if (data) setCards(data)
    }

    const handleDelete = async (cardId: string) => {
        const { error } = await supabase
            .from('credit_cards')
            .delete()
            .eq('id', cardId)
        
            if (!error) {
                setSuccess('Card deleted successfully!')
                setTimeout(() => setSuccess(''), 3000)
                fetchCards()
                setError('')
            }
    }

    useEffect(() => {
      const checkAuth = async() => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/')
          return
        }
        fetchCards()
        setLoading(false)
      }
      checkAuth()
    }, [])

    if (loading) return <main className="min-h-screen bg-[#080C14]" />

    return (
    <main className="min-h-screen bg-[#080C14] font-['Sora'] relative overflow-hidden">
      <div className="pm-grid fixed inset-0 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(55,138,221,0.1)] relative z-60">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/80 transition-colors duration-150 cursor-pointer bg-transparent border-none font-['Sora']"
        >
          ← dashboard
        </button>
        <div className="text-[18px] font-semibold text-white tracking-[-0.02em]">
          Points<span className="text-[#378ADD]">Maxxing</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-8 max-w-120 mx-auto relative z-1">
        
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-[10px] font-['Space_Mono'] text-white/30 tracking-[0.08em] uppercase">
            Your Cards
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#378ADD] hover:bg-[#185FA5] border-none rounded-lg px-3.5 py-2 text-[12px] font-medium text-white cursor-pointer transition-colors duration-150 font-['Sora']"
          >
            + Add Card
          </button>
        </div>

        <div className="h-5 mb-4">
            {success && (
                <p className="text-[12px] text-green-400 mb-4 font-['Space_Mono']">{success}</p>
            )}  
        </div>

        {/* Cards list */}
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className="bg-[#0D1420] border border-[rgba(55,138,221,0.15)] rounded-2xl p-5 mb-2.5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[15px] font-medium text-white mb-0.5">{card.name}</div>
                  <div className="text-[11px] text-white/30 font-['Space_Mono']">{card.card_issuer}</div>
                  <div className="text-[11px] text-white/30 font-['Space_Mono'] mt-0.5">•••• {card.last_four_digits}</div>
                </div>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="bg-[rgba(255,59,48,0.1)] hover:bg-[rgba(255,59,48,0.2)] border border-[rgba(255,59,48,0.2)] rounded-lg px-2.5 py-1.5 text-[11px] text-[rgba(255,59,48,0.8)] cursor-pointer transition-all duration-150 font-['Sora']"
                >
                  Delete
                </button>
              </div>
              <div className="h-px bg-[rgba(55,138,221,0.1)] mb-3" />
              <div className="text-[9px] font-['Space_Mono'] text-white/25 tracking-[0.08em] uppercase mb-2">
                Rewards
              </div>
              <div className="flex flex-wrap gap-1">
                {card.rewards?.length > 0 ? card.rewards.map((reward, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-[10px] font-['Space_Mono'] ${
                      reward.is_rotating
                        ? 'bg-[rgba(255,159,10,0.08)] border-[rgba(255,159,10,0.2)] text-[rgba(255,159,10,0.8)]'
                        : 'bg-[rgba(55,138,221,0.08)] border-[rgba(55,138,221,0.15)] text-[#378ADD]'
                    }`}
                  >
                    {reward.reward_percentage}% · {reward.category}{reward.is_rotating ? ' ⟳' : ''}
                  </span>
                )) : (
                  <span className="text-[10px] text-white/20 font-['Space_Mono']">No rewards added yet</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[13px] text-white/20 font-['Space_Mono']">
            No cards yet. Add your first card to get started.
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1420] border border-[rgba(55,138,221,0.2)] rounded-[20px] p-6 w-full max-w-120">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[16px] font-semibold text-white">Add a Card</div>
              <button
                onClick={() => setShowForm(false)}
                className="bg-white/5 border border-white/10 rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-white/50 hover:text-white/80 transition-colors duration-150 font-['Sora']"
              >
                ✕
              </button>
            </div>

            {error && <p className="text-red-400 text-[12px] mb-4 font-['Space_Mono']">{error}</p>}

            <div className="mb-4">
              <div className="text-[10px] font-['Space_Mono'] text-white/30 tracking-[0.08em] uppercase mb-1.5">
                Select Card
              </div>
              <select
                value={selectedCard?.name || ''}
                onChange={(e) => {
                  const card = PREDEFINED_CARDS.find(c => c.name === e.target.value)
                  setSelectedCard(card || null)
                }}
                className="w-full bg-white/4 border border-[rgba(55,138,221,0.2)] rounded-[10px] px-3.5 py-3 font-['Sora'] text-[14px] text-white outline-none appearance-none focus:border-[rgba(55,138,221,0.5)] transition-colors duration-200"
              >
                <option value="" className="bg-[#0D1420]">Select your card</option>
                {PREDEFINED_CARDS.map(card => (
                  <option key={card.name} value={card.name} className="bg-[#0D1420]">{card.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="text-[10px] font-['Space_Mono'] text-white/30 tracking-[0.08em] uppercase mb-1.5">
                Last Four Digits
              </div>
              <input
                placeholder="1234"
                value={lastFourDigits}
                maxLength={4}
                onChange={(e) => setLastFourDigits(e.target.value)}
                className="w-full bg-white/4 border border-[rgba(55,138,221,0.2)] rounded-[10px] px-3.5 py-3 font-['Sora'] text-[14px] text-white outline-none focus:border-[rgba(55,138,221,0.5)] transition-colors duration-200 placeholder:text-white/25"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#378ADD] hover:bg-[#185FA5] border-none rounded-[10px] py-3.5 font-['Sora'] text-[14px] font-medium text-white cursor-pointer transition-colors duration-200 mt-1"
            >
              Add Card
            </button>
          </div>
        </div>
      )}
    </main>
  )
}