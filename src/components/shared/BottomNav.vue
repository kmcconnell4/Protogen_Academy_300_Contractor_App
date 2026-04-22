<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const tabs = [
  { name: 'home',     label: 'nav.jobs',    icon: '🏗️',  route: 'home' },
  { name: 'jobs',     label: 'nav.jobs',    icon: '📋',  route: 'jobs' },
  { name: 'catalog',  label: 'nav.catalog', icon: '📦',  route: 'catalog' },
  { name: 'documents',label: 'nav.docs',    icon: '📄',  route: 'documents' },
  { name: 'videos',   label: 'nav.videos',  icon: '🎥',  route: 'videos' },
]

// Deduplicate: remove 'home' from display, show Jobs as the first tab
const navTabs = [
  { label: 'nav.jobs',     icon: '📋', route: 'jobs' },
  { label: 'nav.catalog',  icon: '📦', route: 'catalog' },
  { label: 'nav.docs',     icon: '📄', route: 'documents' },
  { label: 'nav.videos',   icon: '🎥', route: 'videos' },
]

function isActive(routeName) {
  return route.name === routeName || (routeName === 'jobs' && route.name === 'home')
}
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-nav border-t border-border h-16">
    <router-link
      v-for="tab in navTabs"
      :key="tab.route"
      :to="{ name: tab.route }"
      :class="[
        'flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-bold uppercase tracking-wide transition-colors',
        isActive(tab.route) ? 'text-highlight' : 'text-text-secondary',
      ]"
    >
      <span class="text-[28px] leading-none">{{ tab.icon }}</span>
      <span>{{ t(tab.label) }}</span>
    </router-link>
  </nav>
</template>
