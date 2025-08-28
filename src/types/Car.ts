// src/types/Car.ts - COMPLETE REPLACEMENT
import { Timestamp } from 'firebase/firestore';

export type CarCategory = 'ocean network' | 'dynasty network' | 'denza' | 'leopard';

export interface CarImage {
  url: string;
  storagePath?: string;
  uploadedAt?: Timestamp;
}

export interface Car {
  id?: string;
  name: string;
  type: string;
  category: CarCategory;
  price: string;
  year?: string;
  range: string;
  acceleration: string;
  topSpeed: string;
  battery: string;
  charging: string;
  seats: number;
  description: string;
  features: string[];
  images: (string | CarImage)[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isActive: boolean;
  published?: boolean;
}

// Helper to normalize images
export const normalizeCarImages = (images: (string | CarImage)[]): CarImage[] => {
  return images.map(img => 
    typeof img === 'string' ? { url: img } : img
  );
};

// Category display names
export const CATEGORY_LABELS: Record<CarCategory, string> = {
  'ocean network': 'Ocean Network',
  'dynasty network': 'Dynasty Network',
  'denza': 'Denza',
  'leopard': 'Leopard'
};

export const CAR_CATEGORIES: CarCategory[] = [
  'ocean network',
  'dynasty network', 
  'denza',
  'leopard'
];