<template>
  <div class="flex items-center gap-2 px-4 py-2 bg-[#333333] text-white md:hidden">
    <span class="text-xs font-semibold uppercase tracking-widest text-red-400 mr-auto">Carlisle Portal</span>
    <span class="text-xs text-gray-400">Role:</span>
    <button
      @click="toggle"
      class="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
    >
      <span :class="role === 'contractor' ? 'text-green-400' : 'text-yellow-300'">●</span>
      {{ role === 'contractor' ? 'Contractor' : 'Sales Rep' }}
    </button>
  </div>

  <!-- Desktop role switcher in sidebar bottom -->
  <div class="hidden md:flex fixed bottom-0 left-0 w-56 items-center gap-2 px-4 py-3 bg-black/30">
    <span class="text-xs text-gray-400">Role:</span>
    <button
      @click="toggle"
      class="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
    >
      <span :class="role === 'contractor' ? 'text-green-400' : 'text-yellow-300'">●</span>
      {{ role === 'contractor' ? 'Contractor' : 'Sales Rep' }}
    </button>
  </div>
</template>

<script setup>
import { useRole } from '../../composables/useRole.js'

const { role, toggle } = useRole()
</script>
