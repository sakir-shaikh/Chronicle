import { useState, useEffect, useCallback, useMemo } from 'react';
import { EventEntity } from '../../domain/events/Event';
import { LocalStorageEventRepository } from '../../infrastructure/repositories/LocalStorageEventRepository';

// In a real app, this would be injected via Context or a DI container
const eventRepository = new LocalStorageEventRepository();

export function useEvents() {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await eventRepository.list();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = async (event: EventEntity) => {
    const created = await eventRepository.create(event);
    setEvents((prev) => [created, ...prev]);
    return created;
  };

  const updateEvent = async (id: string, updates: Partial<EventEntity>) => {
    const updated = await eventRepository.update(id, updates);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEvent = async (id: string) => {
    await eventRepository.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refresh: loadEvents,
  };
}
