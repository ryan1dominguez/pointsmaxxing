import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface Reward {
  category: string
  reward_percentage: number
  is_rotating: boolean
  start_date: string | null
  end_date: string | null
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
    //const [cards, setCards] = useState<Card[]>([])
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

    const fetchCards = () => {

    }

    const handleDelete = () => {

    }

    

    return (
        <h1>Cards Page</h1>
    )
}