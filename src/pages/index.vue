<template>
  <div class="home-page">
    <!-- Header -->
    <Navbar />

    <!-- Banner -->
    <section class="banner">
      <img src="/banner.png" alt="Banner Markety" class="banner-content"/>
    </section>

    <!-- Catégories -->
    <section class="categories">
      <div class="categories-carousel">
        <div class="carousel-container">
          <h2>Rechercher par catégorie</h2>
          <div class="carousel-controls" v-if="hasOverflow">
            <button 
              class="carousel-btn prev" 
              @click="scrollCategories(-1)"
              :disabled="isAtStart"
            >
              ‹
            </button>
            
            <button 
              class="carousel-btn next" 
              @click="scrollCategories(1)"
              :disabled="isAtEnd"
            >
              ›
            </button>
          </div>
        </div>

        <div class="categories-list" ref="categoriesList">
          <CategoryCard v-for="cat in categories" :key="cat.name" :category="cat" />
        </div>
      </div>
    </section>

    <!-- Nouveautés -->
    <section class="products">
      <h2>Nouveautés</h2>

      <div class="products-list">
        <!-- Skeleton cards pendant le chargement -->
        <ProductCard
          v-if="loading"
          v-for="n in 6"
          :key="'skeleton-' + n"
          :is-loading="true"
        />
        
        <!-- Cartes produits -->
        <ProductCard
          v-else
          v-for="(product, idx) in products.slice(0, visibleCount)"
          :key="product.product_id"
          :product="product"
        />
      </div>

      <Button 
        v-if="visibleCount < products.length" 
        name="Voir plus de produits" 
        class="customer see-more-btn"
        @click="showMoreProducts"
      />
    </section>

    <!-- Entreprise CTA -->
    <section class="cta">
      <div class="cta-content">
        <div class="cta-text">
          <h3>Vous êtes une entreprise et vous cherchez à vendre vos produits ?</h3>
          <Button name="Devenez vendeur sur Markety !" class="customer" />
        </div>
        <img src="/seller-banner.jpg" alt="CTA" class="cta-img" />
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
// Imports UI
import { ref, onMounted, onUnmounted } from 'vue'
import Button from '@/components/ui/Button.vue'
import Navbar from '~/components/ui/Navbar.vue'
import Footer from '~/components/ui/Footer.vue'
import CategoryCard from '@/components/ui/CategoryCard.vue'
import ProductCard from '~/components/ui/ProductCard.vue'

const showSearch = ref(false)
function onSearch(query: string) {
  console.log('Recherche :', query)
  showSearch.value = false
}

const categories = [
  { name: 'Mobilier', img: '/mobilier.jpg' },
  { name: 'Décoration', img: '/decoration.jpg' },
  { name: 'Vaisselle', img: '/vaisselle.jpg' },
  { name: 'Bijoux', img: '/bijoux.jpg' },
  { name: 'Linge de Maison', img: '/linge_de_maison.jpg' },
  { name: 'Musique', img: '/musique.jpg' },
]

const categoriesList = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
const isAtStart = ref(true)
const isAtEnd = ref(false)

function checkOverflow() {
  if (categoriesList.value) {
    const el = categoriesList.value
    hasOverflow.value = el.scrollWidth > el.clientWidth
    isAtStart.value = el.scrollLeft <= 1
    isAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
  }
}

function scrollCategories(direction: number) {
  if (categoriesList.value) {
    const scrollAmount = 600
    categoriesList.value.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    })
    
    setTimeout(checkOverflow, 300)
  }
}

onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
  
  if (categoriesList.value) {
    categoriesList.value.addEventListener('scroll', checkOverflow)
  }
  
  loadProducts()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkOverflow)
  if (categoriesList.value) {
    categoriesList.value.removeEventListener('scroll', checkOverflow)
  }
})

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

const PRODUCTS_PER_ROW = ref(4)
const INITIAL_VISIBLE = ref(8)
const visibleCount = ref(INITIAL_VISIBLE.value)

function updateProductsPerRow() {
  // Largeur min d'une carte produit (ex: 220px + gap)
  const cardMinWidth = 220
  const grid = document.querySelector('.products-list')
  const gridWidth = grid ? grid.clientWidth : window.innerWidth
  const perRow = Math.max(1, Math.floor(gridWidth / cardMinWidth))
  PRODUCTS_PER_ROW.value = perRow
  INITIAL_VISIBLE.value = perRow * 2
  visibleCount.value = INITIAL_VISIBLE.value
}

