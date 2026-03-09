import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api'
import toast from 'react-hot-toast'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await authApi.login(form)
            const data = res.data.data
            login(data)
            toast.success(`Welcome back, ${data.name}! 🚀`)
            if (data.role === 'ADMIN') navigate('/admin')
            else if (data.role === 'DRIVER') navigate('/driver/dashboard')
            else navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Sign in to your RideShare account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            id="login-email"
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            id="login-password"
                            className="form-input"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button id="login-submit" type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '8px' }} disabled={loading}>
                        {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : '🔐 Sign In'}
                    </button>
                </form>

                <div className="divider" />

                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ fontWeight: 700 }}>Create account</Link>
                    </p>
                </div>

                {/* Demo credentials box */}
                <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(108,99,255,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(108,99,255,0.2)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Credentials</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                        Admin: admin@rideshare.com / admin123<br />
                        Register new User or Driver accounts below ↓
                    </p>
                </div>
            </div>
        </div>
    )
}
