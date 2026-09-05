<script setup>
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'
import { useOutdoorMode } from '@/composables/useOutdoorMode'
import profile from '@/data/profile.json'

const { t } = useI18n()
const { currentLocale, supportedLocales, setLocale } = useLocale()
const { isOutdoorMode, toggle: toggleOutdoor } = useOutdoorMode()
</script>

<template>
  <main class="flex flex-col pb-24">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
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

    <!-- Language selector -->
    <section class="bg-surface border border-border rounded-xl p-4">
      <p class="section-label text-text-secondary mb-3">{{ t('profile.language') }}</p>
      <label for="language-select" class="sr-only">{{ t('profile.language') }}</label>
      <select
        id="language-select"
        :value="currentLocale"
        class="select-field w-full h-[52px] px-4 rounded-xl bg-surface-alt border border-border text-white text-base focus:outline-none focus:border-highlight"
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
            'relative shrink-0 w-[52px] h-[28px] rounded-full transition-colors duration-200',
            isOutdoorMode ? 'bg-interactive' : 'bg-surface-alt',
          ]"
          :style="isOutdoorMode ? {} : { boxShadow: 'inset 0 0 0 1.5px #2E3A52' }"
          :aria-pressed="isOutdoorMode"
          @click="toggleOutdoor"
        >
          <span
            :class="[
              'absolute top-[4px] left-[4px] w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
              isOutdoorMode ? 'translate-x-6' : 'translate-x-0',
            ]"
          />
        </button>
      </div>
    </section>
    </div>
  </main>
</template>
