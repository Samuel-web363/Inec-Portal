import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './SystemDocsPage.css'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'auth', label: 'Authentication' },
  { id: 'roles', label: 'User Roles' },
  { id: 'voting', label: 'Mock Voting' },
  { id: 'api', label: 'API Reference' },
  { id: 'database', label: 'Database Models' }
]

export default function SystemDocsPage() {
  const [active, setActive] = useState('overview')

  return (
    <div className="sd-page">
      <Navbar />
      <div className="sd-layout">

        {/* Sidebar nav */}
        <nav className="sd-nav" aria-label="Documentation sections">
          <h2 className="sd-nav-title">Documentation</h2>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`sd-nav-item ${active === s.id ? 'sd-nav-item--active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="sd-content">

          {active === 'overview' && (
            <section>
              <h1 className="sd-title">System Overview</h1>
              <p className="sd-text">
                The IReV Portal is a full-stack web application that simulates Nigeria's INEC (Independent National Electoral Commission) Result Viewing system. It demonstrates how election results can be securely uploaded, verified, filtered, visualised, and publicly viewed.
              </p>
              <p className="sd-text">
                The system follows a client-server architecture with a React.js single-page application frontend communicating with a Node.js/Express REST API backend, backed by a MongoDB database.
              </p>
              <div className="sd-feature-grid">
                {[
                  { title: 'Result Management', desc: 'Upload, filter, search, and verify election results across states, LGAs, and wards' },
                  { title: 'Two-Factor Auth', desc: 'Email-based OTP verification for both registration and login' },
                  { title: 'Role-Based Access', desc: 'Separate admin and public user permissions throughout the system' },
                  { title: 'Data Visualisation', desc: 'Interactive bar, doughnut, and line charts powered by Chart.js' },
                  { title: 'Mock Voting (2027)', desc: 'Real-time vote casting and live result tracking with auto-refresh' },
                  { title: 'PWA Support', desc: 'Offline caching and installable app experience' }
                ].map(f => (
                  <div className="sd-feature" key={f.title}>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === 'architecture' && (
            <section>
              <h1 className="sd-title">System Architecture</h1>
              <p className="sd-text">The system is split into two independently deployable parts:</p>

              <div className="sd-arch-diagram">
                <div className="sd-arch-box sd-arch-box--client">
                  <span className="sd-arch-label">Client</span>
                  <strong>React.js SPA</strong>
                  <span className="sd-arch-sub">Vite · React Router · Chart.js</span>
                </div>
                <div className="sd-arch-arrow">⇄ HTTPS / REST ⇄</div>
                <div className="sd-arch-box sd-arch-box--server">
                  <span className="sd-arch-label">Server</span>
                  <strong>Node.js + Express API</strong>
                  <span className="sd-arch-sub">JWT Auth · Nodemailer · bcrypt</span>
                </div>
                <div className="sd-arch-arrow">⇄ Mongoose ODM ⇄</div>
                <div className="sd-arch-box sd-arch-box--db">
                  <span className="sd-arch-label">Database</span>
                  <strong>MongoDB</strong>
                  <span className="sd-arch-sub">Users · Results · Candidates · Parties · Elections · Votes</span>
                </div>
              </div>

              <h3 className="sd-subtitle">Deployment</h3>
              <ul className="sd-ul">
                <li><strong>Frontend</strong> — Vercel, with SPA rewrite rules for client-side routing</li>
                <li><strong>Backend</strong> — Render, with a keep-alive ping every 14 minutes to prevent cold starts</li>
                <li><strong>Database</strong> — MongoDB Atlas (cloud) or local MongoDB for development</li>
              </ul>
            </section>
          )}

          {active === 'auth' && (
            <section>
              <h1 className="sd-title">Authentication Flow</h1>
              <p className="sd-text">The system uses a two-step authentication process for both registration and login:</p>

              <h3 className="sd-subtitle">Registration</h3>
              <ol className="sd-ol">
                <li>User submits full name, email, NIN, and password</li>
                <li>Password is hashed with SHA-256 client-side before transmission</li>
                <li>Backend hashes the received value again with bcrypt before storage</li>
                <li>A 6-digit OTP is generated and emailed (expires in 10 minutes)</li>
                <li>User enters the OTP to verify their account</li>
              </ol>

              <h3 className="sd-subtitle">Login</h3>
              <ol className="sd-ol">
                <li>User submits email and password (SHA-256 hashed)</li>
                <li>Backend compares against the stored bcrypt hash</li>
                <li>A second OTP is generated and emailed for login verification</li>
                <li>User enters OTP — backend issues a JWT (7-day expiry)</li>
                <li>Frontend decodes the JWT and stores it in localStorage</li>
              </ol>

              <h3 className="sd-subtitle">Password Reset</h3>
              <p className="sd-text">Users can reset forgotten passwords via a 3-step flow: email entry → OTP verification → new password submission, each with its own OTP type to prevent token reuse across flows.</p>
            </section>
          )}

          {active === 'roles' && (
            <section>
              <h1 className="sd-title">User Roles & Permissions</h1>
              <p className="sd-text">
                Roles are <strong>not</strong> returned by the API directly. Instead, the frontend maintains a <code>roleMap</code> in localStorage, assigning <code>admin</code> to any email matching the <code>VITE_ADMIN_EMAILS</code> environment variable at registration time. The backend independently stores and verifies the role on the user document.
              </p>

              <div className="sd-roles-grid">
                <div className="sd-role-card">
                  <h3>Public User</h3>
                  <ul className="sd-ul">
                    <li>View election results with filters</li>
                    <li>View candidate and party profiles</li>
                    <li>View personal dashboard with charts</li>
                    <li>Vote once per mock election</li>
                    <li>View live election results</li>
                    <li>Generate personal voter card</li>
                    <li>Update own profile</li>
                  </ul>
                </div>
                <div className="sd-role-card sd-role-card--admin">
                  <h3>Administrator</h3>
                  <ul className="sd-ul">
                    <li>All public user permissions (except voting)</li>
                    <li>Upload, edit, and delete election results</li>
                    <li>Manage candidates and parties (CRUD)</li>
                    <li>View and deactivate registered users</li>
                    <li>View system-wide activity logs</li>
                    <li>Create, open, and close mock elections</li>
                    <li>Receive admin-only analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {active === 'voting' && (
            <section>
              <h1 className="sd-title">Mock Voting System (2027)</h1>
              <p className="sd-text">
                The mock voting module simulates a real-time electoral process for the 2027 elections. It is fully separate from the historical result-viewing module.
              </p>

              <h3 className="sd-subtitle">Election Lifecycle</h3>
              <div className="sd-lifecycle">
                <div className="sd-lifecycle-step">
                  <span className="sd-lifecycle-badge">1</span>
                  <div><strong>Upcoming</strong><p>Admin creates an election and selects participating candidates</p></div>
                </div>
                <div className="sd-lifecycle-step">
                  <span className="sd-lifecycle-badge sd-lifecycle-badge--live">2</span>
                  <div><strong>Open / Live</strong><p>Admin opens voting — registered users receive an email notification and can cast one vote each</p></div>
                </div>
                <div className="sd-lifecycle-step">
                  <span className="sd-lifecycle-badge sd-lifecycle-badge--closed">3</span>
                  <div><strong>Closed</strong><p>Admin closes voting — results become final, no further votes accepted</p></div>
                </div>
              </div>

              <h3 className="sd-subtitle">Vote Integrity</h3>
              <ul className="sd-ul">
                <li>A unique compound index on <code>(electionId, userId)</code> prevents duplicate votes at the database level</li>
                <li>Administrators are blocked from voting at the API level</li>
                <li>Live results poll every 10 seconds while an election is open</li>
                <li>Vote percentages and leader status are computed server-side via aggregation</li>
              </ul>
            </section>
          )}

          {active === 'api' && (
            <section>
              <h1 className="sd-title">API Reference</h1>
              {[
                {
                  group: 'Authentication', base: '/api/auth', routes: [
                    ['POST', '/register', 'Register a new user'],
                    ['POST', '/verify-otp', 'Verify registration OTP'],
                    ['POST', '/login', 'Login (sends OTP)'],
                    ['POST', '/login-verify-otp', 'Verify login OTP, returns JWT'],
                    ['POST', '/resend-otp', 'Resend OTP code'],
                    ['POST', '/forgot-password', 'Request password reset OTP'],
                    ['POST', '/verify-reset-otp', 'Verify password reset OTP'],
                    ['POST', '/reset-password', 'Set new password']
                  ]
                },
                {
                  group: 'Results', base: '/api/results', routes: [
                    ['GET', '/', 'List results (filterable, paginated)'],
                    ['GET', '/summary', 'Aggregated dashboard statistics'],
                    ['POST', '/', 'Upload new result (admin)'],
                    ['PUT', '/:id', 'Update result (admin)'],
                    ['DELETE', '/:id', 'Delete result (admin)']
                  ]
                },
                {
                  group: 'Candidates & Parties', base: '/api/candidates · /api/parties', routes: [
                    ['GET', '/', 'List all (authenticated)'],
                    ['POST', '/', 'Create (admin)'],
                    ['PUT', '/:id', 'Update (admin)'],
                    ['DELETE', '/:id', 'Delete (admin)']
                  ]
                },
                {
                  group: 'Users', base: '/api/users', routes: [
                    ['GET', '/', 'List all users (admin)'],
                    ['GET', '/activity-logs', 'System activity logs (admin)'],
                    ['PUT', '/:id/deactivate', 'Deactivate a user (admin)']
                  ]
                },
                {
                  group: 'Elections', base: '/api/elections', routes: [
                    ['GET', '/', 'List all elections'],
                    ['GET', '/:id', 'Get election with candidates'],
                    ['GET', '/:id/results', 'Live vote counts and percentages'],
                    ['GET', '/:id/my-vote', 'Check if current user has voted'],
                    ['POST', '/:id/vote', 'Cast a vote'],
                    ['POST', '/', 'Create election (admin)'],
                    ['PUT', '/:id/open', 'Open voting + notify users (admin)'],
                    ['PUT', '/:id/close', 'Close voting (admin)']
                  ]
                },
                {
                  group: 'Profile', base: '/api/profile', routes: [
                    ['GET', '/', 'Get current user profile'],
                    ['PUT', '/', 'Update profile']
                  ]
                }
              ].map(g => (
                <div className="sd-api-group" key={g.group}>
                  <h3 className="sd-subtitle">{g.group}</h3>
                  <p className="sd-api-base">Base: <code>{g.base}</code></p>
                  <table className="sd-api-table">
                    <tbody>
                      {g.routes.map(([method, path, desc]) => (
                        <tr key={path}>
                          <td><span className={`sd-method sd-method--${method.toLowerCase()}`}>{method}</span></td>
                          <td><code>{path}</code></td>
                          <td className="sd-api-desc">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>
          )}

          {active === 'database' && (
            <section>
              <h1 className="sd-title">Database Models</h1>
              {[
                { name: 'User', fields: ['fullName', 'email (unique)', 'passwordHash', 'nin', 'isVerified', 'otpCode', 'otpExpiry', 'otpType', 'role (user/admin)', 'isActive', 'lastLogin', 'createdAt'] },
                { name: 'Result', fields: ['electionType', 'electionDate', 'state', 'lga', 'ward', 'pollingUnit', 'partyId (ref)', 'candidateId (ref)', 'votesReceived', 'uploadedBy (ref)', 'verifiedStatus', 'createdAt'] },
                { name: 'Candidate', fields: ['fullName', 'partyId (ref)', 'state', 'position', 'photoUrl', 'bio', 'isActive', 'createdAt'] },
                { name: 'Party', fields: ['name', 'abbreviation', 'logoUrl', 'description', 'isActive', 'createdAt'] },
                { name: 'ActivityLog', fields: ['userId (ref)', 'action', 'targetResource', 'ipAddress', 'timestamp'] },
                { name: 'Election', fields: ['title', 'description', 'electionType', 'year', 'status (upcoming/open/closed)', 'candidates (ref array)', 'createdBy (ref)', 'openedAt', 'closedAt', 'createdAt'] },
                { name: 'Vote', fields: ['electionId (ref)', 'candidateId (ref)', 'userId (ref)', 'castedAt', '— unique index on (electionId, userId)'] }
              ].map(m => (
                <div className="sd-model" key={m.name}>
                  <h3 className="sd-subtitle">{m.name}</h3>
                  <div className="sd-fields">
                    {m.fields.map(f => <span className="sd-field" key={f}>{f}</span>)}
                  </div>
                </div>
              ))}
            </section>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}
