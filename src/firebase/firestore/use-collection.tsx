'use client';

import { useState, useEffect } from 'react';
import { mockDb, executeQuery, MockColRef, MockQuery } from '../mock-store';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: any | null;
}

export function useCollection<T = any>(
  memoizedTargetRefOrQuery: (MockColRef | MockQuery) | null | undefined
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(() => {
    if (!memoizedTargetRefOrQuery) return null;
    return executeQuery(memoizedTargetRefOrQuery);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const update = () => {
      try {
        const results = executeQuery(memoizedTargetRefOrQuery);
        setData(results as WithId<T>[]);
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
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}