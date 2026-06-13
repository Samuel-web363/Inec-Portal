import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import './PartyPage.css'
import Footer from '../../components/Footer'

export default function PartyPage() {
  const user = getCurrentUser()
  const isAdmin = user?.role === 'admin'
  const [parties, setParties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', abbreviation: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  const fetch = () => {
    setLoading(true)
    api.get('/api/parties')
      .then(r => setParties(r.data))
      .catch(() => setError('Failed to load parties.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const filtered = parties.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.abbreviation?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      editId ? await api.put(`/api/parties/${editId}`, form) : await api.post('/api/parties', form)
      setShowForm(false); setEditId(null); setForm({ name: '', abbreviation: '', description: '' }); fetch()
    } catch (err) { alert(err.response?.data?.message || 'Save failed.') }
    finally { setSaving(false) }
  }

  const handleEdit = p => {
    setForm({ name: p.name, abbreviation: p.abbreviation, description: p.description || '' })
    setEditId(p._id); setShowForm(true)
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this party?')) return
    try { await api.delete(`/api/parties/${id}`); fetch() }
    catch { alert('Delete failed.') }
  }

  const COLORS = ['#006400','#1a8a1a','#c9a84c','#2e7d32','#558b2f','#33691e','#827717','#e65100']

  return (
    <div className="pp-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="pp-header">
              <div>
                <h1 className="pp-title">Political Parties</h1>
                <p className="pp-sub">{parties.length} part{parties.length !== 1 ? 'ies' : 'y'} registered</p>
              </div>
              <div className="pp-header-right">
                <div className="pp-search-wrap">
                  <span className="pp-search-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                  <input className="pp-search" placeholder="Search parties..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search parties" />
                </div>
                {isAdmin && (
                  <button className="pp-add-btn" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', abbreviation: '', description: '' }) }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Party
                  </button>
                )}
              </div>
            </div>

            {loading ? <Loader message="Loading parties..." /> : error ? (
              <div className="pp-error">{error}</div>
            ) : (
              <div className="pp-grid">
                {filtered.length === 0 ? <p className="pp-empty">No parties found.</p>
                  : filtered.map((p, i) => (
                    <div className="pp-card" key={p._id}>
                      <div className="pp-card-accent" style={{ background: COLORS[i % COLORS.length] }} aria-hidden="true" />
                      <div className="pp-abbr" style={{ color: COLORS[i % COLORS.length] }}>{p.abbreviation}</div>
                      <h3 className="pp-name">{p.name}</h3>
                      {p.description && <p className="pp-desc">{p.description.slice(0, 120)}{p.description.length > 120 ? '…' : ''}</p>}
                      <div className="pp-footer-row">
                        <span className={`pp-status ${p.isActive === false ? 'pp-status--no' : 'pp-status--yes'}`}>
                          {p.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                        {isAdmin && (
                          <div className="pp-actions">
                            <button className="pp-edit-btn" onClick={() => handleEdit(p)} aria-label="Edit">
                              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="pp-del-btn" onClick={() => handleDelete(p._id)} aria-label="Delete">
                              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {showForm && (
              <div className="pp-modal-overlay" role="dialog" aria-modal="true">
                <div className="pp-modal">
                  <h2 className="pp-modal-title">{editId ? 'Edit Party' : 'Add Party'}</h2>
                  <form className="pp-form" onSubmit={handleSave}>
                    {[
                      { name: 'name', label: 'Party Name' },
                      { name: 'abbreviation', label: 'Abbreviation' }
                    ].map(f => (
                      <div className="pp-field" key={f.name}>
                        <label className="pp-label">{f.label}</label>
                        <input className="pp-input" type="text" value={form[f.name]} onChange={e => setForm(fm => ({ ...fm, [f.name]: e.target.value }))} required />
                      </div>
                    ))}
                    <div className="pp-field">
                      <label className="pp-label">Description</label>
                      <textarea className="pp-input pp-textarea" value={form.description} onChange={e => setForm(fm => ({ ...fm, description: e.target.value }))} rows={3} />
                    </div>
                    <div className="pp-modal-btns">
                      <button type="button" className="pp-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                      <button type="submit" className="pp-save-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
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
