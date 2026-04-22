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

  // Inspection responses — overdue first, then pending
  inspections
    .filter((i) => i.status === 'Pending Response' || i.status === 'Response Overdue')
    .forEach((i) => {
      const job = jobs.find((j) => j.id === i.jobId)
      items.push({
        id: i.id,
        type: 'Inspection',
        urgency: i.status === 'Response Overdue' ? 'error' : 'amber',
        heading: i.status === 'Response Overdue' ? 'Response overdue' : 'Response required',
        jobName: job?.name ?? '',
        route: { name: 'job-detail', params: { id: i.jobId } },
      })
    })

  // Quotes awaiting approval
  quotes
    .filter((q) => q.status === 'Submitted')
    .forEach((q) => {
      const job = jobs.find((j) => j.id === q.jobId)
      items.push({
        id: q.id,
        type: 'Quote',
        urgency: 'amber',
        heading: `v${q.version} awaiting approval`,
        jobName: job?.name ?? '',
        route: { name: 'job-detail', params: { id: q.jobId } },
      })
    })

  // Orders shipped — positive signal
  orders
    .filter((o) => o.status === 'Shipped')
    .forEach((o) => {
      const job = jobs.find((j) => j.id === o.jobId)
      items.push({
        id: o.id,
        type: 'Order',
        urgency: 'emerald',
        heading: 'Shipment in transit',
        jobName: job?.name ?? '',
        route: { name: 'job-detail', params: { id: o.jobId } },
      })
    })

  return items
})

// Per-urgency visual config — background tint, border, and type label color
const config = {
  amber:   { bg: 'bg-amber/15',   border: 'border-amber/30',   label: 'text-amber' },
  error:   { bg: 'bg-error/15',   border: 'border-error/30',   label: 'text-error' },
  emerald: { bg: 'bg-emerald/15', border: 'border-emerald/30', label: 'text-emerald' },
}
</script>

<template>
  <section v-if="alerts.length">
    <!-- Section header: urgency label left, count right -->
    <div class="flex items-center justify-between px-4 mb-3">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-amber">
        Action Required
      </p>
      <span class="text-[11px] font-bold text-text-secondary tabular-nums">
        {{ alerts.length }} {{ alerts.length === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <!-- Horizontally scrollable card row: px-4 aligns cards with page grid -->
    <div class="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
      <button
        v-for="(alert, i) in alerts"
        :key="alert.id"
        :class="[
          'shrink-0 w-[272px] flex flex-col gap-2 rounded-xl p-4 text-left border',
          'transition-opacity active:opacity-75',
          config[alert.urgency].bg,
          config[alert.urgency].border,
        ]"
        :style="{ animationDelay: `${i * 40}ms` }"
        @click="router.push(alert.route)"
      >
        <!-- Alert type: all-caps label in urgency color -->
        <p :class="['text-[11px] font-bold uppercase tracking-[0.12em]', config[alert.urgency].label]">
          {{ alert.type }}
        </p>
        <!-- Alert heading: bold, white, primary content -->
        <p class="text-white font-bold text-[0.9375rem] leading-snug">
          {{ alert.heading }}
        </p>
        <!-- Job name: secondary, clipped to one line -->
        <p class="text-text-secondary text-xs font-medium truncate">
          {{ alert.jobName }}
        </p>
      </button>
      <!-- Trailing spacer to reveal peek of overflow on last card -->
      <div class="shrink-0 w-4" aria-hidden="true" />
    </div>
  </section>
</template>

