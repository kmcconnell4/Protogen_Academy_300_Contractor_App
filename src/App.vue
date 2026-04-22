<script setup>
import NavBar from '@/components/shared/NavBar.vue'
import BottomNav from '@/components/shared/BottomNav.vue'
import { setupRole } from '@/composables/useRole'

// Provide global role state to all child components
setupRole()
</script>

<template>
  <div class="flex flex-col min-h-dvh bg-bg text-white">
    <NavBar />
    <RouterView class="flex-1" />
    <BottomNav />
  </div>
</template>

