import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { rideApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

const STEPS = ['REQUESTED', 'ACCEPTED', 'ONGOING', 'COMPLETED']
const STEP_ICONS = { REQUESTED: '📝', ACCEPTED: '✅', ONGOING: '🚗', COMPLETED: '🏁' }

export default function RideTracking() {
    const { rideId } = useParams()
    const navigate = useNavigate()
    const [ride, setRide] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchRide = async () => {
        try {
            const res = await rideApi.getRide(rideId)
            setRide(res.data.data)
        } catch {
            toast.error('Ride not found')
            navigate('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRide()
        const interval = setInterval(fetchRide, 8000)
        return () => clearInterval(interval)
    }, [rideId])

    const handleCancel = async () => {
        try {
            await rideApi.updateStatus(rideId, 'CANCELLED')
            toast.success('Ride cancelled')
            navigate('/dashboard')
        } catch {
            toast.error('Cannot cancel this ride')
        }
    }

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="flex-center" style={{ height: '80vh' }}><div className="spinner" /></div>
        </div>
    )

    if (!ride) return null

    const currentStep = STEPS.indexOf(ride.rideStatus)
    const isActive = (step) => STEPS.indexOf(step) <= currentStep

    const vehicleIcon = { BIKE: '🛵', CAR: '🚗', AUTO: '🛺' }[ride.vehicleType] || '🚗'

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn" style={{ maxWidth: '680px' }}>
                <h1 className="page-title">Ride Tracking</h1>
                <p className="page-subtitle">Ride #{ride.rideId} · Auto-refreshes every 8 seconds</p>

                {/* Status steps */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="ride-status-steps">
                        {STEPS.map((step, i) => (
                            <div key={step} className={`status-step ${isActive(step) ? 'active' : ''}`}>
                                <div className="step-dot">{STEP_ICONS[step]}</div>
                                <div className="step-label">{step}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ride details */}
                <div className="card" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '48px' }}>{vehicleIcon}</div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{ride.vehicleType}</h2>
                            {ride.vehicleNumber && <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🔢 {ride.vehicleNumber}</div>}
                            <span className={`badge badge-${ride.rideStatus?.toLowerCase()}`}>{ride.rideStatus}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '20px', marginTop: '2px' }}>🟢</span>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Pickup</div>
                                <div style={{ fontWeight: 600 }}>{ride.pickupLocation}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '20px', marginTop: '2px' }}>🔴</span>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Destination</div>
                                <div style={{ fontWeight: 600 }}>{ride.dropLocation}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver info */}
                {ride.driverName && (
                    <div className="card" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>👤</div>
                        <div>
                            <div style={{ fontWeight: 700 }}>{ride.driverName}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Your Driver · ⭐ 4.8</div>
                        </div>
                    </div>
                )}

                {/* Fare */}
                {ride.fare && (
                    <div className="card" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fare</div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>₹{ride.fare}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment</div>
                            <div style={{ fontWeight: 600, color: 'var(--accent)' }}>{ride.paymentMethod || 'CASH'}</div>
                            <div>
                                <span className={`badge badge-${ride.paymentStatus?.toLowerCase()}`}>{ride.paymentStatus || 'PENDING'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {ride.rideStatus === 'REQUESTED' && (
                        <button className="btn btn-danger" onClick={handleCancel}>❌ Cancel Ride</button>
                    )}
                    {ride.rideStatus === 'COMPLETED' && (
                        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>🏠 Back to Home</button>
                    )}
                    <button className="btn btn-secondary" onClick={fetchRide}>🔄 Refresh</button>
                </div>
            </div>
        </div>
    )
}
