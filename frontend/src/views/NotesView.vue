<template>
  <div class="notes-container">
    <div class="header">
      <h1>📝 Мои заметки</h1>
      <button @click="showForm = true" class="btn btn-primary">+ Новая заметка</button>
    </div>
    
    <!-- Форма создания/редактирования -->
    <div v-if="showForm" class="note-form">
      <h3>{{ editingNote ? 'Редактировать' : 'Новая заметка' }}</h3>
      <input v-model="form.title" placeholder="Заголовок" />
      <textarea v-model="form.content" placeholder="Содержание" rows="4"></textarea>
      <div class="form-actions">
        <button @click="cancelForm" class="btn btn-secondary">Отмена</button>
        <button @click="saveNote" class="btn btn-primary">Сохранить</button>
      </div>
    </div>
    
    <!-- Список заметок -->
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="notes.length === 0" class="empty">
      У вас пока нет заметок. Создайте первую!
    </div>
    <div v-else class="notes-grid">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <div class="note-header">
          <h3>{{ note.title || 'Без заголовка' }}</h3>
          <div class="note-actions">
            <button @click="editNote(note)" class="edit">✏️</button>
            <button @click="deleteNote(note.id)" class="delete">🗑️</button>
          </div>
        </div>
        <p class="note-content">{{ note.content || 'Нет содержания' }}</p>
        <div class="note-footer">
          <span>{{ formatDate(note.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { notesAPI } from '../api'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated } = useAuth()
const notes = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingNote = ref(null)

const form = ref({
  title: '',
  content: ''
})

const loadNotes = async () => {
  loading.value = true
  try {
    const response = await notesAPI.getAll()
    notes.value = response.data
  } catch (err) {
    error.value = 'Ошибка загрузки заметок'
  } finally {
    loading.value = false
  }
}

const saveNote = async () => {
  if (!form.value.title.trim()) {
    alert('Введите заголовок')
    return
  }
  
  try {
    if (editingNote.value) {
      const response = await notesAPI.update(editingNote.value.id, form.value)
      const index = notes.value.findIndex(n => n.id === editingNote.value.id)
      notes.value[index] = response.data
    } else {
      const response = await notesAPI.create(form.value)
      notes.value.unshift(response.data)
    }
    cancelForm()
  } catch (err) {
    alert('Ошибка при сохранении')
  }
}

const editNote = (note) => {
  editingNote.value = note
  form.value = { title: note.title, content: note.content }
  showForm.value = true
}

const deleteNote = async (id) => {
  if (!confirm('Удалить заметку?')) return
  try {
    await notesAPI.delete(id)
    notes.value = notes.value.filter(n => n.id !== id)
  } catch {
    alert('Ошибка при удалении')
  }
}

const cancelForm = () => {
  showForm.value = false
  editingNote.value = null
  form.value = { title: '', content: '' }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadNotes()
  }
})
</script>

<style scoped>
.notes-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.note-form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.note-form input, .note-form textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.note-header h3 {
  margin: 0;
  font-size: 18px;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.note-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.5;
}

.note-actions button:hover {
  opacity: 1;
}

.note-content {
  color: #666;
  line-height: 1.5;
  margin: 10px 0;
}

.note-footer {
  font-size: 12px;
  color: #999;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
