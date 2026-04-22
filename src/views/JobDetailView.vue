<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import jobs from '@/data/jobs.json'
import JobDetailTabs from '@/components/jobs/JobDetailTabs.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const route = useRoute()

const job = computed(() => jobs.find((j) => j.id === route.params.id))
</script>

<template>
  <main class="pb-24 px-4 pt-4">
    <div v-if="job">
      <div class="mb-4">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h1 class="text-xl font-bold text-white leading-tight">{{ job.name }}</h1>
          <StatusBadge :status="job.status" class="shrink-0 mt-0.5" />
        </div>
        <p class="text-text-secondary text-sm">{{ job.address }}</p>
      </div>
      <JobDetailTabs :job="job" />
    </div>
    <p v-else class="text-error text-center py-12">Job not found.</p>
  </main>
</template>
