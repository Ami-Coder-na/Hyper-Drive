export enum ViewState {
  FEED = 'FEED',
  MARKETPLACE = 'MARKETPLACE',
  PROFILE = 'PROFILE',
  VEHICLE_DETAIL = 'VEHICLE_DETAIL',
  AI_CHAT = 'AI_CHAT',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  role: 'USER' | 'DEALER';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  type: 'CAR' | 'BIKE' | 'TRUCK' | 'EV' | 'PART';
  location: string;
  description: string;
  seller: User;
  stats: {
    speed: number; // 0-100 score
    handling: number;
    range: number;
  };
  history: { date: string; price: number }[];
}

export interface SocialPost {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  type: 'POST' | 'REEL';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}