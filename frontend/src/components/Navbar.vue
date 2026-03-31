<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/">📝 Notes App</router-link>
      </div>
      
      <div class="nav-links">
        <template v-if="isAuthenticated">
          <span class="user">Привет, {{ username }}</span>
          <button @click="handleLogout" class="logout-btn">Выйти</button>
        </template>
        <template v-else>
          <router-link to="/login">Вход</router-link>
          <router-link to="/register">Регистрация</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated, username, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 15px 0;
}

.nav-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #42b883;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #666;
}

.user {
  color: #666;
}

.logout-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
}
</style>
