<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFormatDate } from '@/composables/useFormatDate'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const router = useRouter()
const { formatDate } = useFormatDate()

const props = defineProps({
  job: { type: Object, required: true },
})
</script>

<template>
  <div
    class="w-full bg-surface border border-border rounded-xl overflow-hidden cursor-pointer transition-colors active:bg-surface-alt flex flex-col"
    role="button"
    :tabindex="0"
    @click="router.push({ name: 'job-detail', params: { id: job.id } })"
    @keydown.enter="router.push({ name: 'job-detail', params: { id: job.id } })"
  >
    <div class="w-full px-4 pt-4 pb-4 flex flex-col gap-2">
      <!-- Job type — context label at top -->
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary leading-none">
        {{ job.type }}
      </p>

      <!-- Name -->
      <h3
        class="text-white font-[800] leading-tight text-[1.625rem]"
        style="font-family: var(--font-heading);"
      >
        {{ job.name }}
      </h3>

      <!-- Address with location pin -->
      <div class="flex items-start gap-1.5">
        <svg
          class="w-3.5 h-3.5 text-text-secondary shrink-0 mt-[2px]"
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

    <!-- Status badge + updated date: border spans full card width -->
    <div class="w-full border-t border-border px-4 py-3 flex items-center justify-between gap-3">
      <StatusBadge :status="job.status" />
      <p class="text-text-secondary text-[12px]">
        {{ t('jobs.last_updated', { date: formatDate(job.updatedAt) }) }}
      </p>
    </div>
  </div>
</template>
