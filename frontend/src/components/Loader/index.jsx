import React from 'react'
import './Loader.css'

export default function Loader({ fullscreen = false, message = 'Loading...' }) {
  return (
    <div className={`ld-wrapper ${fullscreen ? 'ld-fullscreen' : ''}`}>
      <div className="ld-spinner">
        <svg viewBox="0 0 50 50" className="ld-circle" aria-hidden="true">
          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
        </svg>
        <div className="ld-emblem">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      {message && <p className="ld-message">{message}</p>}
    </div>
  )
}
