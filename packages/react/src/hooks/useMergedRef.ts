import { useCallback } from 'react';
import type { Ref, RefCallback } from 'react';

export function useMergedRef<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return useCallback((node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        return typeof cleanup === 'function' ? cleanup : () => ref(null);
      }
      if (ref) {
        ref.current = node;
        return () => {
          ref.current = null;
        };
      }
      return () => undefined;
    });
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, refs);
}
