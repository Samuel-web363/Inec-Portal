import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import api from './api/axios'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResultsPage from './pages/ResultsPage'
import AboutPage from './pages/AboutPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CandidatePage from './pages/CandidatePage'
import PartyPage from './pages/PartyPage'
import ProfilePage from './pages/ProfilePage'
import ResultUploadPage from './pages/ResultUploadPage'
import UserManagementPage from './pages/UserManagementPage'
import ActivityLogPage from './pages/ActivityLogPage'
import ElectionsListPage from './pages/ElectionsListPage'
import VotingPage from './pages/VotingPage'
import LiveResultsPage from './pages/LiveResultsPage'
import AdminElectionsPage from './pages/AdminElectionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import VoterCardPage from './pages/VoterCardPage'
import AboutDeveloperPage from './pages/AboutDeveloperPage'
import SystemDocsPage from './pages/SystemDocsPage'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  useEffect(() => {
    const ping = () => api.get('/api/health').catch(() => {})
    ping()
    const interval = setInterval(ping, 840000)
    return () => clearInterval(interval)
  }, [])

  // Apply saved dark mode preference on load
  useEffect(() => {
    if (localStorage.getItem('inec_dark') === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about-developer" element={<AboutDeveloperPage />} />
        <Route path="/docs" element={<SystemDocsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Elections — protected */}
        <Route path="/elections" element={<PrivateRoute><ElectionsListPage /></PrivateRoute>} />
        <Route path="/elections/:id/vote" element={<PrivateRoute><VotingPage /></PrivateRoute>} />
        <Route path="/elections/:id/live" element={<PrivateRoute><LiveResultsPage /></PrivateRoute>} />

        {/* Protected — logged-in users */}
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/candidates" element={<PrivateRoute><CandidatePage /></PrivateRoute>} />
        <Route path="/parties" element={<PrivateRoute><PartyPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/voter-card" element={<PrivateRoute><VoterCardPage /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/results/upload" element={<AdminRoute><ResultUploadPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
        <Route path="/admin/logs" element={<AdminRoute><ActivityLogPage /></AdminRoute>} />
        <Route path="/admin/elections" element={<AdminRoute><AdminElectionsPage /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
