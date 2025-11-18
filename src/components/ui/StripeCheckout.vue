<template>
  <button @click="checkout" class="stripe-btn">Démarrer l’essai gratuit</button>
</template>

<script setup>
const checkout = async () => {
  try {
    const res = await fetch('http://localhost:4242/create-checkout-session', { method: 'POST' })
    const { id, url } = await res.json()
    if (url) {
      window.location.href = url
    } else if (id) {
      window.location.href = `https://checkout.stripe.com/pay/${id}`
    } else {
      alert('Erreur : pas de lien de paiement Stripe')
    }
  } catch (e) {
    alert('Erreur Stripe : ' + e.message)
    console.error(e)
  }
}
</script>