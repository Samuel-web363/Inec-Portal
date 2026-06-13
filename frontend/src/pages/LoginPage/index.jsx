import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import OTPModal from '../../components/OTPModal'
import api from '../../api/axios'
import { sha256, setCurrentUser } from '../../api/auth'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('All fields are required.'); return }
    setLoading(true)
    try {
      const passwordHash = await sha256(form.password)
      await api.post('/api/auth/login', { email: form.email, password: passwordHash })
      setShowOTP(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (code) => {
    setOtpError('')
    setOtpLoading(true)
    try {
      const res = await api.post('/api/auth/login-verify-otp', { email: form.email, otp: code })
      const user = setCurrentUser(res.data.token)
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired code.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await api.post('/api/auth/resend-otp', { email: form.email, type: 'login' })
    } catch {}
  }

  return (
    <div className="lp-page">
      <Navbar />
      <main className="lp-main">
        <div className="lp-card">
          <div className="lp-card-header">
            <div className="lp-logo" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="52" height="52" fill="none">
                <circle cx="24" cy="24" r="22" fill="var(--green-dark)" stroke="var(--gold)" strokeWidth="1.5"/>
                <text x="24" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="serif">INEC</text>
                <path d="M12 28 Q24 36 36 28" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
                <circle cx="24" cy="23" r="3" fill="var(--gold)"/>
              </svg>
            </div>
            <h1 className="lp-title">Welcome Back</h1>
            <p className="lp-sub">Sign in to the IReV Portal</p>
          </div>

          {error && (
            <div className="lp-error" role="alert">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          <form className="lp-form" onSubmit={handleSubmit} noValidate>
            <div className="lp-field">
              <label htmlFor="lp-email" className="lp-label">Email Address</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="lp-email"
                  type="email"
                  name="email"
                  className="lp-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="lp-field">
              <div className="lp-label-row">
                <label htmlFor="lp-password" className="lp-label">Password</label>
                <Link to="/forgot-password" className="lp-forgot">Forgot password?</Link>
              </div>
              <div className="lp-input-wrap">
                <span className="lp-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="lp-password"
                  type="password"
                  name="password"
                  className="lp-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="lp-submit" disabled={loading}>
              {loading ? <span className="lp-spinner" aria-hidden="true" /> : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="lp-divider"><span>New to the portal?</span></div>
          <div className="lp-register-link">
            <Link to="/register" className="lp-link">Create a new account</Link>
          </div>
        </div>
      </main>

      {showOTP && (
        <OTPModal
          title="Login Verification"
          onSubmit={handleOTPSubmit}
          onResend={handleResend}
          loading={otpLoading}
          error={otpError}
        />
      )}
    </div>
  )
}
