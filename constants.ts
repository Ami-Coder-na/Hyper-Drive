import { Vehicle, SocialPost, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex "Drift" Chen',
  handle: '@driftking_alex',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  isVerified: true,
  role: 'USER',
};

export const VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    make: 'Tesla',
    model: 'Cybertruck Cyberbeast',
    year: 2024,
    price: 99990,
    image: 'https://picsum.photos/seed/cybertruck/800/600',
    type: 'EV',
    location: 'Neo Tokyo, JP',
    description: 'Stainless steel exoskeleton. Shatter-resistant armor glass. 0-60 in 2.6s. The future is angular.',
    seller: MOCK_USER,
    stats: { speed: 95, handling: 60, range: 85 },
    history: [
      { date: '2024-01', price: 120000 },
      { date: '2024-03', price: 110000 },
      { date: '2024-05', price: 99990 },
    ]
  },
  {
    id: 'v2',
    make: 'Yamaha',
    model: 'YZF-R1M Carbon',
    year: 2023,
    price: 26999,
    image: 'https://picsum.photos/seed/yamaha/800/600',
    type: 'BIKE',
    location: 'Los Angeles, USA',
    description: 'Track-ready superbike. Electronic racing suspension. Carbon bodywork directly from MotoGP.',
    seller: { ...MOCK_USER, name: 'SpeedDemon', handle: '@speedy', isVerified: false },
    stats: { speed: 98, handling: 95, range: 40 },
    history: [
      { date: '2023-01', price: 29000 },
      { date: '2023-06', price: 27500 },
      { date: '2024-01', price: 26999 },
    ]
  },
  {
    id: 'v3',
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2023,
    price: 223800,
    image: 'https://picsum.photos/seed/porsche/800/600',
    type: 'CAR',
    location: 'Berlin, DE',
    description: 'The ultimate driving machine. Naturally aspirated flat-six. DRS system enabled.',
    seller: { ...MOCK_USER, name: 'EuroImports', role: 'DEALER', isVerified: true },
    stats: { speed: 92, handling: 100, range: 60 },
    history: [
      { date: '2023-01', price: 250000 },
      { date: '2023-06', price: 240000 },
      { date: '2024-01', price: 223800 },
    ]
  },
  {
    id: 'v4',
    make: 'NVIDIA',
    model: 'Drive Orin Module',
    year: 2024,
    price: 1500,
    image: 'https://picsum.photos/seed/chip/800/600',
    type: 'PART',
    location: 'Silicon Valley, USA',
    description: 'AI compute for autonomous vehicles. 254 TOPS. Upgrade your ride\'s brain.',
    seller: MOCK_USER,
    stats: { speed: 100, handling: 0, range: 0 },
    history: [
      { date: '2024-01', price: 1600 },
      { date: '2024-05', price: 1500 },
    ]
  }
];

export const POSTS: SocialPost[] = [
  {
    id: 'p1',
    author: MOCK_USER,
    content: 'Just installed the new flux capacitor on the R1. Hits 88mph in 1.2 seconds now! ⚡️ #mods #future',
    image: 'https://picsum.photos/seed/garage/800/600',
    likes: 1240,
    comments: 45,
    timestamp: '2h ago',
    type: 'POST'
  },
  {
    id: 'p2',
    author: { ...MOCK_USER, name: 'Sarah Connor', handle: '@skynet_hunter' },
    content: 'Night ride through the neon district. This city never sleeps, and neither does my EV.',
    image: 'https://picsum.photos/seed/neoncity/800/600',
    likes: 892,
    comments: 12,
    timestamp: '5h ago',
    type: 'REEL'
  }
];
