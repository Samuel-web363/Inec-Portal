import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { isAuthenticated } from '../../api/auth'
import './HomePage.css'
import Footer from '../../components/Footer'

export default function HomePage() {
  const [summary, setSummary] = useState(null)
  const auth = isAuthenticated()

  useEffect(() => {
    api.get('/api/results/summary').then(r => setSummary(r.data)).catch(() => {})
  }, [])

  return (
    <div className="hp-page">
      <Navbar />

      {/* Hero */}
      <section className="hp-hero" aria-labelledby="hp-hero-title">
        <div className="hp-hero-bg" aria-hidden="true">
          <div className="hp-hero-circle hp-hero-circle--1" />
          <div className="hp-hero-circle hp-hero-circle--2" />
        </div>
        <div className="hp-hero-inner">
          <div className="hp-hero-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Live Result Portal
          </div>
          <h1 id="hp-hero-title" className="hp-hero-title">
            Nigeria's Electoral<br />
            <span className="hp-hero-accent">Result Viewing System</span>
          </h1>
          <p className="hp-hero-sub">
            Transparently access, search, and analyse official election results across all states, LGAs, and wards in real time.
          </p>
          <div className="hp-hero-cta">
            <Link to="/results" className="hp-cta-primary">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              View Results
            </Link>
            {auth ? (
              <Link to="/elections" className="hp-cta-secondary">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Vote Now — 2027
              </Link>
            ) : (
              <Link to="/register" className="hp-cta-secondary">Create Account</Link>
            )}
          </div>
        </div>
        <div className="hp-hero-image" aria-hidden="true">
          <div className="hp-hero-emblem">
            <svg viewBox="0 0 120 120" width="220" height="220" fill="none">
              <circle cx="60" cy="60" r="56" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
              <circle cx="60" cy="60" r="44" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <circle cx="60" cy="60" r="30" fill="rgba(255,255,255,0.08)" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5"/>
              <text x="60" y="54" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="bold" fontFamily="serif">INEC</text>
              <text x="60" y="68" textAnchor="middle" fill="rgba(201,168,76,0.8)" fontSize="7" fontFamily="serif">NIGERIA</text>
              <path d="M30 78 Q60 92 90 78" stroke="rgba(201,168,76,0.4)" strokeWidth="1" fill="none"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="hp-stats" aria-label="Summary statistics">
        <div className="hp-stats-inner">
          {[
            { label: 'Results Uploaded', value: summary?.totalResults?.toLocaleString() ?? '—',
              icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
            { label: 'Total Votes Counted', value: summary?.totalVotes?.toLocaleString() ?? '—',
              icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
            { label: 'Political Parties', value: summary?.totalParties?.toLocaleString() ?? '—',
              icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
            { label: 'Candidates', value: summary?.totalCandidates?.toLocaleString() ?? '—',
              icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> }
          ].map(stat => (
            <div className="hp-stat-item" key={stat.label}>
              <div className="hp-stat-icon" aria-hidden="true">{stat.icon}</div>
              <div>
                <div className="hp-stat-value">{stat.value}</div>
                <div className="hp-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="hp-features" aria-labelledby="hp-features-title">
        <div className="hp-features-inner">
          <div className="hp-section-head">
            <h2 id="hp-features-title" className="hp-section-title">Portal Features</h2>
            <p className="hp-section-sub">Everything you need to access and understand Nigerian election results</p>
          </div>
          <div className="hp-features-grid">
            {[
              { title: 'Real-Time Results', desc: 'Access election results as they are uploaded and verified by administrators.', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              { title: 'Advanced Filtering', desc: 'Filter results by state, LGA, ward, political party, or candidate name.', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> },
              { title: 'Data Visualisation', desc: 'Understand results through interactive charts — bar, doughnut, and line graphs.', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
              { title: 'Candidate Profiles', desc: 'Browse comprehensive profiles of all registered candidates and their parties.', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              { title: 'Secure Access', desc: 'Two-factor authentication via email OTP ensures only verified users access the system.', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { title: 'Works Offline', desc: 'Progressive Web App support means you can view cached results without internet access.', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6s4-4 11-4 11 4 11 4"/><path d="M5 10s3-3 7-3 7 3 7 3"/><path d="M9 14s1-1 3-1 3 1 3 1"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> }
            ].map(feat => (
              <div className="hp-feat-card" key={feat.title}>
                <div className="hp-feat-icon" aria-hidden="true">{feat.icon}</div>
                <h3 className="hp-feat-title">{feat.title}</h3>
                <p className="hp-feat-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About INEC strip */}
      <section className="hp-about-strip" aria-labelledby="hp-about-title">
        <div className="hp-about-inner">
          <div className="hp-about-text">
            <h2 id="hp-about-title">About This Portal</h2>
            <p>
              The INEC IReV Portal is an independent student demonstration project simulating the electoral result viewing capabilities of Nigeria's Independent National Electoral Commission. Results displayed are for educational and visualisation purposes only.
            </p>
            <Link to="/about" className="hp-about-link">
              Learn More
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
          <div className="hp-about-badge" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="160" height="160" fill="none">
              <circle cx="50" cy="50" r="46" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 4"/>
              <circle cx="50" cy="50" r="34" fill="var(--green-pale)" stroke="var(--green-dark)" strokeWidth="2"/>
              <text x="50" y="47" textAnchor="middle" fill="var(--green-dark)" fontSize="9" fontWeight="bold" fontFamily="serif">INEC</text>
              <text x="50" y="59" textAnchor="middle" fill="var(--green-dark)" fontSize="6" fontFamily="serif">IReV PORTAL</text>
            </svg>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
