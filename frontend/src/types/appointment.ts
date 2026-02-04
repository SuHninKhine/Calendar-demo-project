export interface Appointment {
  id: number;
  client_name: string;
  phone: string;
  address: string;
  postal_code: string;
  date: string;
  slot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  district: string;
  worker_name: string | null;
  created_at: string;
  updated_at: string;
}

export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';
