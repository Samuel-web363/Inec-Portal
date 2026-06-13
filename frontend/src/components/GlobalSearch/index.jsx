import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import './GlobalSearch.css'

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ results: [], candidates: [], parties: [] })
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef()
  const wrapRef = useRef()
  const navigate = useNavigate()
  const debounceRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ results: [], candidates: [], parties: [] })
      setOpen(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const [resData, candData, partyData] = await Promise.all([
          api.get('/api/results', { params: { candidate: query, limit: 4 } }),
          api.get('/api/candidates').then(r => ({
            data: r.data.filter(c => c.fullName.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
          })),
          api.get('/api/parties').then(r => ({
            data: r.data.filter(p =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.abbreviation.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 3)
          }))
        ])
        setResults({
          results: resData.data.results || resData.data || [],
          candidates: candData.data,
          parties: partyData.data
        })
        setOpen(true)
      } catch {}
      finally { setLoading(false) }
    }, 350)
  }, [query])

  const total = results.results.length + results.candidates.length + results.parties.length

  const handleSelect = (path) => {
    setQuery('')
    setOpen(false)
    navigate(path)
  }

  return (
    <div className="gs-wrap" ref={wrapRef}>
      <div className="gs-input-wrap">
        <span className="gs-icon" aria-hidden="true">
          {loading
            ? <svg viewBox="0 0 24 24" width="16" height="16" className="gs-spinner" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
            : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          }
        </span>
        <input
          ref={inputRef}
          type="search"
          className="gs-input"
          placeholder="Search results, candidates, parties..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => total > 0 && setOpen(true)}
          aria-label="Global search"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {query && (
          <button className="gs-clear" onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }} aria-label="Clear search">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {open && total > 0 && (
        <div className="gs-dropdown" role="listbox" aria-label="Search results">

          {results.candidates.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-title">Candidates</div>
              {results.candidates.map(c => (
                <button key={c._id} className="gs-item" onClick={() => handleSelect('/candidates')} role="option">
                  <div className="gs-item-icon gs-item-icon--candidate" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div className="gs-item-body">
                    <span className="gs-item-title">{c.fullName}</span>
                    <span className="gs-item-sub">{c.partyId?.abbreviation || '—'} · {c.state} · {c.position}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.parties.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-title">Parties</div>
              {results.parties.map(p => (
                <button key={p._id} className="gs-item" onClick={() => handleSelect('/parties')} role="option">
                  <div className="gs-item-icon gs-item-icon--party" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div className="gs-item-body">
                    <span className="gs-item-title">{p.abbreviation} — {p.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.results.length > 0 && (
            <div className="gs-section">
              <div className="gs-section-title">Results</div>
              {results.results.map((r, i) => (
                <button key={r._id || i} className="gs-item" onClick={() => handleSelect('/results')} role="option">
                  <div className="gs-item-icon gs-item-icon--result" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="gs-item-body">
                    <span className="gs-item-title">{r.candidateId?.fullName || '—'}</span>
                    <span className="gs-item-sub">{r.electionType} · {r.state} · {r.votesReceived?.toLocaleString()} votes</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="gs-footer">
            <button className="gs-view-all" onClick={() => handleSelect(`/results?candidate=${query}`)}>
              View all results for "{query}"
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

      {open && query.length >= 2 && total === 0 && !loading && (
        <div className="gs-dropdown gs-dropdown--empty">
          <p>No results found for "<strong>{query}</strong>"</p>
        </div>
      )}
    </div>
  )
}
