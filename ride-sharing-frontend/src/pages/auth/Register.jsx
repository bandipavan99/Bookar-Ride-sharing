import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api'
import toast from 'react-hot-toast'

export default function Register() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'USER' })
    const [loading, setLoading] = useState(false)

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await authApi.register(form)
            const data = res.data.data
            login(data)
            toast.success(`Account created! Welcome, ${data.name}! 🎉`)
            if (data.role === 'DRIVER') navigate('/driver/dashboard')
            else navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const roleOptions = [
        { value: 'USER', label: '🧑 Customer – Book rides', desc: 'Book bikes, autos, and cars' },
        { value: 'DRIVER', label: '🚗 Driver – Accept rides', desc: 'Earn by accepting ride requests' },
    ]

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Join RideShare today</p>
                </div>

                {/* Role Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {roleOptions.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            id={`role-${opt.value.toLowerCase()}`}
                            onClick={() => setForm({ ...form, role: opt.value })}
                            className={`vehicle-card ${form.role === opt.value ? 'selected' : ''}`}
                            style={{ padding: '16px 12px', cursor: 'pointer', textAlign: 'left' }}
                        >
                            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{opt.label.split(' ')[0]}</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: form.role === opt.value ? 'var(--primary)' : 'var(--text-primary)', marginBottom: '2px' }}>
                                {opt.label.slice(3)}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opt.desc}</div>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                    </div>

                    <button id="register-submit" type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '8px' }} disabled={loading}>
                        {loading ? <><span className="spinner spinner-sm" /> Creating account...</> : '🚀 Create Account'}
                    </button>
                </form>

                <div className="divider" />

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ fontWeight: 700 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
