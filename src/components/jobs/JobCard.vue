<template>
  <div @click="$emit('select', job)" class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer active:bg-gray-50">
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="font-semibold text-gray-800 truncate">{{ job.name }}</p>
        <p class="text-xs text-gray-500 mt-0.5 truncate">{{ job.address }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ job.type }} · {{ job.startDate }}</p>
      </div>
      <StatusBadge :status="job.status" class="shrink-0 mt-0.5" />
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../shared/StatusBadge.vue'
defineProps({ job: Object })
defineEmits(['select'])
</script>
