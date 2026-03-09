import api from './axiosInstance'

export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
}

export const userApi = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getRideHistory: () => api.get('/users/rides'),
}

export const driverApi = {
    registerDriver: (data) => api.post('/drivers/register', data),
    getProfile: () => api.get('/drivers/profile'),
    updateAvailability: (status) => api.put(`/drivers/availability?status=${status}`),
    getDriverRides: () => api.get('/drivers/rides'),
    getEarnings: () => api.get('/drivers/earnings'),
    respondToRide: (rideId, accept) => api.put(`/drivers/respond/${rideId}?accept=${accept}`),
}

export const rideApi = {
    bookRide: (data) => api.post('/rides/book', data),
    getRide: (id) => api.get(`/rides/${id}`),
    updateStatus: (id, st) => api.put(`/rides/${id}/status?status=${st}`),
    getAllRides: () => api.get('/rides/all'),
}

export const adminApi = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    getDrivers: () => api.get('/admin/drivers'),
    getRides: () => api.get('/admin/rides'),
    blockUser: (id, block) => api.put(`/admin/users/${id}/block?block=${block}`),
}
