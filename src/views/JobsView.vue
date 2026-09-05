<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useJobsData } from '@/composables/useJobsData'
import JobCard from '@/components/jobs/JobCard.vue'

const { t } = useI18n()
const router = useRouter()
const { jobs } = useJobsData()

const STATUSES = ['Bid', 'In Progress', 'Under Inspection', 'Warranty', 'Closed']
const activeFilter = ref('All')
const sortBy = ref('updated')

const filtered = computed(() => {
  let list = jobs.value
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
    STATUSES.map((s) => [s, jobs.value.filter((j) => j.status === s).length]),
  )
  return [
    { label: t('jobs.filter_all'), value: 'All', count: jobs.value.length },
    ...STATUSES.map((s) => ({
      label: t(`jobs.filter_${s.toLowerCase().replace(' ', '_')}`),
      value: s,
      count: counts[s],
    })),
  ]
})
</script>

<template>
  <main class="flex flex-col pb-36">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <div class="flex items-center justify-between gap-3">
        <h1
          class="text-[2.25rem] font-[800] text-white leading-none"
          style="font-family: var(--font-heading);"
        >
          {{ t('jobs.title') }}
        </h1>
        <button
          class="shrink-0 inline-flex items-center gap-1.5 h-[32px] px-3 rounded-lg bg-interactive text-white text-[12px] font-[700] uppercase tracking-widest transition-opacity active:opacity-80"
          @click="router.push({ name: 'create-job' })"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {{ t('common.new') }}
        </button>
      </div>
    </div>

    <!-- Filters + sort -->
    <div class="px-4 pt-4 pb-1 flex flex-col gap-3">

      <!-- Status filter chips — horizontal scroll, no scrollbar -->
      <div class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
        <button
          v-for="f in allFilters"
          :key="f.value"
          :class="[
            'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeFilter === f.value
              ? 'bg-interactive/20 text-highlight border-2 border-highlight'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
          <span
            :class="[
              'ml-1.5 tabular-nums',
              activeFilter === f.value ? 'text-highlight/60' : 'text-text-secondary/50',
            ]"
          >{{ f.count }}</span>
        </button>
      </div>

      <!-- Sort toggle: single tap-to-cycle button -->
      <button
        class="flex items-center gap-1.5 h-[36px] px-2.5 rounded-lg text-[11px] font-[700] uppercase tracking-widest text-text-secondary transition-colors hover:text-white"
        @click="sortBy = sortBy === 'updated' ? 'name' : 'updated'"
      >
        <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 18V6M5 9l3-3 3 3M16 6v12M13 15l3 3 3-3" />
        </svg>
        {{ sortBy === 'updated' ? t('jobs.sort_updated') : t('jobs.sort_name') }}
      </button>

    </div>

    <!-- Job list -->
    <div class="px-4 mt-3">
      <div v-if="filtered.length" class="flex flex-col gap-3">
        <JobCard v-for="job in filtered" :key="job.id" :job="job" />
      </div>
      <div v-else class="py-12 text-center flex flex-col items-center gap-3">
        <p v-if="activeFilter !== 'All'" class="text-text-secondary text-[15px]">
          {{ t('jobs.no_jobs_filtered') }}
        </p>
        <p v-else class="text-text-secondary text-[15px]">
          {{ t('jobs.no_jobs') }}
        </p>
        <button
          v-if="activeFilter !== 'All'"
          class="text-highlight text-[13px] font-[700] uppercase tracking-[0.1em] hover:underline"
          @click="activeFilter = 'All'"
        >
          {{ t('jobs.clear_filter') }}
        </button>
      </div>
    </div>

  </main>
</template>
