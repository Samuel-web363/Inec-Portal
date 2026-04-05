import { useState } from 'react';
import { toast } from 'react-toastify';
import { getInitials } from '../../utils/helpers';

const MOCK_USERS = [
  { id:1, name:'Emeka Okafor',   email:'emeka@example.com',  role:'user',  state:'Anambra', joined:'2024-01-10', status:'active' },
  { id:2, name:'Fatima Al-Hassan',email:'fatima@example.com',role:'user',  state:'Kano',    joined:'2024-01-12', status:'active' },
  { id:3, name:'Tunde Adeyemi',  email:'tunde@example.com',  role:'admin', state:'Lagos',   joined:'2024-01-08', status:'active' },
  { id:4, name:'Ngozi Eze',      email:'ngozi@example.com',  role:'user',  state:'Enugu',   joined:'2024-01-15', status:'inactive' },
  { id:5, name:'Musa Ibrahim',   email:'musa@example.com',   role:'user',  state:'Kaduna',  joined:'2024-01-20', status:'active' },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const toggleStatus = (id) => { setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==='active'?'inactive':'active'}:u)); toast.info('Status updated'); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div><h3>Manage Users</h3><p style={{color:'var(--inec-grey-500)',fontSize:'0.875rem'}}>{users.length} registered users</p></div>
        <div className="search-bar" style={{width:280}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>State</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:'var(--inec-green)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'0.8rem'}}>{getInitials(u.name)}</div>
                    <strong>{u.name}</strong>
                  </div></td>
                  <td style={{color:'var(--inec-grey-500)'}}>{u.email}</td>
                  <td><span className={`badge ${u.role==='admin'?'badge-blue':'badge-grey'}`}>{u.role}</span></td>
                  <td>{u.state}</td>
                  <td style={{color:'var(--inec-grey-500)'}}>{u.joined}</td>
                  <td><span className={`badge ${u.status==='active'?'badge-green':'badge-red'}`}>{u.status}</span></td>
                  <td><button className="btn btn-sm btn-secondary" onClick={()=>toggleStatus(u.id)}>{u.status==='active'?'Deactivate':'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}