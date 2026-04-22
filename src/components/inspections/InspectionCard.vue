<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="min-w-0">
        <p class="font-semibold text-gray-800 truncate">{{ inspection.jobName }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ inspection.inspectionDate }} · {{ inspection.inspector }}</p>
      </div>
      <StatusBadge :status="inspection.result" class="shrink-0 mt-0.5" />
    </div>
    <p class="text-xs text-gray-600 mb-2">{{ inspection.findings }}</p>

    <!-- Contractor response section for failed inspections -->
    <div v-if="inspection.result === 'Fail'">
      <div v-if="inspection.contractorResponse" class="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 mb-2">
        <span class="font-medium text-gray-700">Response:</span> {{ inspection.contractorResponse }}
        <div v-if="inspection.responseStatus" class="mt-1">
          <StatusBadge :status="inspection.responseStatus" />
        </div>
      </div>
      <button
        v-if="!canReview"
        @click="$emit('respond')"
        class="text-xs font-semibold text-[#C8102E] border border-[#C8102E] px-3 py-1.5 rounded-lg"
      >
        {{ inspection.contractorResponse ? 'Edit Response' : 'Submit Response' }}
      </button>
      <button
        v-if="canReview && inspection.contractorResponse && inspection.responseStatus !== 'Reviewed'"
        @click="$emit('mark-reviewed')"
        class="text-xs font-semibold text-indigo-700 border border-indigo-400 px-3 py-1.5 rounded-lg"
      >
        Mark Reviewed
      </button>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../shared/StatusBadge.vue'
defineProps({ inspection: Object, canReview: Boolean })
defineEmits(['respond', 'mark-reviewed'])
</script>
