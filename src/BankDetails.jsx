import { useState } from 'react'
import { BANK } from './config.js'

function CopyButton({ value, label }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      window.prompt('Copy this:', value)
    }
  }
  return (
    <button type="button" className="copy" onClick={copy} aria-label={`Copy ${label}`}>
      {done ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

export default function BankDetails() {
  return (
    <dl className="bank">
      <div>
        <dt>Account name</dt>
        <dd>{BANK.accountName}<CopyButton value={BANK.accountName} label="account name" /></dd>
      </div>
      <div>
        <dt>BSB</dt>
        <dd>{BANK.bsb}<CopyButton value={BANK.bsb} label="BSB" /></dd>
      </div>
      <div>
        <dt>Account number</dt>
        <dd>{BANK.account}<CopyButton value={BANK.account} label="account number" /></dd>
      </div>
    </dl>
  )
}
