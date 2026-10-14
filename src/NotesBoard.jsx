import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTES } from './config.js'

// gviz "JSONP" — works from any origin without CORS headers.
function loadNotes() {
  return new Promise((resolve, reject) => {
    const cb = `__hannaNotes${Date.now()}`
    const script = document.createElement('script')
    const cleanup = () => { delete window[cb]; script.remove() }
    window[cb] = (res) => {
      cleanup()
      if (res.status !== 'ok') return reject(new Error('sheet error'))
      const rows = (res.table.rows || [])
        .map((r) => ({ name: r.c?.[0]?.v ?? '', message: r.c?.[1]?.v ?? '' }))
        .filter((r) => String(r.message).trim())
      resolve(rows) // oldest first, as in the sheet
    }
    script.onerror = () => { cleanup(); reject(new Error('network')) }
    const q = encodeURIComponent(`select ${NOTES.nameCol}, ${NOTES.messageCol} where ${NOTES.messageCol} is not null`)
    script.src = `https://docs.google.com/spreadsheets/d/${NOTES.sheetId}/gviz/tq?tqx=out:json;responseHandler:${cb}&tq=${q}`
    document.body.appendChild(script)
  })
}

function Page({ page, number }) {
  if (!page) return <div className="pg pg-blank" />
  if (page.type === 'title') {
    return (
      <div className="pg pg-title">
        <span className="pg-emoji" aria-hidden="true">🎀</span>
        <h2 className="script">Hanna's<br />Book of Wishes</h2>
        <p>Turn the page →</p>
      </div>
    )
  }
  if (page.type === 'end') {
    return (
      <div className="pg pg-title">
        <span className="pg-emoji" aria-hidden="true">💗</span>
        <h2 className="script">The end…<br />for now</h2>
      </div>
    )
  }
  return (
    <div className="pg">
      <div className="pg-text">
        <p>{page.message}</p>
      </div>
      <cite>— {page.name || 'A friend'}</cite>
      <span className="pg-num">{number}</span>
    </div>
  )
}

function Book({ notes }) {
  const pages = [{ type: 'title' }, ...notes.map((n) => ({ type: 'note', ...n }))]
  const sheets = Math.max(1, Math.ceil((pages.length - 1) / 2))
  const [flipped, setFlipped] = useState(0)
  const touch = useRef(null)

  const next = useCallback(() => setFlipped((f) => Math.min(sheets, f + 1)), [sheets])
  const prev = useCallback(() => setFlipped((f) => Math.max(0, f - 1)), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const pageAt = (i) => pages[i] ?? (i === pages.length ? { type: 'end' } : null)

  return (
    <div className="book-wrap">
      <div
        className="book"
        onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touch.current == null) return
          const dx = e.changedTouches[0].clientX - touch.current
          touch.current = null
          if (dx < -40) next()
          else if (dx > 40) prev()
        }}
      >
        <div className="book-left"><Page page={pages[0]} /></div>
        <div className="book-right"><Page page={pageAt(2 * sheets + 1)} number={2 * sheets + 1} /></div>

        {Array.from({ length: sheets }, (_, k) => {
          const isFlipped = k < flipped
          return (
            <div
              key={k}
              className={`sheet${isFlipped ? ' flipped' : ''}`}
              style={{ zIndex: isFlipped ? k + 1 : sheets - k + 1 }}
            >
              <div className="face front" onClick={next}>
                <Page page={pageAt(2 * k + 1)} number={2 * k + 1} />
              </div>
              <div className="face back" onClick={prev}>
                <Page page={pageAt(2 * k + 2)} number={2 * k + 2} />
              </div>
            </div>
          )
        })}
        <div className="spine" aria-hidden="true" />
      </div>

      <nav className="book-nav" aria-label="Turn pages">
        <button onClick={prev} disabled={flipped === 0} aria-label="Previous page">‹</button>
        <span>{Math.min(flipped + 1, sheets + 1)} / {sheets + 1}</span>
        <button onClick={next} disabled={flipped === sheets} aria-label="Next page">›</button>
      </nav>
    </div>
  )
}

export default function NotesBoard() {
  const [notes, setNotes] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    loadNotes().then((n) => alive && setNotes(n)).catch(() => alive && setError(true))
    return () => { alive = false }
  }, [])

  return (
    <div className="board-page">
      <header className="board-head">
        <a href="#" className="back">← Back to the invite</a>
        <h1 className="script">Notes for Hanna</h1>
        <p>Little wishes from the people who love her 💗</p>
      </header>

      {error && <p className="note err">Couldn't load the notes just now. Please try again in a moment.</p>}
      {!notes && !error && <p className="board-empty">Opening the book…</p>}
      {notes && notes.length === 0 && <p className="board-empty">No notes yet. Be the first to leave one!</p>}
      {notes && notes.length > 0 && <Book notes={notes} />}
    </div>
  )
}
