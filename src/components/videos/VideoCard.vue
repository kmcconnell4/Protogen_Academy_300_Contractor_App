<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  video: { type: Object, required: true },
})
</script>

<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
    <img
      :src="video.thumbnailUrl"
      :alt="video.title"
      loading="lazy"
      class="w-full aspect-video object-cover"
    />
    <div class="p-4 flex flex-col gap-2 flex-1">
      <p class="text-white font-bold leading-snug">{{ video.title }}</p>
      <p class="text-text-secondary text-xs">
        {{ video.category }} &middot; {{ t('videos.duration') }}: {{ video.duration }}
      </p>
      <p class="text-text-secondary text-sm line-clamp-2 flex-1">{{ video.description }}</p>
      <a
        :href="video.videoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-flex items-center justify-center gap-2 h-tap rounded-lg bg-interactive text-white font-bold text-sm"
      >
        <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5,3 19,12 5,21" /></svg>
        {{ t('videos.watch') }}
      </a>
    </div>
  </div>
</template>
