import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import './ActivityLogPage.css'
import Footer from '../../components/Footer'

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 20

  useEffect(() => {
    setLoading(true)
    api.get('/api/users/activity-logs', { params: { page, limit: LIMIT } })
      .then(r => {
        setLogs(r.data.logs || r.data)
        setTotal(r.data.total || (r.data.logs || r.data).length)
      })
      .catch(() => setError('Failed to load activity logs.'))
      .finally(() => setLoading(false))
  }, [page])

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.targetResource?.toLowerCase().includes(search.toLowerCase()) ||
    l.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.userId?.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(total / LIMIT)

  const actionColor = (action = '') => {
    if (action.toLowerCase().includes('login')) return 'alp-tag--login'
    if (action.toLowerCase().includes('upload') || action.toLowerCase().includes('create')) return 'alp-tag--create'
    if (action.toLowerCase().includes('delete')) return 'alp-tag--delete'
    if (action.toLowerCase().includes('update') || action.toLowerCase().includes('edit')) return 'alp-tag--update'
    return 'alp-tag--default'
  }

  return (
    <div className="alp-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="alp-header">
              <div>
                <h1 className="alp-title">Activity Logs</h1>
                <p className="alp-sub">{total.toLocaleString()} log entr{total !== 1 ? 'ies' : 'y'} recorded</p>
              </div>
              <div className="alp-search-wrap">
                <span className="alp-search-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input className="alp-search" placeholder="Filter logs..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Filter logs" />
              </div>
            </div>

            {loading ? <Loader message="Loading activity logs..." /> : error ? (
              <div className="alp-error">{error}</div>
            ) : (
              <>
                <div className="alp-table-wrap">
                  <table className="alp-table" aria-label="Activity logs">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Resource</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan={5} className="alp-empty">No logs found.</td></tr>
                      ) : filtered.map((log, i) => (
                        <tr key={log._id || i}>
                          <td className="alp-time">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</td>
                          <td>
                            <div className="alp-user">
                              <span className="alp-user-name">{log.userId?.fullName || 'Unknown'}</span>
                              <span className="alp-user-email">{log.userId?.email || ''}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`alp-tag ${actionColor(log.action)}`}>{log.action || '—'}</span>
                          </td>
                          <td className="alp-resource">{log.targetResource || '—'}</td>
                          <td className="alp-ip">{log.ipAddress || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="alp-pagination" role="navigation" aria-label="Pagination">
                    <button className="alp-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <span className="alp-page-info">Page {page} of {totalPages}</span>
                    <button className="alp-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
