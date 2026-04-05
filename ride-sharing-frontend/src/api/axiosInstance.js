import axios from 'axios'

// VITE_API_BASE_URL is set in Vercel env vars to point to the Render backend.
// Falls back to '/api' for local dev (uses vite proxy).
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000, // 30s to account for Render free tier cold starts
})

// Request interceptor – attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('rs_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor – handle 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('rs_token')
            localStorage.removeItem('rs_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