onMounted(() => {
  // ...existing code...
  updateProductsPerRow()
  window.addEventListener('resize', updateProductsPerRow)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateProductsPerRow)
})

function showMoreProducts() {
  visibleCount.value = products.value.length
}

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
      cart.push({ 
        product_id: product.product_id, 
        product_name: product.product_name, 
        product_price: product.product_price, 
        product_imgurl: product.product_imgurl, 
        qty: 1 
      })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    console.log('Produit ajouté au panier :', product.product_name)
  } catch (e) {
    console.error('Erreur ajout panier', e)
  }
}


async function loadProducts() {
  loading.value = true;
  try {
    const base = import.meta.env.VITE_API_BASE_URL || '';
    const apiKey = import.meta.env.VITE_API_KEY || '';
    
    const response = await fetch(`${base}products`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    products.value = Array.isArray(data) ? data : (data.products ?? []);
    console.log('Produits chargés :', products.value);
  } catch (e) {
    console.error('Error loading products:', e);
    products.value = [];
  } finally {
    loading.value = false;
  }
}
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
  align-items: center;
}

.banner {
  width: 100vw;
  height: 60vh;
  background: #EFEFEF;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.banner-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 20% 70%;
}

.categories {
  max-width: 1300px;
  width: 100%;
  padding: 32px 40px 0 40px;
}

.categories h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.categories h2,
.products h2 {
  font-family: var(--font-title);
  font-size: 16px;
}

.categories-carousel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  border-radius: 12px;
  padding: 12px;
  background: #fff
}

.carousel-controls {
  display: flex;
  gap: 8px;
  align-self: flex-end;
}

.categories-list {
  display: flex;
  border: 1px solid var(--secondary-color);
  border-radius: 5px;
  padding: 12px;
  background: #fff;
  overflow-x: hidden;
  scroll-behavior: smooth;
  flex: 1;
  justify-content: space-evenly;
}

.carousel-btn {
  background: var(--main-color);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.carousel-btn:hover:not(:disabled) {
  background: #d4c89f;
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.carousel-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin: 12px 0 25px;
  justify-items: center;
  justify-content: center; /* Ajouté pour centrer la grille */
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
  display: block;
  width: fit-content;
  margin: 0 auto;
  margin-bottom: 40px; /* Ajouté pour l'espace sous le bouton */
}

@media (max-width: 600px) {
  .see-more-btn {
    margin-bottom: 24px; /* Un peu moins de marge sur mobile */
  }
}

.product-card .add-to-cart {
  padding: 6px 18px;
  font-size: 14px;
  white-space: nowrap;
}

.cta {
  background: #f5f5f5;
  width: 100%;
  display: flex;
  justify-content: center;
}
.cta-content {
  max-width: 1100px;
  width: 100%;
  align-items: center;
  display: flex;
  gap: 32px;
  justify-content: space-between;
}
.cta-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 30px;
}
.cta-content h3 {
  margin-bottom: 12px;
  font-family: var(--font-title);
  text-align: center;
  font-size: 18px;
  color: var(--text-color);
}

/* Responsive pour la bannière */
@media (max-width: 900px) {
  .banner {
    height: 35vh;
  }
  .categories {
    padding: 24px 10px 0 10px;
  }
  .cta-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  .cta-content > div {
    width: 100%;
  }
}

/* Responsive pour mobile */
@media (max-width: 600px) {
  .banner {
    height: 24vh;
  }
  .categories {
    padding: 12px 2vw 0 2vw;
  }
  .products {
    padding: 0 2vw;
  }
  .products-list {
    grid-template-columns: 1fr;
    gap: 12px;
    justify-content: center; /* Ajouté pour centrer sur mobile aussi */
  }
  .cta-content {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  .cta-content > div {
    width: 100%;
  }
  .cta-img {
    display: none !important; /* Masque l'image CTA sur mobile */
  }
}

/* Ajuste la taille des images de produit sur mobile */
@media (max-width: 400px) {
  .product-img {
    width: 80px;
    height: 80px;
  }
}
</style>