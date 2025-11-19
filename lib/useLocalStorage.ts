"use client"

import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setStoredValue(JSON.parse(item))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {}
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
