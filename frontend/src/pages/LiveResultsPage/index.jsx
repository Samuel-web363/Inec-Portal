import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import './LiveResultsPage.css'
import Footer from '../../components/Footer'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const PARTY_COLORS = {
  'APC': '#006400', 'PDP': '#c0392b', 'LP': '#e65100',
  'NNPP': '#1565c0', 'APGA': '#6a1b9a'
}

const getColor = (party, i) =>
  PARTY_COLORS[party] || ['#006400','#c0392b','#e65100','#1565c0','#6a1b9a','#c9a84c','#2e7d32','#558b2f'][i % 8]

export default function LiveResultsPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchResults = useCallback(async () => {
    try {
      const res = await api.get(`/api/elections/${id}/results`)
      setData(res.data)
      setLastUpdated(new Date())
      setError('')
    } catch {
      setError('Failed to load results.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchResults()
    // Auto-refresh every 10 seconds when election is live
    const interval = setInterval(fetchResults, 10000)
    return () => clearInterval(interval)
  }, [fetchResults])

  if (loading) return (
    <div className="lr-page">
      <Navbar />
      <Loader fullscreen message="Loading live results..." />
    </div>
  )

  if (error) return (
    <div className="lr-page">
      <Navbar />
      <div className="lr-error-wrap"><p>{error}</p><Link to="/elections" className="lr-back">Back to Elections</Link></div>
    </div>
  )

  const { election, results, totalVotes } = data
  const winner = results[0]
  const isLive = election.status === 'open'
  const colors = results.map((r, i) => getColor(r.party, i))

  const barData = {
    labels: results.map(r => r.fullName.split(' ').slice(-1)[0]),
    datasets: [{
      label: 'Votes',
      data: results.map(r => r.votes),
      backgroundColor: colors.map(c => c + 'CC'),
      borderColor: colors,
      borderWidth: 2,
      borderRadius: 6
    }]
  }

  const doughnutData = {
    labels: results.map(r => `${r.party} - ${r.fullName.split(' ').slice(-1)[0]}`),
    datasets: [{
      data: results.map(r => r.votes),
      backgroundColor: colors,
      borderWidth: 3,
      borderColor: '#fff'
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

  const doughnutChartOpts = {
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
    <div className="lr-page">
      <Navbar />
      <div className="lr-hero">
        <div className="lr-hero-inner">
          <div className="lr-hero-top">
            <div>
              <div className="lr-election-type">{election.electionType} · {election.year}</div>
              <h1 className="lr-election-title">{election.title}</h1>
            </div>
            <div className="lr-hero-right">
              <span className={`lr-status lr-status--${election.status}`}>
                {isLive && <span className="lr-live-dot" aria-hidden="true" />}
                {isLive ? 'Live' : election.status === 'closed' ? 'Final Results' : 'Upcoming'}
              </span>
              {lastUpdated && (
                <span className="lr-updated">
                  Updated {lastUpdated.toLocaleTimeString()}
                  {isLive && ' · auto-refreshing'}
                </span>
              )}
            </div>
          </div>

          <div className="lr-total-votes">
            <span className="lr-total-num">{totalVotes.toLocaleString()}</span>
            <span className="lr-total-label">Total Votes Cast</span>
          </div>
        </div>
      </div>

      <div className="lr-content">

        {/* Winner card */}
        {totalVotes > 0 && (
          <div className="lr-winner-card">
            <div className="lr-winner-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="lr-winner-info">
              <div className="lr-winner-label">{isLive ? 'Currently Leading' : 'Winner'}</div>
              <div className="lr-winner-name">{winner.fullName}</div>
              <div className="lr-winner-meta">
                <span className="lr-winner-party" style={{ background: getColor(winner.party, 0) }}>{winner.party}</span>
                <span>{winner.votes.toLocaleString()} votes</span>
                <span>{winner.percentage}%</span>
              </div>
            </div>
          </div>
        )}

        {totalVotes === 0 && (
          <div className="lr-no-votes">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <p>No votes have been cast yet. {isLive ? 'Results will appear here as people vote.' : ''}</p>
          </div>
        )}

        {/* Results table */}
        <div className="lr-section">
          <h2 className="lr-section-title">Vote Breakdown</h2>
          <div className="lr-table-wrap">
            <table className="lr-table" aria-label="Vote breakdown">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Candidate</th>
                  <th>Party</th>
                  <th>State</th>
                  <th>Votes</th>
                  <th>Share</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r._id} className={i === 0 && totalVotes > 0 ? 'lr-row--leader' : ''}>
                    <td className="lr-rank">
                      {i === 0 && totalVotes > 0
                        ? <svg viewBox="0 0 24 24" width="16" height="16" fill={getColor(r.party, i)} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        : i + 1
                      }
                    </td>
                    <td className="lr-cand-name">{r.fullName}</td>
                    <td><span className="lr-party-tag" style={{ background: getColor(r.party, i) }}>{r.party}</span></td>
                    <td className="lr-state">{r.state}</td>
                    <td className="lr-votes">{r.votes.toLocaleString()}</td>
                    <td className="lr-pct">{r.percentage}%</td>
                    <td className="lr-bar-cell">
                      <div className="lr-progress-bar">
                        <div className="lr-progress-fill" style={{ width: `${r.percentage}%`, background: getColor(r.party, i) }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        {totalVotes > 0 && (
          <div className="lr-charts">
            <div className="lr-chart-card">
              <h3 className="lr-chart-title">Votes by Candidate</h3>
              <Bar data={barData} options={chartOpts} />
            </div>
            <div className="lr-chart-card">
              <h3 className="lr-chart-title">Vote Share</h3>
              <Doughnut data={doughnutData} options={doughnutChartOpts} />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="lr-actions">
          <Link to={`/elections/${id}/vote`} className="lr-vote-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            {isLive ? 'Go Vote' : 'View Election'}
          </Link>
          <Link to="/elections" className="lr-back-btn">All Elections</Link>
          <button className="lr-refresh-btn" onClick={fetchResults}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
