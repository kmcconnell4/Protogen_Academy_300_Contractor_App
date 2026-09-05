<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import profile from '@/data/profile.json'
import { useJobsData } from '@/composables/useJobsData'

const { t } = useI18n()
const { jobs } = useJobsData()

const hour = new Date().getHours()
const greetingLabel = computed(() => {
  if (hour < 12) return t('home.greeting_label_morning')
  if (hour < 17) return t('home.greeting_label_afternoon')
  return t('home.greeting_label_evening')
})

// Derive city from the most recently updated non-closed job address
// Address format: "123 Street, City, ST 00000" — extract "City, ST"
const weatherCity = computed(() => {
  const recentJob = [...jobs.value]
    .filter((j) => j.status !== 'Closed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
  if (!recentJob) return null
  const parts = recentJob.address.split(', ')
  if (parts.length < 3) return null
  return `${parts[1]}, ${parts[2].split(' ')[0]}`
})

// Mock: temperature — static for demo purposes
const weather = {
  temp: '64°F',
}
</script>

<template>
  <div class="flex items-end justify-between gap-4">
    <!-- Name display: the visual anchor of the home screen -->
    <div class="flex flex-col gap-1 min-w-0">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
        {{ greetingLabel }}
      </p>
      <h1
        class="text-[3rem] leading-[0.9] font-[800] tracking-tight text-white truncate"
        style="font-family: var(--font-heading);"
      >
        {{ profile.firstName }}
      </h1>
    </div>

    <!-- Weather: right-aligned utility widget, secondary info -->
    <div v-if="weatherCity" class="flex flex-col items-end gap-0.5 shrink-0 pb-1">
      <p class="text-white font-bold text-xl leading-none">{{ weather.temp }}</p>
      <div class="flex items-center gap-1 text-text-secondary text-[11px] font-medium leading-snug">
        <!-- Partly cloudy SVG icon -->
        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2v1M4.22 4.22l.7.7M2 12h1M4.22 19.78l.7-.7M12 20v1M19.78 19.78l-.7-.7M22 12h-1M19.78 4.22l-.7.7" />
          <path d="M9 18H7a4 4 0 010-8 5 5 0 019.9-1A3.5 3.5 0 0118 16H9" />
        </svg>
        {{ weatherCity }}
      </div>
    </div>
  </div>
</template>

