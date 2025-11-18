<template>
  <teleport to="body">
    <transition name="slide-fade">
      <div v-if="visible" class="cart-overlay" @click.self="close">
        <aside class="cart-drawer" role="dialog" aria-label="Panier" aria-modal="true">
          <div class="cart-container">
            <div class="cart-header">
              <div class="header-container">
                <h2>Votre panier</h2>
                <span class="count">{{ count }}</span>
              </div>
              <div class="close-btn" @click="close">
                <CloseIcon />
              </div>
            </div>
            <div class="cart-content">
              <div v-if="!items.length">
                <div>Votre panier est vide.</div>
              </div>
              <div v-else class="items-list">
                <CartItem v-for="it in items" :key="it.product_id" :item="it" @update:qty="updateQty"
                  @remove="removeItem" />
              </div>
            </div>
            <div class="cart-footer">
              <div class="total">
                <span>Total</span>
                <div><span class="total-value">{{ total }}</span><span class="devise"> €</span></div>
              </div>
              <div class="actions">
                <Button name="Passer la commande" variant="customer" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CloseIcon from '~/assets/icons/CloseIcon.vue'
import Button from './Button.vue'
import CartItem from './CartItem.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  count: { type: Number, default: 0 }
})
const emit = defineEmits(['update:visible', 'close'])

function close() {
  emit('update:visible', false)
  emit('close')
}

const items = ref([])

function loadCart() {
  try {
    const raw = localStorage.getItem('cart') || '[]'
    const parsed = JSON.parse(raw)
    // ensure qty present and numeric
    items.value = Array.isArray(parsed)
      ? parsed.map(it => ({ qty: 1, ...it, qty: Number(it.qty || 1) }))
      : []
  } catch (e) {
    items.value = []
    // console.error(e)
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(items.value))
}

function updateQty(payload) {
  const { id, qty } = payload || {}
  const i = items.value.find(x => x.product_id === id)
  if (i) {
    i.qty = Math.max(1, Number(qty) || 1)
    saveCart()
  }
}

function removeItem(id) {
  items.value = items.value.filter(x => x.product_id !== id)
  saveCart()
}

const total = computed(() =>
  items.value.reduce((s, it) => s + (Number(it.product_price || 0) * (Number(it.qty || 0))), 0).toFixed(2)
)

onMounted(loadCart)
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: flex-end;
  z-index: 1200;
}

.cart-drawer {
  width: 100%;
  max-width: 550px;
  min-width: 300px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background: transparent;
}

.cart-container {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 0; /* important pour permettre le scrolling du middle */

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E6E6E6;
    padding-bottom: 20px;

    .header-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    h2 {
      font-family: var(--font-title);
      font-size: 16px;
      color: var(--text-color);
      margin: 0;
    }

    .count {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--seller-color);
      color: var(--bg);
      border-radius: 50%;
      aspect-ratio: 1 / 1;
      width: 24px;
      font-size: 12px;
    }

    .close-btn {
      cursor: pointer;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      background-color: var(--secondary-color);
      width: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /* zone centrale scrollable */
  .cart-content {
    overflow-y: auto;
    padding: 15px 0;
    /* garantir que la zone centrale peut se réduire dans la grille */
    min-height: 0;
  }

  .cart-footer {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-top: 20px;
    border-top: 1px solid #E6E6E6;

    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-title);
      font-size: 18px;
      color: var(--text-color);
    }
  }

  .items-list {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* le scroll est géré par .cart-content, donc retirer ici */
  }
}

/* transition simple (slide from right) */
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 300ms ease, opacity 200ms ease;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>