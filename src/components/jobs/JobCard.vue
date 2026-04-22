<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  job: { type: Object, required: true },
})
</script>

<template>
  <button
    class="w-full text-left bg-surface border border-border border-l-4 border-l-brand rounded-xl p-4 flex items-start justify-between gap-3"
    @click="router.push({ name: 'job-detail', params: { id: job.id } })"
  >
    <div class="min-w-0">
      <p class="text-white font-bold text-base leading-snug truncate">{{ job.name }}</p>
      <p class="text-text-secondary text-xs mt-0.5 truncate">{{ job.address }}</p>
      <p class="text-text-secondary text-xs mt-2">
        {{ t('jobs.last_updated', { date: job.updatedAt }) }}
      </p>
    </div>
    <StatusBadge :status="job.status" class="shrink-0 mt-0.5" />
  </button>
</template>
