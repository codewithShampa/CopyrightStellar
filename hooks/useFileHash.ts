'use client';

import { useCallback, useState } from 'react';

/**
 * Custom hook for SHA-256 file hashing with progress tracking.
 * Wraps the SubtleCrypto API with loading and error states.
 */
export function useFileHash() {
  const [fileHash, setFileHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [hashing, setHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hashFile = useCallback(async (file: File) => {
    setHashing(true);
    setError(null);
    setFileName(file.name);
    setFileSize(file.size);
    setFileHash('');

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setFileHash(hex);
      return hex;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Hashing failed';
      setError(message);
      setFileHash('');
      return '';
    } finally {
      setHashing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFileHash('');
    setFileName('');
    setFileSize(0);
    setHashing(false);
    setError(null);
  }, []);

  return { fileHash, fileName, fileSize, hashing, error, hashFile, reset };
}
