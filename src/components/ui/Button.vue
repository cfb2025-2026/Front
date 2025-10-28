<script setup lang="ts">
const props = defineProps<{
  name?: string
  variant?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'small' | 'large'
  vertical?: boolean
}>()

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[variant, size, { vertical, 'add-to-cart': variant === 'add-to-cart' }]"
    @click="$emit('click', $event)"
  >
    <slot>{{ name }}</slot>
  </button>
</template>

<style scoped>
/* base */
button {
  font-family: var(--font-family, system-ui);
  border-radius: 5px;
  padding: 13px 43px;
  font-size: 14px;
  width: 100%;
  height: fit-content;
  transition: all 0.2s;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* exact add-to-cart style you wanted */
button.add-to-cart {
  padding: 6px 18px;
  font-size: 14px;
  white-space: nowrap;   /* Empêche le retour à la ligne */
  min-width: 0;
  width: auto;
  box-sizing: border-box;
}

/* sizes */
button.large {
  font-size: 14px;
  padding: 18px 50px;
  box-shadow: 0 0 12px rgba(98, 100, 88, 0.15);
  z-index: 1;
}
button.small {
  font-size: 13px;
  padding: 10px 30px;
}

/* variants */
button.secondary {
  background: var(--secondary-color, #fff);
  color: var(--text-color, #222);
  border: 1px solid rgba(0,0,0,0.06);
}
button.main-custumer {
  background: var(--main-custumer, #e6d9a8);
  color: #111;
  border: none;
}

/* vertical stacked */
button.vertical {
  width: 150px;
  height: 100px;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  line-height: 1.05;
  white-space: pre-line;
}

/* combine vertical + secondary/add-to-cart */
button.secondary.vertical,
button.add-to-cart.vertical {
  background: var(--secondary-color, #f6f6f6);
  border: 2px solid rgba(0,0,0,0.10);
}

/* hover/active */
button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}
button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

/* disabled */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>