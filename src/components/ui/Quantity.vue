<template>
  <div class="qty-control">
    <button @click="dec" class="qty-btn">-</button>
    <input class="qty-input" :min="min" type="number" :value="modelValue" @input="onInput" />
    <button @click="inc" class="qty-btn">+</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 0 } // <-- Changé de 1 à 0
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
.qty-control {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  overflow: hidden;
  width: 90px;
  height: 30px;
  background: #fff;
}

.qty-control > * {
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  box-sizing: border-box;
}

.qty-btn {
  /* flex: 1; */
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  height: 100%;
}

.qty-btn:active {
  background-color: #f0f0f0;
}

.qty-input {
  /* flex: 1; */
  text-align: center;
  border: none;
  font-size: 15px;
  width: 100%;
  height: 100%;
  appearance: textfield;
  color: #333;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-control > *:not(:last-child) {
  border-right: 1px solid #d9d9d9;
}

</style>