<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">

    <!-- Documents: icon top-left, label bottom-left — diagonal visual flow -->
    <button
      class="flex flex-col items-start justify-between h-[124px] bg-surface border border-border rounded-xl p-4 text-left transition-opacity active:opacity-75"
      @click="router.push({ name: 'documents' })"
    >
      <!-- Filled document icon, brand blue -->
      <svg
        class="w-7 h-7 text-interactive"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <p
        class="text-white font-[700] text-lg leading-tight tracking-tight"
        style="font-family: var(--font-heading);"
      >
        {{ t('home.quick_docs') }}
      </p>
    </button>

    <!-- Videos: icon top-left in amber, label bottom-left -->
    <button
      class="flex flex-col items-start justify-between h-[124px] bg-surface border border-border rounded-xl p-4 text-left transition-opacity active:opacity-75"
      @click="router.push({ name: 'videos' })"
    >
      <!-- Filled play icon, amber -->
      <svg
        class="w-7 h-7 text-amber"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>

      <p
        class="text-white font-[700] text-lg leading-tight tracking-tight"
        style="font-family: var(--font-heading);"
      >
        {{ t('home.quick_videos') }}
      </p>
    </button>

  </div>
</template>

