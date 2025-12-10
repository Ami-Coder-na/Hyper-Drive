export enum ViewState {
  FEED = 'FEED',
  MARKETPLACE = 'MARKETPLACE',
  PROFILE = 'PROFILE',
  VEHICLE_DETAIL = 'VEHICLE_DETAIL',
  AI_CHAT = 'AI_CHAT',
  SETTINGS = 'SETTINGS',
  CREATE_LISTING = 'CREATE_LISTING',
  MESSAGES = 'MESSAGES',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  role: 'USER' | 'DEALER';
  status?: 'online' | 'offline' | 'away';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  gallery?: string[];
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

export interface DMMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

export interface Conversation {
  id: number;
  user: User;
  lastMessage: string;
  time: string;
  unread: number;
  history: DMMessage[];
}