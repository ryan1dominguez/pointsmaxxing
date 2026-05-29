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
      { category: 'dining', reward_percentage: 4, is_rotating: false },
      { category: 'groceries', reward_percentage: 4, is_rotating: false }
    ]
  },
  {
    name: 'American Express Platinum',
    issuer: 'American Express',
    rewards: [
      { category: 'travel', reward_percentage: 5, is_rotating: false }
    ]
  },
  {
    name: 'American Express Blue Cash Preferred',
    issuer: 'American Express',
    rewards: [
      { category: 'groceries', reward_percentage: 6, is_rotating: false },
      { category: 'dining', reward_percentage: 3, is_rotating: false },
      { category: 'gas', reward_percentage: 3, is_rotating: false }
    ]
  },
  {
    name: 'Discover IT',
    issuer: 'Discover',
    rewards: []
  },
  {
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', reward_percentage: 3, is_rotating: false },
      { category: 'online_shopping', reward_percentage: 3, is_rotating: false }
    ]
  },
  {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', reward_percentage: 3, is_rotating: false },
      { category: 'travel', reward_percentage: 5, is_rotating: false }
    ]
  },
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    rewards: [
      { category: 'dining', reward_percentage: 3, is_rotating: false },
      { category: 'travel', reward_percentage: 5, is_rotating: false }
    ]
  },
  {
    name: 'Capital One Venture',
    issuer: 'Capital One',
    rewards: [
      { category: 'travel', reward_percentage: 5, is_rotating: false }
    ]
  },
  {
    name: 'Capital One Quicksilver',
    issuer: 'Capital One',
    rewards: [
      { category: 'dining', reward_percentage: 1.5, is_rotating: false },
      { category: 'groceries', reward_percentage: 1.5, is_rotating: false }
    ]
  },
  {
    name: 'Citi Double Cash',
    issuer: 'Citi',
    rewards: [
      { category: 'dining', reward_percentage: 2, is_rotating: false },
      { category: 'groceries', reward_percentage: 2, is_rotating: false }
    ]
  },
  {
    name: 'Citi Custom Cash',
    issuer: 'Citi',
    rewards: [
      { category: 'dining', reward_percentage: 5, is_rotating: false }
    ]
  }
]
