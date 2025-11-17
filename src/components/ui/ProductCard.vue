<template>
  <div class="product-card">
    <NuxtLink :to="`/products/${product.product_id}`" class="product-card-link">
      <div class="img-placeholder">
        <img
          v-if="product.product_imgurl"
          class="product-img"
          :src="product.product_imgurl"
          :alt="product.product_name"
        />
        <div v-else class="empty-img"></div>
      </div>
      <div class="product-title">{{ product.product_name }}</div>
      <div class="product-desc" v-if="product.product_brand">{{ product.product_brand }}</div>
      <div class="product-row">
        <div class="product-price">{{ formatPrice(product.product_price) }}€</div>
      </div>
    </NuxtLink>
    <Button
      name="Ajouter au panier"
      btnClass="add-to-cart"
      @click="localAddToCart"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

const props = defineProps<{ product: any }>()
function formatPrice(val: number | string | undefined) {
  return Number(val ?? 0).toFixed(2)
}

function localAddToCart() {
  const p = props.product
  try {
    const key = 'cart'
    const raw = localStorage.getItem(key) || '[]'
    const cart: any[] = JSON.parse(raw)
    const idx = cart.findIndex(x => x.product_id === p.product_id)
    if (idx >= 0) cart[idx].qty = (cart[idx].qty ?? 1) + 1
    else cart.push({
      product_id: p.product_id,
      product_name: p.product_name,
      product_price: p.product_price,
      product_imgurl: p.product_imgurl,
      qty: 1
    })
    localStorage.setItem(key, JSON.stringify(cart))
    console.log('Ajouté au panier :', p.product_name)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>

.product-card {
  width: 150px;
  height: 245px;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px 12px 8px;
  box-sizing: border-box;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.product-card-link {
  text-decoration: none;
  color: inherit;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background: repeating-conic-gradient(#eee 0% 25%, #f8f8f8 0% 50%) 50% / 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  background: #f4f4f4;
}

.empty-img {
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(#eee 0% 25%, #f8f8f8 0% 50%) 50% / 20px 20px;
  border-radius: 8px;
}
.product-title {
  font-size: 10px;
  color: #222;
  text-align: center;
  margin-bottom: 4px;
}

.product-price {
  font-size: 13px;
  color: #888;
  margin-bottom: 5px;
}
button.add-to-cart {
  padding: 4px 10px ;
  font-size: 12px ;
  min-height: 28px ;
}

</style>