<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  job: { type: Object, required: true },
})

function formatDate(iso) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso + 'T00:00:00'))
}
</script>

<template>
  <button
    class="w-full text-left bg-surface border border-border rounded-xl p-4 flex flex-col transition-colors active:bg-surface-alt"
    @click="router.push({ name: 'job-detail', params: { id: job.id } })"
  >
    <!-- Job type — context label at top -->
    <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary leading-none">
      {{ job.type }}
    </p>

    <!-- Name + address — identity zone -->
    <div class="mt-2 min-w-0">
      <h3
        class="text-white font-[800] leading-tight text-[1.25rem] truncate"
        style="font-family: var(--font-heading);"
      >
        {{ job.name }}
      </h3>
      <div class="flex items-start gap-1.5 mt-1.5">
        <!-- Location pin icon -->
        <svg
          class="w-3.5 h-3.5 text-text-secondary shrink-0 mt-[1px]"
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
        <p class="text-text-secondary text-[13px] leading-snug truncate">{{ job.address }}</p>
      </div>
    </div>

    <!-- Status badge + updated date — action zone -->
    <div class="mt-3 flex items-center justify-between gap-3 pt-3 border-t border-border">
      <StatusBadge :status="job.status" />
      <p class="text-text-secondary text-[12px] shrink-0">
        {{ t('jobs.last_updated', { date: formatDate(job.updatedAt) }) }}
      </p>
    </div>
  </button>
</template>
