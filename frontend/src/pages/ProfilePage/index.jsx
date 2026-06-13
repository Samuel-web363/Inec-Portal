import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import './ProfilePage.css'
import Footer from '../../components/Footer'

export default function ProfilePage() {
  const user = getCurrentUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', nin: '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/profile')
      .then(r => {
        setProfile(r.data)
        setForm({ fullName: r.data.fullName || '', email: r.data.email || '', nin: r.data.nin || '' })
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setSuccess('')
    setError('')
    try {
      const res = await api.put('/api/profile', { fullName: form.fullName, nin: form.nin })
      setProfile(res.data)
      setEditing(false)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="prof-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <h1 className="prof-title">My Profile</h1>

            {loading ? <Loader message="Loading profile..." /> : (
              <div className="prof-layout">
                {/* Avatar card */}
                <div className="prof-avatar-card">
                  <div className="prof-avatar" aria-label="User avatar">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <h2 className="prof-name">{profile?.fullName}</h2>
                  <span className={`prof-role-badge ${user?.role === 'admin' ? 'prof-role-badge--admin' : ''}`}>
                    {user?.role === 'admin' ? 'Administrator' : 'Public User'}
                  </span>
                  <div className="prof-meta-list">
                    <div className="prof-meta-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                      <span>{profile?.isVerified ? 'Email Verified' : 'Email Not Verified'}</span>
                    </div>
                    <div className="prof-meta-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span>Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) : '—'}</span>
                    </div>
                    {profile?.lastLogin && (
                      <div className="prof-meta-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        <span>Last login {new Date(profile.lastLogin).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details card */}
                <div className="prof-details-card">
                  <div className="prof-details-head">
                    <h3 className="prof-details-title">Account Details</h3>
                    {!editing && (
                      <button className="prof-edit-btn" onClick={() => setEditing(true)}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {success && <div className="prof-success" role="status">{success}</div>}
                  {error && <div className="prof-error" role="alert">{error}</div>}

                  {editing ? (
                    <form className="prof-form" onSubmit={handleSave}>
                      <div className="prof-field">
                        <label className="prof-label">Full Name</label>
                        <input className="prof-input" type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
                      </div>
                      <div className="prof-field">
                        <label className="prof-label">Email Address</label>
                        <input className="prof-input prof-input--disabled" type="email" value={form.email} disabled />
                        <span className="prof-hint">Email cannot be changed</span>
                      </div>
                      <div className="prof-field">
                        <label className="prof-label">NIN</label>
                        <input className="prof-input" type="text" value={form.nin} onChange={e => setForm(f => ({ ...f, nin: e.target.value }))} />
                      </div>
                      <div className="prof-form-btns">
                        <button type="button" className="prof-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                        <button type="submit" className="prof-save-btn" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                      </div>
                    </form>
                  ) : (
                    <div className="prof-info-grid">
                      {[
                        { label: 'Full Name', value: profile?.fullName },
                        { label: 'Email Address', value: profile?.email },
                        { label: 'NIN', value: profile?.nin || '—' },
                        { label: 'Account Status', value: profile?.isActive === false ? 'Deactivated' : 'Active' },
                        { label: 'Verification', value: profile?.isVerified ? 'Verified' : 'Unverified' },
                        { label: 'Role', value: user?.role === 'admin' ? 'Administrator' : 'Public User' }
                      ].map(item => (
                        <div className="prof-info-item" key={item.label}>
                          <span className="prof-info-label">{item.label}</span>
                          <span className="prof-info-value">{item.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
