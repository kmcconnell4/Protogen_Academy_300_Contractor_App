<script setup>
import NavBar from './components/shared/NavBar.vue'
import RoleSwitcher from './components/shared/RoleSwitcher.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile top bar with role switcher -->
    <RoleSwitcher />

    <!-- Desktop sidebar spacer + role switcher is inside NavBar/RoleSwitcher -->
    <div class="md:ml-56">
      <main class="px-4 pt-4 pb-24 md:pb-8 max-w-2xl mx-auto md:max-w-none md:px-8 md:pt-6">
        <RouterView />
      </main>
    </div>

    <NavBar />
  </div>
</template>

