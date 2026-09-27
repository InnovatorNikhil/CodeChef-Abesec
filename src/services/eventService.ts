import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { EventItem, EventFormData } from '../types/event';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from './sampleData';

const LOCAL_STORAGE_EVENTS_KEY = 'abes_codechef_events';
const LOCAL_STORAGE_REGISTRATIONS_KEY = 'abes_codechef_registrations';

function getLocalEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVENTS;
  }
}

function saveLocalEvents(events: EventItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function getLocalRegistrationCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REGISTRATIONS_KEY);
    const regs = raw ? JSON.parse(raw) : INITIAL_REGISTRATIONS;
    const counts: Record<string, number> = {};
    for (const r of regs) {
      counts[r.event_id] = (counts[r.event_id] || 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

export const eventService = {
  async getEvents(): Promise<EventItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*, registrations(count)')
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;

        return (events || []).map((ev: any) => ({
          ...ev,
          registration_count: ev.registrations?.[0]?.count ?? 0,
        }));
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }

    // Local fallback
    const events = getLocalEvents();
    const counts = getLocalRegistrationCounts();
    return events.map((ev) => ({
      ...ev,
      registration_count: counts[ev.id] || 0,
    }));
  },

  async getEventById(id: string): Promise<EventItem | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*, registrations(count)')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) return null;

        return {
          ...data,
          registration_count: data.registrations?.[0]?.count ?? 0,
        };
      } catch (err) {
        console.warn('Supabase fetchById failed, falling back to local store:', err);
      }
    }

    const events = getLocalEvents();
    const event = events.find((e) => e.id === id);
    if (!event) return null;
    const counts = getLocalRegistrationCounts();
    return {
      ...event,
      registration_count: counts[event.id] || 0,
    };
  },

  async getFeaturedEvent(): Promise<EventItem | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*, registrations(count)')
          .eq('is_featured', true)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          return {
            ...data,
            registration_count: data.registrations?.[0]?.count ?? 0,
          };
        }
      } catch (err) {
        console.warn('Supabase getFeatured failed, falling back to local store:', err);
      }
    }

    const events = getLocalEvents();
    const featured = events.find((e) => e.is_featured) || events[0] || null;
    if (!featured) return null;
    const counts = getLocalRegistrationCounts();
    return {
      ...featured,
      registration_count: counts[featured.id] || 0,
    };
  },

  async createEvent(eventData: EventFormData): Promise<EventItem> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return { ...data, registration_count: 0 };
    }

    const events = getLocalEvents();
    const newEvent: EventItem = {
      ...eventData,
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      registration_count: 0,
    };

    // If marked featured, remove featured from others
    if (newEvent.is_featured) {
      events.forEach((e) => { e.is_featured = false; });
    }

    events.unshift(newEvent);
    saveLocalEvents(events);
    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<EventFormData>): Promise<EventItem> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const events = getLocalEvents();
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) {
      throw new Error('Event not found');
    }

    if (updates.is_featured) {
      events.forEach((e) => { e.is_featured = false; });
    }

    const updatedEvent: EventItem = {
      ...events[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    events[idx] = updatedEvent;
    saveLocalEvents(events);
    return updatedEvent;
  },

  async deleteEvent(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return;
    }

    const events = getLocalEvents().filter((e) => e.id !== id);
    saveLocalEvents(events);

    // Also remove associated registrations from local store
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_REGISTRATIONS_KEY);
      if (raw) {
        const regs = JSON.parse(raw).filter((r: any) => r.event_id !== id);
        localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(regs));
      }
    } catch {
      // ignore
    }
  },
};
