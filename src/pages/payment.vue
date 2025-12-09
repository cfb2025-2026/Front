<template>
  <div>Redirection vers le paiement Stripe...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cartTotal = ref(0)

function loadCartTotal() {
  const raw = localStorage.getItem('cart') || '[]'
  const cart = JSON.parse(raw)
  cartTotal.value = cart.reduce((sum, item) => sum + item.product_price * item.qty, 0)
}

const checkout = async () => {
  const response = await fetch('http://localhost:3001/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: cartTotal.value })
  })
  const data = await response.json()
  if (data.url) {
    window.location.href = data.url
  } else {
    alert("Erreur lors de la création du paiement.")
  }
}

onMounted(() => {
  loadCartTotal()
  checkout()
})
</script>