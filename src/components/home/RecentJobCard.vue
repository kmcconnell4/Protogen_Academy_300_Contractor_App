<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import jobs from '@/data/jobs.json'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const router = useRouter()

// Most recently updated non-closed job
const recentJob = computed(() =>
  [...jobs]
    .filter((j) => j.status !== 'Closed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] ?? null
)

const quoteCount = computed(() => recentJob.value?.quoteIds?.length ?? 0)
const orderCount = computed(() => recentJob.value?.orderIds?.length ?? 0)
const inspectionCount = computed(() => recentJob.value?.inspectionIds?.length ?? 0)
</script>

<template>
  <div v-if="recentJob" class="bg-surface border border-border rounded-xl overflow-hidden">

    <!-- Job identity: status badge + type + name + address -->
    <div class="px-4 pt-4 pb-4">
      <div class="flex items-center justify-between gap-3 mb-3">
        <StatusBadge :status="recentJob.status" />
        <p class="text-text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
          {{ recentJob.type }}
        </p>
      </div>
      <h2
        class="text-[1.625rem] font-[800] leading-tight text-white mb-1"
        style="font-family: var(--font-heading);"
      >
        {{ recentJob.name }}
      </h2>
      <p class="text-text-secondary text-sm truncate">{{ recentJob.address }}</p>
    </div>

    <!-- Stats row: 3 key numbers at a glance, 1px dividers between columns -->
    <div class="border-t border-border grid grid-cols-3 divide-x divide-border">
      <div class="flex flex-col items-center justify-center py-3 gap-0.5">
        <p class="text-white font-bold text-xl tabular-nums leading-none">{{ quoteCount }}</p>
        <p class="text-text-secondary text-[10px] font-bold uppercase tracking-wider">{{ t('jobs.tabs.quotes') }}</p>
      </div>
      <div class="flex flex-col items-center justify-center py-3 gap-0.5">
        <p class="text-white font-bold text-xl tabular-nums leading-none">{{ orderCount }}</p>
        <p class="text-text-secondary text-[10px] font-bold uppercase tracking-wider">{{ t('jobs.tabs.orders') }}</p>
      </div>
      <div class="flex flex-col items-center justify-center py-3 gap-0.5">
        <p class="text-white font-bold text-xl tabular-nums leading-none">{{ inspectionCount }}</p>
        <p class="text-text-secondary text-[10px] font-bold uppercase tracking-wider">{{ t('jobs.tabs.inspections') }}</p>
      </div>
    </div>

    <!-- CTA: full-width, primary action -->
    <div class="px-4 py-4 border-t border-border">
      <button
        class="w-full h-tap rounded-lg bg-interactive text-white font-bold text-base tracking-wide transition-opacity active:opacity-80"
        @click="router.push({ name: 'job-detail', params: { id: recentJob.id } })"
      >
        {{ t('home.open_job') }}
        <svg class="ml-1.5 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Empty state: teaches the interface -->
  <div v-else class="bg-surface border border-border rounded-xl px-4 py-8 text-center">
    <p class="text-white font-bold mb-1">{{ t('home.no_active_jobs') }}</p>
    <p class="text-text-secondary text-sm">{{ t('home.no_active_jobs_hint') }}</p>
  </div>
</template>

