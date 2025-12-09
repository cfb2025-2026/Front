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
          <button class="edit-avatar" @click="onEditAvatar">
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#fff"/>
              <path d="M15.5 6.5l2 2M7 17l8.5-8.5a1.414 1.414 0 1 1 2 2L9 19H7v-2z" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="profil-menu">
        <MenuItem @click="onItemClick('profil')" @edit="onEditClick('profil')">
          <template #icon>
            <span>👤</span>
          </template>
          Modifier le profil
        </MenuItem>
        <MenuItem @click="onItemClick('motdepasse')" @edit="onEditClick('motdepasse')">
          <template #icon>
            <span>🔑</span>
          </template>
          Mot de passe
        </MenuItem>
        <MenuItem @click="onItemClick('historique')" @edit="onEditClick('historique')">
          <template #icon>
            <span>📄</span>
          </template>
          Historique
        </MenuItem>
        <MenuItem @click="onItemClick('notifications')" @edit="onEditClick('notifications')">
          <template #icon>
          </template>
          Notifications
        </MenuItem>
        <MenuItem @click="onItemClick('deconnexion')" @edit="onEditClick('deconnexion')">
          <template #icon>
            <span>🚪</span>
          </template>
          Déconnexion
        </MenuItem>
      </div>

    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/ui/Navbar.vue'
import Footer from '@/components/ui/Footer.vue'
import MenuItem from '@/components/profil/MenuItem.vue'

const router = useRouter()

const users = ref([])

async function getUsers() {

}

onMounted(() => {
  getUsers()
})

function onItemClick(item: string) {
  if (item === 'deconnexion') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    return
  }
  alert('Item cliqué : ' + item)
}
function onEditClick(item: string) {
  alert('Bouton édition cliqué : ' + item)
}
function onEditAvatar() {
  alert('Édition de l\'avatar')
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
  padding: 10px 0 10px 0;
  display: flex;
  justify-content: center;
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

.profil-menu {
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: transparent;
  align-items: center;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  background: #fff;
  padding: 8px 0;
}

.navbar-left {
  display: flex;
  align-items: center;
  margin-left: 24px;
}

.logo-link img {
  height: 32px;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  flex-direction: row;
  gap: 40px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  color: #222;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-right: 24px;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.users-list {
  margin-top: 32px;
  margin-bottom: 32px;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  max-width: 400px;
  width: 100%;
  text-align: center;
}
</style>