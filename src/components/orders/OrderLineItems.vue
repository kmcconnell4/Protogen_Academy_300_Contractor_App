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
        class="shrink-0 text-xs font-bold text-highlight underline"
        @click="router.push({ name: 'catalog' })"
      >
        {{ t('orders.view_product') }}
      </button>
    </div>
  </div>
</template>
