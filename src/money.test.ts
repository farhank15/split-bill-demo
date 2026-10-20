import { describe, expect, it } from 'vitest'

import { money, roundCents, splitBill } from './money'

describe('splitBill', () => {
  it('makes the shares add up to the bill exactly (SV-SPL-01)', () => {
    const split = splitBill(10, 3)
    expect(split.sharesTotal).toBe(split.total)
    expect(split.remaining).toBe(0)
  })

  it('applies the tip before splitting (SV-SPL-02)', () => {
    const split = splitBill(20, 2, 10)
    expect(split.total).toBe(22)
    expect(split.perPerson).toBe(11)
  })

  it('gives the whole bill to a single person (SV-SPL-03)', () => {
    const split = splitBill(19.99, 1)
    expect(split.perPerson).toBe(19.99)
    expect(split.remaining).toBe(0)
  })

  it('refuses a people count below one (SV-SPL-04)', () => {
    expect(() => splitBill(10, 0)).toThrow(/people/)
    expect(() => splitBill(10, 2.5)).toThrow(/people/)
  })

  it('always renders two decimals (SV-SPL-06)', () => {
    expect(money(3)).toBe('$3.00')
    expect(money(3.333)).toBe('$3.33')
  })
})

describe('roundCents', () => {
  it('rounds halves away from zero', () => {
    expect(roundCents(1.005)).toBe(1.01)
    expect(roundCents(2.675)).toBe(2.68)
  })
})
