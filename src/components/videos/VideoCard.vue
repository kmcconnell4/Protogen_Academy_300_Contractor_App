<script setup>
import { useI18n } from 'vue-i18n'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'

const { t } = useI18n()
const { addItem } = useRecentlyViewed()

const props = defineProps({
  video: { type: Object, required: true },
})

function openVideo() {
  addItem({ id: props.video.id, type: 'video', name: props.video.title, videoUrl: props.video.videoUrl })
  window.open(props.video.videoUrl, '_blank', 'noopener')
}
</script>

<template>
  <button
    type="button"
    class="bg-surface border border-border rounded-xl overflow-hidden flex flex-col active:opacity-80 transition-opacity w-full text-left"
    @click="openVideo"
  >
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
    </div>
  </button>
</template>
