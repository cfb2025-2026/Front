<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="spotlight-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        @click.self="close"
      >
        <div class="spotlight-panel">
          <div class="spotlight-header">
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              class="spotlight-input"
              placeholder="Rechercher un produit..."
              @keydown.down.prevent="move(1)"
              @keydown.up.prevent="move(-1)"
              @keydown.enter.prevent="goSelected"
            />
            <button class="close-btn" @click="close" aria-label="Fermer">✕</button>
          </div>

          <div class="hint-row">
            <span>Utilisez ↑ ↓ pour naviguer, Entrée pour ouvrir.</span>
            <span class="shortcut">ESC pour fermer</span>
          </div>

            <div v-if="loading" class="loading">Recherche...</div>
            <div v-else-if="results.length === 0" class="empty">Aucun résultat</div>

          <ul v-else class="results" role="listbox">
            <li
              v-for="(item, i) in results"
              :key="item.product_id || i"
              :class="['result-item', { active: i === activeIndex }]"
              role="option"
              @mouseenter="activeIndex = i"
              @click="openItem(item)"
            >
              <div class="ri-title">{{ item.product_name || 'Produit' }}</div>
              <div class="ri-meta">
                {{ formatPrice(item.product_price) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const activeIndex = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)
let debounce: any

function close() {
  emit('close')
  query.value = ''
  results.value = []
  activeIndex.value = 0
}

function formatPrice(p?: number) {
  if (typeof p !== 'number') return ''
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(p)
}

async function searchProducts(q: string) {
  if (!q.trim()) {
    results.value = []
    return
  }
  loading.value = true
  try {
    const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'
    // Adaptation API selon backend (ex: ?name=ilike.*q*)
    const url = `${base}/products?search=${encodeURIComponent(q)}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
        apikey: import.meta.env.VITE_API_KEY || ''
      }
    })
    const data = await res.json()
    results.value = Array.isArray(data) ? data.slice(0, 12) : []
    activeIndex.value = 0
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

watch(() => query.value, (val) => {
  clearTimeout(debounce)
  debounce = setTimeout(() => searchProducts(val), 260)
})

function move(dir: number) {
  if (!results.value.length) return
  activeIndex.value = (activeIndex.value + dir + results.value.length) % results.value.length
}

function goSelected() {
  const item = results.value[activeIndex.value]
  if (item) openItem(item)
}

function openItem(item: any) {
  // Redirection: adapter route si nécessaire
  window.location.href = `/produit/${item.product_id}`
}

function onGlobalKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) close()
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))

watch(() => props.visible, async (v) => {
  if (v) {
    await nextTick()
    inputEl.value?.focus()
  }
})
</script>

<style scoped>
.spotlight-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  z-index: 4000;
}
.spotlight-panel {
  width: min(800px, 92vw);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.25);
  padding: 22px 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: Inter, system-ui, sans-serif;
}
.spotlight-header {
  display: flex;
  gap: 12px;
  align-items: center;
}
.spotlight-input {
  flex: 1;
  border: none;
  background: #f3f3f3;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 16px;
  outline: none;
}
.spotlight-input:focus {
  background: #eee;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
}
.hint-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}
.shortcut {
  opacity: .7;
}
.loading, .empty {
  padding: 24px 8px;
  text-align: center;
  font-size: 14px;
  color: #666;
}
.results {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 420px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.result-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 120ms;
  font-size: 14px;
}
.result-item:hover,
.result-item.active {
  background: #f1f1f1;
}
.ri-title {
  font-weight: 500;
  color: #222;
}
.ri-meta {
  font-size: 12px;
  color: #777;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 140ms ease; }
</style>