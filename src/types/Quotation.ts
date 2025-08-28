// src/types/Quotation.ts
import { Timestamp } from 'firebase/firestore';

export type QuotationStatus = 'pending' | 'contacted' | 'completed' | 'cancelled';

export interface Quotation {
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
  status: QuotationStatus;
  createdAt?: Timestamp;
  notes?: string;
}