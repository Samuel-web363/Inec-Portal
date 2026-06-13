import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Loader from '../../components/Loader'
import api from '../../api/axios'
import { getCurrentUser } from '../../api/auth'
import './VotingPage.css'
import Footer from '../../components/Footer'

export default function VotingPage() {
  const { id } = useParams()
  const user = getCurrentUser()
  const [election, setElection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [selected, setSelected] = useState(null)
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [votedFor, setVotedFor] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [elRes, voteRes] = await Promise.all([
          api.get(`/api/elections/${id}`),
          api.get(`/api/elections/${id}/my-vote`)
        ])
        setElection(elRes.data)
        setAlreadyVoted(voteRes.data.voted)
        setVotedFor(voteRes.data.candidate)
      } catch {
        setError('Failed to load election.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleVote = async () => {
    if (!selected) { setError('Please select a candidate.'); return }
    setVoting(true)
    setError('')
    try {
      await api.post(`/api/elections/${id}/vote`, { candidateId: selected })
      const candidate = election.candidates.find(c => c._id === selected)
      setAlreadyVoted(true)
      setVotedFor(candidate)
      setSuccess('Your vote has been cast successfully!')
      setConfirmed(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote.')
    } finally {
      setVoting(false)
    }
  }

  if (loading) return (
    <div className="vp-page"><Navbar /><div className="page-with-sidebar"><Sidebar /><div className="page-main-content"><Loader message="Loading election..." /></div></div></div>
  )

  if (error && !election) return (
    <div className="vp-page"><Navbar /><div className="vp-error-wrap"><p>{error}</p><Link to="/elections" className="vp-back-link">Back to Elections</Link></div></div>
  )

  const isAdmin = user?.role === 'admin'
  const isOpen = election?.status === 'open'
  const isClosed = election?.status === 'closed'

  return (
    <div className="vp-page">
      <Navbar />
      <div className="page-with-sidebar">
        <Sidebar />
        <div className="page-main-content">
          <div className="page-inner">

            {/* Election header */}
            <div className="vp-header">
              <div className="vp-header-left">
                <div className="vp-type-badge">{election.electionType} · {election.year}</div>
                <h1 className="vp-title">{election.title}</h1>
                {election.description && <p className="vp-desc">{election.description}</p>}
              </div>
              <div className="vp-status-wrap">
                <span className={`vp-status vp-status--${election.status}`}>
                  {election.status === 'open' && <span className="vp-live-dot" aria-hidden="true" />}
                  {election.status === 'open' ? 'Live' : election.status === 'closed' ? 'Closed' : 'Upcoming'}
                </span>
                <Link to={`/elections/${id}/live`} className="vp-live-link">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Live Results
                </Link>
              </div>
            </div>

            {/* Admin cannot vote */}
            {isAdmin && (
              <div className="vp-notice vp-notice--info">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                As an administrator you cannot vote. You can view live results and manage this election from the Elections Management page.
              </div>
            )}

            {/* Not open */}
            {!isAdmin && !isOpen && !alreadyVoted && (
              <div className={`vp-notice ${isClosed ? 'vp-notice--closed' : 'vp-notice--upcoming'}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {isClosed ? 'Voting for this election has closed.' : 'This election has not opened yet. Check back later.'}
              </div>
            )}

            {/* Already voted */}
            {alreadyVoted && (
              <div className="vp-voted-card">
                <div className="vp-voted-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <h3 className="vp-voted-title">You have already voted</h3>
                  <p className="vp-voted-sub">
                    You voted for <strong>{votedFor?.fullName || 'a candidate'}</strong> in this election.
                  </p>
                </div>
                <Link to={`/elections/${id}/live`} className="vp-view-results-btn">View Live Results</Link>
              </div>
            )}

            {success && !alreadyVoted && (
              <div className="vp-success">{success}</div>
            )}

            {error && <div className="vp-error">{error}</div>}

            {/* Candidate cards */}
            <div className="vp-candidates-label">
              {election.candidates.length} Candidate{election.candidates.length !== 1 ? 's' : ''}
            </div>

            <div className="vp-candidates">
              {election.candidates.map(c => (
                <div
                  key={c._id}
                  className={`vp-candidate-card ${selected === c._id ? 'vp-candidate-card--selected' : ''} ${alreadyVoted || !isOpen || isAdmin ? 'vp-candidate-card--disabled' : ''}`}
                  onClick={() => {
                    if (!alreadyVoted && isOpen && !isAdmin) {
                      setSelected(c._id)
                      setError('')
                    }
                  }}
                  role={isOpen && !alreadyVoted && !isAdmin ? 'button' : undefined}
                  tabIndex={isOpen && !alreadyVoted && !isAdmin ? 0 : undefined}
                  onKeyDown={e => e.key === 'Enter' && !alreadyVoted && isOpen && !isAdmin && setSelected(c._id)}
                  aria-pressed={selected === c._id}
                >
                  <div className="vp-cand-avatar" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="vp-cand-info">
                    <h3 className="vp-cand-name">{c.fullName}</h3>
                    <div className="vp-cand-meta">
                      <span className="vp-cand-party">{c.partyId?.abbreviation || '—'}</span>
                      <span className="vp-cand-state">{c.state}</span>
                      <span className="vp-cand-position">{c.position}</span>
                    </div>
                    {c.partyId?.name && <p className="vp-cand-party-full">{c.partyId.name}</p>}
                  </div>
                  {selected === c._id && (
                    <div className="vp-selected-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                  {alreadyVoted && votedFor?._id === c._id && (
                    <div className="vp-your-vote" aria-label="Your vote">Your Vote</div>
                  )}
                </div>
              ))}
            </div>

            {/* Vote button */}
            {isOpen && !alreadyVoted && !isAdmin && (
              <div className="vp-vote-section">
                {!confirmed ? (
                  <button
                    className="vp-confirm-btn"
                    onClick={() => { if (!selected) { setError('Please select a candidate first.'); return } setConfirmed(true) }}
                    disabled={!selected}
                  >
                    Confirm Selection
                  </button>
                ) : (
                  <div className="vp-confirm-box">
                    <p className="vp-confirm-text">
                      You are about to vote for <strong>{election.candidates.find(c => c._id === selected)?.fullName}</strong>. This cannot be undone.
                    </p>
                    <div className="vp-confirm-btns">
                      <button className="vp-cancel-btn" onClick={() => setConfirmed(false)}>Cancel</button>
                      <button className="vp-cast-btn" onClick={handleVote} disabled={voting}>
                        {voting ? <span className="vp-spinner" aria-hidden="true" /> : (
                          <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Cast My Vote</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
