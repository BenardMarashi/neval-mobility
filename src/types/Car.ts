// src/types/Car.ts
import { Timestamp } from 'firebase/firestore';

export type CarCategory = 'ocean network' | 'dynasty network' | 'denza' | 'leopard';

export const CAR_CATEGORIES: CarCategory[] = [
  'ocean network',
  'dynasty network', 
  'denza',
  'leopard'
];

export const CATEGORY_LABELS: Record<CarCategory, string> = {
  'ocean network': 'Ocean Network',
  'dynasty network': 'Dynasty Network',
  'denza': 'Denza',
  'leopard': 'Leopard'
};

export interface Car {
  id?: string;
  name: string;
  type: string;
  category: CarCategory;
  price: string;
  year?: number;
  range: string;
  acceleration: string;
  topSpeed: string;
  battery: string;
  charging: string;
  seats: number;
  description: string;
  features: string[];
  images: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isActive: boolean;
  published?: boolean;
}