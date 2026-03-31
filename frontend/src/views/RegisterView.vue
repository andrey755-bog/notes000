<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Регистрация</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Имя пользователя</label>
          <input v-model="username" type="text" required />
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="password" type="password" required />
        </div>
        
        <div class="form-group">
          <label>Подтверждение пароля</label>
          <input v-model="confirmPassword" type="password" required />
        </div>
        
        <div v-if="registerError" class="error">{{ registerError }}</div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>
      
      <p class="auth-footer">
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, loading } = useAuth()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const registerError = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    registerError.value = 'Пароли не совпадают'
    return
  }
  
  if (password.value.length < 6) {
    registerError.value = 'Пароль должен содержать минимум 6 символов'
    return
  }
  
  registerError.value = ''
  
  const result = await register({
    username: username.value,
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    router.push('/')
  } else {
    registerError.value = result.error
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
}

.error {
  color: #ff6b6b;
  margin-bottom: 15px;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
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
