import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getPartyColor, calcPercentage } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const GREY = '#6b7280';   // --inec-grey-500
const DARK = '#1f2937';   // --inec-grey-800

export default function PieChart({ data, title }) {
  const total = (data || []).reduce((s, d) => s + d.votes, 0);

  const chartData = {
    labels: (data || []).map(d => `${d.party} — ${calcPercentage(d.votes, total)}%`),
    datasets: [{
      data:            (data || []).map(d => d.votes),
      backgroundColor: (data || []).map(d => getPartyColor(d.party) + 'cc'),
      borderColor:     (data || []).map(d => getPartyColor(d.party)),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: GREY,
          font: { family: FONT, size: 12 },
          boxWidth: 14,
          boxHeight: 14,
          borderRadius: 4,
          useBorderRadius: true,
          padding: 20,
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
        titleFont: { family: FONT, size: 13, weight: '600' },
        bodyFont:  { family: FONT, size: 12 },
        padding: 10,
        callbacks: {
          label: c => ` ${c.label.split(' — ')[0]}: ${c.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 280 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}