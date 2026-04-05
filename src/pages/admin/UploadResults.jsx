import { useState } from 'react';
import { toast } from 'react-toastify';
import { NIGERIA_STATES, ELECTION_TYPES } from '../../services/mockData';

export default function UploadResults() {
  const [form, setForm] = useState({ state:'', lga:'', ward:'', puCode:'', electionType:'Presidential', candidate:'', party:'', votes:'', accredited:'' });
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.state || !form.candidate || !form.votes) { toast.error('State, candidate, and votes are required'); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,1200)); // simulate upload
    setUploaded(p=>[...p,{...form,id:Date.now(),uploadedAt:new Date().toLocaleTimeString()}]);
    toast.success('Result uploaded successfully!');
    setForm(p=>({...p,candidate:'',party:'',votes:'',accredited:'',puCode:''}));
    setLoading(false);
  };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}><h3>Upload Results</h3><p style={{color:'var(--inec-grey-500)',fontSize:'0.875rem'}}>Submit verified result data from polling units</p></div>
      <div className="content-grid-2">
        <div className="card">
          <div className="card-header"><h4>📤 New Result Entry</h4></div>
          <div className="card-body">
            <form style={{display:'flex',flexDirection:'column',gap:'1rem'}} onSubmit={handleSubmit}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group"><label className="form-label">Election Type</label>
                  <select className="form-select" value={form.electionType} onChange={f('electionType')}>
                    {ELECTION_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">State *</label>
                  <select className="form-select" value={form.state} onChange={f('state')}>
                    <option value="">Select state</option>
                    {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">LGA</label><input className="form-input" placeholder="Local Govt Area" value={form.lga} onChange={f('lga')} /></div>
                <div className="form-group"><label className="form-label">Ward</label><input className="form-input" placeholder="Ward name" value={form.ward} onChange={f('ward')} /></div>
                <div className="form-group"><label className="form-label">PU Code</label><input className="form-input" placeholder="Polling unit code" value={form.puCode} onChange={f('puCode')} /></div>
                <div className="form-group"><label className="form-label">Party</label><input className="form-input" placeholder="APC / PDP / LP…" value={form.party} onChange={f('party')} /></div>
              </div>
              <div className="form-group"><label className="form-label">Candidate Name *</label><input className="form-input" placeholder="Full name" value={form.candidate} onChange={f('candidate')} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group"><label className="form-label">Total Votes *</label><input className="form-input" type="number" min="0" placeholder="0" value={form.votes} onChange={f('votes')} /></div>
                <div className="form-group"><label className="form-label">Accredited Voters</label><input className="form-input" type="number" min="0" placeholder="0" value={form.accredited} onChange={f('accredited')} /></div>
              </div>
              <button type="submit" className={`btn btn-primary${loading?' btn-loading':''}`} disabled={loading}>{loading?'':'Upload Result'}</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h4>✅ Recent Uploads ({uploaded.length})</h4></div>
          <div className="card-body" style={{padding:0}}>
            {uploaded.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">📭</div><p>No uploads yet in this session</p></div>
            ) : uploaded.slice().reverse().map(u=>(
              <div key={u.id} style={{padding:'1rem 1.5rem',borderBottom:'1px solid var(--inec-grey-100)'}}>
                <div style={{fontWeight:600,fontSize:'0.875rem'}}>{u.candidate} — {u.party}</div>
                <div style={{fontSize:'0.78rem',color:'var(--inec-grey-500)'}}>{u.state}{u.lga?` › ${u.lga}`:''} · {Number(u.votes).toLocaleString()} votes · {u.uploadedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}