import { Link } from 'react-router-dom';
import { MOCK_PRESIDENTIAL_RESULTS, MOCK_DASHBOARD_STATS } from '../../services/mockData';
import ResultCard from '../../components/results/ResultCard';
import { formatNumber } from '../../utils/helpers';

const totalVotes = MOCK_PRESIDENTIAL_RESULTS.reduce((s, c) => s + c.votes, 0);

const features = [
  { icon: '⚡', title: 'Real-Time Results',   desc: 'Results update live as data arrives from polling units across Nigeria.' },
  { icon: '🔒', title: 'Secure & Verified',   desc: 'Every result is authenticated and traceable to its polling unit.' },
  { icon: '📱', title: 'Mobile-First',         desc: 'Optimised for the 70%+ of Nigerians who access the web via mobile.' },
  { icon: '🌍', title: 'Nationwide Coverage',  desc: 'All 36 states, 774 LGAs, and 176,846 polling units covered.' },
  { icon: '📊', title: 'Visual Analytics',     desc: 'Bar charts, pie charts, and trend graphs for deeper insight.' },
  { icon: '🔍', title: 'Smart Search',         desc: 'Filter by state, LGA, party, or candidate instantly.' },
];

const quickLinks = [
  { label: 'Presidential',   href: '/results', icon: '🏛️' },
  { label: 'Governorship',   href: '/results', icon: '🏢' },
  { label: 'Senate',         href: '/results', icon: '⚖️' },
  { label: 'State Assembly', href: '/results', icon: '📋' },
];

const endorsers = ['Federal Govt. of Nigeria', 'African Union', 'EU Election Mission', 'ECOWAS', 'The Carter Center'];

