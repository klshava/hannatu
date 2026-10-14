import { useEffect, useState } from 'react'
import { EVENT } from './config.js'
import RsvpForm from './RsvpForm.jsx'
import BankDetails from './BankDetails.jsx'

const photo = (n) => `${import.meta.env.BASE_URL}photos/${n}.jpg`

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, new Date(targetISO).getTime() - now)
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    mins: Math.floor(diff / 60_000) % 60,
  }
}

export default function App() {
  const { days, hours, mins } = useCountdown(EVENT.dateISO)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.mapsQuery)}`
  const deadlinePassed = Date.now() > new Date(EVENT.rsvpDeadlineISO).getTime()

  return (
    <>
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>

      <header className="hero">
        <p className="script kicker">You're invited to</p>
        <div className="hero-photo">
          <img src={photo(4524)} alt="Hanna smiling next to a giant teddy bear" />
          <div className="bow" aria-hidden="true">🎀</div>
          <div className="badge">ONE</div>
        </div>
        <h1 className="script title">
          Hanna's 1<sup>st</sup> Birthday
        </h1>
        <p className="sub">{EVENT.dateLabel}</p>
        <a href="#rsvp" className="btn primary">RSVP now</a>
      </header>

      <main>
        <section className="card details" aria-labelledby="details-h">
          <h2 id="details-h" className="script">The details</h2>
          <ul>
            <li>
              <span className="ico">📅</span>
              <div>
                <strong>{EVENT.dateLabel}</strong>
                {EVENT.time && <small>{EVENT.time}</small>}
              </div>
            </li>
            <li>
              <span className="ico">📍</span>
              <div>
                <strong>{EVENT.venue}</strong>
                <small>{EVENT.area}</small>
                <a href={mapsUrl} target="_blank" rel="noreferrer">Open in Maps →</a>
              </div>
            </li>
            <li>
              <span className="ico">💌</span>
              <div>
                <strong>RSVP by {EVENT.rsvpDeadlineLabel}</strong>
              </div>
            </li>
          </ul>

          <div className="countdown" aria-label="Countdown to the party">
            <div><b>{days}</b><span>days</span></div>
            <div><b>{hours}</b><span>hours</span></div>
            <div><b>{mins}</b><span>mins</span></div>
          </div>
        </section>

        <section className="strip" aria-label="Photos of Hanna">
          <figure style={{ '--r': '-3deg' }}>
            <img src={photo(3234)} alt="Hanna as a newborn in yellow shorts" loading="lazy" />
            <figcaption>Hello world</figcaption>
          </figure>
          <figure style={{ '--r': '2.5deg' }}>
            <img src={photo(1472)} alt="Hanna in her little racing car walker" loading="lazy" />
            <figcaption>Ready to race</figcaption>
          </figure>
          <figure style={{ '--r': '-2deg' }}>
            <img src={photo(5468)} alt="Hanna giggling in a teddy robe" loading="lazy" />
            <figcaption>Giggles</figcaption>
          </figure>
          <figure style={{ '--r': '3deg' }}>
            <img src={photo(5477)} alt="Hanna standing up in her teddy robe" loading="lazy" />
            <figcaption>Standing tall</figcaption>
          </figure>
        </section>

        <section id="rsvp" className="card" aria-labelledby="rsvp-h">
          <h2 id="rsvp-h" className="script">Will you celebrate with us?</h2>
          {deadlinePassed && (
            <p className="note">
              RSVPs closed on {EVENT.rsvpDeadlineLabel}. Still keen to come? Get in touch with us directly.
            </p>
          )}
          <RsvpForm />
        </section>

        <section className="card gift" aria-labelledby="gift-h">
          <h2 id="gift-h" className="script">A little note on gifts</h2>
          <p>
            Hanna has all the toys she could ever want! If you'd like to give, we'd be so grateful for a
            contribution to her investment account instead.
          </p>
          <BankDetails />
        </section>
      </main>

      <footer>
        <p className="script">With love, the Ahinche family</p>
        <p className="small">
          Questions? Call{' '}
          {EVENT.contacts.map((c, i) => (
            <span key={c.name}>
              {i > 0 && ' or '}
              <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.name} ({c.phone})</a>
            </span>
          ))}
        </p>
      </footer>
    </>
  )
}
