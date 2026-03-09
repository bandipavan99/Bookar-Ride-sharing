import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#1a1a2e',
                    color: '#e0e0e0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                },
                success: { iconTheme: { primary: '#6c63ff', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ff4757', secondary: '#fff' } },
            }}
        />
    </React.StrictMode>
)
