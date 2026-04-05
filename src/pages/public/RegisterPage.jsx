import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../../services/api';
import { NIGERIA_STATES } from '../../services/mockData';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    state: '', phone: '',
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                              e.name = 'Full name is required';
    else if (form.name.trim().length < 3)               e.name = 'Name must be at least 3 characters';
    if (!form.email)                                    e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))         e.email = 'Enter a valid email address';
    if (!form.state)                                    e.state = 'Please select your state';
    if (!form.password)                                 e.password = 'Password is required';
    else if (form.password.length < 6)                  e.password = 'Password must be at least 6 characters';
    else if (!/[A-Z]/.test(form.password) && !/[0-9]/.test(form.password))
                                                        e.password = 'Include a number or uppercase letter';
    if (!form.confirmPassword)                          e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)    e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pwdStrength = () => {
    if (!form.password) return 0;
    if (form.password.length < 6) return 1;
    if (form.password.length < 10) return 2;
    return 3;
  };
  const strength = pwdStrength();
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];
  const strengthColor = ['', '#dc2626', '#f59e0b', '#16a34a'][strength];

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await registerUser({
        name:        form.name.trim(),
        email:       form.email.trim().toLowerCase(),
        password:    form.password,
        state:       form.state,
        phoneNumber: form.phone || undefined,
      });
      toast.success('Account created successfully! Please sign in. ✅');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      const rawMsg = err.response?.data?.message;
      const msg = Array.isArray(rawMsg) ? rawMsg[0] : rawMsg ||
        err.response?.data?.error || err.response?.data?.msg ||
        (err.response?.status === 409 ? 'An account with this email already exists.' :
         err.response?.status === 422 ? 'Please check your details and try again.' :
         'Registration failed. Please check your connection.');
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page">

      {/* ── Left / Top panel ── */}
      <div className="rp-left">
        <div className="rp-left-dots" />
        <div className="rp-left-accent" />

        <div className="rp-left-content">
          {/* Logo */}
          <div className="rp-left-logo">
            <img
              src="https://www.inecnigeria.org/wp-content/uploads/2019/07/inec-logo.png"
              alt="INEC Logo"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="rp-left-logo-title">INEC Result Portal</div>
              <div className="rp-left-logo-sub">Federal Republic of Nigeria</div>
            </div>
          </div>

          {/* Headline — hidden on mobile (too much space) */}
          <div className="rp-left-headline">
            <div className="rp-left-eyebrow">Join the Platform</div>
            <h2 className="rp-left-h2">
              Nigeria's Electoral<br />
              <span className="rp-left-h2-accent">Transparency Platform</span>
            </h2>
            <p className="rp-left-desc">
              Create your account to track results, receive updates, and
              contribute to democratic accountability across Nigeria.
            </p>
          </div>

          {/* Features — use SVG-based icons, no emoji */}
          <div className="rp-left-features">
            {[
              { label: 'Track results across all 36 states + FCT', color: '#86efac' },
              { label: 'Access charts and visual analytics',        color: '#86efac' },
              { label: 'Personalised result dashboard',            color: '#86efac' },
              { label: 'Completely free to register',              color: '#86efac' },
            ].map(feat => (
              <div key={feat.label} className="rp-left-feature">
                <div className="rp-left-feature-dot" />
                <div className="rp-left-feature-text">{feat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-left-footer">
          &copy; {new Date().getFullYear()} Independent National Electoral Commission
        </div>
      </div>

      {/* ── Right / Bottom panel ── */}
      <div className="rp-right">
        <div className="rp-form-card">

          {/* Header */}
          <div className="rp-form-header">
            {/* INEC-green shield icon built in CSS — no emoji */}
            <div className="rp-form-header-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3L5 9V20C5 28.3 11.6 36 20 38C28.4 36 35 28.3 35 20V9L20 3Z" fill="#1a7a3c" opacity=".15"/>
                <path d="M20 3L5 9V20C5 28.3 11.6 36 20 38C28.4 36 35 28.3 35 20V9L20 3Z" stroke="#1a7a3c" strokeWidth="1.5" fill="none"/>
                <path d="M14 20L18 24L26 16" stroke="#1a7a3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="rp-form-title">Create Account</h3>
            <p className="rp-form-subtitle">Fill in your details to get started</p>
          </div>

          {/* General error */}
          {errors.general && (
            <div className="rp-alert-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#991b1b" strokeWidth="1.5"/><path d="M8 5v4M8 11v.5" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Name + Email */}
            <div className="rp-field-row">
              <div className="rp-field">
                <label className="rp-label" htmlFor="reg-name">
                  Full Name <span className="rp-req">*</span>
                </label>
                <div className="rp-input-wrap">
                  <svg className="rp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <input
                    id="reg-name"
                    className={`rp-input${errors.name ? ' rp-input--error' : ''}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={f('name')}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <span className="rp-field-error">{errors.name}</span>}
              </div>

              <div className="rp-field">
                <label className="rp-label" htmlFor="reg-email">
                  Email Address <span className="rp-req">*</span>
                </label>
                <div className="rp-input-wrap">
                  <svg className="rp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <input
                    id="reg-email"
                    className={`rp-input${errors.email ? ' rp-input--error' : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={f('email')}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="rp-field-error">{errors.email}</span>}
              </div>
            </div>

            {/* State + Phone */}
            <div className="rp-field-row">
              <div className="rp-field">
                <label className="rp-label" htmlFor="reg-state">
                  State <span className="rp-req">*</span>
                </label>
                <div className="rp-input-wrap">
                  <svg className="rp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
                  <select
                    id="reg-state"
                    className={`rp-input rp-select${errors.state ? ' rp-input--error' : ''}`}
                    value={form.state}
                    onChange={f('state')}
                  >
                    <option value="">— Select state —</option>
                    {NIGERIA_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {errors.state && <span className="rp-field-error">{errors.state}</span>}
              </div>

              <div className="rp-field">
                <label className="rp-label" htmlFor="reg-phone">
                  Phone <span className="rp-optional">(optional)</span>
                </label>
                <div className="rp-input-wrap">
                  <svg className="rp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2.5A1.5 1.5 0 014.5 1h1A1.5 1.5 0 017 2.5v1A1.5 1.5 0 015.5 5h-.25A8.25 8.25 0 0011 10.75V10.5A1.5 1.5 0 0112.5 9h1A1.5 1.5 0 0115 10.5v1A1.5 1.5 0 0113.5 13C7.701 13 3 8.299 3 2.5z" stroke="currentColor" strokeWidth="1.3" fill="none"/></svg>
                  <input
                    id="reg-phone"
                    className="rp-input"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={f('phone')}
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="rp-field-row">
              <div className="rp-field">
                <label className="rp-label" htmlFor="reg-password">
                  Password <span className="rp-req">*</span>
                </label>
                <div className="rp-input-wrap rp-input-wrap--has-toggle">
                  <svg className="rp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <input
                    id="reg-password"
                    className={`rp-input${errors.password ? ' rp-input--error' : ''}`}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={f('password')}
                    autoComplete="new-password"
                  />
                  <button type="button" className="rp-toggle" onClick={() => setShowPwd(p => !p)} aria-label="Toggle password">
                    {showPwd
                      ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                    }
                  </button>
                </div>
                {errors.password && <span className="rp-field-error">{errors.password}</span>}
                {!errors.password && form.password && (
                  <div className="rp-strength">
                    <div className="rp-strength-bars">
                      {[1,2,3].map(i => (
                        <div key={i} className="rp-strength-bar"
                          style={{ background: i <= strength ? strengthColor : 'var(--inec-grey-200)' }} />
                      ))}
                    </div>
                    <span className="rp-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              <div className="rp-field">
                <label className="rp-label" htmlFor="reg-confirm">
                  Confirm Password <span className="rp-req">*</span>
                </label>
                <div className="rp-input-wrap rp-input-wrap--has-toggle">
                  <svg className="rp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <input
                    id="reg-confirm"
                    className={`rp-input${errors.confirmPassword ? ' rp-input--error' : ''}`}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={f('confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button type="button" className="rp-toggle" onClick={() => setShowConfirm(p => !p)} aria-label="Toggle confirm password">
                    {showConfirm
                      ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                    }
                  </button>
                </div>
                {errors.confirmPassword && <span className="rp-field-error">{errors.confirmPassword}</span>}
                {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                  <span className="rp-match">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7l3 3 6-6" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Passwords match
                  </span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`rp-submit${loading ? ' rp-submit--loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Create Account'}
            </button>
          </form>

          <p className="rp-signin-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}