<template>
  <div class="profil-page">
    <Navbar />

    <div class="profil-content">
      <!-- Avatar -->
      <div class="profil-header">
        <div class="avatar-wrapper">
          <div class="avatar">
            <svg width="130" height="130" viewBox="0 0 70 70" fill="none">
              <circle cx="35" cy="35" r="35" fill="#EFEFEF"/>
              <circle cx="35" cy="30" r="14" fill="#D6B7A0"/>
              <ellipse cx="35" cy="54" rx="20" ry="12" fill="#D6B7A0"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div class="user-info" v-if="!isEditing">
        <h2>Bienvenue {{ user?.username }}</h2>
        <p v-if="user?.email">Email : {{ user.email }}</p>
        <p v-else>Aucune information utilisateur disponible.</p>
      </div>

      <!-- Edit Form -->
      <div class="edit-form" v-else>
        <h2>Modifier le profil</h2>
        <form @submit.prevent="onSaveProfile">
          <div class="form-group">
            <Input
              :label="'Nom'"
              id="name"
              v-model="editUser.username"
              type="text"
              placeholder="Votre nom"
              :required="true"
              :regex="usernameRegex"
              @error-state="usernameInputError = $event"
            />
          </div>
          <div class="form-group">
            <Input
              :label="'Email'"
              id="email"
              v-model="editUser.email"
              type="email"
              placeholder="Votre email"
              :required="true"
              :regex="emailRegex"
              @error-state="emailInputError = $event"
            />
          </div>
          <div class="form-actions">
            <Button
              name="Enregistrer"
              type="submit"
              :disabled="!editUser.username || !editUser.email || emailInputError"
            />
            <Button
              name="Annuler"
              :secondary="true"
              @click="isEditing = false"
            />
          </div>
        </form>
      </div>

      <!-- Menu Items -->
      <div class="profil-menu">
        <ul>
          <MenuItem
            v-for="item in menuItems"
            :key="item.key"
            :label="item.label"
            :active="item.key === selectedKey"
            @select="onMenuItemClick(item.key)"
          />
        </ul>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import Navbar from '@/components/ui/Navbar.vue'
import Footer from '@/components/ui/Footer.vue'
import MenuItem from '@/components/ui/MenuItem.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()

const user = ref<{ users_id: string; username: string; email: string } | null>(null)
const isEditing = ref(false)
const editUser = ref<{ username: string; email: string }>({ username: '', email: '' })
const usernameInputError = ref(false)
const emailInputError = ref(false)

const emailRegex = [
  { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Email invalide' },
]

const usernameRegex: Array<{ pattern: string, message: string }> = [
  { pattern: '^.{3,20}$', message: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères.' }
]

onMounted(async () => {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  if (!token || !storedUser) {
    router.push('/login')
    return
  }

  try {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const apiKey = import.meta.env.VITE_API_KEY || ''
    const userObj = JSON.parse(storedUser)
    const userId = userObj.users_id

    if (!userId) {
      toast.error('Utilisateur non trouvé.')
      router.push('/login')
      return
    }

    const response = await fetch(`${base}users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }

    const fetchedUser = await response.json()
    user.value = fetchedUser
    editUser.value = {
      username: fetchedUser.username || '',
      email: fetchedUser.email || '',
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur :', error)
    toast.error('Erreur lors de la récupération du profil.')
    router.push('/login')
  }
})

async function onSaveProfile() {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  if (!token || !storedUser) {
    router.push('/login')
    return
  }

  try {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const apiKey = import.meta.env.VITE_API_KEY || ''
    const userObj = JSON.parse(storedUser)
    const userId = userObj.users_id

    if (!userId) {
      toast.error('Utilisateur non trouvé.')
      router.push('/login')
      return
    }

    const response = await fetch(`${base}users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editUser.value),
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }

    const updatedUser = await response.json()
    user.value = updatedUser
    isEditing.value = false
    toast.success('Profil mis à jour avec succès !')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des informations utilisateur :', error)
    toast.error('Erreur lors de la sauvegarde du profil.')
  }
}

const menuItems = [
  { key: 'profil', label: 'Modifier le profil' },
  // { key: 'paiement', label: 'Mode de paiements' },
  // { key: 'historique', label: 'Historique' },
  // { key: 'mdp', label: 'Changer le mot de passe' },
  { key: 'deconnexion', label: 'Se déconnecter' },
]

const selectedKey = ref<string | null>(null)

function onMenuItemClick(item: string) {
  if (item === 'deconnexion') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    router.push('/login')
    return
  }

  if (item === 'profil') {
    isEditing.value = true
    return
  }

  selectedKey.value = item
}

function onEditAvatar() {
  alert("Édition de l'avatar")
}
</script>

<style scoped>
.profil-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.profil-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profil-header {
  width: 100%;
  background: #f5f5f5;
  padding: 10px 0;
  text-align: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-avatar {
  margin-top: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.user-info {
  text-align: center;
  margin: 20px 0;
}

.edit-form {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
}

.edit-form .form-group {
  margin-bottom: 15px;
}

.edit-form .form-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.profil-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 450px;
  margin: 10px auto;
}

ul {
  list-style: none;
  padding: 0;
  margin: 23px;
  width: 70%;
}

li {
  background: #f9f8f6;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  padding: 12px 20px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

li:hover {
  background: #f8e5d1;
}

li.active {
  background: #f8f8f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>