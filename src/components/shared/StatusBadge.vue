<script setup>
const props = defineProps({
  status: { type: String, required: true },
})

const colorMap = {
  'Bid':         'bg-amber text-bg',
  'In Progress': 'bg-interactive text-white',
  'Inspection':  'bg-amber text-bg',
  'Warranty':    'bg-emerald text-bg',
  'Closed':      'bg-surface-alt text-text-secondary border border-border',
}

const badgeClass = colorMap[props.status] ?? 'bg-surface-alt text-text-secondary'
</script>

<template>
  <span
    :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest', badgeClass]"
  >
    {{ status }}
  </span>
</template>
