<script setup lang="ts">
import './text-input.css'
type Props = {
  modelValue?: string
  name?: string
  placeholder?: string
  type?: string
  autocomplete?: string
}
const props = withDefaults(defineProps<Props>(), { modelValue: '', type: 'text' })
const emit = defineEmits<{ (e:'update:modelValue', v:string):void }>()
</script>

<template>
  <input
    class="text-input"
    :name="props.name"
    :type="props.type"
    :placeholder="props.placeholder"
    :autocomplete="props.autocomplete"
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>