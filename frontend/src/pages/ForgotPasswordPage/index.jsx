import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { sha256 } from '../../api/auth'
import './ForgotPasswordPage.css'

const STEPS = { EMAIL: 'email', OTP: 'otp', RESET: 'reset', DONE: 'done' }

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.EMAIL)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = React.useRef([])

  // Countdown timer for resend
  React.useEffect(() => {
    if (step !== STEPS.OTP) return
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, step])

  // Step 1 — send OTP to email
  const handleSendOTP = async e => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setStep(STEPS.OTP)
      setCountdown(60)
      setCanResend(false)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  // OTP input handlers
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus()
  }

  const handleOtpPaste = e => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    paste.split('').forEach((c, i) => { if (i < 6) next[i] = c })
    setOtp(next)
    inputRefs.current[Math.min(paste.length, 5)]?.focus()
  }

  // Step 2 — verify OTP
  const handleVerifyOTP = async () => {
    setError('')
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return }
    setLoading(true)
    try {
      await api.post('/api/auth/verify-reset-otp', { email, otp: code })
      setStep(STEPS.RESET)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await api.post('/api/auth/forgot-password', { email })
      setOtp(['', '', '', '', '', ''])
      setCountdown(60)
      setCanResend(false)
      setError('')
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch {}
  }

  // Step 3 — set new password
  const handleResetPassword = async e => {
    e.preventDefault()
    setError('')
    if (!password) { setError('Please enter a new password.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const passwordHash = await sha256(password)
      await api.post('/api/auth/reset-password', { email, otp: otp.join(''), password: passwordHash })
      setStep(STEPS.DONE)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fp-page">
      <Navbar />
      <main className="fp-main">
        <div className="fp-card">

          {/* Step indicator */}
          <div className="fp-steps" aria-label="Progress steps">
            {['Email', 'Verify', 'Reset'].map((label, i) => {
              const stepIndex = [STEPS.EMAIL, STEPS.OTP, STEPS.RESET, STEPS.DONE].indexOf(step)
              const done = stepIndex > i
              const active = stepIndex === i
              return (
                <React.Fragment key={label}>
                  <div className={`fp-step-item ${active ? 'fp-step-item--active' : ''} ${done ? 'fp-step-item--done' : ''}`}>
                    <div className="fp-step-circle">
                      {done
                        ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : i + 1
                      }
                    </div>
                    <span className="fp-step-label">{label}</span>
                  </div>
                  {i < 2 && <div className={`fp-step-line ${done ? 'fp-step-line--done' : ''}`} aria-hidden="true" />}
                </React.Fragment>
              )
            })}
          </div>

          {/* ── STEP 1: Email ── */}
          {step === STEPS.EMAIL && (
            <>
              <div className="fp-header">
                <div className="fp-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h1 className="fp-title">Forgot Password</h1>
                <p className="fp-sub">Enter your registered email and we'll send you a reset code</p>
              </div>

              {error && <div className="fp-error" role="alert">{error}</div>}

              <form className="fp-form" onSubmit={handleSendOTP} noValidate>
                <div className="fp-field">
                  <label className="fp-label" htmlFor="fp-email">Email Address</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <input
                      id="fp-email"
                      type="email"
                      className="fp-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? <span className="fp-spinner" aria-hidden="true" /> : 'Send Reset Code'}
                </button>
              </form>

              <div className="fp-back">
                <Link to="/login" className="fp-back-link">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === STEPS.OTP && (
            <>
              <div className="fp-header">
                <div className="fp-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h1 className="fp-title">Enter Reset Code</h1>
                <p className="fp-sub">A 6-digit code was sent to <strong>{email}</strong></p>
              </div>

              {error && <div className="fp-error" role="alert">{error}</div>}

              <div className="fp-otp-inputs" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`fp-otp-input ${digit ? 'fp-otp-input--filled' : ''}`}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              <button className="fp-btn" onClick={handleVerifyOTP} disabled={loading || otp.join('').length < 6}>
                {loading ? <span className="fp-spinner" aria-hidden="true" /> : 'Verify Code'}
              </button>

              <div className="fp-resend">
                {canResend
                  ? <button className="fp-resend-btn" onClick={handleResend}>Resend Code</button>
                  : <span className="fp-countdown">Resend in {countdown}s</span>
                }
              </div>

              <div className="fp-back">
                <button className="fp-back-link" onClick={() => setStep(STEPS.EMAIL)}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  Change Email
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === STEPS.RESET && (
            <>
              <div className="fp-header">
                <div className="fp-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h1 className="fp-title">Set New Password</h1>
                <p className="fp-sub">Choose a strong new password for your account</p>
              </div>

              {error && <div className="fp-error" role="alert">{error}</div>}

              <form className="fp-form" onSubmit={handleResetPassword} noValidate>
                <div className="fp-field">
                  <label className="fp-label" htmlFor="fp-password">New Password</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input id="fp-password" type="password" className="fp-input" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                </div>
                <div className="fp-field">
                  <label className="fp-label" htmlFor="fp-confirm">Confirm Password</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input id="fp-confirm" type="password" className="fp-input" placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? <span className="fp-spinner" aria-hidden="true" /> : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Done ── */}
          {step === STEPS.DONE && (
            <div className="fp-done">
              <div className="fp-done-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="fp-done-title">Password Reset!</h2>
              <p className="fp-done-sub">Your password has been updated successfully. You can now log in with your new password.</p>
              <button className="fp-btn" onClick={() => navigate('/login')}>Go to Login</button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
