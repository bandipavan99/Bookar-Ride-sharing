import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function RideHistory() {
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        userApi.getRideHistory()
            .then(res => setRides(res.data.data || []))
            .catch(() => toast.error('Failed to load ride history'))
            .finally(() => setLoading(false))
    }, [])

    const statuses = ['ALL', 'COMPLETED', 'CANCELLED', 'REQUESTED', 'ONGOING', 'ACCEPTED']
    const filtered = filter === 'ALL' ? rides : rides.filter(r => r.rideStatus === filter)

    const statusColor = {
        REQUESTED: 'badge-requested', ACCEPTED: 'badge-accepted',
        ONGOING: 'badge-ongoing', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled'
    }

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn">
                <h1 className="page-title">Ride History</h1>
                <p className="page-subtitle">All your past and active rides</p>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {statuses.map(st => (
                        <button
                            key={st}
                            id={`filter-${st.toLowerCase()}`}
                            className={`btn btn-sm ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(st)}
                        >
                            {st} {st !== 'ALL' && rides.filter(r => r.rideStatus === st).length > 0 && `(${rides.filter(r => r.rideStatus === st).length})`}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex-center" style={{ padding: '80px' }}><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="card empty-state">
                        <div className="empty-icon">🚗</div>
                        <div className="empty-text">No rides found</div>
                        <Link to="/book" className="btn btn-primary" style={{ marginTop: '16px' }}>Book a Ride</Link>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Vehicle</th>
                                    <th>Pickup</th>
                                    <th>Destination</th>
                                    <th>Driver</th>
                                    <th>Fare</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(ride => (
                                    <tr key={ride.rideId}>
                                        <td>#{ride.rideId}</td>
                                        <td>
                                            <span style={{ fontSize: '20px' }}>{ride.vehicleType === 'BIKE' ? '🛵' : ride.vehicleType === 'CAR' ? '🚗' : '🛺'}</span>
                                            {' '}{ride.vehicleType}
                                        </td>
                                        <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ride.pickupLocation}</td>
                                        <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ride.dropLocation}</td>
                                        <td>{ride.driverName || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{ride.fare ? `₹${ride.fare}` : '—'}</td>
                                        <td><span className={`badge ${statusColor[ride.rideStatus]}`}>{ride.rideStatus}</span></td>
                                        <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                            {new Date(ride.rideTime).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {['REQUESTED', 'ACCEPTED', 'ONGOING'].includes(ride.rideStatus) && (
                                                <Link to={`/ride/${ride.rideId}`} className="btn btn-sm btn-primary">Track</Link>
                                            )}
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
