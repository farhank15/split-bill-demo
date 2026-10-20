import { useMemo, useState } from 'react'

import { money, splitBill } from './money'
import './styles.css'

const PEOPLE_PRESETS = [1, 2, 3, 4, 5]

export default function App() {
  const [bill, setBill] = useState('10.00')
  const [people, setPeople] = useState(3)
  const [tip, setTip] = useState('0')

  const result = useMemo(() => {
    try {
      return { ok: true as const, split: splitBill(Number(bill), people, Number(tip)) }
    } catch (error) {
      return { ok: false as const, message: (error as Error).message }
    }
  }, [bill, people, tip])

  const exact = result.ok && result.split.remaining === 0

  return (
    <main className="page">
      <header className="head">
        <p className="eyebrow">Demo target for Meerkat</p>
        <h1>Split Bill</h1>
        <p className="lede">
          Split a bill across people, rounded to the nearest cent. Every share is supposed to be
          rounded half-up, and the shares must add up to the bill exactly.
        </p>
      </header>

      <section className="card" aria-label="Bill inputs">
        <div className="field">
          <label htmlFor="bill">Bill amount</label>
          <input
            id="bill"
            type="number"
            min="0"
            step="0.01"
            value={bill}
            onChange={(event) => setBill(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="people">People</label>
          <div className="presets">
            {PEOPLE_PRESETS.map((value) => (
              <button
                key={value}
                type="button"
                className={value === people ? 'chip chip-active' : 'chip'}
                onClick={() => setPeople(value)}
                aria-pressed={value === people}
              >
                {value}
              </button>
            ))}
          </div>
          <input
            id="people"
            type="number"
            min="1"
            step="1"
            value={people}
            onChange={(event) => setPeople(Number(event.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="tip">Tip %</label>
          <input
            id="tip"
            type="number"
            min="0"
            step="1"
            value={tip}
            onChange={(event) => setTip(event.target.value)}
          />
        </div>
      </section>

      {result.ok ? (
        <section className="card result" aria-label="Split result">
          <div className="hero-figure">
            <span className="label">Each person pays</span>
            <strong id="per-person" data-testid="per-person">
              {money(result.split.perPerson)}
            </strong>
          </div>

          <dl className="rows">
            <div>
              <dt>Bill + tip</dt>
              <dd id="total" data-testid="total">
                {money(result.split.total)}
              </dd>
            </div>
            <div>
              <dt>Shares total</dt>
              <dd id="shares-total" data-testid="shares-total">
                {money(result.split.sharesTotal)}
              </dd>
            </div>
            <div>
              <dt>Remaining</dt>
              <dd
                id="remaining"
                data-testid="remaining"
                className={exact ? 'ok' : 'bad'}
                aria-live="polite"
              >
                {money(result.split.remaining)}
              </dd>
            </div>
          </dl>

          <p className={exact ? 'note ok' : 'note bad'} id="balance-note">
            {exact
              ? 'Balanced — the shares add up to the bill exactly.'
              : `Unbalanced — ${money(Math.abs(result.split.remaining))} is missing from the shares.`}
          </p>

          <ul className="shares" aria-label="Share per person">
            {result.split.shares.map((share, index) => (
              <li key={index}>
                <span>Person {index + 1}</span>
                <span className="mono">{money(share)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="card error" role="alert">
          {result.message}
        </section>
      )}

      <footer className="foot">
        <span>
          Rounded half-up to the nearest cent · contract in{' '}
          <a href="https://github.com/farhank15/split-bill-demo/blob/main/SPEC.md">SPEC.md</a>
        </span>
        <a href="https://meerkat-app.vercel.app/share/split-bill">Scored by Meerkat</a>
      </footer>
    </main>
  )
}
