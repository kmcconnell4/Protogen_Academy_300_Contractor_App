<script setup>
defineProps({
  type: { type: String, required: true },
})

// Solid-fill only per design system. Canonical doc type colors.
const typeConfig = {
  PDS:  'bg-interactive text-white',
  SDS:  'bg-amber text-bg',
  Spec: 'bg-surface-alt text-text-secondary',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide leading-none',
      typeConfig[type] ?? 'bg-surface-alt text-text-secondary',
    ]"
  >
    {{ type }}
  </span>
</template>
