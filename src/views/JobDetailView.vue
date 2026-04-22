<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import jobs from '@/data/jobs.json'
import JobDetailTabs from '@/components/jobs/JobDetailTabs.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const job = computed(() => jobs.find((j) => j.id === route.params.id))

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push({ name: 'jobs' })
  }
}
</script>

<template>
  <main class="pb-24">

    <!-- Back navigation -->
    <div class="px-4 pt-4">
      <button
        class="flex items-center gap-1.5 h-[52px] -ml-1 pl-1 text-text-secondary text-[11px] font-[700] uppercase tracking-[0.12em] transition-colors active:text-white"
        @click="goBack()"
      >
        <svg
          class="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        {{ t('jobs.title') }}
      </button>
    </div>

    <div v-if="job">

      <!-- Job header -->
      <div class="px-4 pb-5 border-b border-border">
        <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary leading-none mb-2">
          {{ job.type }}
        </p>
        <div class="flex items-start justify-between gap-3 mb-2">
          <h1
            class="text-[2rem] font-[800] text-white leading-tight"
            style="font-family: var(--font-heading);"
          >
            {{ job.name }}
          </h1>
          <StatusBadge :status="job.status" class="shrink-0 mt-1.5" />
        </div>
        <div class="flex items-center gap-1.5">
          <svg
            class="w-3.5 h-3.5 text-text-secondary shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.557 6.326 3.5 8.327a19.581 19.581 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-text-secondary text-[13px]">{{ job.address }}</p>
        </div>

        <!-- Stats counter row -->
        <div class="grid grid-cols-3 divide-x divide-border border border-border rounded-xl mt-4 overflow-hidden">
          <div class="flex flex-col items-center py-3 gap-0.5">
            <p
              class="text-white font-[800] text-xl leading-none"
              style="font-family: var(--font-heading);"
            >{{ job.quoteIds.length }}</p>
            <p class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
              {{ t('jobs.tabs.quotes') }}
            </p>
          </div>
          <div class="flex flex-col items-center py-3 gap-0.5">
            <p
              class="text-white font-[800] text-xl leading-none"
              style="font-family: var(--font-heading);"
            >{{ job.orderIds.length }}</p>
            <p class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
              {{ t('jobs.tabs.orders') }}
            </p>
          </div>
          <div class="flex flex-col items-center py-3 gap-0.5">
            <p
              class="text-white font-[800] text-xl leading-none"
              style="font-family: var(--font-heading);"
            >{{ job.inspectionIds.length }}</p>
            <p class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
              {{ t('jobs.tabs.inspections') }}
            </p>
          </div>
        </div>
      </div>

      <JobDetailTabs :job="job" />

    </div>

    <div v-else class="px-4 py-12 text-center">
      <p class="text-error font-[700]">{{ t('jobs.not_found') }}</p>
    </div>

  </main>
</template>
