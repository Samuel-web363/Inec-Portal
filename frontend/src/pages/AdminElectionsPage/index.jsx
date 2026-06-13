import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import './AdminElectionsPage.css'
import Footer from '../../components/Footer'

export default function AdminElectionsPage() {
  const [elections, setElections] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', electionType: '', year: 2027, candidates: []
  })

  const electionTypes = ['Presidential', 'Gubernatorial', 'Senatorial', 'House of Representatives', 'State House of Assembly']

  const fetchElections = () => {
    setLoading(true)
    api.get('/api/elections')
      .then(r => setElections(r.data))
      .catch(() => setError('Failed to load elections.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchElections()
    api.get('/api/candidates').then(r => setCandidates(r.data)).catch(() => {})
  }, [])

  const handleCandidateToggle = (id) => {
    setForm(f => ({
      ...f,
      candidates: f.candidates.includes(id)
        ? f.candidates.filter(c => c !== id)
        : [...f.candidates, id]
    }))
  }

  const handleCreate = async e => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.title || !form.electionType) { setError('Title and election type are required.'); return }
    if (form.candidates.length === 0) { setError('Select at least one candidate.'); return }
    setSaving(true)
    try {
      await api.post('/api/elections', form)
      setSuccess('Election created successfully!')
      setShowForm(false)
      setForm({ title: '', description: '', electionType: '', year: 2027, candidates: [] })
      fetchElections()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election.')
    } finally {
      setSaving(false)
    }
  }

  const handleOpen = async (id) => {
    setActionLoading(id + '_open')
    try {
      await api.put(`/api/elections/${id}/open`)
      fetchElections()
    } catch { setError('Failed to open election.') }
    finally { setActionLoading(null) }
  }

  const handleClose = async (id) => {
    if (!window.confirm('Close this election? Voting will stop immediately.')) return
    setActionLoading(id + '_close')
    try {
      await api.put(`/api/elections/${id}/close`)
      fetchElections()
    } catch { setError('Failed to close election.') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this election and all its votes? This cannot be undone.')) return
    try {
      await api.delete(`/api/elections/${id}`)
      fetchElections()
    } catch { setError('Failed to delete election.') }
  }

  const statusColor = s => s === 'open' ? 'ae-status--open' : s === 'closed' ? 'ae-status--closed' : 'ae-status--upcoming'

  return (
    <div className="ae-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="ae-header">
              <div>
                <h1 className="ae-title">Election Management</h1>
                <p className="ae-sub">Create and manage mock elections for 2027</p>
              </div>
              <button className="ae-create-btn" onClick={() => setShowForm(true)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create Election
              </button>
            </div>

            {error && <div className="ae-error" role="alert">{error}</div>}
            {success && <div className="ae-success" role="status">{success}</div>}

            {loading ? <Loader message="Loading elections..." /> : (
              <div className="ae-list">
                {elections.length === 0 ? (
                  <div className="ae-empty">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p>No elections created yet. Click "Create Election" to get started.</p>
                  </div>
                ) : elections.map(e => (
                  <div className="ae-card" key={e._id}>
                    <div className="ae-card-top">
                      <div>
                        <h2 className="ae-card-title">{e.title}</h2>
                        <div className="ae-card-meta">
                          <span className="ae-type">{e.electionType}</span>
                          <span className="ae-year">{e.year}</span>
                          <span className={`ae-status ${statusColor(e.status)}`}>
                            {e.status === 'open' ? '● Live' : e.status === 'closed' ? 'Closed' : 'Upcoming'}
                          </span>
                        </div>
                        {e.description && <p className="ae-card-desc">{e.description}</p>}
                      </div>
                      <div className="ae-card-actions">
                        {e.status === 'upcoming' && (
                          <button className="ae-open-btn" onClick={() => handleOpen(e._id)} disabled={actionLoading === e._id + '_open'}>
                            {actionLoading === e._id + '_open' ? '...' : (
                              <><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Open Voting</>
                            )}
                          </button>
                        )}
                        {e.status === 'open' && (
                          <button className="ae-close-btn" onClick={() => handleClose(e._id)} disabled={actionLoading === e._id + '_close'}>
                            {actionLoading === e._id + '_close' ? '...' : (
                              <><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Close Voting</>
                            )}
                          </button>
                        )}
                        <a href={`/elections/${e._id}/live`} className="ae-results-btn" target="_blank" rel="noreferrer">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                          Live Results
                        </a>
                        {e.status !== 'open' && (
                          <button className="ae-del-btn" onClick={() => handleDelete(e._id)} aria-label="Delete">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="ae-candidates-list">
                      <span className="ae-cand-label">Candidates ({e.candidates?.length || 0}):</span>
                      {e.candidates?.slice(0, 5).map(c => (
                        <span className="ae-cand-chip" key={c._id}>{c.fullName}</span>
                      ))}
                      {e.candidates?.length > 5 && <span className="ae-cand-more">+{e.candidates.length - 5} more</span>}
                    </div>

                    {e.status === 'open' && (
                      <div className="ae-live-banner">
                        <span className="ae-live-dot" aria-hidden="true" />
                        Voting is currently LIVE — users can cast votes now
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Create Election Modal */}
            {showForm && (
              <div className="ae-modal-overlay" role="dialog" aria-modal="true">
                <div className="ae-modal">
                  <div className="ae-modal-head">
                    <h2 className="ae-modal-title">Create New Election</h2>
                    <button className="ae-modal-close" onClick={() => setShowForm(false)} aria-label="Close">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  <form className="ae-form" onSubmit={handleCreate}>
                    <div className="ae-field">
                      <label className="ae-label">Election Title *</label>
                      <input className="ae-input" type="text" placeholder="e.g. 2027 Presidential Election" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                    </div>
                    <div className="ae-field">
                      <label className="ae-label">Election Type *</label>
                      <select className="ae-input" value={form.electionType} onChange={e => setForm(f => ({ ...f, electionType: e.target.value }))} required>
                        <option value="">Select type</option>
                        {electionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="ae-field">
                      <label className="ae-label">Year</label>
                      <input className="ae-input" type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} />
                    </div>
                    <div className="ae-field">
                      <label className="ae-label">Description</label>
                      <textarea className="ae-input ae-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Optional description" />
                    </div>

                    <div className="ae-field">
                      <label className="ae-label">Select Candidates * ({form.candidates.length} selected)</label>
                      <div className="ae-candidates-grid">
                        {candidates.map(c => (
                          <label key={c._id} className={`ae-cand-option ${form.candidates.includes(c._id) ? 'ae-cand-option--selected' : ''}`}>
                            <input type="checkbox" checked={form.candidates.includes(c._id)} onChange={() => handleCandidateToggle(c._id)} className="ae-cand-checkbox" />
                            <div>
                              <div className="ae-cand-name">{c.fullName}</div>
                              <div className="ae-cand-info">{c.partyId?.abbreviation || '—'} · {c.state}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="ae-modal-btns">
                      <button type="button" className="ae-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                      <button type="submit" className="ae-save-btn" disabled={saving}>{saving ? 'Creating...' : 'Create Election'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
