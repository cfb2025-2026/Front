<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import TextInput from '@/components/ui/Input.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const role = ref<'login'|'vendeur'>('login')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string|null>(null)

const SUPABASE_URL = "https://twpsekokpqcpswgzdkjn.supabase.co/rest/v1/Users"
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cHNla29rcHFjcHN3Z3pka2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDg5ODEsImV4cCI6MjA3NTQ4NDk4MX0.LTwe_Y8ChNLDB7aedvgkYSoHi-0959VAPXgM8AH3HS4"

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    // Vérifie l'utilisateur dans la table Users
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
      router.push('/')
    } else {
      error.value = "Email ou mot de passe incorrect"
    }
  } catch (e: any) {
    error.value = e?.message ?? 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <img src="/logo.svg" alt="Markety" class="logo" />

    <div class="roles">
  <Button name="Login" :variant="role === 'login' ? 'customer' : 'secondary'" @click="role='login'" />
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <label class="field-label">Email <span class="asterisk">*</span></label>
      <TextInput v-model="email" name="email" type="email" placeholder="KarineP@gmail.com" autocomplete="email" />

      <label class="field-label">Mot de passe <span class="asterisk">*</span></label>
      <TextInput v-model="password" name="password" type="password" placeholder="************" autocomplete="current-password" />

      <PrimaryButton
        :disabled="loading"
        class="btn-main"
        :class="{ rose: role === 'vendeur' }"
        type="submit"
      >
        {{ loading ? 'Connexion…' : 'Connexion' }}
      </PrimaryButton>

      <button class="btn-secondary" type="button">Inscription</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style>
.auth-card{
  width:min(440px, 92vw);
  background:#fff;
  border:1px solid var(--ring);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  padding:28px 24px 24px;
  display:flex;flex-direction:column;gap:18px;
}

.roles{
    display: flex;
    gap: 10px;
    align-self: center;
    min-height: 48px;
}

.logo{height:36px;width:auto;user-select:none}

.form{display:flex;flex-direction:column;gap:10px}
.field-label{font-size:.9rem;color:var(--text);margin-top:6px}
.asterisk{color:#ef4444}

.btn-main{
    margin-top:25px;
    width: 30%;
    background:var(--brand);color:#fff;
    border:none;border-radius:12px;padding:5px 18px;
    font-weight:350;
    cursor:pointer;
}
.btn-main.rose {
  background: #D6B7A0 !important;
  color: #fff !important;
}

.btn-secondary{
  margin-top:8px;width:100%;
  background:var(--brand-ghost);color:#111;
  border:none;border-radius:12px;padding:10px 14px;
  font-weight:500;cursor:pointer;
}
.error{margin-top:8px;color:#b91c1c;font-size:.9rem}
</style>