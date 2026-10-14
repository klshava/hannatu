// ─── Edit event details here ────────────────────────────────────────────────
export const EVENT = {
  childName: 'Hannatu Rufaro Ahinche',
  nickname: 'Hanna',
  dateISO: '2026-12-12T13:00:00+11:00',
  dateLabel: 'Saturday, 12 December 2026',
  time: 'Starts at 1:00 pm',
  venue: 'Craigieburn Sporting Club',
  area: 'Mickleham, VIC',
  mapsQuery: 'Craigieburn Sporting Club, Mickleham VIC',
  rsvpDeadlineISO: '2026-11-21T23:59:59+11:00',
  rsvpDeadlineLabel: 'Saturday, 21 November 2026',
  contacts: [
    { name: 'John', phone: '0413 095 303' },
    { name: 'Mercy', phone: '0403 056 316' },
  ],
}

export const BANK = {
  accountName: 'Hannatu Rufaro Ahinche',
  bsb: '033122',
  account: '460559',
}

// ─── RSVP storage: Google Form ─────────────────────────────────────────────
// 1. Create a Google Form with 7 short-answer questions in this order:
//    Name, Attending, Adults, Kids, Dietary, Message, Contact
// 2. Get a pre-filled link → copy each entry.123456 id into `fields` below.
// 3. FORM_ACTION = the form's URL with /viewform replaced by /formResponse
export const GOOGLE_FORM = {
  action: 'https://docs.google.com/forms/d/e/1FAIpQLSduowK6lmn5wooFo-pDeG3e1nFAzUgLBE09yhbsVtJ2OV3LWw/formResponse',
  fields: {
    name: 'entry.353591717',
    attending: 'entry.1108630447',
    adults: 'entry.1824739831',
    kids: 'entry.1496416061',
    dietary: 'entry.1280663345',
    message: 'entry.2055676418',
    contact: 'entry.835664827',
  },
}

// ─── Notes board: reads name + message columns from the responses Sheet ────
// Sheet must be viewable by "anyone with the link". Column letters match the
// form's response sheet (A timestamp, B name, G message).
export const NOTES = {
  sheetId: '1hJeNpzG-2UzIAO9_FCniFMLR8r8Aq6lWx1N_6Slio3w',
  nameCol: 'B',
  messageCol: 'G',
}
