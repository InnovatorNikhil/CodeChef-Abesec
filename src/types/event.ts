export type EventCategory = 
  | 'All'
  | 'Coding'
  | 'Workshop'
  | 'Hackathon'
  | 'Seminar'
  | 'Cultural'
  | 'Sports'
  | 'Other';

export type EventStatusFilter = 
  | 'All'
  | 'Upcoming'
  | 'Past'
  | 'Registration Open'
  | 'Registration Closed';

export interface EventItem {
  id: string;
  name: string;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS or HH:MM
  venue: string;
  short_description?: string;
  description?: string;
  banner_url?: string;
  registration_deadline?: string;
  max_participants?: number;
  is_featured?: boolean;
  registration_open?: boolean;
  created_at?: string;
  updated_at?: string;
  registration_count?: number; // calculated from registrations
}

export type EventFormData = Omit<EventItem, 'id' | 'created_at' | 'updated_at' | 'registration_count'>;
