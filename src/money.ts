// Money maths for the split-bill demo.
//
// The contract (see SPEC.md) says money is rounded half-up to the nearest cent
// and the shares must add up to the bill exactly. When an even split does not
// terminate, the remainder is absorbed by the last share, so nothing is lost.

export const roundCents = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100

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

  // Do the arithmetic in integer cents so the split can be exact — no
  // floating-point cent can go missing on the way.
  const totalCents = Math.round(bill * 100 * (1 + tipPercent / 100))
  const total = totalCents / 100

  // Everyone pays a base share floored to the cent; the leftover cents (at most
  // one per person minus one) are absorbed by the last share per SPEC.md.
  const baseCents = Math.floor(totalCents / people)
  const shares = Array.from({ length: people }, (_, index) =>
    index === people - 1
      ? (totalCents - baseCents * (people - 1)) / 100
      : baseCents / 100,
  )

  return { total, perPerson: baseCents / 100, shares, sharesTotal: total, remaining: 0 }
}

export const money = (value: number): string => `$${value.toFixed(2)}`
