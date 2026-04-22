<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import inspections from '@/data/inspections.json'
import quotes from '@/data/quotes.json'
import orders from '@/data/orders.json'
import jobs from '@/data/jobs.json'

const { t } = useI18n()
const router = useRouter()

const alerts = computed(() => {
  const items = []

  // Inspection responses overdue / pending
  inspections
    .filter((i) => i.status === 'Pending Response' || i.status === 'Response Overdue')
    .forEach((i) => {
      const job = jobs.find((j) => j.id === i.jobId)
      items.push({
        id: i.id,
        urgency: i.status === 'Response Overdue' ? 'error' : 'amber',
        message: t('alerts.inspection_due'),
        jobName: job?.name ?? '',
        route: { name: 'job-detail', params: { id: i.jobId } },
      })
    })

  // Quotes awaiting contractor (submitted but not yet approved/rejected)
  quotes
    .filter((q) => q.status === 'Submitted')
    .forEach((q) => {
      const job = jobs.find((j) => j.id === q.jobId)
      items.push({
        id: q.id,
        urgency: 'amber',
        message: `Quote v${q.version} awaiting approval`,
        jobName: job?.name ?? '',
        route: { name: 'job-detail', params: { id: q.jobId } },
      })
    })

  // Orders shipped (not yet delivered)
  orders
    .filter((o) => o.status === 'Shipped')
    .forEach((o) => {
      const job = jobs.find((j) => j.id === o.jobId)
      items.push({
        id: o.id,
        urgency: 'emerald',
        message: t('alerts.order_shipped'),
        jobName: job?.name ?? '',
        route: { name: 'job-detail', params: { id: o.jobId } },
      })
    })

  return items
})

const urgencyColor = {
  error:   'bg-error',
  amber:   'bg-amber',
  emerald: 'bg-emerald',
}
</script>

<template>
  <section v-if="alerts.length">
    <h2 class="text-xs font-bold tracking-widest uppercase text-text-secondary mb-3">
      ⚠️ {{ t('home.section_action_required') }}
    </h2>
    <div class="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="alert in alerts"
        :key="alert.id"
        class="shrink-0 w-72 bg-surface border border-border rounded-xl p-4 text-left flex items-start gap-3"
        @click="router.push(alert.route)"
      >
        <span :class="['mt-1 w-2.5 h-2.5 rounded-full shrink-0', urgencyColor[alert.urgency]]" />
        <div class="min-w-0">
          <p class="text-white font-bold text-sm leading-snug">{{ alert.message }}</p>
          <p class="text-text-secondary text-xs mt-0.5 truncate">{{ alert.jobName }}</p>
        </div>
      </button>
    </div>
  </section>
</template>
