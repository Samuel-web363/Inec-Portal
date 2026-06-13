import React, { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import Footer from '../../components/Footer'
import api from '../../api/axios'
import './AnalyticsPage.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Tooltip, Legend)

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/results/summary'),
      api.get('/api/results', { params: { limit: 100, page: 1 } })
    ]).then(([s, r]) => {
      setSummary(s.data)
      setResults(r.data.results || r.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Compute analytics
  const partyTotals = {}
  const stateTotals = {}
  const typeTotals = {}

  results.forEach(r => {
    const party = r.partyId?.abbreviation || 'Other'
    const state = r.state || 'Unknown'
    const type = r.electionType || 'Unknown'
    const votes = r.votesReceived || 0

    partyTotals[party] = (partyTotals[party] || 0) + votes
    stateTotals[state] = (stateTotals[state] || 0) + votes
    typeTotals[type] = (typeTotals[type] || 0) + 1
  })

  const sortedParties = Object.entries(partyTotals).sort((a, b) => b[1] - a[1])
  const sortedStates = Object.entries(stateTotals).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const totalVotes = Object.values(partyTotals).reduce((a, b) => a + b, 0)

  const COLORS = ['#006400','#c0392b','#e65100','#1565c0','#6a1b9a','#c9a84c','#2e7d32','#558b2f']

  const barData = {
    labels: sortedParties.map(([p]) => p),
    datasets: [{
      label: 'Total Votes',
      data: sortedParties.map(([, v]) => v),
      backgroundColor: sortedParties.map((_, i) => COLORS[i % COLORS.length] + 'CC'),
      borderColor: sortedParties.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 2, borderRadius: 6
    }]
  }

  const stateData = {
    labels: sortedStates.map(([s]) => s),
    datasets: [{
      label: 'Votes',
      data: sortedStates.map(([, v]) => v),
      backgroundColor: 'rgba(0,100,0,0.7)',
      borderColor: '#006400',
      borderWidth: 2, borderRadius: 4
    }]
  }

  const typeData = {
    labels: Object.keys(typeTotals),
    datasets: [{
      data: Object.values(typeTotals),
      backgroundColor: COLORS,
      borderWidth: 3, borderColor: '#fff'
    }]
  }

  const uploadData = {
    labels: summary?.uploadsByDate?.map(d => d.date) || [],
    datasets: [{
      label: 'Uploads',
      data: summary?.uploadsByDate?.map(d => d.count) || [],
      borderColor: '#006400',
      backgroundColor: 'rgba(0,100,0,0.08)',
      tension: 0.4, fill: true,
      pointBackgroundColor: '#006400'
    }]
  }

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, boxWidth: 12 } } },
    scales: { x: { ticks: { font: { size: 10 }, maxRotation: 45 } }, y: { ticks: { font: { size: 10 } } } }
  }
  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 10 }, boxWidth: 10 } } }
  }

  // Winner per election type
  const winnerByType = {}
  results.forEach(r => {
    const type = r.electionType || 'Unknown'
    if (!winnerByType[type] || r.votesReceived > winnerByType[type].votes) {
      winnerByType[type] = {
        name: r.candidateId?.fullName || '—',
        party: r.partyId?.abbreviation || '—',
        votes: r.votesReceived || 0,
        state: r.state || '—'
      }
    }
  })

  return (
    <div className="an-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="an-header">
              <h1 className="an-title">Result Analytics</h1>
              <p className="an-sub">Deep analysis of all uploaded election results</p>
            </div>

            {loading ? <Loader message="Loading analytics..." /> : (
              <>
                {/* Summary KPIs */}
                <div className="an-kpis">
                  {[
                    { label: 'Total Votes', value: totalVotes.toLocaleString(), color: 'green',
                      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
                    { label: 'Results Uploaded', value: results.length.toLocaleString(), color: 'blue',
                      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                    { label: 'States Covered', value: Object.keys(stateTotals).length, color: 'gold',
                      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
                    { label: 'Election Types', value: Object.keys(typeTotals).length, color: 'purple',
                      icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
                  ].map(k => (
                    <div className={`an-kpi an-kpi--${k.color}`} key={k.label}>
                      <div className="an-kpi-icon">{k.icon}</div>
                      <div className="an-kpi-body">
                        <div className="an-kpi-value">{k.value}</div>
                        <div className="an-kpi-label">{k.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leaders per election type */}
                {Object.keys(winnerByType).length > 0 && (
                  <div className="an-section">
                    <h2 className="an-section-title">Leading Candidate by Election Type</h2>
                    <div className="an-leaders">
                      {Object.entries(winnerByType).map(([type, w]) => (
                        <div className="an-leader-card" key={type}>
                          <div className="an-leader-type">{type}</div>
                          <div className="an-leader-name">{w.name}</div>
                          <div className="an-leader-meta">
                            <span className="an-party-tag">{w.party}</span>
                            <span className="an-leader-state">{w.state}</span>
                          </div>
                          <div className="an-leader-votes">{w.votes.toLocaleString()} <span>votes</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Party breakdown table */}
                {sortedParties.length > 0 && (
                  <div className="an-section">
                    <h2 className="an-section-title">Party Vote Breakdown</h2>
                    <div className="an-table-wrap">
                      <table className="an-table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Party</th>
                            <th>Total Votes</th>
                            <th>Vote Share</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedParties.map(([party, votes], i) => {
                            const pct = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0
                            return (
                              <tr key={party} className={i === 0 ? 'an-row--winner' : ''}>
                                <td className="an-rank">
                                  {i === 0
                                    ? <svg viewBox="0 0 24 24" width="16" height="16" fill={COLORS[0]}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    : i + 1}
                                </td>
                                <td><span className="an-party-chip" style={{ background: COLORS[i % COLORS.length] }}>{party}</span></td>
                                <td className="an-votes">{votes.toLocaleString()}</td>
                                <td className="an-pct">{pct}%</td>
                                <td className="an-bar-cell">
                                  <div className="an-bar"><div className="an-bar-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} /></div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Charts */}
                <div className="an-charts">
                  <div className="an-chart-card">
                    <h3 className="an-chart-title">Votes Per Party</h3>
                    <div className="an-chart-body"><Bar data={barData} options={chartOpts} /></div>
                  </div>
                  <div className="an-chart-card">
                    <h3 className="an-chart-title">Results by Election Type</h3>
                    <div className="an-chart-body"><Doughnut data={typeData} options={doughnutOpts} /></div>
                  </div>
                  <div className="an-chart-card an-chart-card--wide">
                    <h3 className="an-chart-title">Top States by Votes</h3>
                    <div className="an-chart-body"><Bar data={stateData} options={chartOpts} /></div>
                  </div>
                  <div className="an-chart-card an-chart-card--wide">
                    <h3 className="an-chart-title">Upload Activity Over Time</h3>
                    <div className="an-chart-body"><Line data={uploadData} options={chartOpts} /></div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
