<script setup>
import { useI18n } from 'vue-i18n'
import products from '@/data/products.json'

const { t } = useI18n()

const props = defineProps({
  lineItems: { type: Array, required: true },
  subtotal:  { type: Number, required: true },
  tax:       { type: Number, required: true },
  total:     { type: Number, required: true },
})

function productName(productId) {
  return products.find((p) => p.id === productId)?.name ?? productId
}
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <div class="flex flex-col gap-2">
      <div
        v-for="item in lineItems"
        :key="item.productId"
        class="flex items-start justify-between gap-2 text-sm"
      >
        <div class="min-w-0">
          <p class="text-white font-bold truncate">{{ productName(item.productId) }}</p>
          <p class="text-text-secondary">{{ item.qty }} {{ item.unit }} × ${{ item.unitPrice }}</p>
        </div>
        <p class="text-white font-bold shrink-0">${{ item.total.toLocaleString() }}</p>
      </div>
    </div>
    <div class="border-t border-border pt-3 flex flex-col gap-1 text-sm">
      <div class="flex justify-between text-text-secondary">
        <span>{{ t('quotes.subtotal') }}</span>
        <span>${{ subtotal.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between text-text-secondary">
        <span>{{ t('quotes.tax') }}</span>
        <span>${{ tax.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between text-white font-bold text-base mt-1">
        <span>{{ t('quotes.total') }}</span>
        <span>${{ total.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>
