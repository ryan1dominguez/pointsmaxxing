"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CARD_ISSUERS } from "../constants/cardIssuers"
import { REWARD_CATEGORIES } from "../constants/rewardCategories"
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
  rewards: Reward[]
}

export default function Cards() {
    const [cardName, setCardName] = useState('')
    const [cardIssuer, setCardIssuer] = useState('')
    const [lastFourDigits, setLastFourDigits] = useState('')
    const [rewards, setRewards] = useState<Reward[]>([
        { category: '', reward_percentage: 0, is_rotating: false, start_date: null, end_date: null}
    ])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [cards, setCards] = useState<Card[]>([])
    const [showForm, setShowForm] = useState(false)

    const handleSubmit = async() => {
        if (!cardName || !cardIssuer || !lastFourDigits) {
            setError('Please fill in all required fields')
            return
        }

        const trimmedCardName = cardName.trim()
        const trimmedLastFour = lastFourDigits.trim()
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user.id

        const { data: cardData, error: cardError } = await supabase
            .from('credit_cards')
            .insert({ 
                user_id: userId,
                name: trimmedCardName, 
                card_issuer: cardIssuer,
                last_four_digits: trimmedLastFour 
            })
            .select()
            .single()

        if (cardError) {
            setError('An error occured')
            return
        }

        if (cardData) {
            const { error: rewardsError } = await supabase
            .from('rewards')
            .insert(
                rewards.map(reward => ({
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

            if (!rewardsError) {
                setCardName('')
                setCardIssuer('')
                setLastFourDigits('')
                setRewards([{ category: '', reward_percentage: 0, is_rotating: false, start_date: null, end_date: null }])
                setError('')
                setSuccess('Card added successfully!')
                setShowForm(false)
                fetchCards()
            }
        }

    }

    const fetchCards = async () => {
        const { data } = await supabase
        .from('credit_cards')
        .select('*, rewards(*)')
        if (data) setCards(data)
    }

    const handleDelete = () => {

    }

    useEffect(() => {
        fetchCards()
    }, [])

    return (
        <main>
            <div>
                <button onClick={() => setShowForm(true)}>Add Card</button>
                {cards.length > 0 ? (       
                    cards.map((card) => (
                        <div key={card.id}>
                            <div>{card.name}</div>
                            <button>Delete</button>
                        </div>
                    ))
                ) : (
                    <div>No cards yet. Add your first card to get started.</div>
                )}

                {showForm && (
                    <div>
                        
                        <input
                            placeholder="Card Name"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                        />

                        <select
                            value={cardIssuer}
                            onChange={(e) => setCardIssuer(e.target.value)}
                        >
                            <option value="">Select card issuer</option> 
                            {CARD_ISSUERS.map((issuer) => (
                                <option key={issuer} value={issuer}>{issuer}</option>
                            ))}
                        </select>
                        
                        <input
                            placeholder="Last Four Digits"
                            value={lastFourDigits}
                            onChange={(e) => setLastFourDigits(e.target.value)}
                        />
                        
                        <button onClick={() => setShowForm(false)}>Close</button>

                    </div>
                )}
            </div>


        </main>
    )
}