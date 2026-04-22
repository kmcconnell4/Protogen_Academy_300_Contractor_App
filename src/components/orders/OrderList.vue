<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatDate } from '@/composables/useFormatDate'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import OrderLineItems from './OrderLineItems.vue'

const { t } = useI18n()
const { formatDate } = useFormatDate()

const CARRIER_URLS = {
  'ABF Freight':  (n) => `https://www.abf.com/logistics/tracking?pro=${n}`,
  'R+L Carriers': (n) => `https://www.rlcarriers.com/freight/shipping/shipment-tracking?probill=${n}`,
}

function trackingUrl(order) {
  const builder = CARRIER_URLS[order.carrier]
  return builder ? builder(order.trackingNumber) : null
}

const props = defineProps({
  orders: { type: Array, required: true },
})

const expandedId = ref(null)

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="flex flex-col gap-3">

    <div
      v-for="order in orders"
      :key="order.id"
      class="bg-surface border border-border rounded-xl overflow-hidden"
    >

      <!-- Header row -->
      <button
        class="w-full flex items-start justify-between gap-3 p-4 text-left active:bg-surface-alt transition-colors"
        :aria-expanded="expandedId === order.id"
        @click="toggle(order.id)"
      >
        <div class="min-w-0">
          <p
            class="text-white font-[800] text-lg leading-none tracking-tight"
            style="font-family: var(--font-heading);"
          >
            {{ order.poNumber }}
          </p>
          <p class="text-text-secondary text-[13px] mt-1">
            {{ t('orders.ordered') }} {{ formatDate(order.orderedAt) }}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <StatusBadge :status="order.status" />
          <svg
            :class="['w-4 h-4 text-text-secondary transition-transform duration-200', expandedId === order.id ? 'rotate-180' : '']"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      <!-- Expanded shipping details + line items -->
      <div v-if="expandedId === order.id" class="border-t border-border">

        <!-- Shipping metadata strip -->
        <div class="bg-surface-alt px-4 py-3 flex flex-wrap gap-x-6 gap-y-2 border-b border-border">
          <div v-if="order.carrier" class="flex flex-col gap-0.5">
            <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">{{ t('orders.carrier') }}</span>
            <span class="text-white text-[13px] font-[600]">{{ order.carrier }}</span>
          </div>
          <div v-if="order.trackingNumber" class="flex flex-col gap-0.5">
            <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">{{ t('orders.tracking') }}</span>
            <a
              v-if="trackingUrl(order)"
              :href="trackingUrl(order)"
              target="_blank"
              rel="noopener noreferrer"
              class="text-highlight text-[13px] font-[600] font-mono underline underline-offset-2 hover:text-white transition-colors"
            >{{ order.trackingNumber }}</a>
            <span v-else class="text-white text-[13px] font-[600] font-mono">{{ order.trackingNumber }}</span>
          </div>
          <div v-if="order.shippedAt" class="flex flex-col gap-0.5">
            <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">{{ t('orders.shipped') }}</span>
            <span class="text-white text-[13px] font-[600]">{{ formatDate(order.shippedAt) }}</span>
          </div>
          <div v-if="order.deliveredAt" class="flex flex-col gap-0.5">
            <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-emerald/80">{{ t('orders.delivered') }}</span>
            <span class="text-emerald text-[13px] font-[600]">{{ formatDate(order.deliveredAt) }}</span>
          </div>
        </div>

        <OrderLineItems :line-items="order.lineItems" />

      </div>
    </div>

  </div>
</template>
