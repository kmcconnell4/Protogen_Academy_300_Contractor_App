<script setup>
const props = defineProps({
  status: { type: String, required: true },
})

// Solid-fill only — no outlined variants per design system.
// Covers job statuses, inspection statuses, order statuses, and quote statuses.
const colorMap = {
  // Job statuses
  'Bid':              'bg-amber/90 text-nav',
  'In Progress':      'bg-interactive text-white',
  'Inspection':       'bg-highlight/90 text-nav',
  'Warranty':         'bg-emerald text-nav',
  'Closed':           'bg-surface-alt text-text-secondary',
  // Inspection statuses
  'Pending Response': 'bg-amber/90 text-nav',
  'Response Overdue': 'bg-error text-white',
  'Reviewed':         'bg-emerald text-nav',
  // Order statuses
  'Processing':       'bg-amber/90 text-nav',
  'Shipped':          'bg-interactive text-white',
  'Delivered':        'bg-emerald text-nav',
  'Cancelled':        'bg-error text-white',
  // Quote statuses
  'Draft':            'bg-surface-alt text-text-secondary',
  'Submitted':        'bg-amber/90 text-nav',
  'Approved':         'bg-emerald text-nav',
  'Rejected':         'bg-error text-white',
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
