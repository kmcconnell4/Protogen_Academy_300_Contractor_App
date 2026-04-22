<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import videos from '@/data/videos.json'
import VideoCard from '@/components/videos/VideoCard.vue'

const { t } = useI18n()
const route = useRoute()

const CATEGORIES = [...new Set(videos.map((v) => v.category))]
const activeCategory = ref('All')
const searchQuery = ref('')

onMounted(() => {
  if (route.query.search) searchQuery.value = route.query.search
})

const filtered = computed(() => {
  let list = videos
  if (activeCategory.value !== 'All') list = list.filter((v) => v.category === activeCategory.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((v) => v.title.toLowerCase().includes(q))
  }
  return list
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
        {{ cat === 'All' ? t('videos.filter_all') : (t('videos.categories.' + cat) || cat) }}
      </button>
    </div>

    <!-- Video grid -->
    <div v-if="filtered.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <VideoCard v-for="video in filtered" :key="video.id" :video="video" />
    </div>
    <div v-else class="py-12 text-center flex flex-col items-center gap-3">
      <p class="text-text-secondary text-[15px]">
        {{ searchQuery.trim() || activeCategory !== 'All' ? t('videos.no_videos_filtered') : t('videos.no_videos') }}
      </p>
      <button
        v-if="searchQuery.trim() || activeCategory !== 'All'"
        class="text-highlight text-[13px] font-[700] uppercase tracking-[0.1em] hover:underline"
        @click="searchQuery = ''; activeCategory = 'All'"
      >
        {{ t('videos.filter_all') }}
      </button>
    </div>

    </div>
  </main>
</template>
