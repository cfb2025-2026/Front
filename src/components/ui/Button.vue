<!--
Button.vue

Reusable button component.

Props:
- name (string, required): The button text.
- variant (string, optional): CSS class for styling (e.g. "customer", "seller", "secondary", "add-to-cart").
- type (string, optional): Button type ("button", "submit", "reset"). Default: "button".
- disabled (boolean, optional): Disable the button.

Events:
- @click: Emitted when the button is clicked.

Usage example:
<Button
  name="Acheteur"
  variant="customer"
  type="button"
  :disabled="false"
  @click="handleClick"
/> 

Button is 100% width by default. To set the size, use a wrapper div with the desired width.
-->

<script setup lang="ts">
defineProps<{
  name: string
  variant?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="variant"
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
  /* smooth default transitions for motion-friendly interactions */
  transition: transform 180ms cubic-bezier(.2,.9,.2,1), box-shadow 180ms ease, background-color 180ms ease, color 180ms ease, filter 180ms ease;

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
        padding: 8px 15px;
        font-size: 12px;
        &:hover {
          cursor: pointer;
        }
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

/* hover / active: slight lift, gentle scale and deeper shadow */
button:hover:not(:disabled) {
  /* subtle lift without noticeable scaling */
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  filter: brightness(1.01);
}
button:active:not(:disabled) {
  transform: translateY(0) scale(0.998);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

/* focus: visible keyboard focus ring */
button:focus-visible {
  outline: 3px solid rgba(0,140,82,0.14); /* gentle focus ring */
  outline-offset: 3px;
}

/* disabled */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none !important;
  }
}
</style>