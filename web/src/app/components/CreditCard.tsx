import { formatCategory } from "../utils/formatCategory"

interface CreditCardProps {
    name: string
    issuer: string
    percentage: number
    category: string
}

export default function CreditCard({ name, issuer, percentage, category}: CreditCardProps) {
    
    const getCardStyle = (issuer: string) => {
        switch(issuer.toLowerCase()) {
            case 'american express': return 'from-[#B8860B] via-[#FFD700] to-[#B8860B]'
            case 'discover': return 'from-[#CC4A00] via-[#FF6B2B] to-[#CC4A00]'
            case 'chase': return 'from-[#0047FF] via-[#3D8FFF] to-[#0047FF]'
            default: return 'from-[#1A2332] via-[#243447] to-[#1A2332]'
        }
    }

    

    return (
        <div className={`bg-linear-to-br ${getCardStyle(issuer)} w-full h-40 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg`}>
            <div className="flex items-start justify-between">
                <span className="text-[13px] font-semibold text-white/90 tracking-[0.02em]">{issuer}</span>
                <div className="w-8 h-6 bg-linear-to-br from-yellow-300 to-yellow-500 rounded-sm opacity-90"/>
            </div>

            <div>
                <div className="text-[11px] text-white/70 uppercase tracking-wider font-['Space_Mono'] mb-1">{name}</div>
                <div className="text-[22px] font-semibold text-white font-['Space_Mono']">{percentage}%</div>
                <div className="text-[11px] text-white/60 mt-0.5">{formatCategory(category)}</div>
            </div>

        </div>
    )
}