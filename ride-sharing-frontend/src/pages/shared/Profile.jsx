import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { userApi, driverApi } from '../../api'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, isDriver } = useAuth()
    const [form, setForm] = useState({ name: '', phone: '', currentPassword: '', newPassword: '' })
    const [driver, setDriver] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        userApi.getProfile().then(res => {
            const u = res.data.data
            setForm(f => ({ ...f, name: u.name || '', phone: u.phone || '' }))
        })
        if (isDriver) {
            driverApi.getProfile().then(res => setDriver(res.data.data)).catch(() => { })
        }
    }, [isDriver])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await userApi.updateProfile({
                name: form.name,
                phone: form.phone,
                currentPassword: form.currentPassword || undefined,
                newPassword: form.newPassword || undefined,
            })
            toast.success('Profile updated! ✅')
            setForm(f => ({ ...f, currentPassword: '', newPassword: '' }))
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="main-content animate-fadeIn" style={{ maxWidth: '720px' }}>
                <h1 className="page-title">My Profile</h1>
                <p className="page-subtitle">Manage your account details</p>

                {/* Avatar section */}
                <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '96px', height: '96px', borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '40px', margin: '0 auto 16px',
                        boxShadow: 'var(--shadow-glow)', animation: 'glow 3s infinite'
                    }}>
                        {isDriver ? '🚗' : '👤'}
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>{user?.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{user?.email}</p>
                    <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
                </div>

                {/* Edit form */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>✏️ Edit Information</h3>
                    <form onSubmit={handleSave}>
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    id="profile-name"
                                    className="form-input"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    id="profile-phone"
                                    className="form-input"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="10-digit phone"
                                />
                            </div>
                        </div>

                        <div className="divider" />
                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>🔒 Change Password (optional)</h4>

                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    id="current-password"
                                    className="form-input"
                                    type="password"
                                    value={form.currentPassword}
                                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                    placeholder="Current password"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    id="new-password"
                                    className="form-input"
                                    type="password"
                                    value={form.newPassword}
                                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                    placeholder="New password"
                                />
                            </div>
                        </div>

                        <button id="save-profile" type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><span className="spinner spinner-sm" /> Saving...</> : '💾 Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Driver vehicle info */}
                {isDriver && driver && (
                    <div className="card">
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>🚘 Vehicle Information</h3>
                        <div className="grid-2">
                            {[
                                { l: 'Vehicle Type', v: driver.vehicleType },
                                { l: 'Vehicle Number', v: driver.vehicleNumber },
                                { l: 'Status', v: driver.availabilityStatus ? '🟢 Online' : '🔴 Offline' },
                                { l: 'Rating', v: `⭐ ${driver.rating}` },
                                { l: 'Total Rides', v: driver.totalRides },
                            ].map(item => (
                                <div key={item.l} style={{ padding: '16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.l}</div>
                                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{item.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
