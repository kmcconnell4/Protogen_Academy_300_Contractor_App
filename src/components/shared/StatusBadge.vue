<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  status: { type: String, required: true },
})

// Maps raw data status values to their i18n translation keys.
const statusKeyMap = {
  // Job statuses
  'Bid':              'jobs.status_bid',
  'In Progress':      'jobs.status_in_progress',
  'Under Inspection':  'jobs.status_inspection',
  'Warranty':         'jobs.status_warranty',
  'Closed':           'jobs.status_closed',
  // Inspection statuses
  'Pending Response': 'inspections.status_pending',
  'Response Overdue': 'inspections.status_overdue',
  'Reviewed':         'inspections.status_reviewed',
  // Order statuses
  'Processing':       'orders.status_processing',
  'Shipped':          'orders.status_shipped',
  'Delivered':        'orders.status_delivered',
  'Cancelled':        'orders.status_cancelled',
  // Quote statuses
  'Draft':            'quotes.status_draft',
  'Submitted':        'quotes.status_submitted',
  'Approved':         'quotes.status_approved',
  'Rejected':         'quotes.status_rejected',
}

// Solid-fill only — no outlined variants per design system.
// Covers job statuses, inspection statuses, order statuses, and quote statuses.
const colorMap = {
  // Job statuses
  'Bid':              'bg-amber/90 text-nav',
  'In Progress':      'bg-interactive text-white',
  'Under Inspection': 'bg-highlight/90 text-nav',
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

const badgeClass = computed(() => colorMap[props.status] ?? 'bg-surface-alt text-text-secondary')
const label = computed(() => {
  const key = statusKeyMap[props.status]
  return key ? t(key) : props.status
})
</script>

<template>
  <span
    :class="['inline-flex items-center px-2.5 py-[5px] rounded text-[11px] font-[700] uppercase tracking-widest leading-none', badgeClass]"
  >
    {{ label }}
  </span>
</template>
