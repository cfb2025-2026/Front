<template>
  <div class="page-auth">
    <Button
      name="Acheteur"
      style="Main button"
      size="large"
      type="button"
      class="buyer-btn"
    />
    <form class="login-form" @submit.prevent="onLogin">
      <Input
        v-model="email"
        label="Email"
        name="email"
        type="text"
        autocomplete="email"
        required
        placeholder="Votre email"
      />
      <Input
        v-model="password"
        label="Mot de passe"
        name="password"
        type="password"
        autocomplete="current-password"
        required
        placeholder="Votre mot de passe"
      />
      <Button
        name="Connexion"
        style="secondary"
        size="large"
        type="submit"
      />
      <Button
        name="Inscription"
        style="secondary"
        size="small"
        type="button"
        disabled
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const email = ref('')
const password = ref('')

const SUPABASE_URL = "https://twpsekokpqcpswgzdkjn.supabase.co/rest/v1/Users"
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cHNla29rcHFjcHN3Z3pka2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDg5ODEsImV4cCI6MjA3NTQ4NDk4MX0.LTwe_Y8ChNLDB7aedvgkYSoHi-0959VAPXgM8AH3HS4"

async function onLogin() {
  const url = `${SUPABASE_URL}?email=eq.${encodeURIComponent(email.value)}&password=eq.${encodeURIComponent(password.value)}&select=*`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
      Accept: 'application/json'
    }
  })
  const users = await res.json()
  if (Array.isArray(users) && users.length > 0) {
    window.location.href = '/' // Forçage du rechargement de la home
  } else {
    alert("Email ou mot de passe incorrect")
  }
}
</script>

<style scoped>
.page-auth {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
}
.buyer-btn {
  margin-bottom: 48px;
  max-width: 340px;
  width: 100%;
  display: block;
  box-shadow: 0 0 12px rgba(98, 100, 88, 0.15);
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 400px;
  align-items: center;
}
</style>