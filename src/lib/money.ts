/** Shared public money format: Latin digits, NBSP grouping/code, floor to whole units. */
export function formatMoney(amount: number, currency = 'MAD'): string {
  if (!Number.isFinite(amount)) throw new RangeError('A finite monetary amount is required.')
  const whole = Math.floor(amount)
  const grouped = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
    .format(whole === 0 ? 0 : whole)
    .replaceAll(',', '\u00a0')
  return `${grouped}\u00a0${currency}`
}

/** Capturing groups let HTML and React renderers isolate amounts without altering prose. */
export function moneyParts(text: string): string[] {
  return text.split(/(-?\d{1,3}(?:\u00a0\d{3})*\u00a0(?:MAD|EUR|USD))/g)
}
