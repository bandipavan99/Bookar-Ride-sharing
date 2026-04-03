import React, { useState, useEffect } from 'react'
import { adminApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [drivers, setDrivers] = useState([])
    const [rides, setRides] = useState([])
    const [activeTab, setActiveTab] = useState('overview')
    const [loading, setLoading] = useState(true)

    const fetchAll = async () => {
        try {
            const [statsRes, usersRes, driversRes, ridesRes] = await Promise.all([
                adminApi.getStats(),
                adminApi.getUsers(),
                adminApi.getDrivers(),
                adminApi.getRides(),
            ])
            setStats(statsRes.data.data)
            setUsers(usersRes.data.data || [])
            setDrivers(driversRes.data.data || [])
            setRides(ridesRes.data.data || [])
        } catch {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleBlock = async (userId, isBlocked) => {
        try {
            await adminApi.blockUser(userId, !isBlocked)
            toast.success(!isBlocked ? 'User blocked' : 'User unblocked')
            fetchAll()
        } catch {
            toast.error('Failed to update user')
        }
    }

    const statusColor = {
        REQUESTED: 'badge-requested', ACCEPTED: 'badge-accepted',
        ONGOING: 'badge-ongoing', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled'
    }

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'users', label: '👥 Users' },
        { id: 'drivers', label: '🚘 Drivers' },
        { id: 'rides', label: '📋 Rides' },
    ]

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="flex-center" style={{ height: '80vh' }}><div className="spinner" /></div>
        </div>
    )

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Platform overview and management</p>

                {/* Tab nav */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            id={`admin-tab-${tab.id}`}
                            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && stats && (
                    <>
                        <div className="grid-4" style={{ marginBottom: '32px' }}>
                            {[
                                { icon: '👥', val: stats.totalUsers, label: 'Total Users' },
                                { icon: '🚘', val: stats.totalDrivers, label: 'Total Drivers' },
                                { icon: '🛵', val: stats.totalRides, label: 'Total Rides' },
                                { icon: '🟢', val: stats.availableDrivers, label: 'Online Drivers' },
                            ].map(s => (
                                <div key={s.label} className="stat-card">
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-value">{s.val}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="grid-3">
                            {[
                                { icon: '📝', val: stats.requestedRides, label: 'Requested', cls: 'badge-requested' },
                                { icon: '🚗', val: stats.activeRides, label: 'Active / Ongoing', cls: 'badge-ongoing' },
                                { icon: '✅', val: stats.completedRides, label: 'Completed', cls: 'badge-completed' },
                            ].map(s => (
                                <div key={s.label} className="stat-card">
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-value">{s.val}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Users */}
                {activeTab === 'users' && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>#{u.id}</td>
                                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                        <td>{u.phone || '—'}</td>
                                        <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                                        <td>
                                            <span className={`badge ${u.blocked ? 'badge-blocked' : 'badge-online'}`}>
                                                {u.blocked ? '🔴 Blocked' : '🟢 Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                id={`block-user-${u.id}`}
                                                className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-danger'}`}
                                                onClick={() => handleBlock(u.id, u.blocked)}
                                            >
                                                {u.blocked ? '✅ Unblock' : '🚫 Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Drivers */}
                {activeTab === 'drivers' && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Vehicle</th><th>Number</th><th>Status</th><th>Rating</th><th>Rides</th><th>Earnings</th></tr>
                            </thead>
                            <tbody>
                                {drivers.map(d => (
                                    <tr key={d.driverId}>
                                        <td>#{d.driverId}</td>
                                        <td style={{ fontWeight: 600 }}>{d.driverName}</td>
                                        <td>
                                            <span style={{ fontSize: '18px' }}>{d.vehicleType === 'BIKE' ? '🛵' : d.vehicleType === 'CAR' ? '🚗' : '🛺'}</span>
                                            {' '}{d.vehicleType}
                                        </td>
                                        <td>{d.vehicleNumber}</td>
                                        <td>
                                            <span className={`badge ${d.availabilityStatus ? 'badge-online' : 'badge-offline'}`}>
                                                {d.availabilityStatus ? '🟢 Online' : '⚫ Offline'}
                                            </span>
                                        </td>
                                        <td>⭐ {d.rating}</td>
                                        <td>{d.totalRides}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{d.totalEarnings != null ? Number(d.totalEarnings).toFixed(0) : '0'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Rides */}
                {activeTab === 'rides' && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr><th>#</th><th>User</th><th>Driver</th><th>Vehicle</th><th>Pickup</th><th>Destination</th><th>Fare</th><th>Status</th><th>Date</th></tr>
                            </thead>
                            <tbody>
                                {rides.map(r => (
                                    <tr key={r.rideId}>
                                        <td>#{r.rideId}</td>
                                        <td>{r.userName}</td>
                                        <td>{r.driverName || '—'}</td>
                                        <td>{r.vehicleType}</td>
                                        <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.pickupLocation}</td>
                                        <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.dropLocation}</td>
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
