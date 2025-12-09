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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CloseIcon from '~/assets/icons/CloseIcon.vue'
import Button from './Button.vue'
import CartItem from './CartItem.vue'
import { useCart } from '~/composables/useCart'
const { isUserConnected, getUser, removeFromCart, updateCartQty } = useCart()

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

async function loadCart() {
  try {
    if (isUserConnected()) {
      // Charger depuis l'API
      await loadCartFromAPI()
    } else {
      // Charger depuis localStorage
      loadCartLocalStorage()
    }
  } catch (e) {
    console.error(e)
    // Fallback sur localStorage
    loadCartLocalStorage()
  }
}

function loadCartLocalStorage() {
  const raw = localStorage.getItem('cart') || '[]'
  const parsed = JSON.parse(raw)
  items.value = Array.isArray(parsed)
    ? parsed.map(it => ({ qty: 1, ...it, qty: Number(it.qty || 1) }))
    : []
}

async function loadCartFromAPI() {
  const token = localStorage.getItem('token')
  const user = getUser()
  const base = import.meta.env.VITE_API_BASE_URL || '';

  if (!user || !token) {
    loadCartLocalStorage()
    return
  }

  const res = await fetch(`${base}carts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) throw new Error('Erreur chargement panier')

  const carts = await res.json()

  // Vide le panier avant de remplir
  items.value = []

  // Charge tous les produits en parallèle
  const products = await Promise.all(
    carts.map(async cart => {
      
      const prodRes = await fetch(`${base}products/${cart.product_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (prodRes.ok) {
        const product = await prodRes.json();
        
        const itemWithCartId = { 
          ...product,
          qty: Number(cart.product_quantity) || 1,
          cart_id: cart.carts_id,  // <-- Vérifier que cart.cart_id existe
          product_id: product.product_id
        };
        
        return itemWithCartId;
      }
      return null
    })
  )

  // Ajoute seulement les produits valides
  items.value = products.filter(Boolean)
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(items.value))
}

function updateQty(payload) {
  const { id, qty } = payload || {}
  console.log("🔄 Mise à jour quantité locale ID:", id, "qty:", qty);
  
  // Cherche l'item correspondant pour récupérer le product_id
  const item = items.value.find(it => it.cart_id === id || it.product_id === id)
  
  // Synchronise en arrière-plan AVANT la MAJ locale
  if (qty < 1) {
    // Suppression
    removeFromCart(id)
  } else {
    // Mise à jour
    updateCartQty(id, qty, item?.product_id)
    // MAJ locale immédiate après confirmation
    if (item) item.qty = qty
  }
}

function removeItem(id) {
  // MAJ locale immédiate
  items.value = items.value.filter(it => it.cart_id !== id && it.product_id !== id)
  // Synchronise en arrière-plan
  removeFromCart(id)
  // Ne pas appeler loadCart()
}

const total = computed(() =>
  items.value.reduce((s, it) => s + (Number(it.product_price || 0) * (Number(it.qty || 0))), 0).toFixed(2)
)

onMounted(() => {
  loadCart()
  window.addEventListener('cart-updated', loadCart)
})

onUnmounted(() => {
  window.removeEventListener('cart-updated', loadCart)
})
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