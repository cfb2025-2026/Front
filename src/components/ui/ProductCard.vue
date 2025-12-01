<template>
  <div 
    class="product-card"
    :class="{ 'is-loading': isLoading }"
    @click="handleCardClick"
  >
    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-title"></div>
        <div class="skeleton-footer">
            <div class="skeleton-price"></div>
            <div class="skeleton-button"></div>
        </div>
      </div>
    </div>

    <!-- Loaded Content -->
    <div v-else class="card-content">
      <div class="product-image">
        <img :src="product.product_imgurl" :alt="product.product_name" />
      </div>
      <h3 class="product-name">{{ product.product_name }}</h3>
      <div class="product-footer">
          <span class="product-price">{{ formatPrice(product.product_price) }}</span>
          <Button name="Ajouter au panier" variant="add-to-cart" @click.stop="handleAddToCart" :disabled="isAddingToCart" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from './Button.vue'

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
// console log props for debugging when available
if (props.product) {
  console.log('ProductCard props.product:', props.product)
}
const emit = defineEmits(['add-to-cart'])

const router = useRouter()
const isAddingToCart = ref(false)

const handleCardClick = () => {
  if (!props.isLoading && props.product) {
    router.push(`/products/${props.product.product_id}`)
  }
}

const handleAddToCart = async () => {
  if (isAddingToCart.value) return
  
  isAddingToCart.value = true
  emit('add-to-cart', props.product)
  
  // Simuler un délai pour l'ajout
  setTimeout(() => {
    isAddingToCart.value = false
  }, 500)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>

<style scoped>
.product-card {
    border-radius: 5px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid var(--secondary-color);
    cursor: pointer;
    width: 200px;
    padding: 21px 25px;
    color: var(--text-color);
    font-size: 13px;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
}

.product-image {
  width: calc(100%);
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
}

.product-name {
  font-weight: 400;
  margin: 0;
  font-size: 13px;
}

.product-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 10px;

  .product-price {
    align-self: flex-end;
  }
}


.add-to-cart-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Skeleton Loading Styles */
.skeleton {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0; /* Images in card don't seem to have radius in your CSS, or inherit from card overflow hidden */
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  flex: 1;
}

.skeleton-title {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
  width: 80%;
}

.skeleton-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.skeleton-price {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
  width: 40%;
  align-self: flex-end;
}

.skeleton-button {
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>