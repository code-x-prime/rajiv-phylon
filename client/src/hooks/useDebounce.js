"use client";

import { useState, useEffect } from "react";

/**
 * Returns a debounced value that updates after `delay` ms of no changes.
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
