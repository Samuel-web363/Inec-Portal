import { useState } from 'react';
import { MOCK_PRESIDENTIAL_RESULTS } from '../../services/mockData';
import BarChart  from '../../components/charts/BarChart';
import PieChart  from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';

const IconOverview = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="1" y="8" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8" y="8" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IconParty = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="9" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="6" y="5" width="3" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="11" y="2" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IconTrend = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M1 11L5.5 6l3.5 3L14 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5.5" cy="6" r="1.2" fill="currentColor"/>
    <circle cx="9" cy="9" r="1.2" fill="currentColor"/>
  </svg>
);

const TABS = [
  { key: 'overview', label: 'Overview',       Icon: IconOverview },
  { key: 'party',    label: 'By Party',        Icon: IconParty    },
  { key: 'trend',    label: 'Upload Trend',    Icon: IconTrend    },
];

const uploadTrend = {
  labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
  datasets: [{
    label: 'Uploads',
    data:  [5200, 18400, 42000, 89000, 134000, 161000, 149272],
    borderColor: '#1a7a3c',
    backgroundColor: 'rgba(26,122,60,.1)',
  }],
};

export default function ChartsPage() {
  const [active, setActive] = useState('overview');

  return (
    <div className="cp-root">

      {/* ── Page header ── */}
      <div className="cp-header">
        <div>
          <div className="cp-eyebrow">2023 General Election</div>
          <h3 className="cp-title">Charts &amp; Analytics</h3>
          <p className="cp-subtitle">Visual breakdown of election results and upload trends</p>
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="cp-summary">
        {[
          { label: 'Total Votes',   value: '23.6M',  color: 'var(--inec-green)' },
          { label: 'Candidates',    value: MOCK_PRESIDENTIAL_RESULTS.length, color: 'var(--inec-blue)' },
          { label: 'Upload Rate',   value: '87.4%',  color: '#d97706' },
          { label: 'States Live',   value: '36+',    color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="cp-summary-item">
            <div className="cp-summary-value" style={{ color: s.color }}>{s.value}</div>
            <div className="cp-summary-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="cp-tabs">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`cp-tab${active === key ? ' cp-tab--active' : ''}`}
            onClick={() => setActive(key)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      {active === 'overview' && (
        <div className="cp-grid-2">
          <div className="card cp-chart-card">
            <div className="card-header cp-card-header">
              <h4>Votes by Candidate</h4>
              <span className="cp-card-badge">Bar</span>
            </div>
            <div className="card-body">
              <BarChart data={MOCK_PRESIDENTIAL_RESULTS} />
            </div>
          </div>
          <div className="card cp-chart-card">
            <div className="card-header cp-card-header">
              <h4>Vote Share</h4>
              <span className="cp-card-badge">Doughnut</span>
            </div>
            <div className="card-body">
              <PieChart data={MOCK_PRESIDENTIAL_RESULTS} />
            </div>
          </div>
        </div>
      )}

      {active === 'party' && (
        <div className="card cp-chart-card">
          <div className="card-header cp-card-header">
            <h4>Party Comparison</h4>
            <span className="cp-card-badge">Bar</span>
          </div>
          <div className="card-body">
            <BarChart data={MOCK_PRESIDENTIAL_RESULTS} title="Total Votes by Party" />
          </div>
        </div>
      )}

      {active === 'trend' && (
        <div className="card cp-chart-card">
          <div className="card-header cp-card-header">
            <h4>Results Upload Timeline</h4>
            <span className="cp-card-badge">Line</span>
          </div>
          <div className="card-body">
            <LineChart labels={uploadTrend.labels} datasets={uploadTrend.datasets} title="Cumulative Uploads — Election Day" />
          </div>
        </div>
      )}

    </div>
  );
}