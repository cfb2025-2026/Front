<template>
<Navbar :showSearch="showSearch" @search="onSearch" />
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
        <div class="info">
          <div class="title-row">
            <h1 class="name">{{ product.product_name }}</h1>
            <span class="price">{{ formatPrice(product.product_price) }} €</span>
          </div>
          <div class="meta" v-if="product.product_description">{{ product.product_description }}</div>
          <div class="qty-row">
            <span>Quantité</span>
            <QuantityControl v-model="qty" />
          </div>
        </div>

        <div class="actions">
          <Button name="Ajouter au panier" class="customer" @click="addToCartWithQty" />
          <Button name="Acheter maintenant" class="secondary" @click="buyNow" />
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import QuantityControl from '@/components/ui/Quantity.vue'
import Navbar from '~/components/ui/Navbar.vue'
import Footer from '~/components/ui/Footer.vue'

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
      console.log('Produit chargé avec useFetch :', product.value)
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
Button {
  width: fit-content;
}
.product-page {
  padding: 20px 0 60px;
  display: flex;
  justify-content: center;
  color: var(--color-text);
}

.product-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  margin-top: 20px;
  max-width: 1000px;
}

.main-image img {
  width: 350px;
  height: 350px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 10px;
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

.details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 15px;
  justify-content: space-between;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  font-family: var(--font-title);
}
.price {
  font-weight: 700;
  color: var(--main-color);
  font-size: 20px;
  white-space: nowrap;
}

.meta {
  color: #374151;
  margin-top: 6px;
  line-height: 1.7;
}

.qty-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  justify-content: flex-end;
}
</style>