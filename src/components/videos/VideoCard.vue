<template>
  <a :href="video.videoUrl" target="_blank" rel="noopener noreferrer" class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm block active:opacity-80">
    <div class="relative">
      <img :src="video.thumbnail" :alt="video.title" class="w-full h-40 object-cover bg-gray-200" />
      <span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{{ video.duration }}</span>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow">
          <svg class="w-5 h-5 text-[#C8102E] ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    </div>
    <div class="p-3">
      <p class="font-semibold text-gray-800 text-sm leading-snug">{{ video.title }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ video.category }}</p>
      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ video.description }}</p>
    </div>
  </a>
</template>

<script setup>
defineProps({ video: Object })
</script>
