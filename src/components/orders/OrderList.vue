<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OrderLineItems from './OrderLineItems.vue'

const { t } = useI18n()

const props = defineProps({
  orders: { type: Array, required: true },
})

const expandedId = ref(null)

const statusColor = {
  Processing: 'bg-amber text-bg',
  Shipped:    'bg-interactive text-white',
  Delivered:  'bg-emerald text-bg',
}

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
      <button
        class="w-full flex items-center justify-between gap-3 p-4 text-left"
        @click="toggle(order.id)"
      >
        <div>
          <p class="text-white font-bold text-sm">{{ order.poNumber }}</p>
          <p class="text-text-secondary text-xs mt-0.5">{{ t('orders.ordered') }} {{ order.orderedAt }}</p>
        </div>
        <span :class="['px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest shrink-0', statusColor[order.status]]">
          {{ t(`orders.status_${order.status.toLowerCase()}`) }}
        </span>
      </button>
      <div v-if="expandedId === order.id" class="border-t border-border">
        <div class="p-4 flex flex-col gap-2 text-sm text-text-secondary">
          <div v-if="order.carrier" class="flex justify-between">
            <span>{{ t('orders.carrier') }}</span>
            <span class="text-white font-bold">{{ order.carrier }}</span>
          </div>
          <div v-if="order.trackingNumber" class="flex justify-between">
            <span>{{ t('orders.tracking') }}</span>
            <span class="text-white font-bold font-mono">{{ order.trackingNumber }}</span>
          </div>
          <div v-if="order.shippedAt" class="flex justify-between">
            <span>{{ t('orders.shipped') }}</span>
            <span class="text-white">{{ order.shippedAt }}</span>
          </div>
          <div v-if="order.deliveredAt" class="flex justify-between">
            <span>{{ t('orders.delivered') }}</span>
            <span class="text-white">{{ order.deliveredAt }}</span>
          </div>
        </div>
        <OrderLineItems :line-items="order.lineItems" />
      </div>
    </div>
  </div>
</template>
