<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import videos from '@/data/videos.json'
import VideoCard from '@/components/videos/VideoCard.vue'

const { t } = useI18n()

const CATEGORIES = [...new Set(videos.map((v) => v.category))]
const activeCategory = ref('All')

const filtered = computed(() => {
  if (activeCategory.value === 'All') return videos
  return videos.filter((v) => v.category === activeCategory.value)
})
</script>

<template>
  <main class="flex flex-col pb-24">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-1 leading-none">
        {{ t('videos.count', { count: filtered.length }, filtered.length) }}
      </p>
      <h1
        class="text-[2.25rem] font-[800] text-white leading-none"
        style="font-family: var(--font-heading);"
      >
        {{ t('videos.title') }}
      </h1>
    </div>

    <div class="px-4 pt-4 flex flex-col gap-4">

    <!-- Category filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
      <button
        v-for="cat in ['All', ...CATEGORIES]"
        :key="cat"
        :class="[
          'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
          activeCategory === cat
            ? 'bg-interactive text-white'
            : 'bg-surface text-text-secondary border border-border',
        ]"
        @click="activeCategory = cat"
      >
        {{ cat === 'All' ? t('videos.filter_all') : cat }}
      </button>
    </div>

    <!-- Video grid -->
    <div v-if="filtered.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <VideoCard v-for="video in filtered" :key="video.id" :video="video" />
    </div>
    <p v-else class="text-text-secondary text-center py-8">{{ t('videos.no_videos') }}</p>

    </div>
  </main>
</template>
