<script setup lang="ts">
import { ref, computed } from 'vue'
import Input from '@/components/ui/Input.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import Button from '~/components/ui/Button.vue'

const email = ref('')
const password = ref('')
const username = ref('')
const error = ref<string|null>(null)

const usernameInputError = ref(false)
const emailInputError = ref(false)
const passwordInputError = ref(false)

// Regex pour le nom d'utilisateur (3 à 20 caractères)
const usernameRegex: Array<{ pattern: string, message: string }> = [
  { pattern: '^.{3,20}$', message: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères.' }
]

const emailRegex: Array<{ pattern: string, message: string }> = [
  { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Email invalide' }
]
const passwordRegex: Array<{ pattern: string, message: string }> = [
  { pattern: '[A-Z]', message: 'Le mot de passe doit contenir au moins une lettre majuscule.' },
  { pattern: '[a-z]', message: 'Le mot de passe doit contenir au moins une lettre minuscule.' },
  { pattern: '[0-9]', message: 'Le mot de passe doit contenir au moins un chiffre.' },
  { pattern: '[!@#$%^&*(),.?":{}|<>]', message: 'Le mot de passe doit contenir au moins un caractère spécial.' },
  { pattern: '.{8,50}', message: 'Le mot de passe doit contenir entre 8 et 50 caractères.' }
]

// Vérifie si le formulaire est valide pour activer/désactiver le bouton
const isFormValid = computed(() => {
  return !usernameInputError.value && !emailInputError.value && !passwordInputError.value && 
         username.value.length > 0 && email.value.length > 0 && password.value.length > 0
})

async function onRegister(e: Event) {
  e.preventDefault()
  if (!isFormValid.value) return;

  try {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const apiKey = import.meta.env.VITE_API_KEY || ''

    const res = await fetch(`${base}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'apikey': apiKey
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        isadmin: true
      })
    })
    const data = await res.json()

    if (res.ok) {
      error.value = null
      router.push('/login')
    } else {
      error.value = data.message || data.error || "Erreur lors de l'inscription"
    }
  } catch (err) {
    console.error("Erreur inscription:", err)
    error.value = "Une erreur réseau est survenue."
  }
}
</script>

<template>
  <div class="page-auth">
    <h2>Inscription</h2>
    <div v-if="error" class="api-error-box">
      {{ error }}
    </div>
    <form class="register-form" @submit="onRegister">
      <Input :label="'Nom d\'utilisateur'" 
        v-model="username" 
        name="username" 
        id="register-username" 
        type="text" 
        placeholder="Votre nom" 
        :required="true" 
        autocomplete="username" 
        :regex="usernameRegex" 
        @error-state="usernameInputError = $event"
      />
      <Input :label="'Email'" 
        v-model="email" 
        name="email" 
        id="register-email" 
        type="text" 
        placeholder="KarineP@gmail.com" 
        :required="true" 
        autocomplete="email" 
        :regex="emailRegex" 
        @error-state="emailInputError = $event" 
      />
      <Input :label="'Mot de passe'" 
        v-model="password" 
        name="password" 
        id="register-password" 
        type="password" 
        placeholder="************" 
        :required="true" 
        autocomplete="new-password" 
        :regex="passwordRegex"
        @error-state="passwordInputError = $event" 
      />
      <Button 
        name="S'inscrire" 
        variant="customer" 
        type="submit" 
        :disabled="!isFormValid" 
      />
    </form>
    <a href="/login">Déjà un compte ? Connectez-vous</a>
  </div>
</template>

<style scoped>
.page-auth {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  place-items: center;
  padding: 24px;
}

.page-auth h2 {
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 15px;
    background: var(--main-color, #9EA18E);
    margin-top: -10px;
  }
}

.page-auth a {
  color: var(--main-color);
  text-decoration: none;
  width: 400px;
  font-size: 13px;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 400px;
  align-items: center;
}
.api-error-box {
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #e74c3c;
  background: #fff0f0;
  color: #c0392b;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}
</style>