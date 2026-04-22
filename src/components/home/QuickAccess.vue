<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <button
      class="flex flex-col items-center justify-center gap-2 bg-surface border border-border rounded-xl h-[100px] font-bold text-white text-base"
      @click="router.push({ name: 'documents' })"
    >
      <span class="text-3xl">📄</span>
      <span>{{ t('home.quick_docs') }}</span>
    </button>
    <button
      class="flex flex-col items-center justify-center gap-2 bg-surface border border-border rounded-xl h-[100px] font-bold text-white text-base"
      @click="router.push({ name: 'videos' })"
    >
      <span class="text-3xl">🎥</span>
      <span>{{ t('home.quick_videos') }}</span>
    </button>
  </div>
</template>
