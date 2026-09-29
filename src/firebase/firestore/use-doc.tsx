'use client';

import { useState, useEffect } from 'react';
import { mockDb, MockDocRef } from '../mock-store';

export type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: any | null;
}

export function useDoc<T = any>(
  memoizedDocRef: MockDocRef | null | undefined
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(() => {
    if (!memoizedDocRef) return null;
    const res = mockDb.getDoc(memoizedDocRef.path);
    return res.exists ? ({ ...res.data, id: res.id } as WithId<T>) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const update = () => {
      try {
        const res = mockDb.getDoc(memoizedDocRef.path);
        if (res.exists) {
          setData({ ...res.data, id: res.id } as WithId<T>);
        } else {
          setData(null);
        }
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    update();
    const unsubscribe = mockDb.subscribe(update);
    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}