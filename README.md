# Split Bill — a Meerkat demo target

[![test strength](https://meerkat-app.vercel.app/api/badge/tsi.svg?project=split-bill)](https://meerkat-app.vercel.app/share/split-bill)

A deliberately small app used to show what Meerkat is for: a green suite is not the
same as a correct one.

Split a bill across people, rounded half-up to the nearest cent. The contract lives in
[`SPEC.md`](./SPEC.md) and every scenario carries an ID (`SV-SPL-01` … `SV-SPL-06`) so
coverage is measurable instead of implied.

## The point of this repo

The first release ships with a **one-line rounding defect**: shares are rounded down
instead of half-up, so splitting `$10.00` across 3 people produces `$3.33 × 3 = $9.99`
and a visible `$0.01` gap. Both the unit test and the browser suite catch it, the fix is
a small PR, and the second wave goes green.

That red → green pair is the demo. The app is not the product; the evidence is.

## Reproduce the defect by hand

Open the deployed page, enter `10.00` in **Bill amount**, `3` in **People**, and leave
**Tip** at `0`.

- **Each person pays** reads `$3.33` — plausible on its own.
- **Shares total** reads `$9.99`, not `$10.00`.
- **Remaining** reads `$0.01`.
- The note under the results says `Unbalanced — $0.01 is missing from the shares.`

Every number looks reasonable; the split is still wrong. That is the failure mode the
suite exists to catch.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # the invariant test fails on this release, by design
npm run build
```

## How it is scored

- [TestSprite](https://www.testsprite.com) runs the suite on every pull request through
  its GitHub App and posts a `TestSprite V3` check.
- [Meerkat](https://meerkat-app.vercel.app/share/split-bill) ingests that wave, computes
  the Test Strength Index, and keeps the evidence — coverage, shallow passes, orphans,
  verdict trust — traceable to the JUnit row behind it.
- `main` requires `TestSprite V3`, so a red suite blocks the merge instead of decorating it.

## Layout

```
src/money.ts       split maths + rounding (the defect lives here)
src/money.test.ts  invariants the contract promises
src/App.tsx        the page TestSprite drives
SPEC.md            the scenario contract, by ID
scripts/           Meerkat ingest client used by CI
```