export default function HomePage() {
  return (
    <div>

      {/* ── Live notice banner ── */}
      <div className="hp-notice-bar">
        <span className="hp-notice-live">🔴 LIVE</span>
        <span>2023 General Election Results — Officially Collated by INEC</span>
        <span className="hp-notice-sep">|</span>
        <span className="hp-notice-time">Last updated: March 1, 2023 — 11:47 PM WAT</span>
      </div>

      {/* ── Hero ── */}
      <section className="hp-hero">
        <div className="hp-hero-accent-bar" />
        <div className="hp-hero-dots" />

        <div className="hp-hero-inner">
          {/* Left col */}
          <div className="hp-hero-left">
            {/* Org identity */}
            <div className="hp-hero-identity">
              <img
                src="https://www.inecnigeria.org/wp-content/uploads/2019/07/inec-logo.png"
                alt="INEC"
                className="hp-hero-logo"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="hp-hero-identity-divider" />
              <div>
                <div className="hp-hero-org-sub">Federal Republic of Nigeria</div>
                <div className="hp-hero-org-name">Independent National Electoral Commission</div>
              </div>
            </div>

            {/* Live pill */}
            <div className="hp-live-pill">
              <span className="hp-live-dot" />
              Live · 2023 General Elections
            </div>

            <h1 className="hp-hero-h1">
              Nigeria's <span className="hp-hero-accent">Official</span><br />
              Election Result Portal
            </h1>

            <p className="hp-hero-desc">
              Transparent, real-time access to verified election results across
              all 36 states and the FCT — powered by INEC's authenticated data infrastructure.
            </p>

            <div className="hp-hero-actions">
              <Link to="/results"  className="hp-btn-white">View Results →</Link>
              <Link to="/register" className="hp-btn-ghost">Create Account</Link>
            </div>

            {/* Stats */}
            <div className="hp-hero-stats">
              {[
                { label: 'Registered Voters', value: formatNumber(MOCK_DASHBOARD_STATS.totalRegistered) },
                { label: 'Votes Cast',         value: formatNumber(MOCK_DASHBOARD_STATS.totalVotesCast)  },
                { label: 'Results Uploaded',   value: `${MOCK_DASHBOARD_STATS.uploadPercentage}%`        },
              ].map(s => (
                <div key={s.label} className="hp-hero-stat">
                  <div className="hp-hero-stat-value">{s.value}</div>
                  <div className="hp-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right col */}
          <div className="hp-hero-right">
            <div className="hp-hero-photo-wrap">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Voters_in_Nigeria.jpg/640px-Voters_in_Nigeria.jpg"
                alt="Nigerian voters"
                className="hp-hero-photo"
                onError={e => {
                  e.target.parentNode.innerHTML = `<div class="hp-hero-photo-fallback"><div style="font-size:4rem">🗳️</div><div>Nigerian Elections 2023</div></div>`;
                }}
              />
              <div className="hp-hero-photo-badge">📍 Polling Unit — Abuja, FCT</div>
            </div>

            <div className="hp-quick-links">
              {quickLinks.map(q => (
                <Link key={q.label} to={q.href} className="hp-quick-link">
                  <span className="hp-quick-link-icon">{q.icon}</span>
                  <span>{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ticker ── */}
      <div className="hp-ticker">
        {[
          { value: MOCK_PRESIDENTIAL_RESULTS.length, label: 'Presidential Candidates', icon: '🏛️' },
          { value: '36 + FCT',                       label: 'States Covered',           icon: '🗺️' },
          { value: '774',                             label: 'Local Govt. Areas',        icon: '📍' },
          { value: formatNumber(176846),              label: 'Polling Units',             icon: '🗳️' },
        ].map((s, i) => (
          <div key={s.label} className={`hp-ticker-item${i < 3 ? ' hp-ticker-item--border' : ''}`}>
            <div className="hp-ticker-icon">{s.icon}</div>
            <div className="hp-ticker-value">{s.value}</div>
            <div className="hp-ticker-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Presidential Results ── */}
      <section className="hp-section hp-section--grey">
        <div className="container">
          <div className="hp-results-header">
            <div>
              <div className="hp-eyebrow">Presidential Election · 2023</div>
              <h2 className="hp-section-h2">Results Overview</h2>
              <p className="hp-section-sub">Real-time collated results from polling units nationwide</p>
            </div>
            <Link to="/results" className="btn btn-primary">Full Results →</Link>
          </div>

          {MOCK_PRESIDENTIAL_RESULTS[0] && (
            <div className="hp-winner-banner">
              <div className="hp-winner-left">
                <div className="hp-winner-avatar">
                  {MOCK_PRESIDENTIAL_RESULTS[0].candidate?.charAt(0)}
                </div>
                <div>
                  <div className="hp-winner-tag">🏆 Current Leader</div>
                  <div className="hp-winner-name">{MOCK_PRESIDENTIAL_RESULTS[0].candidate}</div>
                  <div className="hp-winner-party">{MOCK_PRESIDENTIAL_RESULTS[0].party}</div>
                </div>
              </div>
              <div className="hp-winner-right">
                <div className="hp-winner-votes">{formatNumber(MOCK_PRESIDENTIAL_RESULTS[0].votes)}</div>
                <div className="hp-winner-votes-label">votes recorded</div>
              </div>
            </div>
          )}

          <div className="results-grid">
            {MOCK_PRESIDENTIAL_RESULTS.map((c, i) => (
              <ResultCard key={c.id} candidate={c} totalVotes={totalVotes} rank={i} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/results" className="btn btn-primary btn-lg">View Full Results →</Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="hp-section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Why This Portal</span>
            <h2>Built for Every Nigerian</h2>
            <p>Designed to make election results accessible, transparent, and trustworthy for all stakeholders</p>
          </div>
          <div className="hp-features-grid">
            {features.map(feat => (
              <div key={feat.title} className="hp-feature-card">
                <div className="hp-feature-icon">{feat.icon}</div>
                <div>
                  <h4 className="hp-feature-title">{feat.title}</h4>
                  <p className="hp-feature-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Endorsers ── */}
      <div className="hp-endorsers">
        <div className="container">
          <p className="hp-endorsers-label">Recognised & Endorsed By</p>
          <div className="hp-endorsers-list">
            {endorsers.map(org => (
              <div key={org} className="hp-endorser-badge">{org}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="hp-cta">
        <div className="hp-cta-dots" />
        <div className="container hp-cta-inner">
          <div className="hp-live-pill hp-live-pill--light">Free to Register</div>
          <h2 className="hp-cta-h2">Track Every Vote.<br />Trust Every Result.</h2>
          <p className="hp-cta-desc">
            Create a free account to receive personalised updates, access
            state-level analytics, and be part of Nigeria's democratic transparency movement.
          </p>
          <div className="hp-cta-actions">
            <Link to="/register" className="hp-btn-white">Create Free Account →</Link>
            <Link to="/results"  className="hp-btn-ghost">Browse Results</Link>
          </div>
          <p className="hp-cta-footnote">🔒 Secured by INEC · No spam · Unsubscribe anytime</p>
        </div>
      </section>

    </div>
  );
}