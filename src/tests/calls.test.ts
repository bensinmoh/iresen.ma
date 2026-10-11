import { describe, it, expect } from 'vitest'
import {
  callHref,
  callReferenceFromPath,
  callDateErrors,
  callState,
  isSubmissionUrl,
} from '@/lib/calls'
import { pageHref } from '@/lib/site'

describe('call destinations, calendar and submission', () => {
  it('keeps one stable record reference in localized programme routes', () => {
    for (const locale of ['fr', 'en', 'ar'] as const) {
      expect(callHref('green-call-2026', locale)).toBe(
        pageHref('programmes', locale) + '/green-call-2026',
      )
      expect(
        callReferenceFromPath(callHref('green-call-2026', locale).slice(locale.length + 1), locale),
      ).toBe('green-call-2026')
      expect(callReferenceFromPath('/research-innovation/programmes/green-call-2026', locale)).toBe(
        'green-call-2026',
      )
      expect(callReferenceFromPath('/research-innovation/programmes/a/b', locale)).toBeNull()
      expect(
        callReferenceFromPath(
          encodeURI(callHref('green-call-2026', locale).slice(locale.length + 1)),
          locale,
        ),
      ).toBe('green-call-2026')
      expect(callReferenceFromPath('/research-innovation/programmes/%E0%A4%A', locale)).toBeNull()
    }
  })
  it('closes at the exact deadline, disables cancelled calls and rejects reversed schedules', () => {
    const call = { openingAt: '2026-01-01T10:00:00Z', deadlineAt: '2026-11-01T17:00:00Z' }
    expect(callState(call, Date.parse('2025-12-31T10:00:00Z'))).toBe('upcoming')
    expect(callState(call, Date.parse(call.openingAt))).toBe('open')
    expect(callState(call, Date.parse(call.deadlineAt))).toBe('closed')
    expect(callState({ ...call, cancelled: true }, Date.parse(call.openingAt))).toBe('cancelled')
    expect(callDateErrors({ ...call, evaluationStartsAt: '2026-02-01T00:00:00Z' })).not.toEqual([])
    expect(callDateErrors({ ...call, evaluationStartsAt: '2026-11-02T00:00:00Z' })).toEqual([])
    expect(callDateErrors({ openingAt: 'not a date' })).not.toEqual([])
  })
  it('accepts explicit HTTPS form destinations and rejects active/credentialed URLs', () => {
    expect(isSubmissionUrl('https://example.org/application?call=green')).toBe(true)
    for (const value of [
      'javascript:alert(1)',
      'https://user:secret@example.org',
      'http://example.org',
      '/form',
    ])
      expect(isSubmissionUrl(value)).toBe(false)
  })
})
