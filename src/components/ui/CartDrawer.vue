<template>
  <teleport to="body">
    <transition name="slide-fade">
      <div v-if="visible" class="cart-overlay" @click.self="close">
        <aside class="cart-drawer" role="dialog" aria-label="Panier" aria-modal="true">
          <!-- rectangle vide : tu pourras y injecter la liste du panier plus tard -->
          <div class="empty-rect"></div>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'close'])

function close() {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  justify-content: flex-end;
  z-index: 1200;
}

.cart-drawer {
  width: 380px;
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background: transparent; /* le rectangle interne est blanc */
}

/* rectangle vide */
.empty-rect {
  width: 100%;
  max-width: 340px;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border: 1px dashed rgba(0,0,0,0.08);
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