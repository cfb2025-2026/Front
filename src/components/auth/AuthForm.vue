<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const role = ref<'login'|'vendeur'>('login')
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
    <Button  name="Login" :style="role === 'login' ? 'customer' : 'secondary'" :size="role === 'login' ? undefined : 'small'" @click="role='login'"/>
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
    min-height: 48px; /* Hauteur fixe adaptée à tes boutons */
      
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