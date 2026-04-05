import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PRESIDENTIAL_RESULTS, MOCK_DASHBOARD_STATS } from '../../services/mockData';
import ResultCard from '../../components/results/ResultCard';
import BarChart from '../../components/charts/BarChart';
import { formatNumber } from '../../utils/helpers';

const totalVotes = MOCK_PRESIDENTIAL_RESULTS.reduce((s, c) => s + c.votes, 0);
const winner     = MOCK_PRESIDENTIAL_RESULTS[0];

// SVG icons — no emoji
const IconBallot = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M7 8h8M7 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M14 14.5l1.5 1.5L18 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 14V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconPeople = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M16 11c1.7.4 3 2 3 3.9V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="16" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);
const IconTrophy = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 11c-3 0-5-2-5-5V3h10v3c0 3-2 5-5 5z" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 11.5c0 1.5 1 2 2.5 2s2.5-.5 2.5-2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 3C5 3 3 3 3 1H1v2.5C1 5 3 5 5 5M11 3c0 0 2 0 2-2h2v2.5C15 5 13 5 11 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="5.5" y1="13.5" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 12L6 7l3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function UserDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Voter';

  return (
    <div className="ud-root">

      {/* ── Welcome hero ── */}
      <div className="ud-hero">
        <div className="ud-hero-dots" />
        <div className="ud-hero-accent" />
        <div className="ud-hero-body">
          <div className="ud-hero-left">
            <div className="ud-hero-greeting">
              <div className="ud-hero-avatar">{firstName.charAt(0).toUpperCase()}</div>
              <div>
                <div className="ud-hero-hello">Good day, {firstName}</div>
                <div className="ud-hero-sub">2023 General Elections · Live Tracking</div>
              </div>
            </div>
            <p className="ud-hero-desc">
              Track the 2023 elections in real-time from your personalised dashboard.
              Results are updated as data arrives from polling units nationwide.
            </p>
            <div className="ud-hero-actions">
              <Link to="/user/results" className="ud-btn-white">
                View Results <IconArrow />
              </Link>
              <Link to="/user/charts" className="ud-btn-ghost">
                <IconChart /> Analytics
              </Link>
            </div>
          </div>

          {/* Live indicator */}
          <div className="ud-hero-live-box">
            <div className="ud-live-dot" />
            <div className="ud-live-text">Live</div>
            <div className="ud-live-sub">Results updating</div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="ud-stats-grid">
        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--green"><IconBallot /></div>
          <div className="ud-stat-body">
            <div className="ud-stat-value">{formatNumber(MOCK_DASHBOARD_STATS.totalVotesCast)}</div>
            <div className="ud-stat-label">Total Votes Cast</div>
          </div>
          <div className="ud-stat-badge ud-stat-badge--green">Nationwide</div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--blue"><IconUpload /></div>
          <div className="ud-stat-body">
            <div className="ud-stat-value">{MOCK_DASHBOARD_STATS.uploadPercentage}%</div>
            <div className="ud-stat-label">Results Uploaded</div>
          </div>
          <div className="ud-stat-progress">
            <div className="ud-stat-progress-fill" style={{ width: `${MOCK_DASHBOARD_STATS.uploadPercentage}%` }} />
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--amber"><IconPeople /></div>
          <div className="ud-stat-body">
            <div className="ud-stat-value">{MOCK_PRESIDENTIAL_RESULTS.length}</div>
            <div className="ud-stat-label">Candidates Tracked</div>
          </div>
          <div className="ud-stat-badge ud-stat-badge--amber">Presidential</div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--purple"><IconTrophy /></div>
          <div className="ud-stat-body">
            <div className="ud-stat-value ud-stat-value--sm">{winner?.party || '—'}</div>
            <div className="ud-stat-label">Current Leader</div>
          </div>
          <div className="ud-stat-badge ud-stat-badge--purple">
            {winner?.candidate?.split(' ').slice(-1)[0]}
          </div>
        </div>
      </div>

      {/* ── Winner highlight ── */}
      {winner && (
        <div className="ud-winner">
          <div className="ud-winner-left">
            <div className="ud-winner-avatar">{winner.candidate?.charAt(0)}</div>
            <div>
              <div className="ud-winner-tag">
                <IconTrophy /> Current Leader
              </div>
              <div className="ud-winner-name">{winner.candidate}</div>
              <div className="ud-winner-party">{winner.party}</div>
            </div>
          </div>
          <div className="ud-winner-right">
            <div className="ud-winner-votes">{formatNumber(winner.votes)}</div>
            <div className="ud-winner-label">votes recorded</div>
          </div>
        </div>
      )}

      {/* ── Results section ── */}
      <div className="ud-section-header">
        <div>
          <div className="ud-section-eyebrow">Presidential Election · 2023</div>
          <h4 className="ud-section-title">Top Candidates</h4>
        </div>
        <Link to="/user/results" className="ud-link-btn">
          View All <IconArrow />
        </Link>
      </div>

      <div className="results-grid">
        {MOCK_PRESIDENTIAL_RESULTS.slice(0, 4).map((c, i) => (
          <ResultCard key={c.id} candidate={c} totalVotes={totalVotes} rank={i} />
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="ud-chart-card">
        <div className="ud-chart-header">
          <div>
            <div className="ud-section-eyebrow">Analytics</div>
            <h4 className="ud-section-title">Vote Distribution</h4>
          </div>
          <Link to="/user/charts" className="ud-link-btn">
            Full Analytics <IconArrow />
          </Link>
        </div>
        <div className="ud-chart-body">
          <BarChart data={MOCK_PRESIDENTIAL_RESULTS} />
        </div>
      </div>

    </div>
  );
}