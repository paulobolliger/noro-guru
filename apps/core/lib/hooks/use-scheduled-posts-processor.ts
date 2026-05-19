'use client';

import { useEffect } from 'react';

export function useScheduledPostsProcessor(isEnabled: boolean) {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    // Placeholder hook: no-op to keep build working until real processor is implemented.
  }, [isEnabled]);
}
