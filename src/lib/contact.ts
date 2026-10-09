import { footerContact } from '@/lib/footer'

export const contactTopics = [
  'agency',
  'partnerships',
  'press',
  'careers',
  'platforms',
  'other',
] as const
export type ContactTopic = (typeof contactTopics)[number]

export const contactLocation = {
  directionsHref: 'https://maps.app.goo.gl/ns5xu8p1TQVdL7Wu7',
  // Address query, not coordinates inferred from the unresolved short link.
  embedHref:
    'https://www.google.com/maps?q=IRESEN%2C%2016%20rue%20Amir%20Sidi%20Mohamed%2C%20Souissi%2C%20Rabat%2010090%2C%20Maroc&output=embed',
} as const

export function isContactTopic(value: string | null): value is ContactTopic {
  return contactTopics.some((topic) => topic === value)
}

// Only a subject and body may be composed. User input never becomes a recipient
// or an email header; percent encoding preserves Arabic, newlines and punctuation.
export function contactEmailHref(subject: string, body: string): string {
  const safeSubject = subject.replace(/[\r\n]/g, ' ')
  return `mailto:${footerContact.email}?subject=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(body)}`
}
