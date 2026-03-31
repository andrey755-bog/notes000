import { ref, computed } from 'vue'
import { authAPI } from '../api'

const user = ref(null)
const isAuthenticated = ref(false)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  const username = computed(() => user.value?.username || '')
  const email = computed(() => user.value?.email || '')

  const initAuth = () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      isAuthenticated.value = true
      loadProfile()
    }
  }

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      user.value = response.data
    } catch {
      logout()
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      await authAPI.register(userData)
      const result = await login({
        username: userData.username,
        password: userData.password
      })
      return result
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка регистрации'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.login(credentials)
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      isAuthenticated.value = true
      await loadProfile()
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Ошибка входа'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    username,
    email,
    initAuth,
    register,
    login,
    logout
  }
}
