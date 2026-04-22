<script setup>
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'
import { useOutdoorMode } from '@/composables/useOutdoorMode'
import { useRole } from '@/composables/useRole'
import RoleSwitcher from '@/components/shared/RoleSwitcher.vue'

const { t } = useI18n()
const { currentLocale, supportedLocales, setLocale } = useLocale()
const { isOutdoorMode, toggle: toggleOutdoor } = useOutdoorMode()
const { role } = useRole()

// Mock contractor profile — replace with real data source when auth is added
const profile = {
  name: 'Marcus Rivera',
  company: 'Rivera Roofing LLC',
  region: 'Ohio / Indiana',
}
</script>

<template>
  <main class="flex flex-col gap-6 pb-24 px-4 pt-4">
    <h1 class="text-xl font-bold text-white">{{ t('profile.title') }}</h1>

    <!-- Contractor info -->
    <section class="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-0.5">{{ t('profile.name') }}</p>
        <p class="text-white font-bold">{{ profile.name }}</p>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-0.5">{{ t('profile.company') }}</p>
        <p class="text-white font-bold">{{ profile.company }}</p>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-0.5">{{ t('profile.region') }}</p>
        <p class="text-white font-bold">{{ profile.region }}</p>
      </div>
    </section>

    <!-- Role switcher -->
    <section class="bg-surface border border-border rounded-xl p-4">
      <p class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">{{ t('profile.role') }}</p>
      <RoleSwitcher />
    </section>

    <!-- Language selector -->
    <section class="bg-surface border border-border rounded-xl p-4">
      <p class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">{{ t('profile.language') }}</p>
      <select
        :value="currentLocale"
        class="w-full h-[52px] px-4 rounded-xl bg-surface-alt border border-border text-white text-base focus:outline-none focus:border-highlight"
        @change="setLocale($event.target.value)"
      >
        <option v-for="loc in supportedLocales" :key="loc" :value="loc">
          {{ t(`profile.languages.${loc}`) }}
        </option>
      </select>
    </section>

    <!-- Outdoor mode toggle -->
    <section class="bg-surface border border-border rounded-xl p-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-white font-bold">{{ t('profile.outdoor_mode') }}</p>
          <p class="text-text-secondary text-sm mt-0.5">{{ t('profile.outdoor_mode_hint') }}</p>
        </div>
        <button
          :class="[
            'relative shrink-0 w-14 h-7 rounded-full transition-colors',
            isOutdoorMode ? 'bg-interactive' : 'bg-surface-alt',
          ]"
          :aria-pressed="isOutdoorMode"
          @click="toggleOutdoor"
        >
          <span
            :class="[
              'absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform',
              isOutdoorMode ? 'translate-x-7' : 'translate-x-0',
            ]"
          />
        </button>
      </div>
    </section>
  </main>
</template>
