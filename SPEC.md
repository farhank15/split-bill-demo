# SPEC — Split Bill

The contract this app is scored against. Every scenario carries an ID; a test whose
name contains that ID claims coverage of it. Meerkat reads this file to compute
coverage, so the IDs are part of the product, not decoration.

## Rules

- Money is rounded **half-up** to the nearest cent (half away from zero).
- The shares must add up to the bill **exactly**. When an even split does not
  terminate, the remainder is absorbed by the last share.
- A share is never negative, and a people count below 1 is refused with a message.
- Every amount is rendered with exactly two decimals.

## Scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| `SV-SPL-01` | Split `$10.00` across 3 people | Shares total `$10.00`, remaining `$0.00` |
| `SV-SPL-02` | Bill `$20.00`, 2 people, 10% tip | Total `$22.00`, each pays `$11.00` |
| `SV-SPL-03` | Bill `$19.99`, 1 person | That person pays `$19.99`, remaining `$0.00` |
| `SV-SPL-04` | People set to `0` | A refusal message is shown and no result is rendered |
| `SV-SPL-05` | Balanced split | The page states that the shares add up to the bill exactly |
| `SV-SPL-06` | Any amount | Rendered with two decimals (`$3.00`, not `$3`) |
