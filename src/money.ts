// Money maths for the split-bill demo.
//
// The contract (see SPEC.md) says every share is rounded half-up to the nearest
// cent and the shares must add up to the bill exactly. The current release
// rounds DOWN, which loses a cent whenever the division does not terminate —
// the demo's intentional defect.

export const roundCents = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100

// matcha:debt rounding is floor here on purpose (the demo's seeded defect); replace with half-up + remainder distribution in the fix PR
const toCents = (value: number): number => Math.floor(value * 100) / 100

export interface Split {
  /** Bill plus tip, rounded to cents. */
  total: number
  /** What each person owes. */
  perPerson: number
  /** One entry per person, in order. */
  shares: number[]
  /** Sum of the shares, rounded to cents. */
  sharesTotal: number
  /** total − sharesTotal. Zero means the split is exact. */
  remaining: number
}

export function splitBill(bill: number, people: number, tipPercent = 0): Split {
  if (!Number.isFinite(bill) || bill < 0) throw new Error('bill must be a positive number')
  if (!Number.isInteger(people) || people < 1) throw new Error('people must be a whole number of at least 1')
  if (!Number.isFinite(tipPercent) || tipPercent < 0) throw new Error('tip must be zero or more')

  const total = roundCents(bill * (1 + tipPercent / 100))
  const perPerson = toCents(total / people)
  const shares = Array.from({ length: people }, () => perPerson)
  const sharesTotal = roundCents(perPerson * people)

  return { total, perPerson, shares, sharesTotal, remaining: roundCents(total - sharesTotal) }
}

export const money = (value: number): string => `$${value.toFixed(2)}`
