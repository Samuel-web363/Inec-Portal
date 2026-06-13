import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import OTPModal from '../../components/OTPModal'
import api from '../../api/axios'
import { sha256 } from '../../api/auth'
import PasswordStrength from '../../components/PasswordStrength'
import './RegisterPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', nin: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const { fullName, email, nin, password, confirmPassword } = form
    if (!fullName || !email || !nin || !password) { setError('All fields are required.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (nin.length < 11) { setError('NIN must be at least 11 digits.'); return }
    setLoading(true)
    try {
      const passwordHash = await sha256(password)
      await api.post('/api/auth/register', { fullName, email, nin, password: passwordHash })
      setShowOTP(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (code) => {
    setOtpError('')
    setOtpLoading(true)
    try {
      await api.post('/api/auth/verify-otp', { email: form.email, otp: code })
      navigate('/login')
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Invalid or expired code.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await api.post('/api/auth/resend-otp', { email: form.email, type: 'register' })
    } catch {}
  }

  return (
    <div className="rp-page">
      <Navbar />
      <main className="rp-main">
        <div className="rp-card">
          <div className="rp-card-header">
            <div className="rp-logo" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="52" height="52" fill="none">
                <circle cx="24" cy="24" r="22" fill="var(--green-dark)" stroke="var(--gold)" strokeWidth="1.5"/>
                <text x="24" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="serif">INEC</text>
                <path d="M12 28 Q24 36 36 28" stroke="var(--gold)" strokeWidth="1.5" fill="none"/>
                <circle cx="24" cy="23" r="3" fill="var(--gold)"/>
              </svg>
            </div>
            <h1 className="rp-title">Create Account</h1>
            <p className="rp-sub">Register to access the IReV Portal</p>
          </div>

          {error && (
            <div className="rp-error" role="alert">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          <form className="rp-form" onSubmit={handleSubmit} noValidate>
            {[
              { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g. Chioma Okafor', autocomplete: 'name',
                icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email',
                icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
              { name: 'nin', label: 'National Identification Number (NIN)', type: 'text', placeholder: '12345678901', autocomplete: 'off',
                icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a strong password', autocomplete: 'new-password',
                icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password', autocomplete: 'new-password',
                icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
            ].map(field => (
              <div className="rp-field" key={field.name}>
                <label htmlFor={`rp-${field.name}`} className="rp-label">{field.label}</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon" aria-hidden="true">{field.icon}</span>
                  <input
                    id={`rp-${field.name}`}
                    type={field.type}
                    name={field.name}
                    className="rp-input"
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    autoComplete={field.autocomplete}
                    required
                  />
                </div>
                {field.name === 'password' && <PasswordStrength password={form.password} />}
              </div>
            ))}

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? <span className="rp-spinner" aria-hidden="true" /> : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="rp-login-link">
            Already registered? <Link to="/login" className="rp-link">Sign in here</Link>
          </div>
        </div>
      </main>

      {showOTP && (
        <OTPModal
          title="Verify Your Email"
          onSubmit={handleOTPSubmit}
          onResend={handleResend}
          loading={otpLoading}
          error={otpError}
        />
      )}
    </div>
  )
}
