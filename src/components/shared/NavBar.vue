<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 md:hidden">
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-500 flex-1 h-full active:bg-gray-50"
      active-class="text-red-700 font-semibold"
    >
      <component :is="item.icon" class="w-5 h-5" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>

  <!-- Desktop sidebar -->
  <aside class="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-[#333333] text-white z-40">
    <div class="px-6 py-5 border-b border-white/10">
      <span class="text-sm font-bold uppercase tracking-widest text-red-400">Carlisle</span>
      <p class="text-xs text-gray-400 mt-0.5">Contractor Portal</p>
    </div>
    <nav class="flex-1 py-4">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-6 py-3 text-sm text-gray-300 hover:bg-white/10 transition-colors"
        active-class="bg-red-700 text-white font-semibold"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { defineComponent, h } from 'vue'

function icon(paths) {
  return defineComponent({
    render: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        paths.map(d => h('path', { d }))
      )
  })
}

const navItems = [
  { to: '/jobs',        label: 'Jobs',       icon: icon(['M3 9.5V20a1 1 0 001 1h16a1 1 0 001-1V9.5M3 9.5L12 3l9 6.5M9 21V12h6v9']) },
  { to: '/orders',      label: 'Orders',     icon: icon(['M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z', 'M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z']) },
  { to: '/quotes',      label: 'Quotes',     icon: icon(['M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z']) },
  { to: '/inspections', label: 'Inspect',    icon: icon(['M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z']) },
  { to: '/documents',   label: 'Docs',       icon: icon(['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z', 'M14 2v6h6']) },
  { to: '/videos',      label: 'Videos',     icon: icon(['M15 10l-4 2.5L7 10V6a1 1 0 011-1h6a1 1 0 011 1v4z', 'M21 8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8z']) },
]
</script>
