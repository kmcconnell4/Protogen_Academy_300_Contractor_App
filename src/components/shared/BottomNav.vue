<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

function isActive(routeName) {
  if (routeName === 'jobs') return route.name === 'jobs' || route.name === 'job-detail'
  return route.name === routeName
}
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 flex items-center bg-nav border-t border-border h-16">

    <!-- Home -->
    <router-link
      :to="{ name: 'home' }"
      :class="['flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors', isActive('home') ? 'text-highlight' : 'text-text-secondary']"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span class="text-[10px] font-[700] uppercase tracking-[0.08em] leading-none">{{ t('nav.home_tab') }}</span>
    </router-link>

    <!-- Jobs -->
    <router-link
      :to="{ name: 'jobs' }"
      :class="['flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors', isActive('jobs') ? 'text-highlight' : 'text-text-secondary']"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
      <span class="text-[10px] font-[700] uppercase tracking-[0.08em] leading-none">{{ t('nav.jobs') }}</span>
    </router-link>

    <!-- Search — featured center tab -->
    <router-link
      :to="{ name: 'search' }"
      class="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors"
      :aria-label="t('nav.search')"
    >
      <div :class="['w-11 h-11 rounded-full flex items-center justify-center transition-colors', isActive('search') ? 'bg-highlight' : 'bg-interactive']">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
    </router-link>

    <!-- Videos -->
    <router-link
      :to="{ name: 'videos' }"
      :class="['flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors', isActive('videos') ? 'text-highlight' : 'text-text-secondary']"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      <span class="text-[10px] font-[700] uppercase tracking-[0.08em] leading-none">{{ t('nav.videos') }}</span>
    </router-link>

    <!-- Profile -->
    <router-link
      :to="{ name: 'profile' }"
      :class="['flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors', isActive('profile') ? 'text-highlight' : 'text-text-secondary']"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span class="text-[10px] font-[700] uppercase tracking-[0.08em] leading-none">{{ t('nav.profile') }}</span>
    </router-link>

  </nav>
</template>
