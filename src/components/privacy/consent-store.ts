'use client'

import { useSyncExternalStore } from 'react'
import { consentCookie, consentMaxAge, consentVersion, parseConsent } from '@/lib/cookie-consent'

const changed = 'iresen:consent-changed'
export const openPreferencesEvent = 'iresen:open-cookie-preferences'

function snapshot() {
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
  if (channel) channel.onmessage = callback
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
  try {
    document.cookie = `${consentCookie}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${consentMaxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  } catch {
    return false
  }
  window.dispatchEvent(new Event(changed))
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(changed)
    channel.postMessage(null)
    channel.close()
  }
  return snapshot() === JSON.stringify(value)
}

export function openPreferences() {
  window.dispatchEvent(new Event(openPreferencesEvent))
}
