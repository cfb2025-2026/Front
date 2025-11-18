<template>
    <div class="category-card">
        <NuxtImg :src="category.img" :alt="category.name" width="150" height="150" />
        <div class="category-name">{{ category.name }}</div>
    </div>

</template>

<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.category-card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    cursor: pointer;
    font-size: 13px;
    gap: 10px;
}
</style>

// TODO: functionality to be added when clicking on category cards