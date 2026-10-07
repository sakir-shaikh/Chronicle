import { PhotoStorage } from '../../domain/photos/PhotoStorage';
import { StoredPhoto } from '../../domain/photos/Photo';

export class MockPhotoStorage implements PhotoStorage {
  private memoryStore: Map<string, StoredPhoto> = new Map();

  async upload(file: File): Promise<StoredPhoto> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create an object URL to simulate uploaded file url
    const url = URL.createObjectURL(file);
    const id = \photo-\-\\;
    
    const storedPhoto: StoredPhoto = {
      id,
      url,
      createdAt: new Date().toISOString()
    };
    
    this.memoryStore.set(id, storedPhoto);
    return storedPhoto;
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const photo = this.memoryStore.get(id);
    if (photo) {
      URL.revokeObjectURL(photo.url);
      this.memoryStore.delete(id);
    }
  }

  async getUrl(id: string): Promise<string> {
    const photo = this.memoryStore.get(id);
    if (!photo) {
      throw new Error(\Photo \ not found\);
    }
    return photo.url;
  }
}
