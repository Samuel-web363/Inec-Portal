import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { isAuthenticated, getCurrentUser } from '../../api/auth'
import './AboutPage.css'

export default function AboutPage() {
  const auth = isAuthenticated()
  const user = getCurrentUser()

  return (
    <div className="ab-page">
      <Navbar />

      <div className="ab-hero">
        <div className="ab-hero-inner">
          <h1 className="ab-hero-title">About the IReV Portal</h1>
          <p className="ab-hero-sub">Understanding the purpose and scope of this electoral result system</p>
        </div>
      </div>

      <div className="ab-content">
        {/* Disclaimer */}
        <div className="ab-notice">
          <div className="ab-notice-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </div>
          <div>
            <strong>Academic Disclaimer:</strong> This portal is a student demonstration project built for educational purposes. Results displayed are simulated and do not represent actual electoral outcomes. This system is not affiliated with the official INEC Nigeria.
          </div>
        </div>

        <div className="ab-grid">
          <div className="ab-section">
            <h2 className="ab-section-title">What is the IReV Portal?</h2>
            <p>The INEC Result Viewing (IReV) Portal is a full-stack web application simulating Nigeria's Independent National Electoral Commission result viewing system. It demonstrates how election results can be uploaded, managed, and publicly viewed in a transparent and accessible manner.</p>
            <p>The project was built as a final-year Computer Science capstone, incorporating modern web technologies including React.js, Node.js, Express, MongoDB, and Progressive Web App capabilities.</p>
          </div>

          <div className="ab-section">
            <h2 className="ab-section-title">Core Objectives</h2>
            <ul className="ab-list">
              {[
                'Demonstrate transparent result publishing and public access',
                'Implement role-based access control (admin vs public users)',
                'Provide multi-level filtering across state, LGA, ward, party, and candidate',
                'Visualise electoral data through interactive charts',
                'Support Progressive Web App features including offline access',
                'Apply secure authentication via JWT and email OTP verification'
              ].map((item, i) => (
                <li className="ab-list-item" key={i}>
                  <span className="ab-list-dot" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="ab-section">
            <h2 className="ab-section-title">Technology Stack</h2>
            <div className="ab-tech-grid">
              {[
                { cat: 'Frontend', items: ['React.js (Vite)', 'React Router v6', 'Chart.js / react-chartjs-2', 'Custom CSS (no Tailwind)', 'Axios'] },
                { cat: 'Backend', items: ['Node.js + Express.js', 'MongoDB + Mongoose', 'JWT Authentication', 'Brevo SMTP (OTP)', 'bcryptjs'] },
                { cat: 'Deployment', items: ['Vercel (Frontend)', 'Render (Backend)', 'MongoDB Atlas (Database)'] },
                { cat: 'PWA', items: ['vite-plugin-pwa', 'Service Worker', 'Offline caching', 'Web App Manifest'] }
              ].map(group => (
                <div className="ab-tech-card" key={group.cat}>
                  <h3 className="ab-tech-title">{group.cat}</h3>
                  <ul className="ab-tech-list">
                    {group.items.map(item => (
                      <li key={item} className="ab-tech-item">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-section">
            <h2 className="ab-section-title">How to Use the Portal</h2>
            <div className="ab-steps">
              {[
                { step: '1', title: 'Create an Account', desc: 'Register with your name, email, NIN, and password. Verify your email via the OTP sent to your inbox.' },
                { step: '2', title: 'Log In Securely', desc: 'Log in with your credentials. A second OTP is sent for login verification, ensuring two-factor security.' },
                { step: '3', title: 'Browse Results', desc: 'Access the Results page to view all uploaded election results. Use filters to narrow by state, LGA, party, or candidate.' },
                { step: '4', title: 'View Analytics', desc: 'Your dashboard shows charts and statistics including votes per party, results by state, and upload timelines.' }
              ].map(s => (
                <div className="ab-step" key={s.step}>
                  <div className="ab-step-num" aria-hidden="true">{s.step}</div>
                  <div>
                    <h3 className="ab-step-title">{s.title}</h3>
                    <p className="ab-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ab-cta">
          <h2 className="ab-cta-title">
            {auth ? `Welcome back, ${user?.fullName?.split(' ')[0] || 'User'}!` : 'Ready to get started?'}
          </h2>
          <p className="ab-cta-sub">
            {auth ? 'Continue exploring the portal' : 'Create a free account to access the full portal'}
          </p>
          <div className="ab-cta-btns">
            {auth ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="ab-cta-primary">
                  Go to Dashboard
                </Link>
                <Link to="/elections" className="ab-cta-secondary">
                  Vote Now — 2027
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="ab-cta-primary">Create Account</Link>
                <Link to="/results" className="ab-cta-secondary">View Results</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
