<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import RoleSwitcher from './RoleSwitcher.vue'
import SearchOverlay from '@/components/search/SearchOverlay.vue'

const { t } = useI18n()
const router = useRouter()
const searchOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-nav border-b border-border">
    <!-- Logo / brand -->
    <button
      class="font-[800] text-[1.125rem] tracking-tight text-white leading-none"
      style="font-family: var(--font-heading);"
      @click="router.push({ name: 'home' })"
    >
      Carlisle
    </button>

    <!-- Actions -->
    <div class="flex items-center gap-0.5">
      <RoleSwitcher compact />

      <!-- Search -->
      <button
        class="h-[52px] w-[52px] flex items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-white active:text-white"
        :aria-label="t('nav.search')"
        @click="searchOpen = true"
      >
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>

      <!-- Profile -->
      <button
        class="h-[52px] w-[52px] flex items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-white active:text-white"
        :aria-label="t('nav.profile')"
        @click="router.push({ name: 'profile' })"
      >
        <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </div>
  </header>

  <SearchOverlay v-model="searchOpen" />
</template>
