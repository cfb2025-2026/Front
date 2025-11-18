<template>
  <div class="menu-item" @click="$emit('click')">
    <span class="icon">
      <slot name="icon" />
    </span>
    <span class="label">
      <slot />
    </span>
    <button class="edit-btn" @click.stop="$emit('edit')">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M4 21h17" stroke="#888" stroke-width="2" stroke-linecap="round"/>
        <path d="M15.5 6.5l2 2M7 17l8.5-8.5a1.414 1.414 0 1 1 2 2L9 19H7v-2z" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['click', 'edit'])
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: background 0.15s;
}
.menu-item:hover {
  background: #f5f5f5;
}
.icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.label {
  flex: 1;
  color: #444;
  font-size: 15px;
}
.edit-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.edit-btn svg {
  pointer-events: none;
}
</style>