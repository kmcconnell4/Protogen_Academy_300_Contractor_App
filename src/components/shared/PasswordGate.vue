<script setup>
import { ref } from 'vue'

const PASSWORD = 'Protogen300!'
const STORAGE_KEY = 'ridgeline_unlocked'

function readStoredUnlock() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const unlocked = ref(readStoredUnlock())
const value = ref('')
const error = ref(false)

function handleSubmit() {
  if (value.value === PASSWORD) {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // Storage unavailable — the session still unlocks, just won't persist.
    }
    unlocked.value = true
    return
  }
  error.value = true
}
</script>

<template>
  <slot v-if="unlocked" />

  <div v-else class="flex items-center justify-center min-h-dvh bg-bg px-4">
    <form
      class="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4"
      @submit.prevent="handleSubmit"
    >
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-amber">🔒 Private demo</p>
      <h1
        class="text-white font-[800] text-[1.5rem] leading-tight"
        style="font-family: var(--font-heading);"
      >
        This one's password-protected.
      </h1>
      <p class="text-text-secondary text-[14px] leading-relaxed">
        Enter the password to continue.
      </p>
      <input
        v-model="value"
        type="password"
        autofocus
        aria-label="Password"
        :aria-invalid="error"
        placeholder="Password"
        class="w-full h-[52px] px-4 rounded-xl bg-surface-alt border border-border text-white text-[15px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight transition-colors"
        @input="error = false"
      />
      <p v-if="error" class="text-error text-[13px] font-[600]">That's not it — try again.</p>
      <button
        type="submit"
        class="w-full h-[52px] rounded-xl bg-interactive text-white text-[14px] font-[700] uppercase tracking-[0.1em] transition-colors active:bg-highlight flex items-center justify-center"
      >
        Unlock
      </button>
    </form>
  </div>
</template>
