<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import quotes from '@/data/quotes.json'
import orders from '@/data/orders.json'
import inspections from '@/data/inspections.json'
import QuoteVersionList from '@/components/quotes/QuoteVersionList.vue'
import OrderList from '@/components/orders/OrderList.vue'
import InspectionCard from '@/components/inspections/InspectionCard.vue'

const { t } = useI18n()

const props = defineProps({
  job: { type: Object, required: true },
})

const activeTab = ref('overview')

const jobQuotes     = computed(() => quotes.filter((q) => props.job.quoteIds.includes(q.id)))
const jobOrders     = computed(() => orders.filter((o) => props.job.orderIds.includes(o.id)))
const jobInspections = computed(() => inspections.filter((i) => props.job.inspectionIds.includes(i.id)))

const tabs = computed(() => [
  { key: 'overview',     label: t('jobs.tabs.overview'),     count: null },
  { key: 'quotes',       label: t('jobs.tabs.quotes'),       count: jobQuotes.value.length },
  { key: 'orders',       label: t('jobs.tabs.orders'),       count: jobOrders.value.length },
  { key: 'inspections',  label: t('jobs.tabs.inspections'),  count: jobInspections.value.length },
])

function formatDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(iso + 'T00:00:00'))
}
</script>

<template>
  <div>

    <!-- Tab bar — horizontal scroll handles narrow screens -->
    <div class="flex border-b border-border px-4 pt-4 gap-0 overflow-x-auto no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors border-b-2 -mb-px shrink-0',
          activeTab === tab.key
            ? 'text-highlight border-highlight'
            : 'text-text-secondary border-transparent',
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== null"
          :class="[
            'inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-[800] leading-none',
            activeTab === tab.key ? 'bg-highlight/20 text-highlight' : 'bg-surface-alt text-text-secondary',
          ]"
        >{{ tab.count }}</span>
      </button>
    </div>

    <!-- Tab content -->
    <div class="px-4 pt-5">

      <!-- ── OVERVIEW ── -->
      <div v-if="activeTab === 'overview'" class="flex flex-col gap-4">

        <!-- Job details -->
        <div class="bg-surface border border-border rounded-xl overflow-hidden">
          <div class="divide-y divide-border">
            <div class="px-4 py-3 flex items-center justify-between gap-3">
              <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary shrink-0">{{ t('jobs.detail.type') }}</p>
              <p class="text-white font-[600] text-[15px] text-right">{{ job.type }}</p>
            </div>
            <div class="px-4 py-3 flex items-start justify-between gap-3">
              <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary shrink-0 mt-0.5">{{ t('jobs.detail.address') }}</p>
              <p class="text-white font-[600] text-[15px] text-right leading-snug">{{ job.address }}</p>
            </div>
            <div class="px-4 py-3 flex items-center justify-between gap-3">
              <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary shrink-0">{{ t('jobs.detail.square_footage') }}</p>
              <p class="text-white font-[600] text-[15px]">
                {{ job.squareFootage.toLocaleString() }}
                <span class="text-text-secondary"> {{ t('jobs.detail.sq_ft') }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="bg-surface border border-border rounded-xl overflow-hidden">
          <div class="divide-y divide-border">
            <div class="px-4 py-3 flex items-center justify-between gap-3">
              <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary shrink-0">{{ t('jobs.detail.created') }}</p>
              <p class="text-white font-[600] text-[15px]">{{ formatDate(job.createdAt) }}</p>
            </div>
            <div class="px-4 py-3 flex items-center justify-between gap-3">
              <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary shrink-0">{{ t('jobs.sort_updated') }}</p>
              <p class="text-white font-[600] text-[15px]">{{ formatDate(job.updatedAt) }}</p>
            </div>
            <div class="px-4 py-3 flex items-center justify-between gap-3">
              <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary shrink-0">{{ t('jobs.detail.assigned_rep') }}</p>
              <p class="text-white font-[600] text-[15px]">{{ job.repId }}</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="job.notes" class="bg-surface border border-border rounded-xl p-4">
          <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary mb-2">{{ t('jobs.detail.notes') }}</p>
          <p class="text-white text-[15px] leading-relaxed">{{ job.notes }}</p>
        </div>

      </div>

      <!-- ── QUOTES ── -->
      <div v-else-if="activeTab === 'quotes'">
        <QuoteVersionList v-if="jobQuotes.length" :quotes="jobQuotes" />
        <p v-else class="text-text-secondary text-center py-12 text-[15px]">{{ t('quotes.no_quotes') }}</p>
      </div>

      <!-- ── ORDERS ── -->
      <div v-else-if="activeTab === 'orders'">
        <OrderList v-if="jobOrders.length" :orders="jobOrders" />
        <p v-else class="text-text-secondary text-center py-12 text-[15px]">{{ t('orders.no_orders') }}</p>
      </div>

      <!-- ── INSPECTIONS ── -->
      <div v-else-if="activeTab === 'inspections'" class="flex flex-col gap-3">
        <template v-if="jobInspections.length">
          <InspectionCard
            v-for="inspection in jobInspections"
            :key="inspection.id"
            :inspection="inspection"
          />
        </template>
        <p v-else class="text-text-secondary text-center py-12 text-[15px]">{{ t('inspections.no_inspections') }}</p>
      </div>

    </div>
  </div>
</template>
