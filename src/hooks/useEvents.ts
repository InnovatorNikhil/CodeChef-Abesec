import { useState, useEffect, useCallback } from 'react';
import type { EventItem, EventFormData } from '../types/event';
import { eventService } from '../services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err?.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (data: EventFormData): Promise<EventItem> => {
    const created = await eventService.createEvent(data);
    await fetchEvents();
    return created;
  };

  const updateEvent = async (id: string, data: Partial<EventFormData>): Promise<EventItem> => {
    const updated = await eventService.updateEvent(id, data);
    await fetchEvents();
    return updated;
  };

  const deleteEvent = async (id: string): Promise<void> => {
    await eventService.deleteEvent(id);
    await fetchEvents();
  };

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
