import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getPartyColor, calcPercentage } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const FONT   = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const GREY   = '#6b7280';
const DARK   = '#1f2937';

// ── Center-text plugin — shows winner inside the doughnut hole ──
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, data, chartArea } = chart;
    if (!chartArea) return;

    // Find the highest-value slice
    const vals    = data.datasets[0]?.data || [];
    const maxIdx  = vals.indexOf(Math.max(...vals));
    const label   = (data.labels?.[maxIdx] || '').split(' — ')[0]; // party name
    const pct     = (data.labels?.[maxIdx] || '').split(' — ')[1] || ''; // "37.6%"

    const cx = (chartArea.left + chartArea.right)  / 2;
    const cy = (chartArea.top  + chartArea.bottom) / 2;

    ctx.save();

    // Percentage
    ctx.font = `700 1.25rem ${FONT}`;
    ctx.fillStyle = DARK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pct, cx, cy - 10);

    // Party name
    ctx.font = `500 0.7rem ${FONT}`;
    ctx.fillStyle = GREY;
    ctx.fillText(label, cx, cy + 12);

    ctx.restore();
  },
};

// ── Empty state ───────────────────────────────────────────
function EmptyState() {
  return (
    <div className="ch-empty">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ch-empty-icon">
        <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M20 5v15l10 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
      <p className="ch-empty-text">No vote data available</p>
    </div>
  );
}

export default function PieChart({ data, title }) {
  if (!data || data.length === 0) return <EmptyState />;

  const total = data.reduce((s, d) => s + d.votes, 0);

  const chartData = {
    labels: data.map(d => `${d.party} — ${calcPercentage(d.votes, total)}%`),
    datasets: [{
      data:            data.map(d => d.votes),
      backgroundColor: data.map(d => getPartyColor(d.party) + 'cc'),
      borderColor:     data.map(d => getPartyColor(d.party)),
      borderWidth: 2,
      hoverOffset: 10,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    animation: { duration: 700, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: GREY,
          font: { family: FONT, size: 12 },
          boxWidth: 12, boxHeight: 12,
          borderRadius: 3, useBorderRadius: true,
          padding: 16,
          generateLabels: chart => {
            const ds = chart.data.datasets[0];
            return (chart.data.labels || []).map((label, i) => ({
              text:            label,
              fillStyle:       ds.backgroundColor[i],
              strokeStyle:     ds.borderColor[i],
              lineWidth:       1,
              hidden:          !chart.getDataVisibility(i),
              index:           i,
            }));
          },
        },
      },
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
          label: c => `  ${c.label.split(' — ')[0]}: ${c.parsed.toLocaleString()} votes`,
          afterLabel: c => {
            const pct = calcPercentage(c.parsed, total);
            return `  Share: ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container ch-pie">
      <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}