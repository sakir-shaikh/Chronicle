import { useState } from 'react';
import { MockPhotoStorage } from '../../infrastructure/storage/MockPhotoStorage';
import { StoredPhoto } from '../../domain/photos/Photo';

const photoStorage = new MockPhotoStorage(); // Replaceable with DI

export function usePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const stored = await photoStorage.upload(file);
      setPhotos(prev => [...prev, stored]);
      return stored;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async (id: string) => {
    try {
      await photoStorage.delete(id);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    photos,
    isUploading,
    error,
    uploadPhoto,
    removePhoto,
    setPhotos // To allow manual setting of existing photos
  };
}
