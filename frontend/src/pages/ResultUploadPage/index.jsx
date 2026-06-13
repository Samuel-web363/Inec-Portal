import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'
import './ResultUploadPage.css'
import Footer from '../../components/Footer'

export default function ResultUploadPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    electionType: '', electionDate: '', state: '', lga: '', ward: '',
    pollingUnit: '', partyId: '', candidateId: '', votesReceived: '', verifiedStatus: false
  })
  const [parties, setParties] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/parties').then(r => setParties(r.data)).catch(() => {})
    api.get('/api/candidates').then(r => setCandidates(r.data)).catch(() => {})
  }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.electionType || !form.state || !form.votesReceived) {
      setError('Election type, state, and votes are required.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/results', { ...form, votesReceived: Number(form.votesReceived) })
      setSuccess('Result uploaded successfully!')
      setForm({ electionType: '', electionDate: '', state: '', lga: '', ward: '', pollingUnit: '', partyId: '', candidateId: '', votesReceived: '', verifiedStatus: false })
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const electionTypes = ['Presidential', 'Gubernatorial', 'Senatorial', 'House of Representatives', 'State House of Assembly', 'Local Government']

  return (
    <div className="rup-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="rup-header">
              <div>
                <h1 className="rup-title">Upload Election Result</h1>
                <p className="rup-sub">Add a new result entry to the portal</p>
              </div>
              <button className="rup-back-btn" onClick={() => navigate('/admin/dashboard')}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Back to Dashboard
              </button>
            </div>

            <div className="rup-card">
              {success && (
                <div className="rup-success" role="status">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {success}
                </div>
              )}
              {error && (
                <div className="rup-error" role="alert">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  {error}
                </div>
              )}

              <form className="rup-form" onSubmit={handleSubmit} noValidate>
                <div className="rup-section-label">Election Information</div>
                <div className="rup-grid">
                  <div className="rup-field">
                    <label className="rup-label" htmlFor="rup-electionType">Election Type <span className="rup-required">*</span></label>
                    <select id="rup-electionType" name="electionType" className="rup-select" value={form.electionType} onChange={handleChange} required>
                      <option value="">Select type</option>
                      {electionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="rup-field">
                    <label className="rup-label" htmlFor="rup-electionDate">Election Date</label>
                    <input id="rup-electionDate" type="date" name="electionDate" className="rup-input" value={form.electionDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="rup-section-label">Location</div>
                <div className="rup-grid">
                  {[
                    { name: 'state', label: 'State', req: true },
                    { name: 'lga', label: 'LGA' },
                    { name: 'ward', label: 'Ward' },
                    { name: 'pollingUnit', label: 'Polling Unit' }
                  ].map(f => (
                    <div className="rup-field" key={f.name}>
                      <label className="rup-label" htmlFor={`rup-${f.name}`}>
                        {f.label} {f.req && <span className="rup-required">*</span>}
                      </label>
                      <input
                        id={`rup-${f.name}`}
                        type="text"
                        name={f.name}
                        className="rup-input"
                        value={form[f.name]}
                        onChange={handleChange}
                        required={!!f.req}
                      />
                    </div>
                  ))}
                </div>

                <div className="rup-section-label">Party & Candidate</div>
                <div className="rup-grid">
                  <div className="rup-field">
                    <label className="rup-label" htmlFor="rup-partyId">Party</label>
                    <select id="rup-partyId" name="partyId" className="rup-select" value={form.partyId} onChange={handleChange}>
                      <option value="">Select party</option>
                      {parties.map(p => <option key={p._id} value={p._id}>{p.abbreviation} — {p.name}</option>)}
                    </select>
                  </div>
                  <div className="rup-field">
                    <label className="rup-label" htmlFor="rup-candidateId">Candidate</label>
                    <select id="rup-candidateId" name="candidateId" className="rup-select" value={form.candidateId} onChange={handleChange}>
                      <option value="">Select candidate</option>
                      {candidates.map(c => <option key={c._id} value={c._id}>{c.fullName} ({c.state})</option>)}
                    </select>
                  </div>
                </div>

                <div className="rup-section-label">Vote Count</div>
                <div className="rup-grid rup-grid--narrow">
                  <div className="rup-field">
                    <label className="rup-label" htmlFor="rup-votes">Votes Received <span className="rup-required">*</span></label>
                    <input
                      id="rup-votes"
                      type="number"
                      name="votesReceived"
                      className="rup-input"
                      placeholder="e.g. 12500"
                      value={form.votesReceived}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="rup-field rup-field--checkbox">
                    <label className="rup-checkbox-label">
                      <input
                        type="checkbox"
                        name="verifiedStatus"
                        className="rup-checkbox"
                        checked={form.verifiedStatus}
                        onChange={handleChange}
                      />
                      <span className="rup-checkbox-text">Mark as Verified</span>
                    </label>
                    <span className="rup-hint">Verified results are publicly highlighted</span>
                  </div>
                </div>

                <div className="rup-actions">
                  <button type="button" className="rup-reset-btn" onClick={() => setForm({ electionType: '', electionDate: '', state: '', lga: '', ward: '', pollingUnit: '', partyId: '', candidateId: '', votesReceived: '', verifiedStatus: false })}>
                    Reset Form
                  </button>
                  <button type="submit" className="rup-submit" disabled={loading}>
                    {loading ? <span className="rup-spinner" aria-hidden="true" /> : (
                      <>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload Result
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
