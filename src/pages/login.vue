<template>
  <div class="page-auth">
    <h2>Connexion</h2>
    <div v-if="error" class="api-error-box">
      {{ error }}
    </div>
    <form class="login-form" @submit.prevent="onLogin">
      <Input :label="'Email'"
        v-model="email"
        name="email"
        id="login-email"
        type="email"
        autocomplete="email"
        :required="true"
        placeholder="Votre email"
        :regex="emailRegex"
        @error-state="emailInputError = $event"
      />
      <Input :label="'Mot de passe'"
        v-model="password"
        name="password"
        id="login-password"
        type="password"
        placeholder="************"
        autocomplete="current-password"
        :required="true"
        :regex="[]"
      />
      <Button 
        name="Connexion" 
        variant="customer"
        type="submit" 
        :disabled="loading || !isFormValid" 
      />
    </form>
    <a href="/register">Pas encore inscrit ? Inscrivez-vous ici.</a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Gestion des erreurs
const emailInputError = ref(false)

// Regex pour l'email (identique à register.vue)
const emailRegex: Array<{ pattern: string, message: string }> = [
  { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Email invalide' }
]

// Validation du formulaire : pas d'erreur sur l'email et champs remplis
const isFormValid = computed(() => {
  return !emailInputError.value && email.value.length > 0 && password.value.length > 0
})

async function onLogin() {
  if (!isFormValid.value) return

  loading.value = true
  error.value = null // Reset l'erreur à chaque tentative
  try {
    const base = import.meta.env.VITE_API_BASE_URL || ''
    const apiKey = import.meta.env.VITE_API_KEY || ''

    const res = await fetch(`${base}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'apikey': apiKey
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (res.ok) {
      // Stockage des informations utilisateur
      if (data.token) {
        localStorage.setItem('token', data.token)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user)) // Assurez-vous que "data.user" contient le nom
        }
      }
      error.value = null
      router.push('/')
    } else {
      error.value = data.message || data.error || "Email ou mot de passe incorrect"
    }
  } catch (err) {
    console.error("Erreur connexion:", err)
    error.value = "Une erreur réseau est survenue."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-auth {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  place-items: center;
  padding: 24px;

  a {
    color: var(--main-color);
    text-decoration: none;
    width: 400px;
    font-size: 13px;
  }
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

.login-form {
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

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 12px;
}

.forgot-password {
  color: var(--text-color);
  text-decoration: none;
}
</style>