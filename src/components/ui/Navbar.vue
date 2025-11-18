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
            <button class="search-trigger" aria-label="Ouvrir la recherche" @click="openSpotlight">
                <searchIcon />
            </button>
            <NuxtLink to="/profil"><UserIcon /></NuxtLink>
            <CartButton :count="1" />
            <!-- mobile toggle button -->
            <button
                class="mobile-toggle"
                @click="toggleMobile"
                :aria-expanded="mobileOpen.toString()"
                aria-controls="mobile-drawer"
                aria-label="Ouvrir le menu"
            >
                <span v-if="!mobileOpen" class="icon-hamburger" aria-hidden="true">
                    <!-- simple hamburger -->
                    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.5h22M0 7h22M0 12.5h22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                <span v-else class="icon-close" aria-hidden="true">
                    <!-- close icon -->
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
            </button>
        </div>
    </header>

    <!-- mobile drawer (slides from right) -->
    <teleport to="body">
        <transition name="drawer">
            <div
                v-if="mobileOpen"
                class="drawer-overlay"
                @click.self="closeMobile"
            >
                <aside
                    id="mobile-drawer"
                    class="mobile-drawer"
                    role="dialog"
                    aria-label="Menu"
                    aria-modal="true"
                >
                    <div class="drawer-header">
                        <img src="/logo.svg" alt="Logo" />
                        <button class="close-btn" @click="closeMobile" aria-label="Fermer le menu">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </button>
                    </div>
                    <nav class="drawer-nav">
                        <ul class="mobile-links" role="menu">
                            <li role="none"><NuxtLink role="menuitem" @click="closeMobile" to="/mobilier" :class="{ active: isActive('/mobilier') }">Mobilier</NuxtLink></li>
                            <li role="none"><NuxtLink role="menuitem" @click="closeMobile" to="/decoration" :class="{ active: isActive('/decoration') }">Décoration</NuxtLink></li>
                            <li role="none"><NuxtLink role="menuitem" @click="closeMobile" to="/bijoux" :class="{ active: isActive('/bijoux') }">Bijoux</NuxtLink></li>
                            <li role="none"><NuxtLink role="menuitem" @click="closeMobile" to="/vaisselle" :class="{ active: isActive('/vaisselle') }">Vaisselle</NuxtLink></li>
                            <li role="none"><NuxtLink role="menuitem" @click="closeMobile" to="/linge-de-maison" :class="{ active: isActive('/linge-de-maison') }">Linge de Maison</NuxtLink></li>
                        </ul>
                    </nav>
                </aside>
            </div>
        </transition>
    </teleport>

    <SearchOverlay :visible="spotlightVisible" @close="closeSpotlight" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import searchIcon from '~/assets/icons/SearchIcon.vue'
import UserIcon from '~/assets/icons/UserIcon.vue';
import CartButton from './CartButton.vue';
import SearchOverlay from './SearchOverlay.vue' // ajout

const route = useRoute()
const isActive = (path) => route.path === path

const mobileOpen = ref(false)
const toggleMobile = () => { mobileOpen.value = !mobileOpen.value }
const closeMobile = () => { mobileOpen.value = false }

const spotlightVisible = ref(false)
function openSpotlight() { spotlightVisible.value = true }
function closeSpotlight() { spotlightVisible.value = false }

function onKey(e) {
  if (e.key === 'Escape' && mobileOpen.value) closeMobile()
  // Cmd+K / Ctrl+K
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    spotlightVisible.value = true
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background-color: #fff;
    width: 100%;
    color: var(--text-color);
    position: relative;
    z-index: 30;
}

/* center nav (desktop) */
.navbar-center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-links {
    display: flex;
    gap: 40px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-links li {
    font-size: 14px;
    font-weight: 500;
}

.nav-link {
    position: relative;
    text-decoration: none;
    color: var(--text-color);
    padding-bottom: 6px;
    display: inline-block;
}

.nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: var(--main-color);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease;
}

.nav-link:hover::after,
.nav-link.active::after {
    transform: scaleX(1);
}

/* right section */
.navbar-right {
    display: flex;
    align-items: center;
    gap: 25px;
}

/* mobile toggle (hidden on desktop) */
.mobile-toggle {
    display: none;
    background: transparent;
    border: none;
    padding: 6px;
    cursor: pointer;
    color: inherit;
}

/* Drawer overlay + panel */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1200;
  display: flex;
  justify-content: flex-end;
}

.mobile-drawer {
  width: min(86vw, 360px);
  height: 100%;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border-left: 1px solid rgba(0,0,0,0.06);
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawer-header img { height: 32px; width: auto; }
.close-btn {
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: inherit;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.mobile-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}
.mobile-links a {
    padding: 10px 6px;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    display: block;
}

/* Slide-in transition */
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .mobile-drawer,
.drawer-leave-to .mobile-drawer {
  transform: translateX(100%);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 200ms ease;
}
.drawer-enter-active .mobile-drawer,
.drawer-leave-active .mobile-drawer {
  transition: transform 300ms ease;
}

/* Responsive breakpoints */
@media (max-width: 900px) {
    .nav-links { gap: 20px; }
    .navbar-container { padding: 16px 20px; }
}

@media (max-width: 768px) {
    .navbar-center { display: none; } /* hide desktop nav */
    .mobile-toggle { display: inline-flex; align-items: center; gap: 6px; }
    .navbar-right { gap: 12px; }
    .logo-link img { height: 34px; width: auto; }
}

/* accessibility focus styles */
a:focus, button:focus {
    outline: 3px solid rgba(0, 120, 212, 0.15);
    outline-offset: 2px;
}

.search-trigger {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
</style>