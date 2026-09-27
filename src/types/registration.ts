export type StudentYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface RegistrationItem {
  id: string;
  event_id: string;
  name: string;
  email: string;
  college: string;
  year: StudentYear | string;
  phone: string;
  created_at?: string;
  events?: {
    name: string;
    category?: string;
    date?: string;
    venue?: string;
  };
}

export type RegistrationFormData = Omit<RegistrationItem, 'id' | 'created_at' | 'events'>;
