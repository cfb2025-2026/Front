<!--
Button.vue

Reusable button component.

Props:
- name (string, required): The button text.
- style (string, optional): CSS class for styling (e.g. "customer", "seller", "secondary", "add-to-cart").
- type (string, optional): Button type ("button", "submit", "reset"). Default: "button".
- disabled (boolean, optional): Disable the button.

Events:
- @click: Emitted when the button is clicked.

Usage example:
<Button
  name="Acheteur"
  style="customer"
  type="button"
  :disabled="false"
  @click="handleClick"
/>

Button is 100% width by default. To set the size, use a wrapper div with the desired width.
-->

<script setup lang="ts">
defineProps<{
  name: string
  style?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="style"
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

    &.customer {
        background-color: var(--main-color);
        color: white;
        border: none;
        box-shadow: 0 0 7px rgba(98, 100, 88, 0.5);
    }

    &.seller {
        background-color: var(--seller-color);
        color: white;
        border: none;
        box-shadow: 0 0 7px rgba(214, 183, 160, 0.5);
    }

    &.secondary {
        background-color: white;
        color: var(--text-color);
        border: 1px solid var(--text-color);
    }

    &.add-to-cart {
        background-color: var(--secondary-color);
        color: var(--text-color);
        border: none;
        box-shadow: 0 0 7px rgba(239, 239, 239, 0.5);
        padding: 8px 43px;
        font-size: 12px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>