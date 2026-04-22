<script setup>
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'
import { useOutdoorMode } from '@/composables/useOutdoorMode'
import { useRole } from '@/composables/useRole'
import RoleSwitcher from '@/components/shared/RoleSwitcher.vue'
import profile from '@/data/profile.json'

const { t } = useI18n()
const { currentLocale, supportedLocales, setLocale } = useLocale()
const { isOutdoorMode, toggle: toggleOutdoor } = useOutdoorMode()
const { role } = useRole()
</script>

<template>
  <main class="flex flex-col pb-24">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-1 leading-none">
        {{ t('profile.section_label') }}
      </p>
      <h1
        class="text-[2.25rem] font-[800] text-white leading-none"
        style="font-family: var(--font-heading);"
      >
        {{ t('profile.title') }}
      </h1>
    </div>

    <div class="flex flex-col gap-6 px-4 pt-5">

    <!-- Contractor info -->
    <section class="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      <div>
        <p class="section-label text-text-secondary mb-0.5">{{ t('profile.name') }}</p>
        <p class="text-white font-bold">{{ profile.name }}</p>
      </div>
      <div>
        <p class="section-label text-text-secondary mb-0.5">{{ t('profile.company') }}</p>
        <p class="text-white font-bold">{{ profile.company }}</p>
      </div>
      <div>
        <p class="section-label text-text-secondary mb-0.5">{{ t('profile.region') }}</p>
        <p class="text-white font-bold">{{ profile.region }}</p>
      </div>
    </section>

    <!-- Role switcher -->
    <section class="bg-surface border border-border rounded-xl p-4">
      <p class="section-label text-text-secondary mb-3">{{ t('profile.role') }}</p>
      <RoleSwitcher />
    </section>

    <!-- Language selector -->
    <section class="bg-surface border border-border rounded-xl p-4">
      <p class="section-label text-text-secondary mb-3">{{ t('profile.language') }}</p>
      <label for="language-select" class="sr-only">{{ t('profile.language') }}</label>
      <select
        id="language-select"
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
    </div>
  </main>
</template>
