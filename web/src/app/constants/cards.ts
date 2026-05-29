export const CARD_ISSUERS = [
  'American Express',
  'Discover',
  'Chase',
  'Capital One',
  'Citi',
  'Bank of America',
  'Wells Fargo',
  'Other'
]

export interface PredefinedReward {
  category: string
  reward_percentage: number
  is_rotating: boolean
  start_date: string | null
  end_date: string | null
}

export interface PredefinedCard {
  name: string
  issuer: string
  rewards: PredefinedReward[]
}

export const PREDEFINED_CARDS: PredefinedCard[] = [
  {
    name: 'American Express Gold',
    issuer: 'American Express',
    rewards: [
      { category: 'dining', reward_percentage: 4, is_rotating: false, start_date: null, end_date: null },
      { category: 'groceries', reward_percentage: 4, is_rotating: false , start_date: null, end_date: null },
      { category: 'hotels', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      {category: 'flights', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'American Express Platinum',
    issuer: 'American Express',
    rewards: [
      { category: 'flights', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      { category: 'hotels', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'American Express Blue Cash Preferred',
    issuer: 'American Express',
    rewards: [
      { category: 'groceries', reward_percentage: 6, is_rotating: false, start_date: null, end_date: null },
      { category: 'streaming', reward_percentage: 6, is_rotating: false, start_date: null, end_date: null },
      { category: 'transit', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'gas', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'Discover IT',
    issuer: 'Discover',
    rewards: [
      { category: 'dining', reward_percentage: 5, is_rotating: true, start_date: '2026-04-01', end_date: '2026-06-30' },
      { category: 'home_improvement', reward_percentage: 5, is_rotating: true, start_date: '2026-04-01', end_date: '2026-06-30'},
    ]
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'drugstore', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'travel', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      { category: 'amazon', reward_percentage: 5, is_rotating: true, start_date: '2026-04-01', end_date: '2026-06-30' },
    ]
  },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'drugstore', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'travel', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    rewards: [
      { category: 'travel', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      { category: 'travel', reward_percentage: 2, is_rotating: false, start_date: null, end_date: null },
      { category: 'dining', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'groceries', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
      { category: 'streaming', reward_percentage: 3, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'Capital One VentureOne',
    issuer: 'Capital One',
    rewards: [
      { category: 'hotels', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      { category: 'travel', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'Capital One Quicksilver',
    issuer: 'Capital One',
    rewards: [
      { category: 'dining', reward_percentage: 1.5, is_rotating: false, start_date: null, end_date: null },
      { category: 'groceries', reward_percentage: 1.5, is_rotating: false, start_date: null, end_date: null }
    ]
  },
  {
    name: 'Capital One Venture Rewards',
    issuer: 'Capital One',
    rewards: [
      { category: 'hotels', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      { category: 'travel', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
    ]
  },
  {
    name: 'Citi Double Cash',
    issuer: 'Citi',
    rewards: [
      { category: 'travel', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
      { category: 'hotels', reward_percentage: 5, is_rotating: false, start_date: null, end_date: null },
    ]
  },
]
