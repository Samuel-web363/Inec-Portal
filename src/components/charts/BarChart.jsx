import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { getPartyColor } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FONT   = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const GREY   = '#6b7280';
const DARK   = '#1f2937';
const GRID   = '#f3f4f6';
const BORDER = '#e5e7eb';

// ── Empty state ───────────────────────────────────────────
function EmptyState() {
  return (
    <div className="ch-empty">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ch-empty-icon">
        <rect x="4" y="24" width="7" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="16" y="14" width="7" height="22" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="28" y="8"  width="7" height="28" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M4 36h32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
      <p className="ch-empty-text">No data available</p>
    </div>
  );
}

export default function BarChart({ data, title }) {
  if (!data || data.length === 0) return <EmptyState />;

  const sorted = [...data].sort((a, b) => b.votes - a.votes);

  const chartData = {
    labels: sorted.map(d => d.candidate?.split(' ').slice(-1)[0] || d.candidate),
    datasets: [{
      label: 'Votes',
      data:            sorted.map(d => d.votes),
      backgroundColor: sorted.map(d => getPartyColor(d.party) + 'cc'),
      borderColor:     sorted.map(d => getPartyColor(d.party)),
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      title: {
        display: !!title,
        text: title,
        color: DARK,
        font: { family: FONT, size: 14, weight: '600' },
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: { family: FONT, size: 13, weight: '600' },
        bodyFont:  { family: FONT, size: 12 },
        padding: 12,
        callbacks: {
          label: c => `  ${c.dataset.label}: ${c.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { color: BORDER, dash: [4, 4] },
        grid: { color: GRID },
        ticks: {
          color: GREY,
          font: { family: FONT, size: 11 },
          maxTicksLimit: 6,
          callback: v =>
            v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` :
            v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v,
        },
      },
      x: {
        border: { color: BORDER },
        grid: { display: false },
        ticks: {
          color: GREY,
          font: { family: FONT, size: 11 },
          maxRotation: 0,
        },
      },
    },
  };

  return (
    <div className="chart-container ch-bar">
      <Bar data={chartData} options={options} />
    </div>
  );
}