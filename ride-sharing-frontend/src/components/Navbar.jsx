import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
    const { user, logout, isAdmin, isDriver, isUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🚀</span>
                    <span className="brand-name">RideShare</span>
                </Link>

                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span /><span /><span />
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {isUser && <>
                        <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>🏠 Dashboard</Link>
                        <Link to="/book" className={isActive('/book')} onClick={() => setMenuOpen(false)}>🚗 Book Ride</Link>
                        <Link to="/history" className={isActive('/history')} onClick={() => setMenuOpen(false)}>📋 History</Link>
                    </>}
                    {isDriver && <>
                        <Link to="/driver/dashboard" className={isActive('/driver/dashboard')} onClick={() => setMenuOpen(false)}>🏠 Dashboard</Link>
                        <Link to="/driver/rides" className={isActive('/driver/rides')} onClick={() => setMenuOpen(false)}>🗓 My Rides</Link>
                    </>}
                    {isAdmin && <>
                        <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                        <Link to="/admin/users" className={isActive('/admin/users')} onClick={() => setMenuOpen(false)}>👥 Users</Link>
                        <Link to="/admin/drivers" className={isActive('/admin/drivers')} onClick={() => setMenuOpen(false)}>🚘 Drivers</Link>
                        <Link to="/admin/rides" className={isActive('/admin/rides')} onClick={() => setMenuOpen(false)}>📋 Rides</Link>
                    </>}
                    <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>👤 {user?.name?.split(' ')[0]}</Link>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ marginLeft: '8px' }}>Logout</button>
                </div>
            </div>
        </nav>
    )
}
