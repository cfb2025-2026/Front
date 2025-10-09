<script setup lang="ts">
import './primary-button.css'
defineProps<{ disabled?: boolean }>()
</script>

<template>
  <button class="btn" :disabled="disabled" type="submit">
    <slot />
  </button>
</template>
