import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isAuthenticated, getCurrentUser, logout } from '../../api/auth'
import GlobalSearch from '../GlobalSearch'
import Notifications from '../Notifications'
import DarkModeToggle from '../DarkModeToggle'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const auth = isAuthenticated()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'nav-link nav-link--active' : 'nav-link'

  return (
    <header className="nav-header">
      {/* Top bar */}
      <div className="nav-topbar">
        <div className="nav-topbar-inner">
          <span className="nav-topbar-text">Independent National Electoral Commission — Federal Republic of Nigeria</span>
          <div className="nav-topbar-links">
            <a href="https://inecnigeria.org" target="_blank" rel="noreferrer" className="nav-topbar-link">Official INEC Site</a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="nav-main" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          {/* Brand */}
          <Link to="/" className="nav-brand" aria-label="INEC Result Portal Home">
            <div className="nav-logo" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
                <circle cx="24" cy="24" r="22" fill="#006400" stroke="#c9a84c" strokeWidth="2"/>
                <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="serif">INEC</text>
                <path d="M12 26 Q24 34 36 26" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
                <path d="M14 30 Q24 37 34 30" stroke="#c9a84c" strokeWidth="1" fill="none"/>
                <circle cx="24" cy="22" r="3" fill="#c9a84c"/>
              </svg>
            </div>
            <div className="nav-brand-text">
              <span className="nav-brand-title">IReV Portal</span>
              <span className="nav-brand-sub">Election Result Viewing System</span>
            </div>
          </Link>

          {/* Global search — desktop only, logged in */}
          {auth && (
            <div className="nav-search-slot">
              <GlobalSearch />
            </div>
          )}

          {/* Desktop Links */}
          <ul className="nav-links" role="list">
            <li><Link to="/" className={isActive('/')}>Home</Link></li>
            <li><Link to="/results" className={isActive('/results')}>Results</Link></li>
            <li><Link to="/about" className={isActive('/about')}>About</Link></li>
            {auth && (
              <>
                <li><Link to="/elections" className={isActive('/elections')}>2027 Voting</Link></li>
                <li><Link to="/candidates" className={isActive('/candidates')}>Candidates</Link></li>
                <li><Link to="/parties" className={isActive('/parties')}>Parties</Link></li>
                {user?.role === 'admin'
                  ? <li><Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link></li>
                  : <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
                }
                {user?.role === 'admin' && (
                  <li><Link to="/analytics" className={isActive('/analytics')}>Analytics</Link></li>
                )}
              </>
            )}
          </ul>

          {/* Auth buttons */}
          <div className="nav-auth">
            <DarkModeToggle />
            {auth && <Notifications />}
            {auth ? (
              <div className="nav-user-area">
                <Link to="/profile" className="nav-profile-btn" aria-label="Profile">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="nav-username">{user?.fullName?.split(' ')[0] || 'User'}</span>
                </Link>
                <button className="nav-logout-btn" onClick={handleLogout} aria-label="Logout">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-guest-btns">
                <Link to="/login" className="nav-btn-outline">Login</Link>
                <Link to="/register" className="nav-btn-solid">Register</Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? 'nav-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile search bar — full width below navbar, logged in only */}
        {auth && (
          <div className="nav-mobile-search">
            <GlobalSearch />
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mobile-menu" role="menu">
            <Link to="/" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/results" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Results</Link>
            <Link to="/about" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>About</Link>

            {auth && user?.role === 'admin' && (
              <>
                <div className="nav-mobile-section">Admin</div>
                <Link to="/admin/dashboard" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/results/upload" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Upload Results</Link>
                <Link to="/admin/users" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>User Management</Link>
                <Link to="/admin/logs" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Activity Logs</Link>
                <Link to="/admin/elections" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Manage Elections</Link>
                <Link to="/analytics" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Analytics</Link>
                <div className="nav-mobile-section">General</div>
                <Link to="/elections" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Mock Voting 2027</Link>
                <Link to="/candidates" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Candidates</Link>
                <Link to="/parties" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Parties</Link>
                <Link to="/voter-card" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Voter Card</Link>
                <Link to="/profile" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button className="nav-mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false) }}>Logout</button>
              </>
            )}

            {auth && user?.role !== 'admin' && (
              <>
                <Link to="/dashboard" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/elections" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Mock Voting 2027</Link>
                <Link to="/candidates" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Candidates</Link>
                <Link to="/parties" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Parties</Link>
                <Link to="/voter-card" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Voter Card</Link>
                <Link to="/profile" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button className="nav-mobile-logout" onClick={() => { handleLogout(); setMenuOpen(false) }}>Logout</button>
              </>
            )}

            {!auth && (
              <>
                <Link to="/login" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="nav-mobile-link nav-mobile-link--solid" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
