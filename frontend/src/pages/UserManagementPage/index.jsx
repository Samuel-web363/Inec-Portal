import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import './UserManagementPage.css'
import Footer from '../../components/Footer'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const fetchUsers = () => {
    setLoading(true)
    api.get('/api/users')
      .then(r => setUsers(r.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user account?')) return
    setActionLoading(id)
    try {
      await api.put(`/api/users/${id}/deactivate`)
      fetchUsers()
    } catch { alert('Action failed.') }
    finally { setActionLoading(null) }
  }

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="um-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">
            <div className="um-header">
              <div>
                <h1 className="um-title">User Management</h1>
                <p className="um-sub">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="um-search-wrap">
                <span className="um-search-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input className="um-search" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search users" />
              </div>
            </div>

            {loading ? <Loader message="Loading users..." /> : error ? (
              <div className="um-error">{error}</div>
            ) : (
              <div className="um-table-wrap">
                <table className="um-table" aria-label="User management table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>NIN</th>
                      <th>Verified</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Last Login</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={8} className="um-empty">No users found.</td></tr>
                    ) : filtered.map(u => (
                      <tr key={u._id}>
                        <td className="um-name">{u.fullName}</td>
                        <td>{u.email}</td>
                        <td>{u.nin || '—'}</td>
                        <td>
                          <span className={`um-badge ${u.isVerified ? 'um-badge--yes' : 'um-badge--no'}`}>
                            {u.isVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <span className={`um-badge ${u.isActive === false ? 'um-badge--inactive' : 'um-badge--active'}`}>
                            {u.isActive === false ? 'Inactive' : 'Active'}
                          </span>
                        </td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}</td>
                        <td>
                          {u.isActive !== false ? (
                            <button
                              className="um-deact-btn"
                              onClick={() => handleDeactivate(u._id)}
                              disabled={actionLoading === u._id}
                              aria-label={`Deactivate ${u.fullName}`}
                            >
                              {actionLoading === u._id ? '…' : (
                                <>
                                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                  Deactivate
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="um-deact-label">Deactivated</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
