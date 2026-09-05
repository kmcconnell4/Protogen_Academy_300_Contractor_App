<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from '@/components/shared/BottomNav.vue'
import SidebarNav from '@/components/shared/SidebarNav.vue'
import FloatingSearchBar from '@/components/shared/FloatingSearchBar.vue'
import PasswordGate from '@/components/shared/PasswordGate.vue'

const route = useRoute()
const showSearchBar = computed(() => !['profile', 'search'].includes(route.name))
</script>

<template>
  <PasswordGate>
    <div class="flex min-h-dvh bg-bg text-white">
      <!-- Desktop: persistent left sidebar (hidden below md) -->
      <SidebarNav class="hidden md:flex" />

      <div class="flex flex-col flex-1 min-w-0 md:pl-56">
        <RouterView v-slot="{ Component, route: matchedRoute }" class="flex-1">
          <Transition name="page">
            <component :is="Component" :key="matchedRoute.fullPath" class="flex-1" />
          </Transition>
        </RouterView>
        <FloatingSearchBar v-if="showSearchBar" class="md:pl-56" />
        <BottomNav class="md:hidden" />
      </div>
    </div>
  </PasswordGate>
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

