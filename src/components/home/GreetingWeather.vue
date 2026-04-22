<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const hour = new Date().getHours()
const greetingKey = computed(() => {
  if (hour < 12) return 'home.greeting_morning'
  if (hour < 17) return 'home.greeting_afternoon'
  return 'home.greeting_evening'
})

// Mock: tie weather to the most recent active job's location
const weather = {
  city: 'Cincinnati, OH',
  condition: '⛅',
  temp: '64°F',
}

const contractorFirstName = 'Marcus'
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <h2 class="text-2xl font-bold text-white">
      {{ t(greetingKey, { name: contractorFirstName }) }} 👋
    </h2>
    <p class="text-text-secondary text-sm font-medium">
      📍 {{ weather.city }} &nbsp; {{ weather.condition }} {{ weather.temp }}
    </p>
  </div>
</template>
