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
                    start_date: null,
                    end_date: null
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
        
            if (!error) fetchCards()
    }

    useEffect(() => {
        fetchCards()
    }, [])

    return (
        <main>
            <div>
                <button onClick={() => router.push('/dashboard')}>← Back</button>
                <h1>Manage Cards</h1>
                <button onClick={() => setShowForm(true)}>Add Card</button>
            </div>

            {success && <p>{success}</p>}

                {cards.length > 0 ? (       
                    cards.map((card) => (
                        <div key={card.id}>
                            <div>{card.name}</div>
                            <div>{card.card_issuer}</div>
                            <div>•••• {card.last_four_digits}</div>
                            <div>
                                {card.rewards?.map((reward, i) => (
                                    <div key={i}>
                                    {reward.reward_percentage}% · {reward.category}
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleDelete(card.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <div>No cards yet. Add your first card to get started.</div>
                )}

                {showForm && (
                    <div>
                        <button onClick={() => setShowForm(false)}>Close</button>
                        <h2>Add a Card</h2>

                        {error && <p>{error}</p>}

                        <select
                            value={selectedCard?.name || ''}
                            onChange={(e) => {
                                const card = PREDEFINED_CARDS.find(c => c.name === e.target.value)
                                setSelectedCard(card || null)
                            }}
                        >
                            <option value="">Select your card</option>
                            {PREDEFINED_CARDS.map(card => (
                                <option key={card.name} value={card.name}>{card.name}</option>
                            ))}
                        </select>

                        <input
                            placeholder="Last Four Digits"
                            value={lastFourDigits}
                            maxLength={4}
                            onChange={(e) => setLastFourDigits(e.target.value)}
                        />
                       
                        <button onClick={handleSubmit}>Add Card</button>
                    </div>
                )}
        </main>
    )
}