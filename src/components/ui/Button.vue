<script setup lang="ts">
import './button.css'
defineProps<{ label: string; active?: boolean }>()
defineEmits<{ (e:'click'): void }>()
</script>

<template>
  <button class="role-button" :class="{ active: active }" @click="$emit('click')">
    <slot>{{ label }}</slot>
  </button>
</template>
