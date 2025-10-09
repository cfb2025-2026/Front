<script setup lang="ts">
import './auth-form.css'
import TextInput from '@/components/ui/TextInput.vue'
import PrimaryButton from '@/components/ui/PrimaryButton.vue'
import { ref } from 'vue'
import Button from '~/components/ui/Button.vue'

const role = ref<'acheteur'|'vendeur'>('acheteur')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string|null>(null)

async function onSubmit(){
  error.value = null
  loading.value = true
  try{
    // Appel API ici
    console.log('Login', { email: email.value, password: '••••••••', role: role.value })
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
      <label class="field-label">Email <span class="asterisk">*</span></label>
      <TextInput v-model="email" name="email" type="email" placeholder="KarineP@gmail.com" autocomplete="email" />

      <label class="field-label">Mot de passe <span class="asterisk">*</span></label>
      <TextInput v-model="password" name="password" type="password" placeholder="************" autocomplete="current-password" />

      <PrimaryButton :disabled="loading" class="btn-main">
        {{ loading ? 'Connexion…' : 'Connexion' }}
      </PrimaryButton>

      <button class="btn-secondary" type="button">Inscription</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
