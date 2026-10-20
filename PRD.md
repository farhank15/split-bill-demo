# PRD — Split Bill

A single-page calculator that splits a bill across people. No accounts, no backend, no
persistence: every value is computed in the browser from three inputs.

## Problem

Splitting a bill by hand produces cents that do not add up. The app must split an amount
into equal shares, rounded to the nearest cent, without losing or inventing money.

## Users

One person at a table who needs to tell the others what to pay. They enter the bill, the
number of people, and an optional tip, and read one number per person.

## Inputs

| Field | Type | Rules |
| --- | --- | --- |
| Bill amount | number, step 0.01 | `>= 0`; two decimals |
| People | number, step 1 | integer `>= 1`; a value below 1 or a fraction is refused |
| Tip % | number, step 1 | `>= 0`; applied to the bill before splitting |

## Outputs

| Field | Meaning |
| --- | --- |
| Each person pays | the per-person share |
| Bill + tip | bill × (1 + tip/100), rounded to cents |
| Shares total | the sum of all shares, rounded to cents |
| Remaining | bill + tip − shares total; must be `0.00` for a balanced split |
| Share list | one row per person, each with the same two-decimal format |

## Functional requirements

| ID | Requirement | Pass criteria |
| --- | --- | --- |
| `SV-SPL-01` | Split `$10.00` across 3 people | Each share has two decimals **and** shares total equals `$10.00`; remaining is `$0.00` |
| `SV-SPL-02` | Apply a tip before splitting | Bill `$20.00`, 2 people, 10% → total `$22.00`, each pays `$11.00` |
| `SV-SPL-03` | One person pays the whole bill | Bill `$19.99`, 1 person → that person pays `$19.99`, remaining `$0.00` |
| `SV-SPL-04` | Refuse an impossible people count | People `0` shows a refusal message and renders **no** result |
| `SV-SPL-05` | State the split is balanced | When shares total equals the bill, the page says the shares add up to the bill exactly |
| `SV-SPL-06` | Always two decimals | Any amount renders as `$3.00`, never `$3` or `$3.0` |

## Rounding rule

Money is rounded **half-up** to the nearest cent (half away from zero). A remainder left by
an even split is absorbed by the last share, so the shares always add up to the bill.

## Out of scope

Authentication, saving history, multiple currencies, tax, per-person weights, editing a
share by hand.

## How a reviewer checks it

Enter `10.00`, `3`, `0`. The page must show `$3.33` or `$3.34` per person **and** a shares
total of exactly `$10.00` with remaining `$0.00`. A page that shows `$9.99` has failed, even
though every number looks plausible.
