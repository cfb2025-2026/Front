<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
  <img src="/logo.svg" alt="Markety" class="header-logo" />
  <nav class="header-nav">
        <a href="#">Mobilier</a>
        <a href="#">Décoration</a>
        <a href="#">Vaisselle</a>
        <a href="#">Bijoux</a>
        <a href="#">Linge de Maison</a>
      </nav>
      <div class="header-icons">
  <div class="searchbar-container">
    <button class="icon-btn" @click="showSearch = true" v-if="!showSearch" aria-label="Rechercher">
      <SearchIcon />
    </button>
    <SearchBar
      v-if="showSearch"
      @search="onSearch"
      placeholder="Rechercher un produit..."
    />
  </div>
  <CartButton />
  <NuxtLink to="/profil"><UserIcon /></NuxtLink>

</div>
    </header>

    <!-- Banner -->
    <section class="banner">
      <div class="banner-content">BANNIÈRE</div>
    </section>

    <!-- Catégories -->
    <section class="categories">
      <h2>Rechercher par catégorie</h2>
      <div class="categories-list">
        <div class="category-card" v-for="cat in categories" :key="cat.name">
          <img :src="cat.img" :alt="cat.name" />
          <div class="category-label">{{ cat.name }}</div>
        </div>
      </div>
    </section>

    <!-- Nouveautés -->
    <section class="products">
      <h2>Nouveautés</h2>
      <div class="products-list">
        <div class="product-card" v-for="n in 12" :key="n">
          <div class="product-img"></div>
          <div class="product-title">Nom du produit</div>
          <div class="product-price">XX,XX €</div>
          <Button name="Ajouter au panier" style="add-to-cart" />
        </div>
      </div>
      <Button name="Voir plus de produits" style="add-to-cart" class="see-more-btn" />
    </section>

    <!-- Entreprise CTA -->
    <section class="cta">
      <div class="cta-content">
        <div>
          <h3>Vous êtes une entreprise et vous cherchez à vendre vos produits ?</h3>
          <Button name="Devenez vendeur sur Markety !" style="seller" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <img src="/logo.svg" alt="Markety" class="footer-logo" />
      <div class="footer-links">
        <div>
          <strong>EXPLORER</strong>
          <div>Mobilier</div>
          <div>Décoration</div>
          <div>Bijoux</div>
          <div>Vaisselle</div>
          <div>Linge de Maison</div>
        </div>
        <div>
          <strong>CONTACT</strong>
          <div>contact@markety.com</div>
          <div>+33 1 23 45 67 89</div>
        </div>
      </div>
      <div class="footer-copy">
        Copyright © 2024 Markety. Tous droits réservés.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import CartButton from '@/components/ui/CartButton.vue'
import SearchBar from '@/components/ui/SearchBar.vue'

import SearchIcon from '@/assets/icons/SearchIcon.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'


const showSearch = ref(false)
function onSearch(query: string) {
  // Traite la recherche ici (redirige, filtre, etc.)
  console.log('Recherche :', query)
  showSearch.value = false
}

const categories = [
  { name: 'Mobilier', img: '/mobilier.svg' },
  { name: 'Décoration', img: '/décoration.svg' },
  { name: 'Vaisselle', img: '/vaisselle.svg' },
  { name: 'Bijoux', img: '/bijoux.svg' }, 
  { name: 'Linge de Maison', img: '/linge de maison.svg' },
]
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
.home-page {
  max-width: 100vw;
  margin: 0 auto;
  overflow-x: hidden;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  width: 99vw;
  background: #f5f5f5;
  padding: 12px 0;
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
  margin-left: 150px;
  gap: 30px;
  justify-content: center;
  flex: 1;
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
  align-items: center;
  justify-content: flex-end;
}

.searchbar-container {
  width: 200px; /* adapte la largeur à ta SearchBar */
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.banner {
  width: 100vw;
  height: 120px;
  background: #EFEFEF;
  display: flex;
  align-items: center;
  justify-content: center;
}
.banner-content {
  color: #888;
  font-size: 18px;
  font-weight: 600;
}
.categories {
  max-width: 1100px;
  margin: 32px auto 0 auto;
  width: 100%;
}
.categories-list {
  display: flex;
  gap: 18px;
  margin-top: 12px;
  border: 2px solid #e8deb5ff;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 190px;
  cursor: pointer;
}
.category-card img {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f5;
}
.category-label {
  margin-top: 6px;
  font-size: 14px;
  color: #444;
}
.products {
  max-width: 1100px;
  margin: 32px auto 0 auto;
  width: 100%;
}
.products-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
  margin-top: 12px;
}
.product-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.product-img {
  width: 100px;
  height: 100px;
  background: #EFEFEF;
  border-radius: 8px;
  margin-bottom: 8px;
}
.product-title {
  font-size: 14px;
  color: #222;
  margin-bottom: 4px;
}
.product-price {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}
.see-more-btn {
  margin: 24px auto 0 auto;
  display: block;
}
.cta {
  background: #f5f5f5;
  margin: 40px 0 0 0;
  padding: 24px 0;
}
.cta-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: space-between;
}
.cta-content h3 {
  margin-bottom: 12px;
}
.footer {
  width: 100vw;
  background: #f5f5f5;
  padding: 12px 0 6px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
}
.footer-logo {
  display: block;
  height: 28px;
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