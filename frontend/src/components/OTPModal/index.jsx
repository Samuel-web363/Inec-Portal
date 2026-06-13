import React, { useState, useEffect, useRef } from 'react'
import './OTPModal.css'

export default function OTPModal({ title, onSubmit, onResend, loading, error }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    paste.split('').forEach((c, i) => { if (i < 6) next[i] = c })
    setOtp(next)
    inputRefs.current[Math.min(paste.length, 5)]?.focus()
  }

  const handleSubmit = () => {
    const code = otp.join('')
    if (code.length === 6) onSubmit(code)
  }

  const handleResend = () => {
    setCountdown(60)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    onResend()
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="otp-overlay" role="dialog" aria-modal="true" aria-label="OTP Verification">
      <div className="otp-modal">
        <div className="otp-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 9l10 6 10-6"/>
          </svg>
        </div>
        <h2 className="otp-title">{title || 'Email Verification'}</h2>
        <p className="otp-desc">
          A 6-digit code has been sent to your email address. Enter it below to continue.
        </p>

        {error && (
          <div className="otp-error" role="alert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`otp-input ${digit ? 'otp-input--filled' : ''}`}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="otp-submit"
          onClick={handleSubmit}
          disabled={otp.join('').length < 6 || loading}
        >
          {loading ? (
            <span className="otp-btn-spinner" aria-hidden="true" />
          ) : 'Verify Code'}
        </button>

        <div className="otp-resend">
          {canResend ? (
            <button className="otp-resend-btn" onClick={handleResend}>
              Resend Code
            </button>
          ) : (
            <span className="otp-countdown">Resend in {countdown}s</span>
          )}
        </div>
      </div>
    </div>
  )
}
