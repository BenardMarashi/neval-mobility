// src/types/PricingRequest.ts
import { Timestamp } from 'firebase/firestore';

export type PricingRequestStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface PricingRequest {
  id?: string;
  carId: string;
  carName: string;
  customerName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
  newsletter?: boolean;
  status: PricingRequestStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  notes?: string;
}