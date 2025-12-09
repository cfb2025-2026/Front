<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()
defineEmits<{ (e: 'select'): void }>()
</script>

<template>
  <li
    :class="{ active }"
    @click="$emit('select')"
  >
    <span>{{ label }}</span>
  </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

li:hover {
  background-color: rgba(0, 140, 82, 0.1);
}

li.active {
  background-color: rgba(0, 140, 82, 0.2);
  color: var(--main-color);
}

span {
  font-size: 14px;
  color: var(--text-color);
}
</style>
