import { EventEntity } from '../../domain/events/Event';
import { EventRepository } from '../../domain/events/EventRepository';
import { INITIAL_EVENTS } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'chronicle_events_data_v2';

export class LocalStorageEventRepository implements EventRepository {
  private getEvents(): EventEntity[] {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read events from localStorage', e);
    }
    // Type casting here since we are bridging mock data to domain entity
    return INITIAL_EVENTS as unknown as EventEntity[];
  }

  private saveEvents(events: EventEntity[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }

  async list(): Promise<EventEntity[]> {
    return this.getEvents();
  }

  async getById(id: string): Promise<EventEntity | null> {
    const events = this.getEvents();
    return events.find((e) => e.id === id) || null;
  }

  async create(event: EventEntity): Promise<EventEntity> {
    const events = this.getEvents();
    events.unshift(event);
    this.saveEvents(events);
    return event;
  }

  async update(id: string, updates: Partial<EventEntity>): Promise<EventEntity> {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error(\Event with id \ not found\);
    }
    const updated = { ...events[index], ...updates };
    events[index] = updated;
    this.saveEvents(events);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    this.saveEvents(filtered);
  }
}
