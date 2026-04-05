import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2a5 5 0 00-5 5v3l-1.5 2h13L14 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconAdmin = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1L2 3.5v4C2 10.6 4.5 13.3 7.5 14c3-0.7 5.5-3.4 5.5-6.5v-4L7.5 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M5 7.5l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, role } = useAuth();
  const displayName = user?.name || user?.username || 'User';
  const initials    = displayName.charAt(0).toUpperCase();
  const isAdmin     = role === 'admin';

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">

        {/* ── Topbar ── */}
        <header className="dashboard-topbar dl-topbar">

          {/* Left — page identity */}
          <div className="topbar-left dl-topbar-left">
            {/* Mobile menu toggle — only visible on mobile */}
            <button
              className="dl-menu-btn"
              onClick={() => setSidebarOpen(p => !p)}
              aria-label="Toggle menu"
            >
              <IconMenu />
            </button>

            {/* Role badge + title */}
            <div className="dl-topbar-title-wrap">
              <div className={`dl-role-badge ${isAdmin ? 'dl-role-badge--admin' : 'dl-role-badge--user'}`}>
                {isAdmin ? <IconAdmin /> : <IconUser />}
                {isAdmin ? 'Admin' : 'User'}
              </div>
              <h4 className="dl-topbar-title">
                {isAdmin ? 'Admin Panel' : 'My Dashboard'}
              </h4>
            </div>
          </div>

          {/* Right — actions */}
          <div className="topbar-right dl-topbar-right">

            {/* Notification bell */}
            <button className="dl-icon-btn" title="Notifications" aria-label="Notifications">
              <IconBell />
              <span className="dl-notif-dot" />
            </button>

            {/* User avatar chip */}
            <div className="dl-user-chip">
              <div className="dl-user-avatar">{initials}</div>
              <div className="dl-user-info">
                <div className="dl-user-name">{displayName}</div>
                <div className="dl-user-role">{role}</div>
              </div>
            </div>

          </div>
        </header>

        {/* ── Main content ── */}
        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}