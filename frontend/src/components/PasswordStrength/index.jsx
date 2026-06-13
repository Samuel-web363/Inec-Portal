import React from 'react'
import './PasswordStrength.css'

export default function PasswordStrength({ password }) {
  if (!password) return null

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  }

  const score = Object.values(checks).filter(Boolean).length

  const levels = [
    { label: 'Very Weak', color: '#e53935', width: '20%' },
    { label: 'Weak',      color: '#fb8c00', width: '40%' },
    { label: 'Fair',      color: '#fdd835', width: '60%' },
    { label: 'Strong',    color: '#43a047', width: '80%' },
    { label: 'Very Strong', color: '#006400', width: '100%' }
  ]

  const level = levels[score - 1] || levels[0]

  return (
    <div className="ps-wrap" aria-live="polite">
      <div className="ps-bar-bg">
        <div
          className="ps-bar-fill"
          style={{ width: level.width, background: level.color }}
        />
      </div>
      <div className="ps-info">
        <span className="ps-label" style={{ color: level.color }}>{level.label}</span>
        <div className="ps-checks">
          {[
            { key: 'length',  label: '8+ chars' },
            { key: 'upper',   label: 'Uppercase' },
            { key: 'lower',   label: 'Lowercase' },
            { key: 'number',  label: 'Number' },
            { key: 'special', label: 'Symbol' }
          ].map(c => (
            <span key={c.key} className={`ps-check ${checks[c.key] ? 'ps-check--ok' : ''}`}>
              {checks[c.key]
                ? <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
