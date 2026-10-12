'use client'

import { useSyncExternalStore } from 'react'
import { consentCookie, consentMaxAge, consentVersion, parseConsent } from '@/lib/cookie-consent'

const changed = 'iresen:consent-changed'
// A failed storage write must never keep an optional service active in this tab.
let failedStorage = false
export const openPreferencesEvent = 'iresen:open-cookie-preferences'

function snapshot() {
  if (failedStorage) return ''
  try {
    const entry = document.cookie.split('; ').find((item) => item.startsWith(`${consentCookie}=`))
    const raw = entry ? decodeURIComponent(entry.slice(consentCookie.length + 1)) : ''
    return parseConsent(raw) ? raw : ''
  } catch {
    return ''
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(changed, callback)
  window.addEventListener('focus', callback)
  window.addEventListener('pageshow', callback)
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(changed) : null
  if (channel)
    channel.onmessage = (event: MessageEvent<{ failed: boolean }>) => {
      if (typeof event.data?.failed === 'boolean') failedStorage = event.data.failed
      callback()
    }
  // Recheck expiry while a tab remains open; no third-party request is made.
  const interval = window.setInterval(callback, 30_000)
  return () => {
    window.removeEventListener(changed, callback)
    window.removeEventListener('focus', callback)
    window.removeEventListener('pageshow', callback)
    window.clearInterval(interval)
    channel?.close()
  }
}

export function useConsent() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => 'pending')
  return { ready: raw !== 'pending', consent: parseConsent(raw) }
}

export function saveConsent(external: boolean) {
  const value = { version: consentVersion, external, expires: Date.now() + consentMaxAge * 1000 }
  failedStorage = false
  try {
    document.cookie = `${consentCookie}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${consentMaxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  } catch {
    failedStorage = true
  }
  failedStorage = failedStorage || snapshot() !== JSON.stringify(value)
  window.dispatchEvent(new Event(changed))
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(changed)
    channel.postMessage({ failed: failedStorage })
    channel.close()
  }
  return !failedStorage
}

export function openPreferences() {
  window.dispatchEvent(new Event(openPreferencesEvent))
}
