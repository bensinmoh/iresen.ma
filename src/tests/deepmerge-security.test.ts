import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const payloadRequire = createRequire(require.resolve('payload'))
const merge = payloadRequire('deepmerge') as typeof import('../../vendor/deepmerge-safe')
const json = (value: string) => JSON.parse(value)
const attack = () => json('{"__proto__":{"isAdmin":true}}')

describe('Payload resolved deepmerge security boundary', () => {
  it('uses the explicit private hardened fork rather than the affected registry package', () => {
    const entry = payloadRequire.resolve('deepmerge')
    const manifest = JSON.parse(
      readFileSync(new URL('./package.json', pathToFileURL(entry)), 'utf8'),
    )
    expect(manifest.name).toBe('@iresen/deepmerge-safe')
    expect(manifest.private).toBe(true)
    expect(manifest.version).toBe('1.0.0')
    expect(manifest.dependencies).toBeUndefined()
    expect(readFileSync(entry, 'utf8')).toBe(
      readFileSync(new URL('../../vendor/deepmerge-safe/index.cjs', import.meta.url), 'utf8'),
    )
  })

  it.each([null, undefined, 0, 'placeholder', Object.create(null)])(
    'keeps the normal prototype when merging a nested object over %s',
    (session) => {
      const result = merge({ session }, { session: attack() })
      expect(Object.getPrototypeOf(result.session)).toBe(Object.prototype)
      expect(result.session.isAdmin).toBeUndefined()
      expect(Object.hasOwn(result.session, '__proto__')).toBe(false)
      expect(Object.hasOwn(Object.prototype, 'isAdmin')).toBe(false)
    },
  )

  it('blocks null-prototype targets and malicious own keys in either input', () => {
    for (const [target, source] of [
      [Object.create(null), attack()],
      [attack(), {}],
      [attack(), attack()],
      [{ nested: attack() }, { list: [attack()] }],
    ]) {
      const result = merge<{
        isAdmin?: boolean
        nested?: { isAdmin?: boolean }
        list?: { isAdmin?: boolean }[]
      }>(target, source)
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
      expect(Object.hasOwn(result, '__proto__')).toBe(false)
      expect(result.isAdmin).toBeUndefined()
      if (result.nested) expect(result.nested.isAdmin).toBeUndefined()
      if (result.list) expect(result.list[0].isAdmin).toBeUndefined()
    }
  })

  it('does not mutate inputs and retains ordinary own data-property descriptors', () => {
    const left = Object.freeze({ nested: Object.freeze({ a: 1 }) })
    const right = Object.freeze({ nested: Object.freeze({ b: 2 }) })
    const result = merge(left, right)
    expect(result).toEqual({ nested: { a: 1, b: 2 } })
    expect(result.nested).not.toBe(left.nested)
    expect(Object.getOwnPropertyDescriptor(result, 'nested')).toMatchObject({
      enumerable: true,
      configurable: true,
      writable: true,
    })
  })

  it('preserves concatenation, array replacement and custom cloning helpers', () => {
    const left = { items: [{ a: 1 }] }
    const right = { items: [{ b: 2 }] }
    const combined = merge(left, right)
    expect(combined.items).toEqual([{ a: 1 }, { b: 2 }])
    expect(combined.items[0]).not.toBe(left.items[0])
    expect(merge(left, right, { arrayMerge: (_, source) => source }).items).toBe(right.items)
    expect(
      merge([1], [{ nested: true }], {
        arrayMerge: (target, source, options) => [
          ...target,
          ...source.map((value) => options!.cloneUnlessOtherwiseSpecified(value, options)),
        ],
      }),
    ).toEqual([1, { nested: true }])
  })

  it('preserves clone:false, symbols, special objects and custom merge selection', () => {
    const symbol = Symbol('metadata')
    const date = new Date('2026-01-01T00:00:00Z')
    const pattern = /research/i
    const source = { nested: { valid: true }, date, pattern, [symbol]: { count: 1 } }
    expect(merge({}, source, { clone: false }).nested).toBe(source.nested)
    const result = merge({}, source)
    expect(result.date).toBe(date)
    expect(result.pattern).toBe(pattern)
    expect(result[symbol]).toEqual({ count: 1 })
    expect(result[symbol]).not.toBe(source[symbol])
    expect(
      merge(
        { field: { a: 1 } },
        { field: { b: 2 } },
        {
          customMerge: (key) => (key === 'field' ? () => ({ chosen: true }) : undefined),
        },
      ),
    ).toEqual({ field: { chosen: true } })
    const reactLike = { $$typeof: Symbol.for('react.element'), props: { label: 'safe' } }
    expect(merge({}, { element: reactLike }).element).toBe(reactLike)
  })

  it('preserves custom mergeability and all(), including its invalid-input rejection', () => {
    const element = { $$typeof: Symbol.for('react.transitional.element'), props: {} }
    const result = merge(
      {},
      { element },
      {
        isMergeableObject: (value) =>
          Boolean(value && typeof value === 'object' && !('$$typeof' in value)),
      },
    )
    expect(result.element).toBe(element)
    expect(merge.all([{ a: 1 }, { nested: { x: 2 } }, { nested: { y: 3 } }])).toEqual({
      a: 1,
      nested: { x: 2, y: 3 },
    })
    expect(() => merge.all(null as unknown as object[])).toThrow(
      'first argument should be an array',
    )
  })

  it('retains the original upstream types and license bytes', () => {
    for (const [file, expected] of [
      ['index.d.ts', '146ba4b99c5feb82663e17a671bf9f53bb39c704cd76345d6c5a801c26372f44'],
      ['LICENSE', '6cfc4687cb2f2d86f4a77e6b526290d3878e5e512f3fec2f4cb36a9cb36f798b'],
    ]) {
      const bytes = readFileSync(new URL(`../../vendor/deepmerge-safe/${file}`, import.meta.url))
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(expected)
    }
  })
})
