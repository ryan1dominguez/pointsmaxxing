import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { formatCategory } from '@/app/utils/formatCategory'
import { PREDEFINED_CARDS } from '@/app/constants/cards'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
}) 

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
})

const categories = [...new Set(
    PREDEFINED_CARDS.flatMap(card => card.rewards.map(reward => reward.category))
)]

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success, limit, remaining } = await ratelimit.limit(ip)

    if (!success) {
        return NextResponse.json(
        { message: 'Too many requests. Please slow down.' },
        { 
            status: 429,
            headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            }
        }
        )
    }
    
    const body = await request.json()
    const { purchase_description } = body

    if (!purchase_description || purchase_description.trim() === ''){
        return NextResponse.json({ message: "Purchase description is required." }, { status: 400 })
    }

    let category = ''
    try {
        const message = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 10,
            system: `You are a purchase categorizer. Given a purchase description, respond with exactly one category from this list: ${categories}. No explanation, just the category word.`,
            messages: [{ 
                role: "user", 
                content: purchase_description 
            }],
        });
        category = (message.content[0] as { type: 'text', text: string}).text.trim()
    } catch (error: any) {
        if (error.status === 529) {
            return NextResponse.json({ message: "Service temporarily unavailable, please try again." }, { status: 503 })
        }
        return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 })
    }
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabaseAdmin
        .from('rewards')
        .select('*, credit_cards(name, card_issuer)')
        .eq('category', `${category}`)
        .or(`is_rotating.eq.false,end_date.gte.${today}`)
        .order('reward_percentage', { ascending: false })
        .order('is_rotating', { ascending: false })


    if (error) {
        return NextResponse.json({ 
            message: "An error occurred"
        }, 
        { 
            status: 500 
        })
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ 
            message: "No valid rewards category exist"
        }, 
        { 
            status: 404 
        })
    }
    
    return NextResponse.json({ 
        message: `We are categorizing this purchase as "${formatCategory(category)}". The best credit card to use would be ${data[0].credit_cards.name} which will give you ${data[0].reward_percentage}% back`,
        card: data[0].credit_cards.name,
        issuer: data[0].credit_cards.card_issuer,
        category: category,
        percentage: data[0].reward_percentage
    })
}