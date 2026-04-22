<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import contractors from '@/data/contractors.json'
import jobs from '@/data/jobs.json'

const { t } = useI18n()
const router = useRouter()

// Augment each contractor with their active job count
const contractorsWithStats = computed(() =>
  contractors.map((c) => ({
    ...c,
    activeJobs: jobs.filter((j) => j.contractorId === c.id && j.status !== 'Closed').length,
  }))
)
</script>

<template>
  <!-- Horizontal scroll of contractor cards for Sales Rep home view -->
  <div class="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
    <button
      v-for="contractor in contractorsWithStats"
      :key="contractor.id"
      class="shrink-0 w-[220px] flex flex-col gap-2 rounded-xl p-4 text-left bg-surface border border-border transition-opacity active:opacity-75"
      @click="router.push({ name: 'jobs', query: { contractor: contractor.id } })"
    >
      <!-- Company name + contact -->
      <div class="min-w-0">
        <h3
          class="text-white font-[800] text-[1.0625rem] leading-tight truncate"
          style="font-family: var(--font-heading);"
        >
          {{ contractor.name }}
        </h3>
        <p class="text-text-secondary text-xs font-medium mt-0.5 truncate">{{ contractor.contact }}</p>
      </div>

      <!-- Region + active job count -->
      <div class="flex items-center justify-between gap-2 mt-auto pt-1">
        <p class="text-text-secondary text-[11px] font-medium truncate">{{ contractor.region }}</p>
        <span
          class="shrink-0 bg-interactive/20 text-interactive text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
        >
          {{ t('home.contractor_active_jobs', { count: contractor.activeJobs }, contractor.activeJobs) }}
        </span>
      </div>
    </button>

    <!-- Trailing spacer for natural scroll boundary -->
    <div class="shrink-0 w-4" aria-hidden="true" />
  </div>
</template>
