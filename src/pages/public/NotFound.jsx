import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:'5rem',marginBottom:'1rem'}}>🗳️</div>
      <h1 style={{fontSize:'4rem',fontWeight:800,color:'var(--inec-grey-200)',marginBottom:'0.5rem'}}>404</h1>
      <h2 style={{color:'var(--inec-grey-800)',marginBottom:'0.75rem'}}>Page Not Found</h2>
      <p style={{color:'var(--inec-grey-500)',maxWidth:400,marginBottom:'2rem'}}>This ballot has gone missing. Let's get you back on track.</p>
      <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
    </div>
  );
}