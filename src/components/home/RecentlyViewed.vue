<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'

const { t } = useI18n()
const router = useRouter()
const { recentlyViewed } = useRecentlyViewed()

function navigate(item) {
  if (item.type === 'video') {
    window.open(item.videoUrl, '_blank', 'noopener')
  } else {
    router.push({ name: item.routeName, params: item.routeParams })
  }
}
</script>

<template>
  <!-- Horizontal scroll row: no padding so it bleeds to screen edges -->
  <div v-if="recentlyViewed.length" class="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
    <button
      v-for="item in recentlyViewed"
      :key="item.id"
      class="shrink-0 inline-flex items-center gap-2 h-tap px-3 rounded-lg bg-surface border border-border text-white text-sm font-bold whitespace-nowrap transition-opacity active:opacity-75"
      @click="navigate(item)"
    >
      <!-- Type indicator: filled icon -->
      <span
        class="shrink-0 w-4 h-4 rounded-sm flex items-center justify-center"
        :class="item.type === 'product' ? 'bg-interactive/20 text-interactive' : item.type === 'video' ? 'bg-amber/20 text-amber' : 'bg-brand/20 text-highlight'"
      >
        <!-- Product: box icon -->
        <svg v-if="item.type === 'product'" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        </svg>
        <!-- Video: play icon -->
        <svg v-else-if="item.type === 'video'" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <!-- Document / other: page icon -->
        <svg v-else class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </svg>
      </span>
      <span class="truncate max-w-[120px]">{{ item.name }}</span>
    </button>
    <!-- Trailing spacer for natural scroll boundary -->
    <div class="shrink-0 w-4" aria-hidden="true" />
  </div>

  <!-- Empty state: teaches the interface, not just "nothing here" -->
  <div v-else class="px-4">
    <p class="text-text-secondary text-sm">
      {{ t('home.recently_viewed_empty') }}
    </p>
  </div>
</template>

