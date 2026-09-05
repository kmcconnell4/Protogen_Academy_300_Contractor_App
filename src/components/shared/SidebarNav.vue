<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

function isActive(routeName) {
  if (routeName === 'jobs') return route.name === 'jobs' || route.name === 'job-detail'
  if (routeName === 'library') return route.name === 'library' || route.name === 'videos'
  return route.name === routeName
}
</script>

<template>
  <nav class="fixed inset-y-0 left-0 z-40 w-56 flex-col bg-nav border-r border-border py-6 px-3 gap-1">

    <!-- Wordmark -->
    <div class="px-3 pb-6">
      <p
        class="text-white font-[800] text-[1.35rem] leading-none"
        style="font-family: var(--font-heading);"
      >
        Ridgeline
      </p>
      <p class="text-text-secondary text-[11px] font-[700] uppercase tracking-[0.12em] mt-1">
        {{ t('nav.portal_label') }}
      </p>
    </div>

    <!-- Home -->
    <router-link
      :to="{ name: 'home' }"
      :class="['flex items-center gap-3 h-[48px] px-3 rounded-lg transition-colors', isActive('home') ? 'bg-interactive/15 text-highlight' : 'text-text-secondary hover:text-white']"
    >
      <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span class="text-[13px] font-[700] uppercase tracking-[0.06em]">{{ t('nav.home_tab') }}</span>
    </router-link>

    <!-- Jobs -->
    <router-link
      :to="{ name: 'jobs' }"
      :class="['flex items-center gap-3 h-[48px] px-3 rounded-lg transition-colors', isActive('jobs') ? 'bg-interactive/15 text-highlight' : 'text-text-secondary hover:text-white']"
    >
      <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
      <span class="text-[13px] font-[700] uppercase tracking-[0.06em]">{{ t('nav.jobs') }}</span>
    </router-link>

    <!-- Library -->
    <router-link
      :to="{ name: 'library' }"
      :class="['flex items-center gap-3 h-[48px] px-3 rounded-lg transition-colors', isActive('library') ? 'bg-interactive/15 text-highlight' : 'text-text-secondary hover:text-white']"
    >
      <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="14" width="20" height="7" rx="1" />
        <rect x="2" y="7" width="20" height="5" rx="1" />
        <path d="M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2" />
      </svg>
      <span class="text-[13px] font-[700] uppercase tracking-[0.06em]">{{ t('nav.library') }}</span>
    </router-link>

    <!-- Profile -->
    <router-link
      :to="{ name: 'profile' }"
      :class="['flex items-center gap-3 h-[48px] px-3 rounded-lg transition-colors', isActive('profile') ? 'bg-interactive/15 text-highlight' : 'text-text-secondary hover:text-white']"
    >
      <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span class="text-[13px] font-[700] uppercase tracking-[0.06em]">{{ t('nav.profile') }}</span>
    </router-link>

  </nav>
</template>
