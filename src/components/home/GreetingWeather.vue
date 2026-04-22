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
        {{ greetingLabel }},
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
      <p class="text-text-secondary text-[11px] font-medium leading-snug text-right">
        {{ weather.icon }} {{ weather.city }}
      </p>
    </div>
  </div>
</template>

