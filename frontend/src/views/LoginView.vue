<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Вход в систему</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Имя пользователя</label>
          <input v-model="username" type="text" required />
        </div>
        
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="password" type="password" required />
        </div>
        
        <div v-if="authError" class="error">{{ authError }}</div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      
      <p class="auth-footer">
        Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, loading, error: authError } = useAuth()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await login({
    username: username.value,
    password: password.value
  })
  
  if (result.success) {
    router.push('/')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #42b883;
}

.error {
  color: #ff6b6b;
  margin-bottom: 15px;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-footer a {
  color: #42b883;
  text-decoration: none;
}
</style>
