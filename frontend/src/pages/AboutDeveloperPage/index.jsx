import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './AboutDeveloperPage.css'

export default function AboutDeveloperPage() {
  return (
    <div className="adv-page">
      <Navbar />

      <div className="adv-hero">
        <div className="adv-hero-inner">
          <div className="adv-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1 className="adv-name">Chinonso Samuel</h1>
          <p className="adv-role">Computer Science Final Year Student</p>
          <p className="adv-school">Department of Computer Science · Faculty of Science</p>
        </div>
      </div>

      <div className="adv-content">

        {/* Project info */}
        <div className="adv-section">
          <h2 className="adv-section-title">Project Information</h2>
          <div className="adv-info-grid">
            <div className="adv-info-item">
              <span className="adv-info-label">Project Title</span>
              <span className="adv-info-value">Design and Implementation of a Frontend Electoral Result Portal Using React.js and Progressive Web Application Technologies</span>
            </div>
            <div className="adv-info-item">
              <span className="adv-info-label">Project Type</span>
              <span className="adv-info-value">Final Year Capstone Project (B.Sc. Computer Science)</span>
            </div>
            <div className="adv-info-item">
              <span className="adv-info-label">Academic Session</span>
              <span className="adv-info-value">2025/2026</span>
            </div>
            <div className="adv-info-item">
              <span className="adv-info-label">Inspiration</span>
              <span className="adv-info-value">INEC Nigeria's IReV (INEC Result Viewing) Portal</span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="adv-section">
          <h2 className="adv-section-title">Project Objectives</h2>
          <ul className="adv-list">
            {[
              'Design a responsive, accessible web portal simulating INEC\'s electoral result viewing system',
              'Implement secure authentication with JWT and two-factor email OTP verification',
              'Build role-based access control distinguishing between administrators and public users',
              'Develop a result management system supporting upload, filtering, and verification',
              'Create interactive data visualisations for election results using Chart.js',
              'Implement Progressive Web App (PWA) features for offline access',
              'Build a mock real-time voting and live result system to simulate the 2027 elections'
            ].map((item, i) => (
              <li className="adv-list-item" key={i}>
                <span className="adv-list-num">{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="adv-section">
          <h2 className="adv-section-title">Technology Stack</h2>
          <div className="adv-tech-grid">
            {[
              { name: 'React.js', desc: 'Frontend framework', cat: 'Frontend' },
              { name: 'Vite', desc: 'Build tool', cat: 'Frontend' },
              { name: 'React Router v6', desc: 'Client-side routing', cat: 'Frontend' },
              { name: 'Chart.js', desc: 'Data visualisation', cat: 'Frontend' },
              { name: 'Axios', desc: 'HTTP client', cat: 'Frontend' },
              { name: 'Node.js', desc: 'Runtime environment', cat: 'Backend' },
              { name: 'Express.js', desc: 'Web framework', cat: 'Backend' },
              { name: 'MongoDB', desc: 'Database', cat: 'Backend' },
              { name: 'Mongoose', desc: 'ODM library', cat: 'Backend' },
              { name: 'JWT', desc: 'Authentication', cat: 'Backend' },
              { name: 'Nodemailer', desc: 'Email service', cat: 'Backend' },
              { name: 'bcryptjs', desc: 'Password hashing', cat: 'Backend' }
            ].map(t => (
              <div className="adv-tech-card" key={t.name}>
                <span className="adv-tech-cat">{t.cat}</span>
                <span className="adv-tech-name">{t.name}</span>
                <span className="adv-tech-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acknowledgements */}
        <div className="adv-section adv-section--accent">
          <h2 className="adv-section-title">Acknowledgements</h2>
          <p className="adv-ack-text">
            This project was developed as part of the requirements for the award of a Bachelor's degree in Computer Science. Special appreciation goes to the project supervisor for their guidance, and to the Department of Computer Science for the opportunity to work on this capstone project.
          </p>
          <p className="adv-ack-text">
            This portal is purely an academic demonstration. It is not affiliated with, endorsed by, or representative of the Independent National Electoral Commission (INEC) of Nigeria. All data displayed is either historical (sourced from public records) or simulated for demonstration purposes.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
