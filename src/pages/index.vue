<template>
  <div class="home-page">
    <!-- Header -->
    <Navbar />

    <!-- Banner -->
    <section class="banner">
      <div class="banner-content">BANNIÈRE</div>
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
      <div v-if="loading" class="products-list">
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
          <Button name="Ajouter au panier" class="add-to-cart" @click="addToCart(product)" />
        </NuxtLink>
      </div>
      <Button name="Voir plus de produits" class="secondary see-more-btn" />
    </section>

    <!-- Entreprise CTA -->
    <section class="cta">
      <div class="cta-content">
        <div>
          <h3>Vous êtes une entreprise et vous cherchez à vendre vos produits ?</h3>
          <Button name="Devenez vendeur sur Markety !" class="customer" />
        </div>
      </div>
    </section>

    <StripeCheckout />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from '@/components/ui/Button.vue'
import Navbar from '~/components/ui/Navbar.vue'
import Footer from '~/components/ui/Footer.vue'
import CategoryCard from '@/components/ui/CategoryCard.vue'

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
  { name: 'Musique', img: '/musique.jpeg' },
]

const categoriesList = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const cart = ref<any[]>([])
const cartTotal = ref(0)

function loadCart() {
  const raw = localStorage.getItem('cart') || '[]'
  cart.value = JSON.parse(raw)
  cartTotal.value = cart.value.reduce((sum, item) => sum + item.product_price * item.qty, 0)
}

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
  loadCart()
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

function formatPrice(val: number | string | undefined) {
  const n = Number(val ?? 0)
  return n.toFixed(2)
}

function addToCart(product: Product) {
  try {
    const raw = localStorage.getItem('cart') || '[]'
    const cartArr: any[] = JSON.parse(raw)
    const idx = cartArr.findIndex((p: any) => p.product_id === product.product_id)
    if (idx >= 0) {
      cartArr[idx].qty = (cartArr[idx].qty ?? 1) + 1
    } else {
      cartArr.push({ product_id: product.product_id, product_name: product.product_name, product_price: product.product_price, product_imgurl: product.product_imgurl, qty: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cartArr))
    cart.value = cartArr
    cartTotal.value = cartArr.reduce((sum, item) => sum + item.product_price * item.qty, 0)
    console.log('Produit ajouté au panier :', product.product_name)
  } catch (e) {
    console.error('Erreur ajout panier', e)
  }
}

async function loadProducts() {
  loading.value = true
  try {
    const { useFetch, useRuntimeConfig } = await import('#imports') as any
    if (useFetch && useRuntimeConfig) {
      const config = useRuntimeConfig()
      const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
      const { data, error } = await useFetch('products', {
        baseURL: base,
        onRequest ({ request, options }: { request: Request; options: any }) {
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
    console.log('Error using useFetch', e);
  }
}

const checkout = async () => {
  const response = await fetch('http://localhost:3001/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: cartTotal.value })
  })
  const data = await response.json()
  if (data.url) {
    window.location.href = data.url
  } else {
    alert("Erreur lors de la création du paiement.")
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
  max-width: 1300px;
  width: 100%;
  padding: 32px 40px 0 40px;
}

.categories h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.categories-carousel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  border: 2px solid #fcf6f6;
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
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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

.product-card .add-to-cart {
  padding: 6px 18px;
  font-size: 14px;
  white-space: nowrap;
}

.cart-section {
  max-width: 500px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  padding: 24px;
}
.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.cart-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
}
.cart-details {
  flex: 1;
}
.cart-title {
  font-weight: bold;
  font-size: 1rem;
}
.cart-price {
  color: #888;
  font-size: 0.95rem;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 18px 0;
}
.checkout-btn {
  width: 100%;
  background: #a3a595;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  padding: 16px;
  margin-top: 8px;
  cursor: pointer;
  font-size: 1.1rem;
}
</style>