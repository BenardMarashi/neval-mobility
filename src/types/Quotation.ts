// src/types/Quotation.ts - UPDATE THIS
import { Timestamp } from 'firebase/firestore';

export type QuotationStatus = 'pending' | 'viewed' | 'contacted' | 'completed' | 'cancelled';

export interface Quotation {
  id?: string;
  carId: string;
  carName: string;
  customerName: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message: string;
  status: QuotationStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  notes?: string;
}