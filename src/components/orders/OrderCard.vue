<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="font-semibold text-gray-800 truncate">{{ order.product }}</p>
        <p class="text-xs text-gray-500 mt-0.5 truncate">{{ order.jobName }}</p>
        <p class="text-xs text-gray-400 mt-1">Qty: {{ order.quantity }} {{ order.unit }} · {{ order.orderDate }}</p>
      </div>
      <StatusBadge :status="order.status" class="shrink-0 mt-0.5" />
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../shared/StatusBadge.vue'
defineProps({ order: Object })
</script>
