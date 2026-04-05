import { Link } from 'react-router-dom';

const IconExternal = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M9 1h4v4M13 1L7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export default function UserResults() {
  return (
    <div className="ur-root">

      {/* ── Page header ── */}
      <div className="ur-header">
        <div>
          <div className="ur-eyebrow">Presidential Election · 2023</div>
          <h3 className="ur-title">Browse Results</h3>
          <p className="ur-subtitle">Live results from all polling units across Nigeria</p>
        </div>
        <Link to="/results" className="ur-open-btn" target="_blank" rel="noopener noreferrer">
          Open Full Page <IconExternal />
        </Link>
      </div>

      {/* ── Info notice ── */}
      <div className="ur-notice">
        <IconInfo />
        <span>
          Showing the comprehensive results portal.{' '}
          <Link to="/results" style={{ fontWeight: 700, color: 'var(--inec-blue)' }}>
            Open in full page →
          </Link>
        </span>
      </div>

      {/* ── Embedded results frame ── */}
      <div className="ur-frame-wrap">
        <iframe
          src="/results"
          className="ur-frame"
          title="Election Results"
          loading="lazy"
        />
      </div>
    </div>
  );
}