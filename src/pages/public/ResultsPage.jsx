import { useState } from 'react';
import {
  MOCK_PRESIDENTIAL_RESULTS,
  MOCK_SENATORIAL_RESULTS,
  MOCK_GUBERNATORIAL_RESULTS,
  MOCK_STATE_RESULTS,
  NIGERIA_STATES,
  ELECTION_TYPES,
  PARTIES,
} from '../../services/mockData';
import ResultCard from '../../components/results/ResultCard';
import HierarchyNav from '../../components/results/HierarchyNav';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { useDebounce } from '../../hooks/useDebounce';
import { formatFullNumber } from '../../utils/helpers';

// Map each election type to its dataset
const DATASETS = {
  Presidential:   MOCK_PRESIDENTIAL_RESULTS,
  Senatorial:     MOCK_SENATORIAL_RESULTS,
  Gubernatorial:  MOCK_GUBERNATORIAL_RESULTS,
};

export default function ResultsPage() {
  const [query,  setQuery]  = useState('');
  const [etype,  setEtype]  = useState('Presidential');
  const [party,  setParty]  = useState('ALL');
  const [state,  setState]  = useState('ALL');
  const [chart,  setChart]  = useState('bar');
  const [tab,    setTab]    = useState('cards');
  const debQ = useDebounce(query, 300);

  // Pick dataset based on election type
  const activeDataset = DATASETS[etype] || MOCK_PRESIDENTIAL_RESULTS;

  // Filter by search query + party + state
  const filtered = activeDataset.filter(c => {
    const matchQ = !debQ
      || c.candidate.toLowerCase().includes(debQ.toLowerCase())
      || c.party.toLowerCase().includes(debQ.toLowerCase())
      || (c.state || '').toLowerCase().includes(debQ.toLowerCase());
    const matchP  = party === 'ALL' || c.party === party;
    const matchSt = state === 'ALL' || (c.state || '') === state;
    return matchQ && matchP && matchSt;
  });

  const totalVotes = filtered.reduce((s, c) => s + c.votes, 0);

  return (
    <div>
      {/* Page header */}
      <div style={{background:'linear-gradient(135deg,#0d4a22,var(--inec-green))',padding:'2.5rem 0',color:'#fff'}}>
        <div className="container">
          <h2 style={{color:'#fff',marginBottom:8}}>🗳️ Election Results</h2>
          <p style={{color:'rgba(255,255,255,.8)'}}>
            Real-time collated results from {formatFullNumber(176846)} polling units across Nigeria
          </p>
        </div>
      </div>

      <div className="container" style={{padding:'2rem 1.5rem'}}>
        <HierarchyNav
          levels={['National', state !== 'ALL' ? state : null].filter(Boolean)}
          onNavigate={() => setState('ALL')}
        />

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          {/* Search */}
          <div className="form-group">
            <label className="form-label">Search</label>
            <div className="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Search candidate, party or state…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <span
                  onClick={() => setQuery('')}
                  style={{cursor:'pointer',color:'var(--inec-grey-400)',fontSize:'1rem'}}
                  title="Clear search"
                >✕</span>
              )}
            </div>
          </div>

          {/* Election Type */}
          <div className="form-group">
            <label className="form-label">Election Type</label>
            <select
              className="form-select"
              value={etype}
              onChange={e => { setEtype(e.target.value); setParty('ALL'); setState('ALL'); setQuery(''); }}
            >
              {ELECTION_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Party */}
          <div className="form-group">
            <label className="form-label">Party</label>
            <select
              className="form-select"
              value={party}
              onChange={e => setParty(e.target.value)}
            >
              <option value="ALL">All Parties</option>
              {PARTIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* State — all 37 */}
          <div className="form-group">
            <label className="form-label">State</label>
            <select
              className="form-select"
              value={state}
              onChange={e => setState(e.target.value)}
            >
              <option value="ALL">All States</option>
              {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Reset */}
          <div className="form-group">
            <label className="form-label" style={{visibility:'hidden'}}>Reset</label>
            <button
              className="btn btn-secondary"
              onClick={() => { setQuery(''); setParty('ALL'); setState('ALL'); }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tabs">
          <button className={`tab-btn${tab==='cards'?  ' active':''}`} onClick={() => setTab('cards')}>📋 Result Cards</button>
          <button className={`tab-btn${tab==='table'?  ' active':''}`} onClick={() => setTab('table')}>📄 Table</button>
          <button className={`tab-btn${tab==='charts'? ' active':''}`} onClick={() => setTab('charts')}>📊 Charts</button>
          <button className={`tab-btn${tab==='states'? ' active':''}`} onClick={() => setTab('states')}>🗺️ All States</button>
        </div>

        {/* ── Count line ── */}
        <p style={{color:'var(--inec-grey-500)',fontSize:'0.85rem',marginBottom:'1rem'}}>
          <strong style={{color:'var(--inec-grey-800)'}}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
          Election: <strong style={{color:'var(--inec-green)'}}>{etype}</strong> &nbsp;·&nbsp;
          Total votes: <strong style={{color:'var(--inec-grey-800)'}}>{formatFullNumber(totalVotes)}</strong>
        </p>

        {/* ── CARDS TAB ── */}
        {tab === 'cards' && (
          filtered.length > 0 ? (
            <div className="results-grid">
              {filtered.map((c, i) => (
                <ResultCard key={c.id} candidate={c} totalVotes={totalVotes} rank={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h4>No results found</h4>
              <p>Try adjusting your search or filters</p>
              <button className="btn btn-secondary" onClick={() => { setQuery(''); setParty('ALL'); setState('ALL'); }}>
                Clear Filters
              </button>
            </div>
          )
        )}

        {/* ── TABLE TAB ── */}
        {tab === 'table' && (
          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate</th>
                    <th>Party</th>
                    <th>State</th>
                    {etype === 'Senatorial' && <th>District</th>}
                    <th>Votes</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id}>
                      <td className="rank">{i + 1}</td>
                      <td><strong>{c.candidate}</strong></td>
                      <td><span className="badge badge-grey">{c.party}</span></td>
                      <td>{c.state}</td>
                      {etype === 'Senatorial' && <td style={{color:'var(--inec-grey-500)'}}>{c.district || '—'}</td>}
                      <td className="votes-cell">{formatFullNumber(c.votes)}</td>
                      <td>{totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CHARTS TAB ── */}
        {tab === 'charts' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
            <div className="card">
              <div className="card-header">
                <h4>Vote Distribution — {etype}</h4>
                <div className="chart-toggle">
                  <button className={`chart-toggle-btn${chart==='bar'?' active':''}`} onClick={() => setChart('bar')}>Bar</button>
                  <button className={`chart-toggle-btn${chart==='pie'?' active':''}`} onClick={() => setChart('pie')}>Pie</button>
                </div>
              </div>
              <div className="card-body">
                {filtered.length > 0
                  ? chart === 'bar'
                    ? <BarChart data={filtered} title={`${etype} — Votes`} />
                    : <PieChart data={filtered} title={`${etype} — Vote Share`} />
                  : <div className="empty-state"><div className="empty-state-icon">📊</div><p>No data to chart</p></div>
                }
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h4>Summary Table</h4></div>
              <div className="card-body">
                {filtered.map((c, i) => (
                  <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                    <div style={{width:24,textAlign:'center',fontWeight:700,color:'var(--inec-grey-500)'}}>{i + 1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'0.875rem'}}>{c.candidate}</div>
                      <div style={{fontSize:'0.75rem',color:'var(--inec-grey-500)'}}>{c.party} · {c.state}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:700,fontSize:'0.875rem'}}>{formatFullNumber(c.votes)}</div>
                      <div style={{fontSize:'0.72rem',color:'var(--inec-grey-400)'}}>
                        {totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ALL STATES TAB ── */}
        {tab === 'states' && (
          <div className="card">
            <div className="card-header">
              <h4>Results by State — All 37 (36 States + FCT)</h4>
              <span className="badge badge-green">{MOCK_STATE_RESULTS.length} States</span>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>State</th>
                    <th>Winner</th>
                    <th>APC Votes</th>
                    <th>PDP Votes</th>
                    <th>LP Votes</th>
                    <th>NNPP Votes</th>
                    <th>Registered</th>
                    <th>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STATE_RESULTS.map((s, i) => (
                    <tr key={s.state}>
                      <td className="rank">{i + 1}</td>
                      <td><strong>{s.state}</strong></td>
                      <td>
                        <span className="badge" style={{
                          background: s.winner==='APC'?'#1a3c6e22':s.winner==='PDP'?'#cc000022':s.winner==='LP'?'#228B2222':'#FF8C0022',
                          color: s.winner==='APC'?'#1a3c6e':s.winner==='PDP'?'#cc0000':s.winner==='LP'?'#228B22':'#FF8C00',
                        }}>
                          {s.winner}
                        </span>
                      </td>
                      <td style={{color:'#1a3c6e',fontWeight:600}}>{formatFullNumber(s.apc)}</td>
                      <td style={{color:'#cc0000',fontWeight:600}}>{formatFullNumber(s.pdp)}</td>
                      <td style={{color:'#228B22',fontWeight:600}}>{formatFullNumber(s.lp)}</td>
                      <td style={{color:'#FF8C00',fontWeight:600}}>{formatFullNumber(s.nnpp)}</td>
                      <td style={{color:'var(--inec-grey-500)'}}>{formatFullNumber(s.registered)}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div className="progress-bar" style={{width:80,margin:0}}>
                            <div className="progress-fill" style={{
                              width: `${s.uploaded}%`,
                              background: s.uploaded >= 90 ? 'var(--inec-green)' : s.uploaded >= 75 ? '#f59e0b' : 'var(--inec-red)',
                            }} />
                          </div>
                          <span style={{fontSize:'0.78rem',fontWeight:700,color: s.uploaded>=90?'var(--inec-green)':s.uploaded>=75?'#f59e0b':'var(--inec-red)'}}>
                            {s.uploaded}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}