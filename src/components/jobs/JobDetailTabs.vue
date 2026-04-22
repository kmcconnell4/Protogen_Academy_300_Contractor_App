<script setup>
import { ref } from 'vue'
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

const tabs = ['overview', 'quotes', 'orders', 'inspections']
const activeTab = ref('overview')

const jobQuotes = quotes.filter((q) => props.job.quoteIds.includes(q.id))
const jobOrders = orders.filter((o) => props.job.orderIds.includes(o.id))
const jobInspections = inspections.filter((i) => props.job.inspectionIds.includes(i.id))
</script>

<template>
  <div>
    <!-- Tab bar -->
    <div class="flex border-b border-border mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors',
          activeTab === tab
            ? 'text-highlight border-b-2 border-highlight'
            : 'text-text-secondary',
        ]"
        @click="activeTab = tab"
      >
        {{ t(`jobs.tabs.${tab}`) }}
      </button>
    </div>

    <!-- Overview -->
    <div v-if="activeTab === 'overview'" class="flex flex-col gap-3">
      <div v-for="field in ['job_name', 'address', 'type', 'status', 'assigned_rep', 'created']"
           :key="field"
           class="flex flex-col gap-0.5">
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {{ t(`jobs.detail.${field}`) }}
        </p>
        <p class="text-white font-bold">
          {{
            field === 'job_name'     ? job.name :
            field === 'address'      ? job.address :
            field === 'type'         ? job.type :
            field === 'status'       ? job.status :
            field === 'assigned_rep' ? job.repId :
            job.createdAt
          }}
        </p>
      </div>
      <div class="flex flex-col gap-0.5">
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {{ t('jobs.detail.square_footage') }}
        </p>
        <p class="text-white font-bold">{{ job.squareFootage.toLocaleString() }} {{ t('jobs.detail.sq_ft') }}</p>
      </div>
      <div v-if="job.notes" class="flex flex-col gap-0.5">
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {{ t('jobs.detail.notes') }}
        </p>
        <p class="text-white">{{ job.notes }}</p>
      </div>
    </div>

    <!-- Quotes -->
    <div v-else-if="activeTab === 'quotes'">
      <QuoteVersionList v-if="jobQuotes.length" :quotes="jobQuotes" />
      <p v-else class="text-text-secondary text-center py-8">{{ t('quotes.no_quotes') }}</p>
    </div>

    <!-- Orders -->
    <div v-else-if="activeTab === 'orders'">
      <OrderList v-if="jobOrders.length" :orders="jobOrders" />
      <p v-else class="text-text-secondary text-center py-8">{{ t('orders.no_orders') }}</p>
    </div>

    <!-- Inspections -->
    <div v-else-if="activeTab === 'inspections'" class="flex flex-col gap-3">
      <InspectionCard
        v-if="jobInspections.length"
        v-for="inspection in jobInspections"
        :key="inspection.id"
        :inspection="inspection"
      />
      <p v-else class="text-text-secondary text-center py-8">{{ t('inspections.no_inspections') }}</p>
    </div>
  </div>
</template>
