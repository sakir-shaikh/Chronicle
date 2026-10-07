import { StoredPhoto } from './Photo';

export interface PhotoStorage {
  upload(file: File): Promise<StoredPhoto>;
  delete(id: string): Promise<void>;
  getUrl(id: string): Promise<string>;
}
