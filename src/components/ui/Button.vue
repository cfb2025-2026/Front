<script setup lang="ts">
defineProps<{
  name: string
  style?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'large' | 'small'
}>()
defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[style, size]"
    @click="$emit('click', $event)"
  >
    {{ name }}
  </button>
</template>

<style scoped>
button {
  font-family: var(--font-family);
  border-radius: 5px;
  padding: 13px 43px;
  font-size: 14px;
  width: 100%;
  height: fit-content;
  transition: all 0.2s;
}
button.large {
  font-size: 14px;
  padding: 18px 50px;
  box-shadow: 0 0 12px rgba(98, 100, 88, 0.15);
  z-index: 1;
}
button.small {
  font-size: 13px;
  padding: 10px 30px;
  opacity: 0.8;
  z-index: 0;
}
button.customer {
  background-color: var(--main-color);
  color: white;
  border: none;
  box-shadow: 0 0 7px rgba(98, 100, 88, 0.5);
}
button.seller {
  background-color: var(--seller-color);
  color: white;
  border: none;
  box-shadow: 0 0 7px rgba(214, 183, 160, 0.5);
}
button.secondary {
  background-color: white;
  color: var(--text-color);
  border: 1px solid var(--text-color);
}
button.add-to-cart {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  box-shadow: 0 0 7px rgba(239, 239, 239, 0.5);
  padding: 8px 43px;
  font-size: 12px;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>