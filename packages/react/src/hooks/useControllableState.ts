import { useCallback, useState } from 'react';

export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  return [value, setValue] as const;
}
