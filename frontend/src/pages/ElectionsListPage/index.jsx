import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import './ElectionsListPage.css'
import Footer from '../../components/Footer'

export default function ElectionsListPage() {
  const user = getCurrentUser()
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/elections')
      .then(r => setElections(r.data))
      .catch(() => setError('Failed to load elections.'))
      .finally(() => setLoading(false))
  }, [])

  const statusColor = s => s === 'open' ? 'el-status--open' : s === 'closed' ? 'el-status--closed' : 'el-status--upcoming'
  const statusLabel = s => s === 'open' ? '● Live Now' : s === 'closed' ? 'Closed' : 'Upcoming'

  return (
    <div className="el-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="el-header">
              <div>
                <h1 className="el-title">Mock Elections — 2027</h1>
                <p className="el-sub">Cast your vote and view live results for upcoming Nigerian elections</p>
              </div>
              {user?.role === 'admin' && (
                <Link to="/admin/elections" className="el-manage-btn">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Manage Elections
                </Link>
              )}
            </div>

            {loading ? <Loader message="Loading elections..." /> : error ? (
              <div className="el-error">{error}</div>
            ) : elections.length === 0 ? (
              <div className="el-empty">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <h3>No elections available yet</h3>
                <p>Check back soon for upcoming 2027 mock elections.</p>
                {user?.role === 'admin' && (
                  <Link to="/admin/elections" className="el-create-link">Create an Election</Link>
                )}
              </div>
            ) : (
              <div className="el-grid">
                {elections.map(e => (
                  <div className="el-card" key={e._id}>
                    <div className={`el-card-stripe el-card-stripe--${e.status}`} aria-hidden="true" />
                    <div className="el-card-body">
                      <div className="el-card-top">
                        <span className="el-type-tag">{e.electionType}</span>
                        <span className={`el-status ${statusColor(e.status)}`}>
                          {statusLabel(e.status)}
                        </span>
                      </div>
                      <h2 className="el-card-title">{e.title}</h2>
                      {e.description && <p className="el-card-desc">{e.description}</p>}

                      <div className="el-card-stats">
                        <div className="el-stat">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          {e.candidates?.length || 0} Candidates
                        </div>
                        <div className="el-stat">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                          {e.year}
                        </div>
                      </div>

                      {e.status === 'open' && (
                        <div className="el-live-bar">
                          <span className="el-live-dot" aria-hidden="true" />
                          Voting is open — cast your vote now
                        </div>
                      )}

                      <div className="el-card-actions">
                        {e.status === 'open' && (
                          <Link to={`/elections/${e._id}/vote`} className="el-vote-btn">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Vote Now
                          </Link>
                        )}
                        <Link to={`/elections/${e._id}/live`} className="el-results-btn">
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                          {e.status === 'closed' ? 'Final Results' : 'Live Results'}
                        </Link>
                        {e.status !== 'open' && (
                          <Link to={`/elections/${e._id}/vote`} className="el-view-btn">View Election</Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
