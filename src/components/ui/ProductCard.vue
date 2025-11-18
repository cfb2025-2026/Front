<template>
  <NuxtLink :to="`/products/${product.product_id}`" class="product-card-link">
    <div class="product-card">
      <img class="product-img" :src="product.product_imgurl" :alt="product.product_name" />
      <div class="product-title">{{ product.product_name }}</div>
      <div class="product-price">{{ formatPrice(product.product_price) }} €</div>
  <Button name="Ajouter" class="add-to-cart" @click="localAddToCart" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'


const props = defineProps<{ product: any }>()
function formatPrice(val: number | string | undefined) { return Number(val ?? 0).toFixed(2) }

function localAddToCart(e?: Event) {
  // récupère le produit depuis props
  const p = (props as any).product
  try {
    const key = 'cart'
    const raw = localStorage.getItem(key) || '[]'
    const cart: any[] = JSON.parse(raw)
    const idx = cart.findIndex(x => x.product_id === p.product_id)
    if (idx >= 0) cart[idx].qty = (cart[idx].qty ?? 1) + 1
    else cart.push({ product_id: p.product_id, product_name: p.product_name, product_price: p.product_price, product_imgurl: p.product_imgurl, qty: 1 })
    localStorage.setItem(key, JSON.stringify(cart))
    console.log('Ajouté au panier :', p.product_name)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
.product-card-link { text-decoration: none; color: inherit; display:block; }
.product-card { padding:12px; border-radius:8px; background:#fff; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:0 1px 3px rgba(0,0,0,.04); }
.product-img { width:160px; height:120px; object-fit:cover; border-radius:8px; background:#f4f4f4; }
.product-title { font-weight:600; text-align:center; }
.product-price { color:#4b5563; }
.add-to-cart { margin-top:6px; }
</style>