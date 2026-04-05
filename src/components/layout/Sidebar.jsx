import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

// ── SVG Icons ────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconResults = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 7h8M5 10h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 12l1.5 1.5L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCharts = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 14L6.5 8.5l3.5 3L15 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6.5" cy="8.5" r="1.5" fill="currentColor"/>
    <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
  </svg>
);
const IconProfile = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 16c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconManageResults = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M1 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 9c1.7.4 3 2 3 3.9V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="13.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconUpload = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 12V4M5.5 7L9 3.5 12.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13.5v1A1.5 1.5 0 004.5 16h9a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 2c0 0-3 2.5-3 7s3 7 3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 2c0 0 3 2.5 3 7s-3 7-3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 6h13M2.5 12h13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.5 2"/>
  </svg>
);
const IconSignOut = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Nav links ────────────────────────────────────────────
const AdminLinks = [
  { to: '/admin/dashboard', Icon: IconDashboard,      label: 'Dashboard'       },
  { to: '/admin/results',   Icon: IconManageResults,  label: 'Manage Results'  },
  { to: '/admin/users',     Icon: IconUsers,           label: 'Manage Users'    },
  { to: '/admin/upload',    Icon: IconUpload,          label: 'Upload Results'  },
];
const UserLinks = [
  { to: '/user/dashboard',  Icon: IconDashboard, label: 'Dashboard'      },
  { to: '/user/results',    Icon: IconResults,   label: 'Browse Results' },
  { to: '/user/charts',     Icon: IconCharts,    label: 'Charts & Stats' },
  { to: '/user/profile',    Icon: IconProfile,   label: 'My Profile'     },
];

export default function Sidebar({ open, onClose }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const links = role === 'admin' ? AdminLinks : UserLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 89 }}
        />
      )}

      <aside className={`sidebar sb-sidebar${open ? ' open' : ''}`}>

        {/* ── Header ── */}
        <div className="sidebar-header sb-header">
          <div className="sb-header-logo-wrap">
            <img
              src="https://www.inecnigeria.org/wp-content/uploads/2019/07/inec-logo.png"
              alt="INEC"
              className="sb-header-img"
              onError={e => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%231a7a3c'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='22' font-weight='bold' font-family='Arial'%3EINEC%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="sidebar-header-text">
            <div className="title">INEC Portal</div>
            <div className="sub">{role === 'admin' ? 'Admin Panel' : 'User Panel'}</div>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="sidebar-nav sb-nav">
          <div className="sidebar-section-title">Navigation</div>

          {links.map(({ to, Icon, label }) => (
            <NavLink
              key={to} to={to} onClick={onClose}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sb-link-icon"><Icon /></span>
              <span className="sb-link-label">{label}</span>
            </NavLink>
          ))}

          <div className="sidebar-section-title" style={{ marginTop: '1.25rem' }}>Public</div>
          <NavLink
            to="/results" onClick={onClose}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sb-link-icon"><IconGlobe /></span>
            <span className="sb-link-label">Public Results</span>
          </NavLink>
        </nav>

        {/* ── Footer ── */}
        <div className="sidebar-footer sb-footer">
          <div className="sidebar-user sb-user">
            <div className="sidebar-user-avatar sb-avatar">
              {getInitials(user?.name || user?.username || 'U')}
            </div>
            <div className="sidebar-user-info">
              <div className="name">{user?.name || user?.username}</div>
              <div className="role">{role}</div>
            </div>
          </div>

          <button className="sb-signout" onClick={handleLogout}>
            <IconSignOut />
            Sign Out
          </button>
        </div>

      </aside>
    </>
  );
}