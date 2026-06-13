import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import Footer from '../../components/Footer'
import api from '../../api/axios'
import './ResultsPage.css'

const LIMIT = 15

export default function ResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ state: '', lga: '', ward: '', party: '', candidate: '' })
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: LIMIT, ...filters }
      if (search) params.candidate = search
      const res = await api.get('/api/results', { params })
      setResults(res.data.results || res.data)
      setTotal(res.data.total || res.data.length)
    } catch {
      setError('Failed to load results. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, filters, search])

  useEffect(() => { fetchResults() }, [fetchResults])

  const handleFilterChange = e => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ state: '', lga: '', ward: '', party: '', candidate: '' })
    setSearch('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)
  const hasActiveFilters = Object.values(filters).some(v => v) || search

  const handleExportCSV = () => {
    const headers = ['Election Type', 'Date', 'State', 'LGA', 'Ward', 'Party', 'Candidate', 'Votes', 'Status']
    const rows = results.map(r => [
      r.electionType || '',
      r.electionDate ? new Date(r.electionDate).toLocaleDateString() : '',
      r.state || '',
      r.lga || '',
      r.ward || '',
      r.partyId?.abbreviation || r.party || '',
      r.candidateId?.fullName || r.candidate || '',
      r.votesReceived || 0,
      r.verifiedStatus ? 'Verified' : 'Pending'
    ])
    const csvContent = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inec-results-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="res-page">
      <Navbar />
      <main className="res-main">
        <div className="res-header">
          <div className="res-header-inner">
            <h1 className="res-title">Election Results</h1>
            <p className="res-sub">Browse and filter all published election result entries</p>
          </div>
        </div>

        {/* Mobile search + filter toggle */}
        <div className="res-mobile-bar">
          <div className="res-search-wrap">
            <span className="res-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="search"
              className="res-search"
              placeholder="Search candidate..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              aria-label="Search by candidate"
            />
          </div>
          <button className="res-filter-toggle" onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters {hasActiveFilters && <span className="res-filter-dot" aria-label="Active filters" />}
          </button>
        </div>

        <div className="res-content">
          {/* Filters sidebar */}
          <aside className={`res-filters ${showFilters ? 'res-filters--open' : ''}`} aria-label="Result filters">
            <div className="res-filters-inner">
              <div className="res-filter-group">
                <label className="res-filter-label" htmlFor="res-state">State</label>
                <input id="res-state" name="state" className="res-filter-input" placeholder="e.g. Lagos" value={filters.state} onChange={handleFilterChange} />
              </div>
              <div className="res-filter-group">
                <label className="res-filter-label" htmlFor="res-lga">LGA</label>
                <input id="res-lga" name="lga" className="res-filter-input" placeholder="e.g. Ikeja" value={filters.lga} onChange={handleFilterChange} />
              </div>
              <div className="res-filter-group">
                <label className="res-filter-label" htmlFor="res-ward">Ward</label>
                <input id="res-ward" name="ward" className="res-filter-input" placeholder="e.g. Ward 3" value={filters.ward} onChange={handleFilterChange} />
              </div>
              <div className="res-filter-group">
                <label className="res-filter-label" htmlFor="res-party">Party</label>
                <input id="res-party" name="party" className="res-filter-input" placeholder="e.g. APC" value={filters.party} onChange={handleFilterChange} />
              </div>
              <button className="res-clear-btn" onClick={clearFilters}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Results area */}
          <div className="res-table-area">
            {loading ? (
              <Loader message="Loading results..." />
            ) : error ? (
              <div className="res-error" role="alert">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                {error}
              </div>
            ) : results.length === 0 ? (
              <div className="res-empty">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <p>No results found for the current filters.</p>
                <button className="res-clear-btn" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="res-toolbar">
                  <div className="res-count">{total.toLocaleString()} result{total !== 1 ? 's' : ''} found</div>
                  <div className="res-export-btns">
                    <button className="res-export-btn" onClick={handleExportCSV} aria-label="Export as CSV">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Export CSV
                    </button>
                    <button className="res-export-btn" onClick={handlePrint} aria-label="Print results">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      Print
                    </button>
                  </div>
                </div>

                {/* Desktop table */}
                <div className="res-table-wrap">
                  <table className="res-table" aria-label="Election results table">
                    <thead>
                      <tr>
                        <th>Election Type</th>
                        <th>Date</th>
                        <th>State</th>
                        <th>LGA</th>
                        <th>Party</th>
                        <th>Candidate</th>
                        <th>Votes</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={r._id || i}>
                          <td>{r.electionType || '—'}</td>
                          <td>{r.electionDate ? new Date(r.electionDate).toLocaleDateString() : '—'}</td>
                          <td>{r.state || '—'}</td>
                          <td>{r.lga || '—'}</td>
                          <td><span className="res-party-badge">{r.partyId?.abbreviation || r.party || '—'}</span></td>
                          <td>{r.candidateId?.fullName || r.candidate || '—'}</td>
                          <td className="res-votes">{r.votesReceived?.toLocaleString() || '—'}</td>
                          <td>
                            <span className={`res-status ${r.verifiedStatus ? 'res-status--verified' : 'res-status--pending'}`}>
                              {r.verifiedStatus ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="res-cards">
                  {results.map((r, i) => (
                    <div className="res-card" key={r._id || i}>
                      <div className="res-card-top">
                        <div className="res-card-left">
                          <span className="res-card-type">{r.electionType || '—'}</span>
                          <h3 className="res-card-name">{r.candidateId?.fullName || r.candidate || '—'}</h3>
                        </div>
                        <div className="res-card-right">
                          <span className="res-party-badge">{r.partyId?.abbreviation || r.party || '—'}</span>
                          <span className={`res-status ${r.verifiedStatus ? 'res-status--verified' : 'res-status--pending'}`}>
                            {r.verifiedStatus ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="res-card-details">
                        <div className="res-card-detail">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {r.state || '—'}{r.lga ? `, ${r.lga}` : ''}{r.ward ? `, ${r.ward}` : ''}
                        </div>
                        <div className="res-card-detail">
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                          {r.electionDate ? new Date(r.electionDate).toLocaleDateString('en-NG') : '—'}
                        </div>
                      </div>
                      <div className="res-card-votes">
                        <span className="res-card-votes-num">{r.votesReceived?.toLocaleString() || '—'}</span>
                        <span className="res-card-votes-label">votes</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="res-pagination" role="navigation" aria-label="Pagination">
                    <button className="res-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pg = page <= 3 ? i + 1 : page - 2 + i
                      if (pg > totalPages) return null
                      return (
                        <button key={pg} className={`res-page-btn ${pg === page ? 'res-page-btn--active' : ''}`} onClick={() => setPage(pg)}>{pg}</button>
                      )
                    })}
                    <button className="res-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
