"use client"

const KEY = 'proActive'

export function getProActive(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(KEY) === 'true'
  } catch {
    return false
  }
}

export function setProActive(active: boolean) {
  try {
    window.localStorage.setItem(KEY, active ? 'true' : 'false')
  } catch {}
}
