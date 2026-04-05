import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { NIGERIA_STATES } from '../../services/mockData';

export default function UserProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', state: user?.state||'', bio:'' });
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const handleSave = async (ev) => {
    ev.preventDefault(); setLoading(true);
    await new Promise(r=>setTimeout(r,900));
    toast.success('Profile updated!'); setLoading(false);
  };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}><h3>My Profile</h3><p style={{color:'var(--inec-grey-500)',fontSize:'0.875rem'}}>Manage your account information</p></div>
      <div className="content-grid-2">
        <div className="card">
          <div className="card-header"><h4>Personal Information</h4></div>
          <div className="card-body">
            <div style={{display:'flex',alignItems:'center',gap:'1.5rem',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid var(--inec-grey-200)'}}>
              <div style={{width:80,height:80,borderRadius:'50%',background:'var(--inec-green)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:'1.5rem'}}>{getInitials(form.name||'U')}</div>
              <div><div style={{fontWeight:700,fontSize:'1.1rem'}}>{form.name}</div><div style={{color:'var(--inec-grey-500)',fontSize:'0.875rem'}}>{form.email}</div><span className="badge badge-green" style={{marginTop:6}}>{user?.role||'user'}</span></div>
            </div>
            <form style={{display:'flex',flexDirection:'column',gap:'1rem'}} onSubmit={handleSave}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={f('name')} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={f('email')} /></div>
              <div className="form-group"><label className="form-label">State</label>
                <select className="form-select" value={form.state} onChange={f('state')}>
                  <option value="">Select state</option>
                  {NIGERIA_STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" rows={3} placeholder="About yourself…" value={form.bio} onChange={f('bio')} style={{resize:'vertical'}} /></div>
              <button type="submit" className={`btn btn-primary${loading?' btn-loading':''}`} disabled={loading}>{loading?'':'Save Changes'}</button>
            </form>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h4>Account Security</h4></div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[['Email verified','✅'],['Two-factor auth','⚠️ Not enabled'],['Last login','Today']].map(([label,val])=>(
              <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'0.75rem',background:'var(--inec-grey-50)',borderRadius:8}}>
                <span style={{fontSize:'0.875rem',color:'var(--inec-grey-600)'}}>{label}</span>
                <span style={{fontSize:'0.875rem',fontWeight:600}}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}