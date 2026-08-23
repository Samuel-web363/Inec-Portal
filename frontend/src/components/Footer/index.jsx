import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated, getCurrentUser } from '../../api/auth'
import './Footer.css'

export default function Footer() {
  const auth = isAuthenticated()
  const user = getCurrentUser()

  return (
    <footer className="ft-footer" role="contentinfo">

      {/* Green top band */}
      <div className="ft-top-band">
        <div className="ft-top-inner">
          <div className="ft-brand">
            <div className="ft-logo-wrap" aria-hidden="true">
              <svg viewBox="0 0 56 56" width="52" height="52" fill="none">
                <circle cx="28" cy="28" r="26" fill="#006400" stroke="#c9a84c" strokeWidth="2"/>
                <circle cx="28" cy="28" r="18" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1"/>
                <text x="28" y="24" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Georgia,serif">INEC</text>
                <text x="28" y="33" textAnchor="middle" fill="rgba(201,168,76,0.9)" fontSize="5" fontFamily="Georgia,serif">NIGERIA</text>
                <path d="M14 37 Q28 44 42 37" stroke="#c9a84c" strokeWidth="1.2" fill="none"/>
              </svg>
            </div>
            <div className="ft-brand-text">
              <div className="ft-brand-name">Independent National Electoral Commission</div>
              <div className="ft-brand-sub">IReV — Electoral Result Viewing Portal</div>
            </div>
          </div>
          <div className="ft-social">
            <span className="ft-social-label">Follow INEC:</span>
            <a href="https://twitter.com/inecnigeria" target="_blank" rel="noreferrer" className="ft-social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://facebook.com/inecnigeria" target="_blank" rel="noreferrer" className="ft-social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com/inecnigeria" target="_blank" rel="noreferrer" className="ft-social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Links section */}
      <div className="ft-links-band">
        <div className="ft-links-inner">
          <div className="ft-link-group">
            <h4 className="ft-link-title">Quick Links</h4>
            <ul className="ft-link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/results">Election Results</Link></li>
              <li><Link to="/elections">2027 Mock Voting</Link></li>
              <li><Link to="/about">About Portal</Link></li>
            </ul>
          </div>
          <div className="ft-link-group">
            <h4 className="ft-link-title">Portal</h4>
            <ul className="ft-link-list">
              <li><Link to="/candidates">Candidates</Link></li>
              <li><Link to="/parties">Political Parties</Link></li>
              {auth ? (
                <>
                  <li><Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>Dashboard</Link></li>
                  <li><Link to="/profile">My Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              )}
              <li><Link to="/docs">System Documentation</Link></li>
              <li><Link to="/about-developer">About Developer</Link></li>
            </ul>
          </div>
          <div className="ft-link-group">
            <h4 className="ft-link-title">About INEC</h4>
            <ul className="ft-link-list">
              <li><a href="https://inecnigeria.org" target="_blank" rel="noreferrer">Official INEC Website</a></li>
              <li><a href="https://inecnigeria.org/voters-hub" target="_blank" rel="noreferrer">Voter Registration</a></li>
              <li><a href="https://inecnigeria.org/irev" target="_blank" rel="noreferrer">Official IReV</a></li>
              <li><a href="https://inecnigeria.org/contact-us" target="_blank" rel="noreferrer">Contact INEC</a></li>
            </ul>
          </div>
          <div className="ft-link-group">
            <h4 className="ft-link-title">Contact</h4>
            <ul className="ft-link-list ft-contact-list">
              <li>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Plot 436, Zambezi Crescent, Maitama, Abuja
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                info@inecnigeria.org
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.02-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +234 (0) 800 CALL INEC
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom-bar">
        <div className="ft-bottom-inner">
          <div className="ft-bottom-left">
            <p className="ft-disclaimer">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              This is a student demonstration project. Results displayed are simulated and do not represent actual electoral outcomes. Not affiliated with INEC Nigeria.
            </p>
          </div>
          <div className="ft-bottom-right">
            <p className="ft-copy">&copy; {new Date().getFullYear()} IReV Portal · Computer Science Final Year Project</p>
          </div>
        </div>
      </div>

    </footer>
  )
}
