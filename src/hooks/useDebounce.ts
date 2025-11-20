import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function that runs:
    // 1. When the component unmounts
    // 2. OR when the 'value' or 'delay' changes (before the new timer is set)
    // This cancels the previous timer, ensuring only the latest value is used.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if the value or delay changes

  // Return the debounced value
  return debouncedValue;
}