<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref('')
const password = ref('')
const username = ref('')

const SUPABASE_URL = "https://twpsekokpqcpswgzdkjn.supabase.co/rest/v1/Users"
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cHNla29rcHFjcHN3Z3pka2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDg5ODEsImV4cCI6MjA3NTQ4NDk4MX0.LTwe_Y8ChNLDB7aedvgkYSoHi-0959VAPXgM8AH3HS4"

async function onRegister(e: Event) {
  e.preventDefault()
  const res = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      username: username.value
    })
  })
  const data = await res.json()
  if (res.ok) {
    router.push('/')
  } else {
    alert(data.message || "Erreur lors de l'inscription")
  }
}
</script>

<template>
  <div class="page-auth">
    <form class="register-form" @submit="onRegister">
      <Input v-model="username" label="Nom d'utilisateur" name="username" required placeholder="Votre nom" />
      <Input v-model="email" label="Email" name="email" type="text" required placeholder="Votre email" />
      <Input v-model="password" label="Mot de passe" name="password" type="password" required placeholder="Votre mot de passe" />
      <button type="submit" class="register-btn">S'inscrire</button>
    </form>
  </div>
</template>

<style scoped>
.page-auth {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 400px;
  align-items: center;
}
.register-btn {
  padding: 10px 0;
  background: var(--main-color, #9EA18E);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  width: 100%;
}
</style>