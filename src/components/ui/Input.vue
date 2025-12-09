<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" :class="{ required: required }">{{ label }}</label>
    <div class="input-password-wrapper" v-if="type === 'password'">
      <input
        v-bind="inputAttrs"
        v-model="modelValueProxy"
        :name="name"
        :autocomplete="autocomplete"
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :class="{ 'has-error': errorMessage }"
      />
      <button
        type="button"
        class="toggle-password"
        @click="showPassword = !showPassword"
        :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
        tabindex="-1"
      >
        <span v-if="showPassword">
          <!-- Eye closed SVG -->
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="10" rx="8" ry="5" stroke="#888" stroke-width="2"/>
            <circle cx="10" cy="10" r="2" fill="#888"/>
          </svg>
        </span>
        <span v-else>
          <!-- Eye open SVG -->
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 2L18 18" stroke="#888" stroke-width="2" stroke-linecap="round"/>
            <path d="M10 4C5 4 2 10 2 10C2 10 4.5 15 10 15C12.1 15 13.9 14.2 15.2 13.1M17.5 10.5C17.5 10.5 15 4 10 4" stroke="#888" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
      </button>
    </div>
    <input
      v-else
      v-bind="inputAttrs"
      v-model="modelValueProxy"
      :name="name"
      :autocomplete="autocomplete"
      :id="id"
      :class="{ 'has-error': errorMessage }"
    />
    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  type: {
    type: String,
    default: 'text',
  },
  label: String,
  placeholder: String,
  name: String,
  id: String,
  required: Boolean,
  disabled: Boolean,
  autocomplete: String,
  regex: [ { pattern: String, message: String } ],
})

const emit = defineEmits(['update:modelValue', 'error', 'error-state'])

const { type, placeholder, name, id, required, disabled, autocomplete, regex } = toRefs(props)

const inputAttrs = computed(() => ({
  type: type.value,
  placeholder: placeholder.value,
  name: name.value,
  id: id.value,
  required: required.value,
  disabled: disabled.value,
}))

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Password visibility toggle
const showPassword = ref(false)
const errorMessage = ref(null)
const error = ref(false)

// Check value with regex patterns
watch(() => props.modelValue, (newValue) => {
  error.value = false
  errorMessage.value = null // Reset error on value change
  
  if (regex && newValue) {
    regex.value.forEach((reg) => {
      const pattern = new RegExp(reg.pattern)
      if (!pattern.test(newValue)) {
        // If the pattern does not match, set the error message
        errorMessage.value = reg.message || 'Format invalide'
        error.value = true
        emit('error', errorMessage.value) // Emit the error message
      }
    })
  }
  emit('error-state', error.value) // Emit whether there's an error or not
})

</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px;
  min-width: 150px;
  color: var(--text-color);
}

.input-password-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 1.1em;
  padding: 0 0.25em;
}

label {
  font-size: 13px;
  &.required::after {
    content: " *";
    color: red;
    font-weight: bold;
  }
}

input {
  font-family: var(--font-family);
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 7px 0;
  color: var(--text-color);
  width: 100%;
  &:focus {
    outline: none;
    border-bottom: 2px solid var(--main-color);
  }
  &::placeholder {
    color: rgba(65, 65, 65, 0.3);
  }

  &.has-error {
    border-bottom: 2px solid red;
  }
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 2px;
}
</style>