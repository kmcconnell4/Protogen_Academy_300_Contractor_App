<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="min-w-0">
        <p class="font-semibold text-gray-800 truncate">{{ quote.jobName }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Created {{ quote.createdDate }}</p>
      </div>
      <StatusBadge :status="quote.status" class="shrink-0 mt-0.5" />
    </div>
    <div class="text-xs text-gray-500 space-y-0.5 mb-3">
      <p v-for="item in quote.lineItems" :key="item.description">{{ item.description }} × {{ item.quantity }} @ ${{ item.unitPrice }} = ${{ item.total.toLocaleString() }}</p>
    </div>
    <div class="flex items-center justify-between text-sm">
      <span class="font-bold text-gray-800">Total: ${{ quote.grandTotal.toLocaleString() }}</span>
      <div v-if="canApprove" class="flex gap-2">
        <button @click="$emit('approve')" class="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Approve</button>
        <button @click="$emit('reject')" class="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Reject</button>
      </div>
    </div>
    <p v-if="quote.notes" class="text-xs text-gray-400 mt-2 italic">{{ quote.notes }}</p>
  </div>
</template>

<script setup>
import StatusBadge from '../shared/StatusBadge.vue'
defineProps({ quote: Object, canApprove: Boolean })
defineEmits(['approve', 'reject'])
</script>
