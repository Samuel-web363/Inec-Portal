import { Link } from 'react-router-dom';
export default function Unauthorized() {
  return (
    <div style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:'5rem',marginBottom:'1rem'}}>🔒</div>
      <h2 style={{color:'var(--inec-grey-800)',marginBottom:'0.75rem'}}>Access Denied</h2>
      <p style={{color:'var(--inec-grey-500)',maxWidth:400,marginBottom:'2rem'}}>You don't have permission to view this page.</p>
      <div style={{display:'flex',gap:'1rem'}}><Link to="/" className="btn btn-secondary">Home</Link><Link to="/login" className="btn btn-primary">Sign In</Link></div>
    </div>
  );
}