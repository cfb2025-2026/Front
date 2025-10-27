<template>
  <header class="navbar-container" role="navigation" aria-label="Main navigation">
    <div class="navbar-left">
      <NuxtLink to="/" class="logo-link"><img src="/logo.svg" alt="Logo" /></NuxtLink>
    </div>

    <!-- desktop center nav -->
    <nav class="navbar-center" aria-hidden="false">
      <ul class="nav-links">
        <li><NuxtLink to="/mobilier" class="nav-link" :class="{ active: isActive('/mobilier') }">Mobilier</NuxtLink></li>
        <li><NuxtLink to="/decoration" class="nav-link" :class="{ active: isActive('/decoration') }">Décoration</NuxtLink></li>
        <li><NuxtLink to="/bijoux" class="nav-link" :class="{ active: isActive('/bijoux') }">Bijoux</NuxtLink></li>
        <li><NuxtLink to="/vaisselle" class="nav-link" :class="{ active: isActive('/vaisselle') }">Vaisselle</NuxtLink></li>
        <li><NuxtLink to="/linge-de-maison" class="nav-link" :class="{ active: isActive('/linge-de-maison') }">Linge de Maison</NuxtLink></li>
      </ul>
    </nav>

    <div class="navbar-right">
  <div class="searchbar-container">
    <button
      class="icon-btn"
      @click="showSearch = true"
      aria-label="Rechercher"
      v-if="!showSearch"
    >
      <SearchIcon />
    </button>
    <SearchBar
      v-if="showSearch"
      @search="onSearch"
      placeholder="Rechercher un produit..."
    />
  </div>
  <NuxtLink to="/profil"><UserIcon /></NuxtLink>
  <CartButton :count="1" />
</div>
      <!-- mobile toggle button -->
      <button
        class="mobile-toggle"
        @click="toggleMobile"
        :aria-expanded="mobileOpen.toString()"
        aria-controls="mobile-drawer"
        aria-label="Ouvrir le menu"
      >
        <span v-if="!mobileOpen" class="icon-hamburger" aria-hidden="true">
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.5h22M0 7h22M0 12.5h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </span>
        <span v-else class="icon-close" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </span>
      </button>
    </div>
  </header>
  <!-- ...reste inchangé... -->
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import UserIcon from '~/assets/icons/UserIcon.vue'
import CartButton from './CartButton.vue'

import SearchIcon from '~/assets/icons/SearchIcon.vue'
import SearchBar from './SearchBar.vue'
const route = useRoute()
const isActive = (path) => route.path === path

const mobileOpen = ref(false)
const toggleMobile = () => { mobileOpen.value = !mobileOpen.value }
const closeMobile = () => { mobileOpen.value = false }

const showSearch = ref(false)

function onKey(e) {
  if (e.key === 'Escape' && mobileOpen.value) closeMobile()
  if (e.key === 'Escape' && showSearch.value) showSearch.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function onSearch(query) {
  // Traite la recherche ici (par exemple, redirige ou filtre)
  console.log('Recherche :', query)
  showSearch.value = false // ferme la barre après recherche
}
</script>

<style scoped>
.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.searchbar-container {
  width: 220px;
  background: pink; /* test visuel */
}
</style>