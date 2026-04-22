<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import jobs from '@/data/jobs.json'
import JobCard from '@/components/jobs/JobCard.vue'

const { t } = useI18n()

const STATUSES = ['Bid', 'In Progress', 'Inspection', 'Warranty', 'Closed']
const activeFilter = ref('All')
const sortBy = ref('updated')

const filtered = computed(() => {
  let list = jobs
  if (activeFilter.value !== 'All') {
    list = list.filter((j) => j.status === activeFilter.value)
  }
  if (sortBy.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  } else {
    list = [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }
  return list
})
</script>

<template>
  <main class="flex flex-col gap-4 pb-24 px-4 pt-4">
    <h1 class="text-xl font-bold text-white">{{ t('jobs.title') }}</h1>

    <!-- Status filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="status in ['All', ...STATUSES]"
        :key="status"
        :class="[
          'shrink-0 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-colors',
          activeFilter === status
            ? 'bg-interactive text-white'
            : 'bg-surface text-text-secondary border border-border',
        ]"
        @click="activeFilter = status"
      >
        {{ status === 'All' ? t('jobs.filter_all') : t(`jobs.filter_${status.toLowerCase().replace(' ', '_')}`) }}
      </button>
    </div>

    <!-- Job list -->
    <div v-if="filtered.length" class="flex flex-col gap-3">
      <JobCard v-for="job in filtered" :key="job.id" :job="job" />
    </div>
    <p v-else class="text-text-secondary text-center py-8">{{ t('jobs.no_jobs') }}</p>
  </main>
</template>
