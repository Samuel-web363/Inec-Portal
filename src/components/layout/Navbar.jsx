import { useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { getInitials } from '../../utils/helpers';

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();
  useClickOutside(dropRef, () => setDropOpen(false));

  const handleLogout = () => { logout(); navigate('/'); };
  const dashLink = role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="https://www.inecnigeria.org/wp-content/uploads/2019/07/inec-logo.png"
               alt="INEC Logo" onError={e => { e.target.style.display='none'; }} />
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">INEC Result Portal</span>
            <span className="navbar-brand-sub">Independent National Electoral Commission</span>
          </div>
        </Link>

        <div className="navbar-links">
          <NavLink to="/"        className={({isActive})=>`nav-link${isActive?' active':''}`} end>Home</NavLink>
          <NavLink to="/results" className={({isActive})=>`nav-link${isActive?' active':''}`}>Results</NavLink>
          <NavLink to="/about"   className={({isActive})=>`nav-link${isActive?' active':''}`}>About</NavLink>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="dropdown" ref={dropRef}>
              <button className="btn btn-ghost flex items-center gap-2"
                      onClick={() => setDropOpen(p => !p)}>
                <div style={{width:34,height:34,borderRadius:'50%',background:'var(--inec-green)',
                             display:'flex',alignItems:'center',justifyContent:'center',
                             color:'#fff',fontWeight:700,fontSize:'0.8rem'}}>
                  {getInitials(user?.name || user?.username || 'U')}
                </div>
                <span style={{fontSize:'0.875rem',fontWeight:600,color:'var(--inec-grey-700)'}}>
                  {user?.name || user?.username}
                </span>
                <span style={{fontSize:'0.7rem'}}>▾</span>
              </button>
              {dropOpen && (
                <div className="dropdown-menu">
                  <div style={{padding:'0.75rem 1rem',borderBottom:'1px solid var(--inec-grey-100)'}}>
                    <div style={{fontWeight:700,fontSize:'0.875rem',color:'var(--inec-grey-900)'}}>{user?.name || user?.username}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--inec-grey-400)',textTransform:'capitalize'}}>{role}</div>
                  </div>
                  <div className="dropdown-item" onClick={()=>{navigate(dashLink);setDropOpen(false);}}>📊 Dashboard</div>
                  <div className="dropdown-item" onClick={()=>{navigate('/user/profile');setDropOpen(false);}}>👤 Profile</div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item danger" onClick={handleLogout}>🚪 Sign Out</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
          <button className="navbar-mobile-toggle" onClick={()=>setMobileOpen(p=>!p)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <div className={`navbar-mobile-menu${mobileOpen?' open':''}`}>
        <NavLink to="/"        className="nav-link" onClick={()=>setMobileOpen(false)} end>Home</NavLink>
        <NavLink to="/results" className="nav-link" onClick={()=>setMobileOpen(false)}>Results</NavLink>
        <NavLink to="/about"   className="nav-link" onClick={()=>setMobileOpen(false)}>About</NavLink>
        {!isAuthenticated && <>
          <Link to="/login"    className="btn btn-ghost btn-sm" onClick={()=>setMobileOpen(false)}>Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm" onClick={()=>setMobileOpen(false)}>Register</Link>
        </>}
      </div>
    </nav>
  );
}