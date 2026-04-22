<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import products from '@/data/products.json'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  lineItems: { type: Array, required: true },
})

function getProduct(productId) {
  return products.find((p) => p.id === productId) ?? null
}
</script>

<template>
  <div class="p-4 flex flex-col gap-3 border-t border-border">
    <div
      v-for="item in lineItems"
      :key="item.productId"
      class="flex items-start justify-between gap-2"
    >
      <div class="min-w-0">
        <p class="text-white font-bold text-sm truncate">{{ item.description }}</p>
        <p class="text-text-secondary text-xs">{{ item.qty }} {{ item.unit }}</p>
      </div>
      <button
        v-if="getProduct(item.productId)"
        class="shrink-0 inline-flex items-center gap-1 h-[30px] px-2.5 rounded bg-interactive/15 text-highlight text-[11px] font-[700] uppercase tracking-[0.08em]"
        @click="router.push({ name: 'catalog', query: { product: item.productId } })"
      >
        {{ t('orders.view_product') }}
      </button>
    </div>
  </div>
</template>
