<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import profile from '@/data/profile.json'

const { t } = useI18n()

const hour = new Date().getHours()
const greetingLabel = computed(() => {
  if (hour < 12) return t('home.greeting_label_morning')
  if (hour < 17) return t('home.greeting_label_afternoon')
  return t('home.greeting_label_evening')
})

// Mock: weather tied to most recent active job location
const weather = {
  city: 'Cincinnati, OH',
  icon: '⛅',
  temp: '64°F',
  condition: 'Partly cloudy',
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
    <div class="flex flex-col items-end gap-0.5 shrink-0 pb-1">
      <p class="text-white font-bold text-xl leading-none">{{ weather.temp }}</p>
      <div class="flex items-center gap-1 text-text-secondary text-[11px] font-medium leading-snug">
        <!-- Partly cloudy SVG icon -->
        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2v1M4.22 4.22l.7.7M2 12h1M4.22 19.78l.7-.7M12 20v1M19.78 19.78l-.7-.7M22 12h-1M19.78 4.22l-.7.7" />
          <path d="M9 18H7a4 4 0 010-8 5 5 0 019.9-1A3.5 3.5 0 0118 16H9" />
        </svg>
        {{ weather.city }}
      </div>
    </div>
  </div>
</template>

