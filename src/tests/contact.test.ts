import { describe, expect, it } from 'vitest'
import { contactEmailHref } from '@/lib/contact'
import { footerContact } from '@/lib/footer'

describe('contact email drafts', () => {
  it('preserves multilingual text, punctuation and message line breaks', () => {
    const subject = 'Projet & financement — مشروع 50% #1?'
    const body =
      'Nom: Amina أحمد\nEmail: amina+research@example.invalid\n\nBonjour / مرحبًا\r\nR&D: 50% & #1?'
    const draft = new URL(contactEmailHref(subject, body))

    expect(draft.protocol).toBe('mailto:')
    expect(draft.pathname).toBe(footerContact.email)
    expect(draft.searchParams.get('subject')).toBe(subject)
    expect(draft.searchParams.get('body')).toBe(body)
    expect(draft.hash).toBe('')
  })

  it('keeps attempted recipients and headers inside the encoded subject or body', () => {
    const subject = 'Question\r\nBcc: stranger@example.invalid\n&cc=other@example.invalid'
    const body = 'Message\n&bcc=stranger@example.invalid?subject=override#fragment'
    const draft = new URL(contactEmailHref(subject, body))

    expect(draft.pathname).toBe(footerContact.email)
    expect([...draft.searchParams.keys()]).toEqual(['subject', 'body'])
    expect(draft.searchParams.get('subject')).toBe(
      'Question  Bcc: stranger@example.invalid &cc=other@example.invalid',
    )
    expect(draft.searchParams.get('subject')).not.toMatch(/[\r\n]/)
    expect(draft.searchParams.get('body')).toBe(body)
    expect(draft.hash).toBe('')
  })
})
