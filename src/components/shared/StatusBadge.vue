<script setup>
const props = defineProps({
  status: { type: String, required: true },
})

// Solid-fill only — no outlined variants per design system
const colorMap = {
  'Bid':         'bg-amber/90 text-nav',
  'In Progress': 'bg-interactive text-white',
  'Inspection':  'bg-amber/90 text-nav',
  'Warranty':    'bg-emerald text-nav',
  'Closed':      'bg-surface-alt text-text-secondary',
}

const badgeClass = colorMap[props.status] ?? 'bg-surface-alt text-text-secondary'
</script>

<template>
  <span
    :class="['inline-flex items-center px-2.5 py-[5px] rounded text-[11px] font-[700] uppercase tracking-widest leading-none', badgeClass]"
  >
    {{ status }}
  </span>
</template>
