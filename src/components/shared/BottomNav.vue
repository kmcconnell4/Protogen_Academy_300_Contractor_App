<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const navTabs = [
  { label: 'nav.home_tab', route: 'home' },
  { label: 'nav.jobs',    route: 'jobs' },
  { label: 'nav.catalog', route: 'catalog' },
  { label: 'nav.docs',    route: 'documents' },
  { label: 'nav.videos',  route: 'videos' },
]

function isActive(routeName) {
  return route.name === routeName || (routeName === 'jobs' && route.name === 'job-detail')
}
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-nav border-t border-border h-16">
    <router-link
      v-for="tab in navTabs"
      :key="tab.route"
      :to="{ name: tab.route }"
      :class="[
        'flex-1 flex flex-col items-center justify-center gap-1 transition-colors',
        isActive(tab.route) ? 'text-highlight' : 'text-text-secondary',
      ]"
    >
      <!-- Home -->
      <svg v-if="tab.route === 'home'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <!-- Jobs -->
      <svg v-else-if="tab.route === 'jobs'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
      <!-- Catalog -->
      <svg v-else-if="tab.route === 'catalog'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      <!-- Documents -->
      <svg v-else-if="tab.route === 'documents'" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <!-- Videos -->
      <svg v-else-if="tab.route === 'videos'" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>

      <span class="text-[10px] font-[700] uppercase tracking-[0.08em] leading-none">{{ t(tab.label) }}</span>
    </router-link>
  </nav>
</template>
