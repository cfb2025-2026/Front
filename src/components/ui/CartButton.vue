<template>
  <div class="cart-button-wrapper">
    <button class="cart-button" @click="open" aria-label="Ouvrir le panier" :aria-expanded="visible.toString()">
      <CartIcon />
      <span v-if="count > 0" class="cart-badge" aria-hidden="true">{{ count }}</span>
    </button>

    <!-- le drawer est géré ici et téléporté dans body -->
    <CartDrawer :visible="visible" @update:visible="visible = $event" @close="visible = false">
      <!-- slot pour contenu du panier si besoin -->
    </CartDrawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CartIcon from '@/assets/icons/CartIcon.vue'
import CartDrawer from '@/components/ui/CartDrawer.vue'

const props = defineProps({
  count: { type: Number, default: 0 } // tu peux passer le count depuis Navbar si nécessaire
})

const visible = ref(false)
const open = () => { visible.value = true }

function onKey(e) {
  if (e.key === 'Escape' && visible.value) visible.value = false
}

// fermeture au ESC global (confort)
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.cart-button {
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 0;
  display: inline-flex;
  align-items: center;
  font-family: var(--font-family);
}
.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--seller-color);
  color: #fff;
  font-size: 11px;
  border-radius: 12px;
  line-height: 1;
  height: 16px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>