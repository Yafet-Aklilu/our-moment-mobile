import { useCallback, useRef, useState } from 'react';

import { ApiClientError } from '@/api/client';
import type { SaveStatus } from '@/features/builder/types';

/**
 * Shared save-status + race-safe generation counter for builder step autosave.
 * Mirrors the pattern in `DetailsStep` so every experience/content step reports
 * saving/saved/error consistently via `BuilderSaveStatus`.
 */
export function useAutosaveStatus(readOnly: boolean) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const generation = useRef(0);

  const run = useCallback(
    async (action: () => Promise<void>) => {
      if (readOnly) return;
      const gen = ++generation.current;
      setStatus('saving');
      setErrorMessage(null);
      try {
        await action();
        if (gen !== generation.current) return;
        setStatus('saved');
      } catch (err) {
        if (gen !== generation.current) return;
        setErrorMessage(describeError(err));
        setStatus('error');
      }
    },
    [readOnly],
  );

  return { status, errorMessage, run, setStatus, setErrorMessage } as const;
}

function describeError(err: unknown): string {
  if (err instanceof ApiClientError) {
    if (err.code === 'moment_immutable') {
      return 'This Moment can’t be edited after it’s sent.';
    }
    return err.message;
  }
  return 'Couldn’t save. Try again.';
}
