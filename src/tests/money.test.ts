import { describe, expect, it } from 'vitest'
import { formatMoney, moneyParts } from '@/lib/money'

describe('public monetary formatting', () => {
  it.each([
    [3938394.99, 'MAD', '3\u00a0938\u00a0394\u00a0MAD'],
    [1000.99, 'MAD', '1\u00a0000\u00a0MAD'],
    [0.99, 'MAD', '0\u00a0MAD'],
    [-1.01, 'EUR', '-2\u00a0EUR'],
    [-0, 'USD', '0\u00a0USD'],
    [150000, 'EUR', '150\u00a0000\u00a0EUR'],
  ] as const)('floors %s and keeps all separators nonbreaking', (amount, currency, expected) => {
    expect(formatMoney(amount, currency)).toBe(expected)
  })
  it('uses MAD by default and rejects non-finite amounts', () => {
    expect(formatMoney(42.99)).toBe('42\u00a0MAD')
    for (const value of [NaN, Infinity, -Infinity])
      expect(() => formatMoney(value)).toThrow(RangeError)
  })
  it('isolates each complete amount while preserving surrounding prose', () => {
    expect(moneyParts('حتى 1\u00a0500\u00a0000\u00a0MAD أو 150\u00a0000\u00a0EUR.')).toEqual([
      'حتى ',
      '1\u00a0500\u00a0000\u00a0MAD',
      ' أو ',
      '150\u00a0000\u00a0EUR',
      '.',
    ])
  })
})
