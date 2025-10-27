<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <img src="/logo.svg" alt="Markety" class="header-logo" />
      <nav class="header-nav">
        <a href="#">Mobilier</a>
        <a href="#">Décoration</a>
        <a href="#">Réno</a>
        <a href="#">Vaisselle</a>
        <a href="#">Linge de Maison</a>
      </nav>
      <div class="header-icons">
        <SearchIcon />
        <CartButton />
        <UserIcon />
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
          <div>Réno</div>
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
import Button from '@/components/ui/Button.vue'
import CartButton from '@/components/ui/CartButton.vue'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'

const categories = [
  { name: 'Mobilier', img: '/public/cat-mobilier.jpg' },
  { name: 'Décoration', img: '/public/cat-deco.jpg' },
  { name: 'Réno', img: '/public/cat-reno.jpg' },
  { name: 'Vaisselle', img: '/public/cat-vaisselle.jpg' },
  { name: 'Linge de Maison', img: '/public/cat-linge.jpg' },
  { name: 'Catégorie +', img: '/public/cat-plus.jpg' }
]
</script>

<style scoped>
.home-page {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  width: 100vw;
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
  align-items: center;
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
  border: 3px solid #3A8DFF;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
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
.cta-img {
  width: 220px;
  border-radius: 10px;
  object-fit: cover;
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