const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 2L3 5.5v6C3 16.1 6.6 20.4 11 21.5c4.4-1.1 8-5.4 8-10V5.5L11 2z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    <path d="M7.5 11l2.5 2.5 5-5"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 16L8 10l4 4 7-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M11 2s-4 3-4 9 4 9 4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M11 2s4 3 4 9-4 9-4 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M2 11h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M3 7h16M3 15h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2"/>
  </svg>
);
const IconLock = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="4" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M7 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="11" cy="15" r="1.5" fill="currentColor"/>
  </svg>
);

const features = [
  { Icon: IconShield, title: 'Verified Results',     desc: 'Every result is authenticated and traceable back to its polling unit and collation officer.',  color: 'green'  },
  { Icon: IconChart,  title: 'Live Analytics',        desc: 'Interactive charts and maps update in real-time as results arrive from polling units.',           color: 'blue'   },
  { Icon: IconGlobe,  title: 'Nationwide Coverage',   desc: 'All 36 states, 774 LGAs, and 176,846 polling units covered with granular drill-down views.',       color: 'amber'  },
  { Icon: IconLock,   title: 'Secure Infrastructure', desc: 'JWT-authenticated access, encrypted data transmission, and audit trails on every action.',         color: 'purple' },
];

const timeline = [
  { year: '1998', event: 'INEC established by Decree No. 17 of 1998, replacing the National Electoral Commission of Nigeria.' },
  { year: '2011', event: 'Introduction of biometric voter registration, capturing fingerprints and facial data for 73 million voters.' },
  { year: '2015', event: 'Smart Card Reader (SCR) deployed for voter accreditation — a first for West Africa.' },
  { year: '2020', event: 'IReV (Result Viewing Portal) launched, enabling real-time upload and public access to polling unit results.' },
  { year: '2023', event: 'BVAS deployed nationwide alongside this portal — the most transparent general election in Nigeria\'s history.' },
];

const stats = [
  { value: '87M+',    label: 'Registered Voters' },
  { value: '176K+',   label: 'Polling Units'      },
  { value: '36 +FCT', label: 'States Covered'     },
  { value: '774',     label: 'Local Govt. Areas'   },
];

export default function AboutPage() {
  return (
    <div className="ap-root">

      {/* ── Hero ── */}
      <div className="about-hero ap-hero">
        <div className="ap-hero-dots" />
        <div className="ap-hero-accent" />
        <div className="container ap-hero-inner">
          <div className="ap-hero-badge">About Us</div>
          <h1 className="ap-hero-h1">About INEC Result Portal</h1>
          <p className="ap-hero-sub">
            Bringing Nigeria's electoral transparency into the digital age
          </p>
          {/* Stats row */}
          <div className="ap-hero-stats">
            {stats.map(s => (
              <div key={s.label} className="ap-hero-stat">
                <div className="ap-hero-stat-value">{s.value}</div>
                <div className="ap-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mission section ── */}
      <section className="section ap-mission-section">
        <div className="container">
          <div className="about-grid ap-mission-grid">
            {/* Text */}
            <div className="ap-mission-text">
              <div className="ap-eyebrow">Our Mission</div>
              <h2 className="ap-section-h2">Transparent Elections for a Stronger Democracy</h2>
              <p className="ap-body">
                The INEC Result Portal is Nigeria's official platform for real-time election result
                dissemination. We provide voters, journalists, party agents, and observers with
                instant, verifiable access to results from every polling unit across the country.
              </p>
              <p className="ap-body">
                Built on modern web technology including React.js, Chart.js, and Progressive Web App
                architecture, the portal ensures reliability even in low-bandwidth environments across
                Nigeria's 36 states and FCT.
              </p>
              {/* Inline trust badges */}
              <div className="ap-trust-row">
                {['INEC Certified', 'ECOWAS Endorsed', 'Open Data'].map(b => (
                  <span key={b} className="ap-trust-badge">{b}</span>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="ap-mission-img-wrap">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/INEC_Chairman.jpg/400px-INEC_Chairman.jpg"
                alt="INEC Commission"
                className="ap-mission-img"
                onError={e => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 360'%3E%3Crect width='400' height='360' fill='%23e8f5ee'/%3E%3Ccircle cx='200' cy='150' r='80' fill='%231a7a3c' opacity='.15'/%3E%3Ctext x='200' y='155' text-anchor='middle' fill='%231a7a3c' font-size='28' font-weight='bold' font-family='Arial'%3EINEC%3C/text%3E%3Ctext x='200' y='185' text-anchor='middle' fill='%231a7a3c' font-size='12' font-family='Arial'%3ENigeria%3C/text%3E%3Ctext x='200' y='270' text-anchor='middle' fill='%236b7280' font-size='13' font-family='Arial'%3EINEC Commission Photo%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="ap-img-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}>
                  <path d="M7 1L1.5 3.5v4C1.5 10.6 4 13.1 7 14c3-0.9 5.5-3.4 5.5-6.5v-4L7 1z"
                    stroke="#16a34a" strokeWidth="1.3" fill="none"/>
                  <path d="M4.5 7l2 2 3.5-3.5" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Official INEC Commission
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="section section-alt ap-features-section">
        <div className="container">
          <div className="section-header">
            <div className="ap-eyebrow" style={{marginBottom:'0.75rem'}}>Platform Features</div>
            <h2>Built for Every Nigerian</h2>
            <p>Designed to make electoral data accessible, trustworthy, and actionable</p>
          </div>
          <div className="ap-features-grid">
            {features.map(({ Icon, title, desc, color }) => (
              <div key={title} className="ap-feature-card">
                <div className={`ap-feature-icon ap-feature-icon--${color}`}>
                  <Icon />
                </div>
                <h4 className="ap-feature-title">{title}</h4>
                <p className="ap-feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section ap-timeline-section">
        <div className="container">
          <div className="section-header">
            <div className="ap-eyebrow" style={{marginBottom:'0.75rem'}}>History</div>
            <h2>INEC's Digital Journey</h2>
            <p>Key milestones in Nigeria's electoral digitization</p>
          </div>

          <div className="ap-timeline">
            {timeline.map((t, i) => (
              <div key={i} className="ap-timeline-item">
                {/* Year + connector */}
                <div className="ap-timeline-year-col">
                  <div className="ap-timeline-year">{t.year}</div>
                  {i < timeline.length - 1 && <div className="ap-timeline-line" />}
                </div>
                {/* Dot */}
                <div className="ap-timeline-dot-col">
                  <div className="ap-timeline-dot" />
                  {i < timeline.length - 1 && <div className="ap-timeline-connector" />}
                </div>
                {/* Content */}
                <div className="ap-timeline-content">
                  <p className="ap-timeline-event">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ap-cta">
        <div className="ap-cta-dots" />
        <div className="container ap-cta-inner">
          <div className="ap-eyebrow ap-eyebrow--light">Get Started</div>
          <h2 className="ap-cta-h2">Join Nigeria's Democratic Transparency Movement</h2>
          <p className="ap-cta-desc">
            Create a free account to track results, receive personalised updates,
            and be part of a more accountable Nigeria.
          </p>
          <div className="ap-cta-actions">
            <a href="/register" className="ap-cta-btn-primary">Create Free Account</a>
            <a href="/results"  className="ap-cta-btn-ghost">View Results</a>
          </div>
        </div>
      </section>

    </div>
  );
}