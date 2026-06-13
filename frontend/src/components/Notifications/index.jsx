import React, { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import './Notifications.css'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [lastChecked, setLastChecked] = useState(() => {
    return localStorage.getItem('inec_notif_checked') || new Date(0).toISOString()
  })
  const wrapRef = useRef()

  const fetchNotifications = async () => {
    try {
      const [resultsRes, electionsRes] = await Promise.all([
        api.get('/api/results', { params: { limit: 5, page: 1 } }),
        api.get('/api/elections')
      ])

      const notifs = []

      // New results
      const results = resultsRes.data.results || resultsRes.data || []
      results.forEach(r => {
        if (new Date(r.createdAt) > new Date(lastChecked)) {
          notifs.push({
            id: r._id,
            type: 'result',
            message: `New result uploaded: ${r.candidateId?.fullName || 'Candidate'} — ${r.state}`,
            time: r.createdAt,
            link: '/results'
          })
        }
      })

      // Live elections
      const elections = electionsRes.data || []
      elections.forEach(e => {
        if (e.status === 'open') {
          notifs.push({
            id: e._id + '_open',
            type: 'election',
            message: `Voting is LIVE: ${e.title}`,
            time: e.openedAt || e.createdAt,
            link: `/elections/${e._id}/vote`
          })
        }
      })

      setNotifications(notifs.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8))
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [lastChecked])

  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unread = notifications.filter(n => new Date(n.time) > new Date(lastChecked)).length

  const handleOpen = () => {
    setOpen(o => !o)
    if (!open) {
      const now = new Date().toISOString()
      setLastChecked(now)
      localStorage.setItem('inec_notif_checked', now)
    }
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button className="notif-btn" onClick={handleOpen} aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="notif-badge" aria-hidden="true">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown" role="region" aria-label="Notifications">
          <div className="notif-header">
            <h3 className="notif-title">Notifications</h3>
            {notifications.length > 0 && (
              <button className="notif-clear" onClick={() => setNotifications([])}>Clear all</button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <p>No new notifications</p>
              </div>
            ) : notifications.map(n => (
              <a key={n.id} href={n.link} className={`notif-item notif-item--${n.type}`} onClick={() => setOpen(false)}>
                <div className="notif-item-icon" aria-hidden="true">
                  {n.type === 'election'
                    ? <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    : <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  }
                </div>
                <div className="notif-item-body">
                  <p className="notif-item-msg">{n.message}</p>
                  <span className="notif-item-time">{timeAgo(n.time)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
