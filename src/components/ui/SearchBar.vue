<template>
  <form class="search-bar" @submit.prevent="$emit('search', query)">
    <input
      v-model="query"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      aria-label="Rechercher"
    />
    <button class="search-btn" type="submit" aria-label="Rechercher">
      <SearchIcon />
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchIcon from '@/assets/icons/SearchIcon.vue'

const props = defineProps({
  placeholder: { type: String, default: 'Rechercher...' }
})
const query = ref('')
</script>

<style scoped>


.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px 8px;
  max-width: 320px;
}
.search-input {
  border: none;
  outline: none;
  font-size: 15px;
  flex: 1;
  background: transparent;
  padding: 6px 8px;
}
.search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
.search-btn svg {
  width: 18px;
  height: 18px;
}
</style>