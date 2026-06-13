import React, { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import ChartCard from '../../components/ChartCard'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import Footer from '../../components/Footer'
import './UserDashboard.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Title, Tooltip, Legend)

export default function UserDashboard() {
  const user = getCurrentUser()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/results/summary')
      .then(r => setSummary(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const barData = {
    labels: summary?.partyVotes?.map(p => p.party) || [],
    datasets: [{
      label: 'Total Votes',
      data: summary?.partyVotes?.map(p => p.votes) || [],
      backgroundColor: 'rgba(0, 100, 0, 0.75)',
      borderColor: '#006400',
      borderWidth: 1,
      borderRadius: 4
    }]
  }

  const doughnutData = {
    labels: summary?.stateResults?.map(s => s.state) || [],
    datasets: [{
      data: summary?.stateResults?.map(s => s.count) || [],
      backgroundColor: ['#006400','#1a8a1a','#c9a84c','#2e7d32','#558b2f','#33691e','#827717','#f9a825'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }

  const lineData = {
    labels: summary?.uploadsByDate?.map(d => d.date) || [],
    datasets: [{
      label: 'Uploads',
      data: summary?.uploadsByDate?.map(d => d.count) || [],
      borderColor: '#006400',
      backgroundColor: 'rgba(0,100,0,0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#006400'
    }]
  }

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 12, font: { size: 11 }, boxWidth: 12 }
      }
    },
    scales: {
      x: { ticks: { font: { size: 10 }, maxRotation: 45 } },
      y: { ticks: { font: { size: 10 } } }
    }
  }

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 10, font: { size: 10 }, boxWidth: 10 }
      }
    }
  }

  return (
    <div className="ud-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            {/* Welcome */}
            <div className="ud-welcome">
              <div>
                <h1 className="ud-welcome-title">
                  Welcome back, <span className="ud-name">{user?.fullName?.split(' ')[0] || 'User'}</span>
                </h1>
                <p className="ud-welcome-sub">Here is an overview of the current election data</p>
              </div>
              <div className="ud-welcome-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
                Live Data
              </div>
            </div>

            {loading ? <Loader message="Loading dashboard..." /> : (
              <>
                {/* Stat cards */}
                <div className="ud-stats">
                  <StatCard label="Total Results" value={summary?.totalResults?.toLocaleString() ?? '—'}
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                    color="green"
                  />
                  <StatCard label="Total Votes" value={summary?.totalVotes?.toLocaleString() ?? '—'}
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                    color="gold"
                  />
                  <StatCard label="Parties" value={summary?.totalParties?.toLocaleString() ?? '—'}
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                    color="green"
                  />
                  <StatCard label="Candidates" value={summary?.totalCandidates?.toLocaleString() ?? '—'}
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
                    color="grey"
                  />
                </div>

                {/* Charts */}
                <div className="ud-charts">
                  <ChartCard title="Votes Per Party">
                    <Bar data={barData} options={chartOpts} />
                  </ChartCard>
                  <ChartCard title="Results by State">
                    <Doughnut data={doughnutData} options={doughnutOpts} />
                  </ChartCard>
                  <div className="ud-charts-wide">
                    <ChartCard title="Result Uploads Over Time">
                      <Line data={lineData} options={chartOpts} />
                    </ChartCard>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
