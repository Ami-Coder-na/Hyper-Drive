
import { Vehicle, SocialPost, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex "Drift" Chen',
  handle: '@driftking_alex',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
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
    image: 'https://images.unsplash.com/photo-1695239510467-f12db596bb05?auto=format&fit=crop&q=80&w=1200',
    gallery: [
        'https://images.unsplash.com/photo-1695239510467-f12db596bb05?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1699349896707-160a2214300e?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1701362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=1200'
    ],
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
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c3d?auto=format&fit=crop&q=80&w=1200',
    gallery: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c3d?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200'
    ],
    type: 'BIKE',
    location: 'Los Angeles, USA',
    description: 'Track-ready superbike. Electronic racing suspension. Carbon bodywork directly from MotoGP.',
    seller: { ...MOCK_USER, name: 'SpeedDemon', handle: '@speedy', isVerified: false, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200' },
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
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1200',
    gallery: [
        'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200'
    ],
    type: 'CAR',
    location: 'Berlin, DE',
    description: 'The ultimate driving machine. Naturally aspirated flat-six. DRS system enabled.',
    seller: { ...MOCK_USER, name: 'EuroImports', role: 'DEALER', isVerified: true, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
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
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200',
    type: 'PART',
    location: 'Silicon Valley, USA',
    description: 'AI compute for autonomous vehicles. 254 TOPS. Upgrade your ride\'s brain.',
    seller: MOCK_USER,
    stats: { speed: 100, handling: 0, range: 0 },
    history: [
      { date: '2024-01', price: 1600 },
      { date: '2024-05', price: 1500 },
    ]
  },
  {
    id: 'v5',
    make: 'Ford',
    model: 'Mustang Shelby GT500',
    year: 2022,
    price: 79900,
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=1200',
    type: 'CAR',
    location: 'Austin, TX',
    description: 'Supercharged V8 Predator engine. 760 horsepower. Track pack installed.',
    seller: MOCK_USER,
    stats: { speed: 90, handling: 80, range: 65 },
    history: [
        { date: '2022-01', price: 85000 },
        { date: '2024-01', price: 79900 },
    ]
  }
];

export const POSTS: SocialPost[] = [
  {
    id: 'p1',
    author: MOCK_USER,
    content: 'Just installed the new flux capacitor on the R1. Hits 88mph in 1.2 seconds now! ⚡️ #mods #future',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200',
    likes: 1240,
    comments: 45,
    timestamp: '2h ago',
    type: 'POST'
  },
  {
    id: 'p2',
    author: { ...MOCK_USER, name: 'Sarah Connor', handle: '@skynet_hunter', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    content: 'Night ride through the neon district. This city never sleeps, and neither does my EV.',
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&q=80&w=1200',
    likes: 892,
    comments: 12,
    timestamp: '5h ago',
    type: 'REEL'
  }
];
