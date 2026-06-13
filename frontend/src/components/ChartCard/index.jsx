import React from 'react'
import './ChartCard.css'
import Loader from '../Loader'

export default function ChartCard({ title, children, loading }) {
  return (
    <div className="cc-card">
      <div className="cc-header">
        <h3 className="cc-title">{title}</h3>
        <div className="cc-bar" aria-hidden="true" />
      </div>
      <div className="cc-body">
        {loading ? <Loader message="Loading chart..." /> : children}
      </div>
    </div>
  )
}
