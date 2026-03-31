import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Интерцептор для добавления токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Интерцептор для обновления токена
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refresh = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh })
        localStorage.setItem('access_token', response.data.access)
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/token/', data),
  getProfile: () => api.get('/profile/'),
}

export const notesAPI = {
  getAll: () => api.get('/notes/'),
  create: (data) => api.post('/notes/', data),
  update: (id, data) => api.put(`/notes/${id}/`, data),
  delete: (id) => api.delete(`/notes/${id}/`),
}

export default api
