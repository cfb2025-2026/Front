<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'

const role = ref<'acheteur'|'vendeur'>('acheteur')
const email = ref('')
const password = ref('')
const nom = ref('')
const prenom = ref('')
const phone = ref('')
const company = ref('')
const siret = ref('')
const iban = ref('')
const loading = ref(false)
const error = ref<string|null>(null)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    // Appel API ici
    console.log('Register', { nom: nom.value, prenom: prenom.value, email: email.value, password: '••••••••', role: role.value, phone: phone.value, company: company.value, siret: siret.value, iban: iban.value })
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
      <Button
        name="Acheteur"
        :style="role === 'acheteur' ? 'customer' : 'secondary'"
        :size="role === 'acheteur' ? undefined : 'small'"
        @click="role='acheteur'"
      />
      <Button
        name="Vendeur"
        :style="role === 'vendeur' ? 'seller' : 'secondary'"
        :size="role === 'vendeur' ? undefined : 'small'"
        @click="role='vendeur'"
      />
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <div class="form-row">
        <div class="form-col">
          <label class="field-label">Nom <span class="asterisk">*</span></label>
          <TextInput v-model="nom" name="nom" type="text" placeholder="Nom" autocomplete="family-name" />
        </div>
        <div class="form-col">
          <label class="field-label">Prénom <span class="asterisk">*</span></label>
          <TextInput v-model="prenom" name="prenom" type="text" placeholder="Prénom" autocomplete="given-name" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-col">
          <label class="field-label">Email <span class="asterisk">*</span></label>
          <TextInput v-model="email" name="email" type="email" placeholder="KarineP@gmail.com" autocomplete="email" />
        </div>
        <div class="form-col">
          <label class="field-label">Mot de passe <span class="asterisk">*</span></label>
          <TextInput v-model="password" name="password" type="password" placeholder="************" autocomplete="new-password" />
        </div>
      </div>

      <template v-if="role === 'vendeur'">
        <div class="form-row">
          <div class="form-col">
            <label class="field-label">N° de téléphone <span class="asterisk">*</span></label>
            <TextInput v-model="phone" name="phone" type="tel" placeholder="0123456789" autocomplete="tel" />
          </div>
          <div class="form-col">
            <label class="field-label">Nom de l'entreprise <span class="asterisk">*</span></label>
            <TextInput v-model="company" name="company" type="text" placeholder="Nom de l'entreprise" autocomplete="organization" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-col">
            <label class="field-label">N° de SIRET <span class="asterisk">*</span></label>
            <TextInput v-model="siret" name="siret" type="text" placeholder="12345678901234" autocomplete="off" />
          </div>
          <div class="form-col">
            <label class="field-label">IBAN / RIB <span class="asterisk">*</span></label>
            <TextInput v-model="iban" name="iban" type="text" placeholder="FR76 1234 5678 9012 3456 7890 123" autocomplete="off" />
          </div>
        </div>
      </template>

      <PrimaryButton
        :disabled="loading"
        class="btn-main"
        :class="{ rose: role === 'vendeur' }"
      >
        {{ loading ? 'Inscription…' : 'Inscription' }}
      </PrimaryButton>

      <button class="btn-secondary" type="button">Déjà un compte ? Connexion</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
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
.logo{
  height:36px;
  width:auto;
  user-select:none
}

.form{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.form-row {
   display: flex; 
   gap: 16px;
   margin-top: 8px;
}

.form-col { 
  flex: 1; 
  display: flex; 
  flex-direction: column;
  gap: 4px;
}

@media (
  max-width: 600px
  ) 
  {
  .form-row { 
    flex-direction: column; 
    gap: 0; 
    margin-top: 0
  }
}

.field-label{
  font-size:.9rem;
  color:var(--text);
  margin-top:6px
}

.asterisk{
  color:#ef4444
}

.btn-main {
  margin: 25px auto 0 auto;
  display: block;
  background: var(--brand);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 5px 18px;
  font-weight: 350;
  cursor: pointer;
}

.btn-main.rose {
  background: #D6B7A0 !important;
  color: #fff !important;
}
.btn-secondary{
  margin:8px auto 0 auto;
  display:block;
  background:var(--brand-ghost);
  color:var(--brand);
  border:none;
  border-radius:12px;
  padding:5px 18px;
  font-weight:350;
  cursor:pointer;
}

.error{margin-top:8px;color:#b91c1c;font-size:.9rem}
</style>