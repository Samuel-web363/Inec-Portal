import React, { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import ChartCard from '../../components/ChartCard'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import './AdminDashboard.css'
import Footer from '../../components/Footer'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Tooltip, Legend)

export default function AdminDashboard() {
  const user = getCurrentUser()
  const [summary, setSummary] = useState(null)
  const [recentResults, setRecentResults] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/api/results/summary'),
      api.get('/api/results', { params: { limit: 6, page: 1 } }),
      api.get('/api/users/activity-logs', { params: { limit: 5 } })
    ]).then(([sum, res, logs]) => {
      setSummary(sum.data)
      setRecentResults(res.data.results || res.data)
      setRecentLogs(logs.data.logs || logs.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const barData = {
    labels: summary?.partyVotes?.map(p => p.party) || [],
    datasets: [{
      label: 'Votes',
      data: summary?.partyVotes?.map(p => p.votes) || [],
      backgroundColor: 'rgba(0,100,0,0.75)',
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
      borderWidth: 2, borderColor: '#fff'
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
      fill: true
    }]
  }

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg(null)
    try {
      const res = await api.post('/api/seed')
      setSeedMsg({ type: 'success', text: `Seeded ${res.data.seeded.parties} parties, ${res.data.seeded.candidates} candidates, ${res.data.seeded.results} results.` })
      window.location.reload()
    } catch (err) {
      setSeedMsg({ type: 'error', text: err.response?.data?.message || 'Failed to seed data.' })
    } finally {
      setSeeding(false)
    }
  }

  const handleClearData = async () => {
    if (!window.confirm('This will permanently delete ALL parties, candidates, and results. Continue?')) return
    setSeeding(true)
    setSeedMsg(null)
    try {
      await api.post('/api/seed').catch(() => {}) // not used, placeholder
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || '') + '/api/seed', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('inec_token')}` }
      })
      const data = await res.json()
      setSeedMsg({ type: 'success', text: data.message })
      window.location.reload()
    } catch {
      setSeedMsg({ type: 'error', text: 'Failed to clear data.' })
    } finally {
      setSeeding(false)
    }
  }

  const opts = {
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
    <div className="ad-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">

            {/* Welcome banner */}
            <div className="ad-banner">
              <div>
                <h1 className="ad-banner-title">Admin Dashboard</h1>
                <p className="ad-banner-sub">Hello {user?.fullName?.split(' ')[0]}, here's the system overview</p>
              </div>
              <Link to="/admin/results/upload" className="ad-upload-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload New Result
              </Link>
            </div>

            {loading ? <Loader message="Loading admin dashboard..." /> : (
              <>
                {/* Demo Data Seeder */}
                {(!summary?.totalResults || summary.totalResults === 0) && (
                  <div className="ad-seed-card">
                    <div className="ad-seed-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6m0 8v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/></svg>
                    </div>
                    <div className="ad-seed-body">
                      <h3 className="ad-seed-title">Your database is empty</h3>
                      <p className="ad-seed-text">Seed it with realistic 2023 Nigerian election data (parties, candidates, and results) for your project demo.</p>
                    </div>
                    <button className="ad-seed-btn" onClick={handleSeed} disabled={seeding}>
                      {seeding ? 'Seeding...' : 'Seed Demo Data'}
                    </button>
                  </div>
                )}

                {seedMsg && (
                  <div className={`ad-seed-msg ad-seed-msg--${seedMsg.type}`}>{seedMsg.text}</div>
                )}

                {summary?.totalResults > 0 && (
                  <div className="ad-danger-zone">
                    <span className="ad-danger-text">Danger Zone: Clear all parties, candidates, and results to start fresh.</span>
                    <button className="ad-clear-btn" onClick={handleClearData} disabled={seeding}>
                      {seeding ? 'Clearing...' : 'Clear All Data'}
                    </button>
                  </div>
                )}

                {/* Stats */}
                <div className="ad-stats">
                  <StatCard label="Total Results" value={summary?.totalResults?.toLocaleString() ?? '—'} color="green"
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  />
                  <StatCard label="Total Votes" value={summary?.totalVotes?.toLocaleString() ?? '—'} color="gold"
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
                  />
                  <StatCard label="Registered Users" value={summary?.totalUsers?.toLocaleString() ?? '—'} color="grey"
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                  />
                  <StatCard label="Parties" value={summary?.totalParties?.toLocaleString() ?? '—'} color="green"
                    icon={<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                  />
                </div>

                {/* Charts row */}
                <div className="ad-charts">
                  <ChartCard title="Votes Per Party"><Bar data={barData} options={opts} /></ChartCard>
                  <ChartCard title="Distribution by State"><Doughnut data={doughnutData} options={doughnutOpts} /></ChartCard>
                  <div className="ad-charts-wide">
                    <ChartCard title="Upload Activity Over Time"><Line data={lineData} options={opts} /></ChartCard>
                  </div>
                </div>

                {/* Recent uploads */}
                <div className="ad-section">
                  <div className="ad-section-head">
                    <h2 className="ad-section-title">Recent Uploads</h2>
                    <Link to="/results" className="ad-section-link">View All</Link>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table" aria-label="Recent results">
                      <thead>
                        <tr>
                          <th>Type</th><th>State</th><th>LGA</th><th>Party</th><th>Candidate</th><th>Votes</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentResults.length === 0 ? (
                          <tr><td colSpan={7} className="ad-empty">No results uploaded yet.</td></tr>
                        ) : recentResults.map((r, i) => (
                          <tr key={r._id || i}>
                            <td>{r.electionType || '—'}</td>
                            <td>{r.state || '—'}</td>
                            <td>{r.lga || '—'}</td>
                            <td><span className="ad-badge">{r.partyId?.abbreviation || '—'}</span></td>
                            <td>{r.candidateId?.fullName || '—'}</td>
                            <td className="ad-votes">{r.votesReceived?.toLocaleString() || '—'}</td>
                            <td>
                              <span className={`ad-status ${r.verifiedStatus ? 'ad-status--ok' : 'ad-status--pending'}`}>
                                {r.verifiedStatus ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="ad-section">
                  <div className="ad-section-head">
                    <h2 className="ad-section-title">Recent Activity</h2>
                    <Link to="/admin/logs" className="ad-section-link">View All Logs</Link>
                  </div>
                  <div className="ad-logs">
                    {recentLogs.length === 0 ? (
                      <p className="ad-empty-text">No activity logs yet.</p>
                    ) : recentLogs.map((log, i) => (
                      <div className="ad-log-item" key={log._id || i}>
                        <div className="ad-log-dot" aria-hidden="true" />
                        <div>
                          <span className="ad-log-action">{log.action}</span>
                          {log.targetResource && <span className="ad-log-target"> — {log.targetResource}</span>}
                          <div className="ad-log-time">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</div>
                        </div>
                      </div>
                    ))}
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
