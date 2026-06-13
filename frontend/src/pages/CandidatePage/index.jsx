import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import './CandidatePage.css'
import Footer from '../../components/Footer'

export default function CandidatePage() {
  const user = getCurrentUser()
  const isAdmin = user?.role === 'admin'
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', partyId: '', state: '', position: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  const fetch = () => {
    setLoading(true)
    api.get('/api/candidates')
      .then(r => setCandidates(r.data))
      .catch(() => setError('Failed to load candidates.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const filtered = candidates.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.state?.toLowerCase().includes(search.toLowerCase()) ||
    c.position?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/api/candidates/${editId}`, form)
      } else {
        await api.post('/api/candidates', form)
      }
      setShowForm(false)
      setEditId(null)
      setForm({ fullName: '', partyId: '', state: '', position: '', bio: '' })
      fetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (c) => {
    setForm({ fullName: c.fullName, partyId: c.partyId?._id || c.partyId || '', state: c.state, position: c.position, bio: c.bio || '' })
    setEditId(c._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate?')) return
    try {
      await api.delete(`/api/candidates/${id}`)
      fetch()
    } catch { alert('Delete failed.') }
  }

  return (
    <div className="cp-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="cp-header">
              <div>
                <h1 className="cp-title">Candidates</h1>
                <p className="cp-sub">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} registered</p>
              </div>
              <div className="cp-header-right">
                <div className="cp-search-wrap">
                  <span className="cp-search-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                  <input className="cp-search" placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search candidates" />
                </div>
                {isAdmin && (
                  <button className="cp-add-btn" onClick={() => { setShowForm(true); setEditId(null); setForm({ fullName: '', partyId: '', state: '', position: '', bio: '' }) }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Candidate
                  </button>
                )}
              </div>
            </div>

            {loading ? <Loader message="Loading candidates..." /> : error ? (
              <div className="cp-error">{error}</div>
            ) : (
              <div className="cp-grid">
                {filtered.length === 0 ? (
                  <p className="cp-empty">No candidates found.</p>
                ) : filtered.map(c => (
                  <div className="cp-card" key={c._id}>
                    <div className="cp-avatar" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div className="cp-card-body">
                      <h3 className="cp-name">{c.fullName}</h3>
                      <span className="cp-position">{c.position || 'N/A'}</span>
                      <div className="cp-meta">
                        <span className="cp-state">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {c.state || 'N/A'}
                        </span>
                        <span className={`cp-active ${c.isActive === false ? 'cp-active--no' : 'cp-active--yes'}`}>
                          {c.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                      </div>
                      {c.bio && <p className="cp-bio">{c.bio.slice(0, 100)}{c.bio.length > 100 ? '…' : ''}</p>}
                    </div>
                    {isAdmin && (
                      <div className="cp-actions">
                        <button className="cp-edit-btn" onClick={() => handleEdit(c)} aria-label="Edit candidate">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </button>
                        <button className="cp-del-btn" onClick={() => handleDelete(c._id)} aria-label="Delete candidate">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
              <div className="cp-modal-overlay" role="dialog" aria-modal="true">
                <div className="cp-modal">
                  <h2 className="cp-modal-title">{editId ? 'Edit Candidate' : 'Add Candidate'}</h2>
                  <form className="cp-form" onSubmit={handleSave}>
                    {[
                      { name: 'fullName', label: 'Full Name', type: 'text' },
                      { name: 'partyId', label: 'Party ID', type: 'text' },
                      { name: 'state', label: 'State', type: 'text' },
                      { name: 'position', label: 'Position', type: 'text' }
                    ].map(f => (
                      <div className="cp-field" key={f.name}>
                        <label className="cp-label">{f.label}</label>
                        <input className="cp-input" type={f.type} value={form[f.name]} onChange={e => setForm(fm => ({ ...fm, [f.name]: e.target.value }))} required={f.name !== 'partyId'} />
                      </div>
                    ))}
                    <div className="cp-field">
                      <label className="cp-label">Bio</label>
                      <textarea className="cp-input cp-textarea" value={form.bio} onChange={e => setForm(fm => ({ ...fm, bio: e.target.value }))} rows={3} />
                    </div>
                    <div className="cp-modal-btns">
                      <button type="button" className="cp-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                      <button type="submit" className="cp-save-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
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
