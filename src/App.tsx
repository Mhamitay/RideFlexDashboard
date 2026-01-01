import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './components/Login'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
