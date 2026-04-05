import { useState } from 'react';
import { toast } from 'react-toastify';
import { MOCK_PRESIDENTIAL_RESULTS, NIGERIA_STATES, ELECTION_TYPES } from '../../services/mockData';
import { formatFullNumber } from '../../utils/helpers';

export default function ManageResults() {
  const [results, setResults] = useState(MOCK_PRESIDENTIAL_RESULTS);
  const [modal, setModal]     = useState(false);
  const [form,  setForm]      = useState({ candidate:'', party:'', state:'', votes:'', electionType:'Presidential' });
  const [editId, setEditId]   = useState(null);

  const openAdd  = () => { setForm({ candidate:'',party:'',state:'',votes:'',electionType:'Presidential'}); setEditId(null); setModal(true); };
  const openEdit = (r) => { setForm({...r,votes:String(r.votes)}); setEditId(r.id); setModal(true); };
  const closeModal = () => setModal(false);

  const handleSave = () => {
    if (!form.candidate || !form.party || !form.votes) { toast.error('Fill all required fields'); return; }
    if (editId) {
      setResults(p=>p.map(r=>r.id===editId?{...r,...form,votes:Number(form.votes)}:r));
      toast.success('Result updated');
    } else {
      setResults(p=>[...p,{...form,votes:Number(form.votes),id:Date.now()}]);
      toast.success('Result added');
    }
    setModal(false);
  };

  const handleDelete = (id) => { setResults(p=>p.filter(r=>r.id!==id)); toast.info('Result removed'); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div><h3>Manage Results</h3><p style={{color:'var(--inec-grey-500)',fontSize:'0.875rem'}}>Add, edit, or remove election result entries</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Result</button>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>#</th><th>Candidate</th><th>Party</th><th>State</th><th>Votes</th><th>Actions</th></tr></thead>
            <tbody>
              {results.map((r,i)=>(
                <tr key={r.id}>
                  <td>{i+1}</td>
                  <td><strong>{r.candidate}</strong></td>
                  <td><span className="badge badge-grey">{r.party}</span></td>
                  <td>{r.state}</td>
                  <td className="votes-cell">{formatFullNumber(r.votes)}</td>
                  <td style={{display:'flex',gap:8}}>
                    <button className="btn btn-sm btn-secondary" onClick={()=>openEdit(r)}>✏️ Edit</button>
                    <button className="btn btn-sm btn-danger"    onClick={()=>handleDelete(r.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h4>{editId?'Edit Result':'Add Result'}</h4><button className="btn btn-ghost btn-icon" onClick={closeModal}>✕</button></div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {[['Candidate Name','candidate','text'],['Party','party','text'],['Votes','votes','number']].map(([lbl,key,type])=>(
                <div key={key} className="form-group">
                  <label className="form-label">{lbl}</label>
                  <input className="form-input" type={type} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))}>
                  <option value="">Select state</option>
                  {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Election Type</label>
                <select className="form-select" value={form.electionType} onChange={e=>setForm(p=>({...p,electionType:e.target.value}))}>
                  {ELECTION_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary"  onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}