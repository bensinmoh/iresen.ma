export const consentCookie = 'iresen_consent'
export const consentMaxAge = 60 * 60 * 24 * 180
export const consentVersion = 1
export type Consent = { version: number; external: boolean; expires: number }

export function parseConsent(raw: string, now = Date.now()): Consent | null {
  try {
    const value = JSON.parse(raw) as Consent
    if (
      value.version !== consentVersion ||
      typeof value.external !== 'boolean' ||
      !Number.isFinite(value.expires) ||
      value.expires <= now ||
      value.expires > now + consentMaxAge * 1000
    )
      return null
    return value
  } catch {
    return null
  }
}
