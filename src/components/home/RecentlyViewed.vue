<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'

const { t } = useI18n()
const router = useRouter()
const { recentlyViewed } = useRecentlyViewed()

function navigate(item) {
  router.push({ name: item.routeName, params: item.routeParams })
}
</script>

<template>
  <!-- Horizontal scroll row: no padding so it bleeds to screen edges -->
  <div v-if="recentlyViewed.length" class="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
    <button
      v-for="item in recentlyViewed"
      :key="item.id"
      class="shrink-0 inline-flex items-center gap-2 h-[40px] px-3 rounded-lg bg-surface border border-border text-white text-sm font-bold whitespace-nowrap transition-opacity active:opacity-75"
      @click="navigate(item)"
    >
      <!-- Type indicator: subtle filled icon -->
      <span
        class="shrink-0 w-4 h-4 rounded-sm flex items-center justify-center text-[10px]"
        :class="item.type === 'product' ? 'bg-interactive/20 text-interactive' : 'bg-brand/20 text-highlight'"
      >
        {{ item.type === 'product' ? '⬡' : '⬗' }}
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

