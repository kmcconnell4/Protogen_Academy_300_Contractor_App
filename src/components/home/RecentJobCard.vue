<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import jobs from '@/data/jobs.json'
import orders from '@/data/orders.json'
import products from '@/data/products.json'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const router = useRouter()

// Most recently updated active job (not Closed)
const recentJob = computed(() =>
  [...jobs]
    .filter((j) => j.status !== 'Closed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] ?? null
)

const productCount = computed(() => {
  if (!recentJob.value) return 0
  const jobOrders = orders.filter((o) => o.jobId === recentJob.value.id)
  const productIds = new Set(jobOrders.flatMap((o) => o.lineItems.map((li) => li.productId)))
  return productIds.size
})

const orderCount = computed(() =>
  recentJob.value ? orders.filter((o) => o.jobId === recentJob.value.id).length : 0
)
</script>

<template>
  <div v-if="recentJob" class="bg-surface border border-border rounded-xl p-4 border-l-4 border-l-brand">
    <div class="flex items-center justify-between gap-2 mb-1">
      <p class="text-white font-bold text-lg leading-tight">{{ recentJob.name }}</p>
      <StatusBadge :status="recentJob.status" />
    </div>
    <p class="text-text-secondary text-sm mb-3">
      {{ t('home.products_count', { count: productCount }) }} &middot;
      {{ t('home.orders_count', { count: orderCount }) }}
    </p>
    <button
      class="w-full h-[52px] rounded-lg bg-interactive text-white font-bold text-base"
      @click="router.push({ name: 'job-detail', params: { id: recentJob.id } })"
    >
      {{ t('home.open_job') }} →
    </button>
  </div>
  <div v-else class="text-text-secondary text-sm text-center py-6">
    {{ t('home.no_alerts') }}
  </div>
</template>
