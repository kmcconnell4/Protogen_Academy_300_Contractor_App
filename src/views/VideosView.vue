<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">Training Videos</h1>
      <select v-model="activeCategory" class="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-700">
        <option value="All">All</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <VideoCard v-for="video in filteredVideos" :key="video.id" :video="video" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import allVideos from '../data/videos.json'
import VideoCard from '../components/videos/VideoCard.vue'

const activeCategory = ref('All')
const categories = [...new Set(allVideos.map(v => v.category))]

const filteredVideos = computed(() =>
  activeCategory.value === 'All' ? allVideos : allVideos.filter(v => v.category === activeCategory.value)
)
</script>
