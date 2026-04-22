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
  <main class="flex flex-col gap-4 pb-24 px-4 pt-4">
    <h1 class="text-xl font-bold text-white">{{ t('videos.title') }}</h1>

    <!-- Category filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="cat in ['All', ...CATEGORIES]"
        :key="cat"
        :class="[
          'shrink-0 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-colors',
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
  </main>
</template>
