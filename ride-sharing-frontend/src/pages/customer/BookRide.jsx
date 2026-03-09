import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { rideApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

const VEHICLES = [
    {
        type: 'BIKE', icon: '🛵', name: 'Bike',
        desc: 'Fast & cheap', baseFare: 20, perKm: 8,
        eta: '2-4 min', capacity: '1 person',
    },
    {
        type: 'AUTO', icon: '🛺', name: 'Auto',
        desc: 'City commutes', baseFare: 30, perKm: 12,
        eta: '5-8 min', capacity: '3 persons',
    },
    {
        type: 'CAR', icon: '🚗', name: 'Car',
        desc: 'Comfortable ride', baseFare: 50, perKm: 18,
        eta: '8-12 min', capacity: '4 persons',
    },
]

const PAYMENT_METHODS = ['CASH', 'UPI', 'CARD', 'WALLET']

export default function BookRide() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [form, setForm] = useState({
        pickupLocation: '',
        dropLocation: '',
        vehicleType: params.get('type') || 'BIKE',
        paymentMethod: 'CASH',
    })
    const [loading, setLoading] = useState(false)
    const [estimated, setEstimated] = useState(null)

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value }
        setForm(updated)
        if (updated.pickupLocation && updated.dropLocation) {
            const v = VEHICLES.find(x => x.type === updated.vehicleType)
            const dist = 2 + Math.random() * 13
            setEstimated({ fare: Math.round(v.baseFare + v.perKm * dist), dist: dist.toFixed(1) })
        }
    }

    const selectVehicle = (type) => {
        const updated = { ...form, vehicleType: type }
        setForm(updated)
        if (updated.pickupLocation && updated.dropLocation) {
            const v = VEHICLES.find(x => x.type === type)
            const dist = 2 + Math.random() * 13
            setEstimated({ fare: Math.round(v.baseFare + v.perKm * dist), dist: dist.toFixed(1) })
        }
    }

    const handleBook = async (e) => {
        e.preventDefault()
        if (!form.pickupLocation.trim() || !form.dropLocation.trim()) {
            toast.error('Enter pickup and destination')
            return
        }
        setLoading(true)
        try {
            const res = await rideApi.bookRide(form)
            const ride = res.data.data
            toast.success('Ride booked! 🚀 Finding your driver...')
            navigate(`/ride/${ride.rideId}`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn" style={{ maxWidth: '720px' }}>
                <h1 className="page-title">Book a Ride</h1>
                <p className="page-subtitle">Enter your pickup & destination to get started</p>

                <form onSubmit={handleBook}>
                    {/* Location inputs */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--text-secondary)' }}>📍 Route</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🟢</span>
                                <input
                                    id="pickup-input"
                                    className="form-input"
                                    style={{ paddingLeft: '48px' }}
                                    name="pickupLocation"
                                    placeholder="Enter pickup location..."
                                    value={form.pickupLocation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔴</span>
                                <input
                                    id="drop-input"
                                    className="form-input"
                                    style={{ paddingLeft: '48px' }}
                                    name="dropLocation"
                                    placeholder="Enter destination..."
                                    value={form.dropLocation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle selection */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--text-secondary)' }}>🚘 Choose Vehicle</h3>
                        <div className="vehicle-grid">
                            {VEHICLES.map(v => {
                                const isSelected = form.vehicleType === v.type
                                return (
                                    <div
                                        key={v.type}
                                        id={`vehicle-${v.type.toLowerCase()}`}
                                        className={`vehicle-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => selectVehicle(v.type)}
                                    >
                                        <span className="vehicle-icon">{v.icon}</span>
                                        <div className="vehicle-name">{v.name}</div>
                                        <div className="vehicle-fare">{v.desc} · {v.capacity}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>⏱ {v.eta}</div>
                                        {estimated && isSelected ? (
                                            <div className="vehicle-price">₹{estimated.fare}</div>
                                        ) : (
                                            <div className="vehicle-fare">₹{v.baseFare}+/{v.perKm}/km</div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {estimated && (
                            <div style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginTop: '8px' }}>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>₹{estimated.fare}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated fare</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{estimated.dist} km</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Est. distance</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--secondary)' }}>~5 min</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wait time</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment method */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--text-secondary)' }}>💳 Payment Method</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {PAYMENT_METHODS.map(pm => (
                                <button
                                    key={pm}
                                    type="button"
                                    id={`payment-${pm.toLowerCase()}`}
                                    onClick={() => setForm({ ...form, paymentMethod: pm })}
                                    className={`btn ${form.paymentMethod === pm ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                >
                                    {pm === 'CASH' ? '💵' : pm === 'UPI' ? '📱' : pm === 'CARD' ? '💳' : '👛'} {pm}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button id="book-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                        {loading
                            ? <><span className="spinner spinner-sm" /> Booking...</>
                            : '🚀 Confirm Booking'
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}
