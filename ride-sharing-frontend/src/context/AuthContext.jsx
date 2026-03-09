import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('rs_token')
        const storedUser = localStorage.getItem('rs_user')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = (authData) => {
        const userData = {
            id: authData.userId,
            name: authData.name,
            email: authData.email,
            role: authData.role,
        }
        setToken(authData.token)
        setUser(userData)
        localStorage.setItem('rs_token', authData.token)
        localStorage.setItem('rs_user', JSON.stringify(userData))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('rs_token')
        localStorage.removeItem('rs_user')
    }

    const isAuthenticated = !!token && !!user
    const isAdmin = user?.role === 'ADMIN'
    const isDriver = user?.role === 'DRIVER'
    const isUser = user?.role === 'USER'

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated, isAdmin, isDriver, isUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
