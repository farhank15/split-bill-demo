# DEMO — Split Bill × TestSprite × Meerkat

Runbook for the red → green recording. Everything below is a step **you** run once;
nothing here needs code changes.

## What is already done

| Thing | State |
| --- | --- |
| Repo | https://github.com/farhank15/split-bill-demo (public) |
| App | https://split-bill-demo-two.vercel.app (production, Deployment Protection **off**) |
| Contract | `SPEC.md` with six IDs `SV-SPL-01 … SV-SPL-06` |
| Unit suite | **red on purpose** — `npm test` fails on the seeded rounding defect |
| CI | `.github/workflows/verify.yml` — `unit` + `meerkat-ingest` |
| Ingest client | `scripts/ingest-latest.mjs`, default slug `split-bill` |

The defect lives in `src/money.ts`: `toCents` floors instead of rounding half-up, so
`$10.00 / 3` becomes `$3.33 × 3 = $9.99` with `$0.01` left over.

## 1. TestSprite (account you already have)

1. Create a project pointing at `https://split-bill-demo-two.vercel.app`.
2. Generate a suite of **5–6 tests**, one per SPEC ID. If the generator does not put the
   ID in the name, create them explicitly:
   ```bash
   testsprite test create --project <PROJECT_ID> --name "SV-SPL-01 split 10 across 3 people"
   ```
   Names must contain `SV-SPL-0X` — coverage matching is by ID, case-sensitive.
3. Keep the tests in the **default** environment. The CLI can only read `default`; tests
   that live in a PR environment will report near-zero coverage during ingest.
4. Install the TestSprite GitHub App on `farhank15/split-bill-demo` and select the repo.
   The App resolves the preview deployment itself — no workflow file is required for it.
5. Optional but recommended: enable "Block PR until tests pass" in the portal.

## 2. Meerkat

1. Sign in at https://meerkat-app.vercel.app.
2. Create project **`split-bill`**, tick **Public** (so the share page and badge work).
3. API keys → create one with `ingest` scope. The key must belong to the workspace that
   owns `split-bill`, otherwise ingest answers `403 project_not_in_workspace`.
   - You can reuse the existing workspace-wide key `mk_live_e01bd27c…` — it already
     belongs to that workspace.

## 3. GitHub settings on the demo repo

```bash
cd split-bill-demo
gh secret set TESTSPRITE_API_KEY --body "<testsprite api key>"
gh secret set MEERKAT_API_KEY     --body "mk_live_…"
gh variable set TESTSPRITE_PROJECT_ID --body "<testsprite project id>"
```

Require the App check on `main`:

```bash
gh api -X PUT repos/farhank15/split-bill-demo/branches/main/protection \
  -f 'required_status_checks[strict]=true' \
  -f 'required_status_checks[contexts][]=TestSprite V3' \
  -f 'enforce_admins=false' \
  -F 'restrictions=' 
```

## 4. The recording (the actual demo)

1. **Red.** Open PR #1 from a branch that leaves the defect in place (e.g. add a
   screenshot or tweak copy). Wait for `TestSprite V3` → red, `unit` → red,
   `meerkat-ingest` → green with a POST.
2. **Show Meerkat.** Dashboard → `split-bill` → the run: TSI, coverage, the failing
   `SV-SPL-01` row, the audit findings.
3. **Fix.** New branch, change `toCents` to half-up and distribute the remainder:
   ```ts
   const perPerson = roundCents(total / people)
   const shares = Array.from({ length: people }, (_, i) =>
     i === people - 1 ? roundCents(total - perPerson * (people - 1)) : perPerson,
   )
   ```
4. **Green.** PR #2 → `TestSprite V3` green, `unit` green, Meerkat records the new run and
   the TSI delta versus the previous one.
5. **Close.** Badge in the README:
   `![test strength](https://meerkat-app.vercel.app/api/badge/tsi.svg?project=split-bill)`

## Expected numbers

| Wave | Unit | Browser | TSI |
| --- | --- | --- | --- |
| PR #1 (bug) | 2 failing | 1 failing (`SV-SPL-01`) | lower |
| PR #2 (fix) | 6 passing | 6 passing | higher |

## Gotchas that already bit us

- Deployment Protection must stay off, or TestSprite cannot open the preview.
- A test name without `SV-SPL-0X` counts as an orphan: coverage drops and TSI follows.
- `meerkat-ingest` waits 240 s for the App wave before posting. If the wave is slow, the
  run still posts — it just may not include the last statuses.
