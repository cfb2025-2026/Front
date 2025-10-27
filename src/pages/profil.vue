<template>
  <div class="profil-page">
    <!-- Header -->
    <header class="header">
      <img src="/logo.svg" alt="Markety" class="header-logo" />
      <nav class="header-nav">
        <a href="#">Mobiliers</a>
        <a href="#">Découvertes</a>
        <a href="#">Bijoux</a>
        <a href="#">Vaisselles</a>
        <a href="#">Linge de maison</a>
    </nav>
      <div class="header-icons">
        <span>🔍</span>
        <span>🛒</span>
        <span>👤</span>
      </div>
    </header>

    <!-- Avatar -->
    <div class="profil-header">
      <div class="avatar-wrapper">
        <div class="avatar">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <circle cx="35" cy="35" r="35" fill="#EFEFEF"/>
            <circle cx="35" cy="30" r="14" fill="#D6B7A0"/>
            <ellipse cx="35" cy="54" rx="20" ry="12" fill="#D6B7A0"/>
          </svg>
        </div>
        <button class="edit-avatar" @click="onEditAvatar">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
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
          <span>🔔</span>
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

    <!-- Footer -->
    <footer class="footer">
      <img src="/logo.svg" alt="Markety" class="footer-logo" />
      <div class="footer-links">
        <div>
          <strong>EXPLOREZ</strong>
          <div>Mobiliers</div>
          <div>Décorations</div>
          <div>Bijoux</div>
          <div>Vaisselles</div>
          <div>Linge de Maison</div>
        </div>
        <div>
          <strong>CONTACTEZ</strong>
          <div>contact@markety.com</div>
          <div>+33 6 12 23 01 45</div>
        </div>
      </div>
      <div class="footer-copy">
        Copyright © 2024 Markety. Tous droits réservés.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/components/profil/MenuItem.vue'

function onItemClick(item: string) {
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
  align-items: center;
}
.header {
  width: 100vw;
  background: #f5f5f5;
  padding: 12px 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-logo {
  height: 32px;
  margin-left: 32px;
}
.header-nav {
  display: flex;
  gap: 24px;
}
.header-nav a {
  color: #222;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
}
.header-icons {
  display: flex;
  gap: 18px;
  margin-right: 32px;
  font-size: 20px;
}
.profil-header {
  width: 100vw;
  background: #f5f5f5;
  padding: 32px 0 48px 0;
  display: flex;
  justify-content: center;
}
.avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #EFEFEF;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.edit-avatar {
  position: absolute;
  right: 0;
  bottom: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transform: translate(30%, 30%);
}
.profil-menu {
  margin: 0 auto;
  margin-top: -30px;
  max-width: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: transparent;
}
.footer {
  width: 100vw;
  background: #f5f5f5;
  padding: 55px 0 6px 0; /* Hauteur réduite */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px; /* Optionnel : réduit l'espace au-dessus */
}
.footer-logo {
  display: block;
  height: 28px; /* Optionnel : réduit la taille du logo */
  margin-bottom: 8px;
}
.footer-links {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.footer-links div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: #444;
}
.footer-copy {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
</style>