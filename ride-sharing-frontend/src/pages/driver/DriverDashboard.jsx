import React, { useState, useEffect } from 'react'
import { driverApi, rideApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function DriverDashboard() {
    const [profile, setProfile] = useState(null)
    const [earnings, setEarnings] = useState(null)
    const [requestedRides, setRequestedRides] = useState([])
    const [acceptedRides, setAcceptedRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState(false)

    const fetchAll = async () => {
        try {
            const [profRes, earnRes, allRidesRes] = await Promise.all([
                driverApi.getProfile(),
                driverApi.getEarnings(),
                rideApi.getAllRides(),
            ])
            const prof = profRes.data.data
            setProfile(prof)
            setEarnings(earnRes.data.data)
            const allRides = allRidesRes.data.data || []
            // REQUESTED rides (unassigned) — any online driver can accept these
            setRequestedRides(allRides.filter(r => r.rideStatus === 'REQUESTED'))
            // ACCEPTED rides assigned to THIS driver only
            setAcceptedRides(allRides.filter(r =>
                r.rideStatus === 'ACCEPTED' && r.driverId === prof.driverId
            ))
        } catch (err) {
            if (err.response?.status === 404) {
                setProfile(null)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const toggleAvailability = async () => {
        setToggling(true)
        try {
            const res = await driverApi.updateAvailability(!profile.availabilityStatus)
            setProfile(res.data.data)
            toast.success(res.data.data.availabilityStatus ? '🟢 You are now online!' : '🔴 You are now offline')
            fetchAll()
        } catch {
            toast.error('Failed to update availability')
        } finally {
            setToggling(false)
        }
    }

    const acceptRide = async (rideId) => {
        try {
            await driverApi.respondToRide(rideId, true)
            toast.success('✅ Ride accepted!')
            fetchAll()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept ride')
        }
    }

    const handleCompleteRide = async (rideId) => {
        try {
            await rideApi.updateStatus(rideId, 'COMPLETED')
            toast.success('🏁 Ride completed successfully!')
            fetchAll()
        } catch {
            toast.error('Failed to complete ride')
        }
    }

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="flex-center" style={{ height: '80vh' }}><div className="spinner" /></div>
        </div>
    )

    if (!profile) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content">
                <div className="card empty-state">
                    <div className="empty-icon">🚗</div>
                    <div className="empty-text">No driver profile found</div>
                    <p style={{ margin: '12px 0' }}>You need to register as a driver first</p>
                    <DriverRegisterForm onSuccess={fetchAll} />
                </div>
            </div>
        </div>
    )

    const vehicleIcon = { BIKE: '🛵', CAR: '🚗', AUTO: '🛺' }[profile.vehicleType] || '🚗'

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn">
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <h1 className="page-title">Driver Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Manage your rides and availability</p>
                    </div>
                    <button
                        id="toggle-availability"
                        className={`btn btn-lg ${profile.availabilityStatus ? 'btn-danger' : 'btn-success'}`}
                        onClick={toggleAvailability}
                        disabled={toggling}
                    >
                        {toggling ? <span className="spinner spinner-sm" /> : profile.availabilityStatus ? '🔴 Go Offline' : '🟢 Go Online'}
                    </button>
                </div>

                {/* Driver info card */}
                <div className="card" style={{ background: 'var(--gradient-card)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '56px' }}>{vehicleIcon}</div>
                        <div>
                            <div style={{ fontSize: '20px', fontWeight: 800 }}>{profile.driverName}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{profile.vehicleType} · {profile.vehicleNumber}</div>
                            <div style={{ marginTop: '8px' }}>
                                <span className={`badge ${profile.availabilityStatus ? 'badge-online' : 'badge-offline'}`}>
                                    {profile.availabilityStatus ? '🟢 ONLINE' : '🔴 OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)' }}>⭐ {profile.rating}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Rating</div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid-3" style={{ marginBottom: '32px' }}>
                    <div className="stat-card">
                        <div className="stat-icon">🛵</div>
                        <div className="stat-value">{earnings?.totalRides || 0}</div>
                        <div className="stat-label">Total Rides</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">₹{earnings?.totalEarnings?.toFixed(0) || 0}</div>
                        <div className="stat-label">Total Earnings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-value">{profile.rating}</div>
                        <div className="stat-label">Driver Rating</div>
                    </div>
                </div>

                {/* New Ride Requests (REQUESTED - unassigned) */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                        🔔 New Ride Requests ({requestedRides.length})
                    </h2>
                    {requestedRides.length === 0 ? (
                        <div className="card empty-state" style={{ padding: '32px' }}>
                            <div className="empty-icon" style={{ fontSize: '40px' }}>😴</div>
                            <div className="empty-text" style={{ fontSize: '16px' }}>No new ride requests</div>
                            <p>Go online and ride requests will appear here</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {requestedRides.map(ride => (
                                <div key={ride.rideId} className="card">
                                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '8px' }}>Ride #{ride.rideId}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ fontSize: '14px' }}>🟢 <strong>From:</strong> {ride.pickupLocation}</div>
                                                <div style={{ fontSize: '14px' }}>🔴 <strong>To:</strong> {ride.dropLocation}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    👤 {ride.userName} · 💰 ₹{ride.fare} · {ride.distanceKm}km
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                id={`accept-ride-${ride.rideId}`}
                                                className="btn btn-success"
                                                onClick={() => acceptRide(ride.rideId)}
                                            >✅ Accept</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Rides (ACCEPTED - this driver's rides) */}
                {acceptedRides.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                            🚗 Your Active Rides ({acceptedRides.length})
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {acceptedRides.map(ride => (
                                <div key={ride.rideId} className="card">
                                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '8px' }}>Ride #{ride.rideId}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ fontSize: '14px' }}>🟢 <strong>From:</strong> {ride.pickupLocation}</div>
                                                <div style={{ fontSize: '14px' }}>🔴 <strong>To:</strong> {ride.dropLocation}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    👤 {ride.userName} · 💰 ₹{ride.fare} · {ride.distanceKm}km
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                            <span className="badge badge-accepted">✅ ACCEPTED</span>
                                            <button
                                                id={`complete-ride-${ride.rideId}`}
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleCompleteRide(ride.rideId)}
                                            >🏁 Complete Ride</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function DriverRegisterForm({ onSuccess }) {
    const [form, setForm] = useState({ vehicleType: 'BIKE', vehicleNumber: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await driverApi.registerDriver(form)
            toast.success('Driver registered! 🎉')
            onSuccess()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '360px', margin: '0 auto', textAlign: 'left' }}>
            <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-input" name="vehicleType" value={form.vehicleType}
                    onChange={e => setForm({ ...form, vehicleType: e.target.value })}>
                    <option value="BIKE">🛵 Bike</option>
                    <option value="AUTO">🛺 Auto</option>
                    <option value="CAR">🚗 Car</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input className="form-input" placeholder="e.g. KA05AB1234" value={form.vehicleNumber}
                    onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <span className="spinner spinner-sm" /> : '🚗 Register Vehicle'}
            </button>
        </form>
    )
}
