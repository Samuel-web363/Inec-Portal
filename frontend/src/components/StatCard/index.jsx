import React from 'react'
import './StatCard.css'

export default function StatCard({ label, value, icon, color = 'green', trend }) {
  return (
    <div className={`sc-card sc-card--${color}`}>
      <div className="sc-icon" aria-hidden="true">{icon}</div>
      <div className="sc-body">
        <span className="sc-value">{value ?? '—'}</span>
        <span className="sc-label">{label}</span>
        {trend && <span className="sc-trend">{trend}</span>}
      </div>
    </div>
  )
}
