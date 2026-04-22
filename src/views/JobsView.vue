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

// Build filter chips with per-status counts
const allFilters = computed(() => {
  const counts = Object.fromEntries(
    STATUSES.map((s) => [s, jobs.filter((j) => j.status === s).length]),
  )
  return [
    { label: t('jobs.filter_all'), value: 'All', count: jobs.length },
    ...STATUSES.map((s) => ({
      label: t(`jobs.filter_${s.toLowerCase().replace(' ', '_')}`),
      value: s,
      count: counts[s],
    })),
  ]
})
</script>

<template>
  <main class="flex flex-col pb-24">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-1 leading-none">
        {{ filtered.length }}&nbsp;{{ filtered.length === 1 ? 'job' : 'jobs' }}
      </p>
      <h1
        class="text-[2.25rem] font-[800] text-white leading-none"
        style="font-family: var(--font-heading);"
      >
        {{ t('jobs.title') }}
      </h1>
    </div>

    <!-- Filters + sort -->
    <div class="px-4 pt-4 pb-1 flex flex-col gap-3">

      <!-- Status filter chips — horizontal scroll, no scrollbar -->
      <div class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
        <button
          v-for="f in allFilters"
          :key="f.value"
          :class="[
            'shrink-0 h-[40px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeFilter === f.value
              ? 'bg-interactive text-white'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
          <span
            :class="[
              'ml-1.5 tabular-nums',
              activeFilter === f.value ? 'text-white/60' : 'text-text-secondary/50',
            ]"
          >{{ f.count }}</span>
        </button>
      </div>

      <!-- Sort toggle -->
      <div class="flex items-center gap-1">
        <span class="text-[11px] font-[600] uppercase tracking-widest text-text-secondary mr-0.5">
          Sort:
        </span>
        <button
          :class="[
            'h-[34px] px-3 rounded-lg text-[11px] font-[700] uppercase tracking-[0.08em] transition-colors',
            sortBy === 'updated' ? 'bg-surface-alt text-white' : 'text-text-secondary',
          ]"
          @click="sortBy = 'updated'"
        >
          {{ t('jobs.sort_updated') }}
        </button>
        <button
          :class="[
            'h-[34px] px-3 rounded-lg text-[11px] font-[700] uppercase tracking-[0.08em] transition-colors',
            sortBy === 'name' ? 'bg-surface-alt text-white' : 'text-text-secondary',
          ]"
          @click="sortBy = 'name'"
        >
          {{ t('jobs.sort_name') }}
        </button>
      </div>

    </div>

    <!-- Job list -->
    <div class="px-4 mt-3">
      <div v-if="filtered.length" class="flex flex-col gap-3">
        <JobCard v-for="job in filtered" :key="job.id" :job="job" />
      </div>
      <p v-else class="text-center text-text-secondary text-[15px] py-12">
        {{ t('jobs.no_jobs') }}
      </p>
    </div>

  </main>
</template>
