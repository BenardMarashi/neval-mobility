// src/types/PricingRequest.ts (formerly Quotation.ts)
import { Timestamp } from 'firebase/firestore';

export type PricingRequestStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface PricingRequest {
  id?: string;
  carId: string;
  carName: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  message: string;
  status: PricingRequestStatus;
  createdAt?: Timestamp;
  notes?: string;
}