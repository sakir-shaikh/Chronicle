import { EventEntity } from './Event';

export interface EventRepository {
  getById(id: string): Promise<EventEntity | null>;
  list(): Promise<EventEntity[]>;
  create(event: EventEntity): Promise<EventEntity>;
  update(id: string, event: Partial<EventEntity>): Promise<EventEntity>;
  delete(id: string): Promise<void>;
}
