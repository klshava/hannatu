import { useState } from 'react'
import { GOOGLE_FORM, EVENT } from './config.js'
import BankDetails from './BankDetails.jsx'

const empty = {
  name: '',
  attending: 'yes',
  adults: 1,
  kids: 0,
  dietary: '',
  message: '',
  contact: '',
}

function Stepper({ label, value, onChange, min = 0, max = 15 }) {
  return (
    <div className="stepper">
      <span>{label}</span>
      <div>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Fewer ${label}`}>−</button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`More ${label}`}>+</button>
      </div>
    </div>
  )
}

async function submitToGoogleForm(data) {
  const { action, fields } = GOOGLE_FORM
  if (!action) {
    // Not wired up yet — keep the entry locally so the flow can be tested.
    console.warn('[RSVP] GOOGLE_FORM.action not set; saved to localStorage only.', data)
    try {
      const prev = JSON.parse(localStorage.getItem('rsvp-dev') || '[]')
      localStorage.setItem('rsvp-dev', JSON.stringify([...prev, { ...data, at: new Date().toISOString() }]))
    } catch {}
    return
  }
  const body = new URLSearchParams()
  for (const [key, entry] of Object.entries(fields)) {
    if (entry) body.append(entry, String(data[key] ?? ''))
  }
  // Google Forms doesn't send CORS headers; no-cors still delivers the submission.
  await fetch(action, { method: 'POST', mode: 'no-cors', body })
}

export default function RsvpForm() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const attending = form.attending === 'yes'

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitToGoogleForm({
        ...form,
        name: form.name.trim(),
        adults: attending ? form.adults : 0,
        kids: attending ? form.kids : 0,
        attending: attending ? 'Yes' : 'No',
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    const first = form.name.trim().split(' ')[0]
    return (
      <div className="thanks" role="status">
        <div className="big">{attending ? '🎉' : '💗'}</div>
        <h3 className="script">{attending ? "Can't wait to see you!" : "We'll miss you!"}</h3>
        <p>
          {attending
            ? `Thanks ${first}, you're on the list for ${EVENT.dateLabel}.`
            : `Thanks for letting us know, ${first}. We'll be thinking of you. If you'd still like to celebrate Hanna with a gift, here are her details:`}
        </p>
        {!attending && <BankDetails />}
        <a className="btn primary" href="#notes">💌 Read notes for Hanna</a>
        <button className="btn ghost" onClick={() => { setForm(empty); setStatus('idle') }}>
          RSVP for someone else
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rsvp">
      <label>
        <span>Your name</span>
        <input required autoComplete="name" value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="First & last name" />
      </label>

      <fieldset>
        <legend>Can you make it?</legend>
        <div className="seg">
          <label className={attending ? 'on' : ''}>
            <input type="radio" name="attending" checked={attending} onChange={() => set('attending')('yes')} />
            Yes, count me in!
          </label>
          <label className={!attending ? 'on' : ''}>
            <input type="radio" name="attending" checked={!attending} onChange={() => set('attending')('no')} />
            Sadly can't
          </label>
        </div>
      </fieldset>

      {attending && (
        <>
          <div className="steppers">
            <Stepper label="Adults" value={form.adults} min={1} onChange={set('adults')} />
            <Stepper label="Kids" value={form.kids} onChange={set('kids')} />
          </div>
          <label>
            <span>Dietary needs or allergies <em>(optional)</em></span>
            <input value={form.dietary} onChange={(e) => set('dietary')(e.target.value)} placeholder="e.g. vegetarian, nut allergy" />
          </label>
        </>
      )}

      <label>
        <span>Phone or email <em>(optional)</em></span>
        <input autoComplete="email" value={form.contact} onChange={(e) => set('contact')(e.target.value)} placeholder="So we can reach you" />
      </label>

      <label>
        <span>A message for Hanna <em>(optional)</em></span>
        <textarea rows="3" value={form.message} onChange={(e) => set('message')(e.target.value)} placeholder="Birthday wishes…" />
      </label>

      {status === 'error' && (
        <p className="note err" role="alert">Something went wrong sending that. Please try again.</p>
      )}

      <button className="btn primary full" disabled={status === 'sending' || !form.name.trim()}>
        {status === 'sending' ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}
