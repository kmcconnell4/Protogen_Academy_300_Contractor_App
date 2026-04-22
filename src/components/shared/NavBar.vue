<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import RoleSwitcher from './RoleSwitcher.vue'
import SearchOverlay from '@/components/search/SearchOverlay.vue'

const { t } = useI18n()
const router = useRouter()
const searchOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-nav border-b border-border">
    <!-- Logo / brand -->
    <button class="text-white font-bold text-lg tracking-wide" @click="router.push({ name: 'home' })">
      Carlisle
    </button>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <RoleSwitcher compact />
      <button
        class="h-[44px] w-[44px] flex items-center justify-center rounded-lg text-text-secondary hover:text-white"
        :aria-label="t('nav.search')"
        @click="searchOpen = true"
      >
        🔍
      </button>
      <button
        class="h-[44px] w-[44px] flex items-center justify-center rounded-lg text-text-secondary hover:text-white"
        :aria-label="t('nav.profile')"
        @click="router.push({ name: 'profile' })"
      >
        👤
      </button>
    </div>
  </header>

  <SearchOverlay v-model="searchOpen" />
</template>
