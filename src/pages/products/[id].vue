<template>
  <header class="navbar-container" role="navigation" aria-label="Main navigation">
    <div class="navbar-left">
      <NuxtLink to="/" class="logo-link">
        <img src="/logo.svg" alt="Logo" class="logo-img" />
      </NuxtLink>
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

  <main class="product-page">
    <div v-if="loading" class="center">Chargement…</div>
    <div v-else-if="!product" class="center">Produit introuvable.</div>
    <div v-else class="product-grid">
      <div class="gallery">
        <div class="main-image">
          <img :src="mainImageSrc" :alt="product.product_name" />
        </div>
        <div class="thumbs">
          <div
            v-for="(img, i) in imageList"
            :key="i"
            class="thumb"
            :class="{ selected: i === mainImageIndex }"
            @click="setMainImage(i)"
          >
            <img :src="img" :alt="`Aperçu ${i+1}`" />
          </div>
        </div>
      </div>
      <div class="details">
        <div class="title-row">
          <h1 class="name">{{ product.product_name }}</h1>
          <span class="price">{{ formatPrice(product.product_price) }} €</span>
        </div>
        <div class="meta" v-if="product.product_description">{{ product.product_description }}</div>
        <div class="qty-row">
          <span>Quantité :</span>
          <QuantityControl v-model="qty" />
        </div>
        <div class="actions">
          <Button name="Ajouter au panier" btnClass="add-to-cart" @click="localAddToCart" />
          <Button name="Acheter maintenant" btnClass="customer" @click="buyNow" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import QuantityControl from '@/components/ui/Quantity.vue'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import CartButton from '@/components/ui/CartButton.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'

const showSearch = ref(false)
function onSearch(query: string) {
  showSearch.value = false
}

const route = useRoute()
const isActive = (path: string) => route.path === path

const router = useRouter()
const product = ref<any | null>(null)
const loading = ref(false)
const qty = ref<number>(1)
const mainImageIndex = ref<number>(0)

function formatPrice(v?: number | string) { return Number(v ?? 0).toFixed(2) }

const imageList = computed(() => {
  if (!product.value) return [ '/logo.svg' ]
  if (Array.isArray(product.value.images) && product.value.images.length) return product.value.images
  if (product.value.product_imgurl) return [product.value.product_imgurl]
  return ['/logo.svg']
})

const mainImageSrc = computed(() => {
  const list = imageList.value
  const idx = Math.min(Math.max(0, mainImageIndex.value), list.length - 1)
  return list[idx]
})

function setMainImage(i: number) { mainImageIndex.value = i }
function addToCartWithQty(p = product.value) {
  if (!p) return
  try {
    const key = 'cart'
    const raw = localStorage.getItem(key) || '[]'
    const cart: any[] = JSON.parse(raw)
    const idx = cart.findIndex(x => x.product_id === p.product_id)
    if (idx >= 0) cart[idx].qty = (cart[idx].qty ?? 1) + qty.value
    else cart.push({
      product_id: p.product_id,
      product_name: p.product_name,
      product_price: p.product_price,
      product_imgurl: p.product_imgurl,
      qty: qty.value
    })
    localStorage.setItem(key, JSON.stringify(cart))
    console.log('Ajouté au panier :', p.product_name, 'x', qty.value)
  } catch (e) { console.error(e) }
}

function buyNow() {
  addToCartWithQty()
  router.push({ path: '/cart' }).catch(() => {})
}

async function loadProductById(id: string) {
  product.value = null
  if (!id) return
  loading.value = true

  try {
    const { useFetch, useRuntimeConfig } = await import('#imports') as any
    if (useFetch && useRuntimeConfig) {
      const config = useRuntimeConfig()
      const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
      const { data, error } = await useFetch(`products/${id}`, {
        baseURL: base,
        onRequest ({ request, options }: any) {
          options.headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_KEY || ''}`)
          options.headers.set('apikey', import.meta.env.VITE_API_KEY || '')
        }
      })
      if (error?.value) console.error('useFetch error:', error.value)
      else if (data?.value) product.value = Array.isArray(data.value) ? data.value[0] : data.value
      loading.value = false
      return
    }
  } catch (e) {
    // ignore nuxt import failure and fallback to fetch
  }

  try {
    const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
    const url = base ? `${base.replace(/\/$/,'')}/products/${id}` : `/products/${id}`
    const res = await fetch(url)
    if (res.ok) {
      const j = await res.json()
      product.value = Array.isArray(j) ? j[0] : j
    } else {
      const res2 = await fetch(`${base.replace(/\/$/,'')}/Product?select=*&product_id=eq.${id}`, {
        headers: { apikey: (import.meta.env.VITE_API_KEY || '') }
      })
      if (res2.ok) {
        const j2 = await res2.json()
        product.value = Array.isArray(j2) ? j2[0] : j2
      } else product.value = null
    }
  } catch (err) {
    console.error('Erreur fetch produit:', err)
    product.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = String((route.params.id ?? route.query.id) || '')
  loadProductById(id)
})

watch(
  () => [route.params.id, route.query.id],
  ([paramId, queryId]) => {
    const id = String(paramId ?? queryId ?? '')
    loadProductById(id)
  }
)
</script>
<style scoped>

.logo-link img,
.logo-img {
  height: 28px !important;
  width: auto !important;
  max-height: 28px !important;
  /* Force la taille du logo Markety */
}


.product-page {
  padding: 10px 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}




.main-image img {
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.thumb {
  display: flex;
  gap: 10px;
  border: 2px solid transparent;
  padding: 2px;
  cursor: pointer;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
}



.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.name {
  font-size: 22px;
  margin: 0;
  line-height: 1.1;
  flex: 1;
}
.price {
  font-weight: 700;
  color: #4b5563;
  font-size: 20px;
  white-space: nowrap;
}

.meta {
  color: #374151;
  margin-top: 6px;
}

.qty-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

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

@media (max-width: 900px) {
    .nav-links { gap: 20px; }
    .navbar-container { padding: 16px 20px; }
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