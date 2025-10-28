<template>
  <header class="navbar-container" role="navigation" aria-label="Main navigation">
    <div class="navbar-left">
      <NuxtLink to="/" class="logo-link"><img src="/logo.svg" alt="Logo" /></NuxtLink>
    </div>

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
      
      <CartButton :count="1" />
      <NuxtLink to="/profil"><UserIcon /></NuxtLink>
    </div>
  </header>
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
<style scoped>
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
</style>
