import React, { useState, useEffect } from 'react'
import { driverApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function DriverRides() {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        driverApi.getDriverRides()
            .then(res => setRides(res.data.data || []))
            .catch(() => toast.error('Failed to load rides'))
            .finally(() => setLoading(false))
    }, [])

    const statusColor = {
        REQUESTED: 'badge-requested', ACCEPTED: 'badge-accepted',
        ONGOING: 'badge-ongoing', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled'
    }

    const statuses = ['ALL', 'COMPLETED', 'ACCEPTED', 'ONGOING', 'CANCELLED']
    const filtered = filter === 'ALL' ? rides : rides.filter(r => r.rideStatus === filter)
    const totalEarned = rides.filter(r => r.rideStatus === 'COMPLETED').reduce((s, r) => s + (r.fare || 0), 0)

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn">
                <h1 className="page-title">My Rides</h1>
                <p className="page-subtitle">Your complete ride history</p>

                {/* Summary */}
                <div className="grid-3" style={{ marginBottom: '24px' }}>
                    <div className="stat-card">
                        <div className="stat-icon">🛵</div>
                        <div className="stat-value">{rides.length}</div>
                        <div className="stat-label">Total Rides</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">{rides.filter(r => r.rideStatus === 'COMPLETED').length}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">₹{totalEarned.toFixed(0)}</div>
                        <div className="stat-label">Earned</div>
                    </div>
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {statuses.map(st => (
                        <button
                            key={st}
                            className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(st)}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex-center" style={{ padding: '80px' }}><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="card empty-state">
                        <div className="empty-icon">🚗</div>
                        <div className="empty-text">No rides found</div>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>#</th><th>Customer</th><th>Vehicle</th><th>Pickup</th><th>Destination</th><th>Fare</th><th>Status</th><th>Date</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.rideId}>
                                        <td>#{r.rideId}</td>
                                        <td style={{ fontWeight: 600 }}>{r.userName}</td>
                                        <td>
                                            <span style={{ fontSize: '18px' }}>{r.vehicleType === 'BIKE' ? '🛵' : r.vehicleType === 'CAR' ? '🚗' : '🛺'}</span>
                                            {' '}{r.vehicleType}
                                        </td>
                                        <td style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.pickupLocation}</td>
                                        <td style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.dropLocation}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.fare ? `₹${r.fare}` : '—'}</td>
                                        <td><span className={`badge ${statusColor[r.rideStatus]}`}>{r.rideStatus}</span></td>
                                        <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                            {new Date(r.rideTime).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
