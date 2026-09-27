import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { RegistrationItem, RegistrationFormData } from '../types/registration';
import { INITIAL_REGISTRATIONS } from './sampleData';
import { eventService } from './eventService';

const LOCAL_STORAGE_REGISTRATIONS_KEY = 'abes_codechef_registrations';

function getLocalRegistrations(): RegistrationItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REGISTRATIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REGISTRATIONS;
  }
}

function saveLocalRegistrations(regs: RegistrationItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(regs));
  } catch (err) {
    console.error('Failed to save registrations to localStorage:', err);
  }
}

export const registrationService = {
  async getRegistrations(): Promise<RegistrationItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select(`
            *,
            events (
              name,
              category,
              date,
              venue
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn('Supabase getRegistrations failed, falling back to local store:', err);
      }
    }

    const regs = getLocalRegistrations();
    const allEvents = await eventService.getEvents();
    const eventMap = new Map(allEvents.map((e) => [e.id, e]));

    return regs.map((r) => {
      const ev = eventMap.get(r.event_id);
      return {
        ...r,
        events: ev ? {
          name: ev.name,
          category: ev.category,
          date: ev.date,
          venue: ev.venue,
        } : undefined,
      };
    }).sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  },

  async getRegistrationsByEvent(eventId: string): Promise<RegistrationItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .eq('event_id', eventId);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn('Supabase getRegistrationsByEvent failed, falling back:', err);
      }
    }

    const regs = getLocalRegistrations();
    return regs.filter((r) => r.event_id === eventId);
  },

  async registerStudent(formData: RegistrationFormData): Promise<RegistrationItem> {
    const targetEvent = await eventService.getEventById(formData.event_id);
    if (!targetEvent) {
      throw new Error('Event not found.');
    }

    // Capacity check
    const currentCount = targetEvent.registration_count || 0;
    const maxCapacity = targetEvent.max_participants || 100;
    if (currentCount >= maxCapacity) {
      throw new Error('Registration Full. This event has reached maximum capacity.');
    }

    // Registration open check
    if (targetEvent.registration_open === false) {
      throw new Error('Registration Closed. This event is not accepting new registrations.');
    }

    // Deadline check
    if (targetEvent.registration_deadline && new Date() > new Date(targetEvent.registration_deadline)) {
      throw new Error('Registration Closed. The deadline for this event has passed.');
    }

    if (isSupabaseConfigured) {
      // Supabase insertion
      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          ...formData,
          email: formData.email.trim().toLowerCase(),
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        // Postgres unique constraint code 23505
        if (error.code === '23505' || error.message.toLowerCase().includes('unique') || error.message.toLowerCase().includes('duplicate')) {
          throw new Error('You are already registered for this event.');
        }
        throw new Error(error.message || 'Failed to submit registration.');
      }

      return data;
    }

    // Local fallback check duplicate
    const regs = getLocalRegistrations();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const existing = regs.find(
      (r) => r.event_id === formData.event_id && r.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      throw new Error('You are already registered for this event.');
    }

    const newReg: RegistrationItem = {
      ...formData,
      id: 'reg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      email: normalizedEmail,
      created_at: new Date().toISOString(),
      events: {
        name: targetEvent.name,
        category: targetEvent.category,
        date: targetEvent.date,
        venue: targetEvent.venue,
      },
    };

    regs.unshift(newReg);
    saveLocalRegistrations(regs);
    return newReg;
  },
};
