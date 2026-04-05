import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || null;

  const validate = () => {
    const e = {};
    if (!form.email)                               e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email = 'Enter a valid email address';
    if (!form.password)                            e.password = 'Password is required';
    else if (form.password.length < 6)             e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const emailKey = form.email.trim().toLowerCase();
      const { data } = await loginUser({ identifier: emailKey, password: form.password });

      console.log('Full login response:', data);

      const token = data?.data?.accessToken || data?.data?.token || data?.accessToken || data?.token || '';
      const rawUser = data?.data?.user || data?.user || data?.data || {};

      const savedRoles = JSON.parse(localStorage.getItem('roleMap') || '{}');
      const savedRole  = savedRoles[emailKey];

      const role = (
        rawUser?.role || data?.data?.role || data?.role || savedRole || 'user'
      ).toString().toLowerCase().trim();

      const user = {
        ...rawUser,
        email: rawUser?.email || emailKey,
        name:  rawUser?.name  || rawUser?.firstName || emailKey.split('@')[0],
        role,
      };

      console.log('Resolved user with role:', user);
      login(token, user);
      toast.success(`Welcome back, ${user.name || user.email}!`);

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      const rawMsg = err.response?.data?.message;
      const msg = Array.isArray(rawMsg) ? rawMsg.join('. ') : rawMsg ||
        err.response?.data?.error || err.response?.data?.msg ||
        (err.response?.status === 401 ? 'Invalid email or password.' :
         err.response?.status === 404 ? 'Account not found. Please register.' :
         err.response?.status === 429 ? 'Too many attempts. Please wait and try again.' :
         'Login failed. Please check your connection and try again.');
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page">

      {/* ── Left / Top panel ── */}
      <div className="lp-left">
        <div className="lp-left-dots" />
        <div className="lp-left-accent" />

        <div className="lp-left-content">
          {/* Logo */}
          <div className="lp-left-logo">
            <img
              src="https://www.inecnigeria.org/wp-content/uploads/2019/07/inec-logo.png"
              alt="INEC Logo"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="lp-left-logo-title">INEC Result Portal</div>
              <div className="lp-left-logo-sub">Federal Republic of Nigeria</div>
            </div>
          </div>

          {/* Headline */}
          <div className="lp-left-headline">
            <div className="lp-left-eyebrow">Secure Access</div>
            <h2 className="lp-left-h2">
              Welcome Back to<br />
              <span className="lp-left-h2-accent">Nigeria's Electoral Hub</span>
            </h2>
            <p className="lp-left-desc">
              Sign in to access real-time election results, personalised
              dashboards, and advanced analytics across Nigeria.
            </p>
          </div>

          {/* Features — dot style, no emoji */}
          <div className="lp-left-features">
            {[
              'Real-time result updates across all states',
              'Secure JWT-authenticated access',
              'Mobile-optimised dashboard',
              'Nationwide coverage — 36 states + FCT',
            ].map(text => (
              <div key={text} className="lp-left-feature">
                <div className="lp-left-feature-dot" />
                <div className="lp-left-feature-text">{text}</div>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="lp-left-stats">
            <div className="lp-left-stat">
              <div className="lp-left-stat-value">36+</div>
              <div className="lp-left-stat-label">States</div>
            </div>
            <div className="lp-left-stat-div" />
            <div className="lp-left-stat">
              <div className="lp-left-stat-value">774</div>
              <div className="lp-left-stat-label">LGAs</div>
            </div>
            <div className="lp-left-stat-div" />
            <div className="lp-left-stat">
              <div className="lp-left-stat-value">176K+</div>
              <div className="lp-left-stat-label">Polling Units</div>
            </div>
          </div>
        </div>

        <div className="lp-left-footer">
          &copy; {new Date().getFullYear()} Independent National Electoral Commission
        </div>
      </div>

      {/* ── Right / Bottom panel ── */}
      <div className="lp-right">
        <div className="lp-form-card">

          {/* Header */}
          <div className="lp-form-header">
            <div className="lp-form-header-icon">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="22" r="21" stroke="#1a7a3c" strokeWidth="1.5" fill="rgba(26,122,60,.08)"/>
                <path d="M22 14C18.7 14 16 16.7 16 20v1h-1a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-1v-1c0-3.3-2.7-6-6-6z" stroke="#1a7a3c" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                <circle cx="22" cy="25" r="1.5" fill="#1a7a3c"/>
                <path d="M22 27v2" stroke="#1a7a3c" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="lp-form-title">Sign In</h3>
            <p className="lp-form-subtitle">Enter your credentials to access your account</p>
          </div>

          {/* General error */}
          {errors.general && (
            <div className="lp-alert-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
                <circle cx="8" cy="8" r="7" stroke="#991b1b" strokeWidth="1.5"/>
                <path d="M8 5v3.5M8 11v.5" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="lp-field">
              <label className="lp-label" htmlFor="login-email">
                Email Address <span className="lp-req">*</span>
              </label>
              <div className="lp-input-wrap">
                <svg className="lp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  id="login-email"
                  className={`lp-input${errors.email ? ' lp-input--error' : ''}`}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="lp-field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="lp-field">
              <div className="lp-label-row">
                <label className="lp-label" htmlFor="login-password">
                  Password <span className="lp-req">*</span>
                </label>
              </div>
              <div className="lp-input-wrap lp-input-wrap--has-toggle">
                <svg className="lp-input-svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  id="login-password"
                  className={`lp-input${errors.password ? ' lp-input--error' : ''}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button" className="lp-toggle"
                  onClick={() => setShowPwd(p => !p)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                  }
                </button>
              </div>
              {errors.password && <span className="lp-field-error">{errors.password}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`lp-submit${loading ? ' lp-submit--loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="lp-divider">
            <span>New to the platform?</span>
          </div>

          <Link to="/register" className="lp-register-btn">
            Create a Free Account
          </Link>

          <p className="lp-footer-note">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{display:'inline',marginRight:4}}>
              <path d="M6 1L1.5 3v4C1.5 9.5 3.5 11.3 6 12c2.5-.7 4.5-2.5 4.5-5V3L6 1z" stroke="#9ca3af" strokeWidth="1.2" fill="none"/>
            </svg>
            Secured by INEC &middot; All data is encrypted in transit
          </p>
        </div>
      </div>
    </div>
  );
}