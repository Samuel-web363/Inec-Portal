import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, getCurrentUser } from '../../api/auth'

export default function AdminRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  const user = getCurrentUser()
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}
