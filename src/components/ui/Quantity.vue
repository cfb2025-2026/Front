<template>
  <div class="qty-control">
    <Button sm variant="outline" @click="dec">−</Button>
    <input class="qty-input" :min="min" type="number" :value="modelValue" @input="onInput" />
    <Button sm variant="outline" @click="inc">+</Button>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 }
})
const emit = defineEmits(['update:modelValue'])

function onInput(e: Event) {
  const v = Math.max(props.min, Number((e.target as HTMLInputElement).value || props.min))
  emit('update:modelValue', v)
}
function inc() { emit('update:modelValue', Math.max(props.min, props.modelValue + 1)) }
function dec() { emit('update:modelValue', Math.max(props.min, props.modelValue - 1)) }
</script>

<style scoped>
.qty-control { display:inline-flex; gap:8px; align-items:center; }
.qty-input { width:66px; text-align:center; padding:6px; border:1px solid #e5e7eb; border-radius:6px; }
</style>