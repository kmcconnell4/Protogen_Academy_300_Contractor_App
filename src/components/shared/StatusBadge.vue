<template>
  <span :class="classes" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const MAP = {
  'In Progress':  'bg-blue-100 text-blue-800',
  'Completed':    'bg-green-100 text-green-800',
  'Pending':      'bg-yellow-100 text-yellow-800',
  'Processing':   'bg-purple-100 text-purple-800',
  'Shipped':      'bg-sky-100 text-sky-800',
  'Delivered':    'bg-green-100 text-green-800',
  'Draft':        'bg-gray-100 text-gray-700',
  'Submitted':    'bg-blue-100 text-blue-800',
  'Approved':     'bg-green-100 text-green-800',
  'Rejected':     'bg-red-100 text-red-700',
  'Pass':         'bg-green-100 text-green-800',
  'Fail':         'bg-red-100 text-red-700',
  'Reviewed':     'bg-indigo-100 text-indigo-800',
}

const classes = computed(() => MAP[props.status] ?? 'bg-gray-100 text-gray-600')
</script>
