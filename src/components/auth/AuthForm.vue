<script setup lang="ts">
import './auth-form.css'
import TextInput from '@/components/ui/TextInput.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { ref } from 'vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'

const role = ref<'acheteur'|'vendeur'>('acheteur')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string|null>(null)

const emailInputError = ref(false)
const passwordInputError = ref(false)

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

async function onSubmit(){
  error.value = null
  loading.value = true

  if (emailInputError.value || passwordInputError.value) {
    loading.value = false
    return
  }

  try{
    // Appel API ici
    console.log('Login', { email: email.value, password: password.value, role: role.value })
  }catch(e:any){
    error.value = e?.message ?? 'Une erreur est survenue.'
  }finally{
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <img src="/logo.svg" alt="Markety" class="logo" />

    <div class="roles">
      <Button name="Acheteur" :active="role==='acheteur'" @click="role='acheteur'" :style="'add-to-cart'" :disabled="false" />
      <Button name="Vendeur"  :active="role==='vendeur'"  @click="role='vendeur'"  :style="'seller'" :disabled="false" />
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <Input :label="'Email'" 
        v-model="email" 
        name="email" 
        id="login-email" 
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
        id="login-password" 
        type="password" 
        placeholder="************" 
        :required="true" 
        autocomplete="current-password" 
        :regex="passwordRegex"
        @error-state="passwordInputError = $event" 
      />

      <PrimaryButton :disabled="loading" class="btn-main">
        {{ loading ? 'Connexion…' : 'Connexion' }}
      </PrimaryButton>

      <button class="btn-secondary" type="button">Inscription</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
