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

      <div v-if="loading" class="products-list">
        <!-- simple skeleton fallback -->
        <div class="product-card" v-for="n in 3" :key="'sk-'+n">
          <div class="product-img" style="opacity:.15"></div>
          <div class="product-title" style="height:14px; width:80%; background:#eee;margin-bottom:6px"></div>
          <div class="product-price" style="height:12px; width:50%; background:#eee"></div>
        </div>
      </div>

      <div v-else class="products-list"> 
          <NuxtLink class="product-card" v-for="product in products" :key="product.product_id" :to="`/products/${product.product_id}`">
            <img class="product-img" :src="product.product_imgurl" :alt="product.product_name" />
            <div class="product-title">{{ product.product_name }}</div>
            <div class="product-price">{{ formatPrice(product.product_price) }} €</div>

          <!-- bouton add-to-cart compact (utilise la classe button.add-to-cart du composant Button.vue) -->
          <Button
            variant="add-to-cart"
            @click="addToCart(product)"
          >
            Ajouter au panier
          </Button>
        </NuxtLink>
      </div>

      <Button variant="secondary" class="see-more-btn">Voir plus de produits</Button>
    </section>

    <!-- Entreprise CTA -->
    <section class="cta">
      <div class="cta-content">
        <div>
          <h3>Vous êtes une entreprise et vous cherchez à vendre vos produits ?</h3>
          <Button variant="main-custumer">Devenez vendeur sur Markety !</Button>
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
// Imports UI
import { ref, onMounted } from 'vue'
import Button from '@/components/ui/Button.vue'
import CartButton from '@/components/ui/CartButton.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'
import ProductCard from '@/components/ui/ProductCard.vue'


const showSearch = ref(false)
function onSearch(query: string) {
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

type Product = {
  product_id: string
  product_name: string
  product_price: number
  product_imgurl: string
  product_description?: string
  advice_id?: string
  user_id?: string
}

const products = ref<Product[]>([])
const loading = ref(true)

// helper to format price safely
function formatPrice(val: number | string | undefined) {
  const n = Number(val ?? 0)
  return n.toFixed(2)
}

// add to cart (localStorage) - simple implementation
function addToCart(product: Product) {
  try {
    const raw = localStorage.getItem('cart') || '[]'
    const cart: any[] = JSON.parse(raw)
    const idx = cart.findIndex((p: any) => p.product_id === product.product_id)
    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty ?? 1) + 1
    } else {
      cart.push({ product_id: product.product_id, product_name: product.product_name, product_price: product.product_price, product_imgurl: product.product_imgurl, qty: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    // console feedback — remplace par un toast si tu as un système de notifications
    console.log('Produit ajouté au panier :', product.product_name)
  } catch (e) {
    console.error('Erreur ajout panier', e)
  }
}

// Try Nuxt useFetch first (Nuxt 3). If not available, fallback to window fetch.
async function loadProducts() {
  loading.value = true
  try {
    // Nuxt auto-imports if present
    const { useFetch, useRuntimeConfig } = await import('#imports') as any
    if (useFetch && useRuntimeConfig) {
      const config = useRuntimeConfig()
      const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
      const { data, error } = await useFetch('/Product?select=*', {
        baseURL: base,
        onRequest ({ request, options }) {
          options.headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_KEY || ''}`)
          options.headers.set('apikey', import.meta.env.VITE_API_KEY || '')
        }
      })
      if (error?.value) {
        console.error('useFetch error:', error.value)
      } else if (data?.value) {
        products.value = Array.isArray(data.value) ? data.value : (data.value.products ?? [])
      }
      loading.value = false
      return
    }
  } catch (e) {
    // fallback below
  }

  // Fallback fetch (Vue / Vite)
  try {
    const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
    const res = await fetch(`${base.replace(/\/$/,'')}/products`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    products.value = Array.isArray(json) ? json : (json.products ?? [])
  } catch (err) {
    console.error('Erreur fetch produits:', err)
    products.value = [
      {
        product_id: 'fallback-1',
        product_name: 'Produit indisponible',
        product_price: 0,
        product_imgurl: '/logo.svg',
        product_description: 'Impossible de récupérer les produits.'
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(loadProducts)
</script>

<style scoped>
.icon-btn {
  background: none;
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
  width: 200px;
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
button.customer {
  background-color: var(--main-color);
  color: white;
  border: none;
  box-shadow: 0 0 7px rgba(98, 100, 88, 0.5);
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
  object-fit: cover;
}
.product-title {
  font-size: 11px;
  color: #222;
  margin-bottom: 4px;
  text-align: center;
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

/* petite adaptation si tu veux ajuster la taille du add-to-cart dans cette page */
.product-card .add-to-cart {
  padding: 6px 18px;
  font-size: 14px;
  white-space: nowrap;
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