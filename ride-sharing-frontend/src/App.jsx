import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import BookRide from './pages/customer/BookRide'
import RideTracking from './pages/customer/RideTracking'
import RideHistory from './pages/customer/RideHistory'

// Driver pages
import DriverDashboard from './pages/driver/DriverDashboard'
import DriverRides from './pages/driver/DriverRides'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'

// Shared pages
import Profile from './pages/shared/Profile'

// Protected route (role-aware)
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
    const { isAuthenticated, isAdmin, isDriver, isUser } = useAuth()

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? '/admin' : isDriver ? '/driver/dashboard' : '/dashboard'} />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={isAdmin ? '/admin' : isDriver ? '/driver/dashboard' : '/dashboard'} />} />

            {/* Customer routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['USER']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/book" element={<ProtectedRoute allowedRoles={['USER']}><BookRide /></ProtectedRoute>} />
            <Route path="/ride/:rideId" element={<ProtectedRoute allowedRoles={['USER']}><RideTracking /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['USER']}><RideHistory /></ProtectedRoute>} />

            {/* Driver routes */}
            <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/rides" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverRides /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/drivers" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/rides" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

            {/* Shared */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin' : isDriver ? '/driver/dashboard' : '/dashboard') : '/login'} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}
