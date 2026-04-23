<script setup>
import products from '@/data/products.json'

const props = defineProps({
  lineItems: { type: Array, required: true },
})

function getProduct(productId) {
  return products.find((p) => p.id === productId) ?? null
}
</script>

<template>
  <div class="p-4 flex flex-col gap-0 border-t border-border divide-y divide-border">
    <component
      v-for="item in lineItems"
      :key="item.productId"
      :is="getProduct(item.productId) ? 'router-link' : 'div'"
      v-bind="getProduct(item.productId) ? { to: { name: 'product-detail', params: { id: item.productId } } } : {}"
      class="flex items-center justify-between gap-3 py-3 transition-colors"
      :class="getProduct(item.productId) ? 'active:bg-surface-alt -mx-4 px-4' : ''"
    >
      <div class="min-w-0">
        <p class="text-white font-bold text-sm truncate">{{ item.description }}</p>
        <p class="text-text-secondary text-xs">{{ item.qty }} {{ item.unit }}</p>
      </div>
      <svg
        v-if="getProduct(item.productId)"
        class="w-4 h-4 text-border shrink-0"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </component>
  </div>
</template>
