// src/types/Car.ts
import { Timestamp } from 'firebase/firestore';

export interface Car {
  id?: string;
  name: string;
  type: string;
  price: string;
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
}

