
import React from 'react';
import { RoomType, DesignStyle, StyleOption, RoomOption } from './types';
import { 
  Sofa, Bed, Utensils, ChefHat, Monitor, Bath, Baby,
  DoorOpen, Armchair
} from 'lucide-react';

export const ROOM_OPTIONS: RoomOption[] = [
  { id: 'Living Room', label: 'Living Room', icon: <Sofa size={20} /> },
  { id: 'Family Room', label: 'Family Room', icon: <Armchair size={20} /> },
  { id: 'Bedroom', label: 'Bedroom', icon: <Bed size={20} /> },
  { id: 'Kitchen', label: 'Kitchen', icon: <ChefHat size={20} /> },
  { id: 'Dining Room', label: 'Dining Room', icon: <Utensils size={20} /> },
  { id: 'Bathroom', label: 'Bathroom', icon: <Bath size={20} /> },
  { id: 'Home Office', label: 'Home Office', icon: <Monitor size={20} /> },
  { id: 'Kids Room', label: 'Kids Room', icon: <Baby size={20} /> },
  { id: 'Entryway', label: 'Entryway / Foyer', icon: <DoorOpen size={20} /> },
];

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'Modern',
    name: 'Modern',
    description: 'Clean lines, neutral colors, sleek furniture.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Modern',
  },
  {
    id: 'Cozy Minimal',
    name: 'Cozy Minimal',
    description: 'Warm textures, clutter-free, soft lighting.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Cozy+Minimal',
  },
  {
    id: 'Scandinavian',
    name: 'Scandinavian',
    description: 'Light woods, functional, airy and bright.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Scandinavian',
  },
  {
    id: 'Japandi',
    name: 'Japandi',
    description: 'Japanese functionality meets Scandinavian rustic minimalism.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Japandi',
  },
  {
    id: 'Transitional',
    name: 'Transitional',
    description: 'Classic meets contemporary, balanced elegance.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Transitional',
  },
  {
    id: 'Farmhouse',
    name: 'Farmhouse',
    description: 'Rustic charm, natural materials, inviting.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Farmhouse',
  },
  {
    id: 'Mediterranean',
    name: 'Mediterranean',
    description: 'Warm tones, textured walls, arches, and natural materials.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Mediterranean',
  },
  {
    id: 'Coastal',
    name: 'Coastal',
    description: 'Breezy, blues and whites, relaxed atmosphere.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Coastal',
  },
  {
    id: 'Industrial',
    name: 'Industrial',
    description: 'Raw materials, exposed structural elements.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Industrial',
  },
  {
    id: 'Bohemian',
    name: 'Bohemian',
    description: 'Eclectic, colorful, patterned, and organic.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Bohemian',
  },
  {
    id: 'Mid-Century Modern',
    name: 'Mid-Century',
    description: 'Retro 50s/60s vibe, geometric shapes, wood.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Mid-Century',
  },
  {
    id: 'Traditional',
    name: 'Traditional',
    description: 'Classic details, antiques, rich colors, and symmetry.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Traditional',
  },
  {
    id: 'Art Deco',
    name: 'Art Deco',
    description: 'Glamorous, gold accents, bold geometric patterns.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Art+Deco',
  },
  {
    id: 'Rustic',
    name: 'Rustic',
    description: 'Natural rugged beauty, raw wood, stone, earthy.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Rustic',
  },
  {
    id: 'Maximalist',
    name: 'Maximalist',
    description: 'Bold colors, patterns, textures. More is more.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Maximalist',
  },
  {
    id: 'French Country',
    name: 'French Country',
    description: 'Soft colors, toile fabrics, distressed wood, romantic.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=French+Country',
  },
  {
    id: 'Biophilic',
    name: 'Biophilic',
    description: 'Nature-connected, abundant plants, natural light.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Biophilic',
  },
  {
    id: 'Eclectic',
    name: 'Eclectic',
    description: 'A curated mix of textures, periods, and trends.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Eclectic',
  },
  {
    id: 'Modern Glam',
    name: 'Modern Glam',
    description: 'Luxurious velvet, metallic accents, and plush comfort.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Modern+Glam',
  },
  {
    id: 'Southwestern',
    name: 'Southwestern',
    description: 'Earth tones, desert textures, terracotta, and rugs.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Southwestern',
  },
  {
    id: 'Zen',
    name: 'Zen',
    description: 'Minimalist Japanese influence, harmony, natural stone.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Zen',
  },
  {
    id: 'Baroque',
    name: 'Baroque',
    description: 'Opulent, ornate details, rich drama, and luxury.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Baroque',
  },
  {
    id: 'Tropical',
    name: 'Tropical',
    description: 'Lush greenery, vibrant colors, rattan, and airy.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Tropical',
  },
  {
    id: 'Shabby Chic',
    name: 'Shabby Chic',
    description: 'Vintage furniture, soft pastels, distressed finish.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Shabby+Chic',
  },
  {
    id: 'Cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic, neon lights, high contrast, tech-inspired.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Cyberpunk',
  },
  {
    id: 'Neoclassical',
    name: 'Neoclassical',
    description: 'Elegant, timeless, columns, and refined luxury.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Neoclassical',
  },
];
