<script setup>
import { useRouter } from 'vue-router'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'

const router = useRouter()
const { recentlyViewed } = useRecentlyViewed()

const typeIcon = { product: '📦', document: '📄' }

function navigate(item) {
  router.push({ name: item.routeName, params: item.routeParams })
}
</script>

<template>
  <div v-if="recentlyViewed.length" class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
    <button
      v-for="item in recentlyViewed"
      :key="item.id"
      class="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-full text-sm font-bold text-white max-w-[160px]"
      @click="navigate(item)"
    >
      <span>{{ typeIcon[item.type] ?? '📄' }}</span>
      <span class="truncate">{{ item.name }}</span>
    </button>
  </div>
  <p v-else class="text-text-secondary text-sm italic">Nothing viewed yet.</p>
</template>
