import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
            </div>
        )
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate home based on role
        if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
        if (user?.role === 'DRIVER') return <Navigate to="/driver/dashboard" replace />
        return <Navigate to="/dashboard" replace />
    }

    return children
}
