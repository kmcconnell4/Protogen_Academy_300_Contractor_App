<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <router-link
    :to="{ name: 'create-job' }"
    :aria-label="t('jobs.create_job')"
    class="fixed bottom-36 right-4 z-50 w-14 h-14 rounded-full bg-interactive flex items-center justify-center shadow-lg transition-transform duration-100 active:scale-95"
  >
    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </router-link>
</template>
