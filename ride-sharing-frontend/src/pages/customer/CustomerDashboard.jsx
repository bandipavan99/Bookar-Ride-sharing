import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { userApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function CustomerDashboard() {
    const { user } = useAuth()
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        userApi.getRideHistory()
            .then(res => setRides(res.data.data || []))
            .catch(() => toast.error('Failed to load rides'))
            .finally(() => setLoading(false))
    }, [])

    const recent = rides.slice(0, 3)
    const completedCount = rides.filter(r => r.rideStatus === 'COMPLETED').length
    const totalSpent = rides.filter(r => r.rideStatus === 'COMPLETED').reduce((s, r) => s + (r.fare || 0), 0)

    const statusColor = {
        REQUESTED: 'badge-requested', ACCEPTED: 'badge-accepted',
        ONGOING: 'badge-ongoing', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled'
    }

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn">
                {/* Hero greeting */}
                <div className="card" style={{ background: 'var(--gradient-card)', marginBottom: '24px', border: '1px solid var(--border-active)' }}>
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 className="page-title" style={{ marginBottom: '4px' }}>Hey, {user?.name?.split(' ')[0]}! 👋</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Where would you like to go today?</p>
                        </div>
                        <Link to="/book" className="btn btn-primary btn-lg">
                            🚀 Book a Ride
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid-3" style={{ marginBottom: '32px' }}>
                    <div className="stat-card">
                        <div className="stat-icon">🛵</div>
                        <div className="stat-value">{rides.length}</div>
                        <div className="stat-label">Total Rides</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">{completedCount}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">₹{totalSpent.toFixed(0)}</div>
                        <div className="stat-label">Total Spent</div>
                    </div>
                </div>

                {/* Quick actions */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h2>
                    <div className="grid-3">
                        {[
                            { icon: '🛵', label: 'Bike', desc: 'Fast & affordable', to: '/book?type=BIKE' },
                            { icon: '🚗', label: 'Car', desc: 'Comfortable rides', to: '/book?type=CAR' },
                            { icon: '🛺', label: 'Auto', desc: 'City commutes', to: '/book?type=AUTO' },
                        ].map(v => (
                            <Link key={v.label} to={v.to} className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
                                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{v.icon}</div>
                                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{v.label}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{v.desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent rides */}
                <div>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Rides</h2>
                        <Link to="/history" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>View all →</Link>
                    </div>

                    {loading ? (
                        <div className="flex-center" style={{ padding: '48px' }}><div className="spinner" /></div>
                    ) : recent.length === 0 ? (
                        <div className="card empty-state">
                            <div className="empty-icon">🚗</div>
                            <div className="empty-text">No rides yet</div>
                            <p style={{ marginTop: '8px', marginBottom: '16px' }}>Book your first ride today!</p>
                            <Link to="/book" className="btn btn-primary">Book Now</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recent.map(ride => (
                                <div key={ride.rideId} className="card" style={{ padding: '20px' }}>
                                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '24px' }}>{ride.vehicleType === 'BIKE' ? '🛵' : ride.vehicleType === 'CAR' ? '🚗' : '🛺'}</span>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{ride.pickupLocation}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>→ {ride.dropLocation}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                {new Date(ride.rideTime).toLocaleString()}
                                                {ride.driverName && <> · Driver: {ride.driverName}</>}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className={`badge ${statusColor[ride.rideStatus] || ''}`}>{ride.rideStatus}</span>
                                            {ride.fare && <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>₹{ride.fare}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
