<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '@/components/shared/BottomNav.vue'
import FloatingSearchBar from '@/components/shared/FloatingSearchBar.vue'
import { setupRole } from '@/composables/useRole'

// Provide global role state to all child components
setupRole()

const route = useRoute()
const showSearchBar = computed(() => !['profile', 'search'].includes(route.name))
</script>

<template>
  <div class="flex flex-col min-h-dvh bg-bg text-white">
    <RouterView v-slot="{ Component }" class="flex-1">
      <Transition name="page" mode="out-in">
        <component :is="Component" class="flex-1" />
      </Transition>
    </RouterView>
    <FloatingSearchBar v-if="showSearchBar" />
    <BottomNav />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

