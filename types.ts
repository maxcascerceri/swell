
import React from 'react';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

export type RoomType = 
  | 'Living Room' 
  | 'Family Room'
  | 'Bedroom' 
  | 'Dining Room' 
  | 'Kitchen' 
  | 'Home Office' 
  | 'Patio'
  | 'Bathroom' 
  | 'Kids Room'
  | 'Gaming Room'
  | 'Entryway'
  | 'Home Gym'
  | 'Home Theater'
  | 'Laundry Room'
  | 'Walk-in Closet'
  | 'Library'
  | 'Sunroom';

export type DesignStyle = 
  | 'Modern' 
  | 'Cozy Minimal' 
  | 'Scandinavian' 
  | 'Transitional' 
  | 'Farmhouse' 
  | 'Coastal' 
  | 'Industrial'
  | 'Bohemian'
  | 'Mid-Century Modern'
  | 'Art Deco'
  | 'Japandi'
  | 'Mediterranean'
  | 'Traditional'
  | 'Rustic'
  | 'Maximalist'
  | 'French Country'
  | 'Biophilic'
  | 'Eclectic'
  | 'Modern Glam'
  | 'Southwestern'
  | 'Zen'
  | 'Baroque'
  | 'Tropical'
  | 'Shabby Chic'
  | 'Cyberpunk'
  | 'Neoclassical';

export type AppView = 'landing' | 'studio' | 'pricing' | 'auth';

export interface GeneratedResult {
  style: DesignStyle;
  imageUrl: string;
  notes: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  credits: number;
  avatar?: string; // Optional URL
}

export interface AppState {
  view: AppView;
  user: User | null; // Currently logged in user
  authView: 'login' | 'signup';
  
  originalImage: string | null;
  selectedRoomType: RoomType | null;
  selectedStyles: DesignStyle[]; 
  generatedImages: GeneratedResult[]; 
  isGenerating: boolean;
  activeResultIndex: number; 
}

export interface StyleOption {
  id: DesignStyle;
  name: string;
  description: string;
  image: string;
}

export interface RoomOption {
  id: RoomType;
  label: string;
  icon: React.ReactNode;
}

export interface ImageRecord {
  id: string;
  originalId: number | string;
  section: 'hero' | 'auth' | 'gallery' | 'style' | 'feature';
  type: 'before' | 'after' | 'single';
  label: string;
  src: string;
}
