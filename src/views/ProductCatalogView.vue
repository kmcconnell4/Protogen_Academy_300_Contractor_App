<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import products from '@/data/products.json'
import ProductCard from '@/components/products/ProductCard.vue'

const { t } = useI18n()

const CATEGORIES = [...new Set(products.map((p) => p.category))]
const searchQuery = ref('')
const activeCategory = ref('All')

const filtered = computed(() => {
  let list = products
  if (activeCategory.value !== 'All') {
    list = list.filter((p) => p.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    )
  }
  return list
})
</script>

<template>
  <main class="flex flex-col gap-4 pb-24 px-4 pt-4">
    <h1 class="text-xl font-bold text-white">{{ t('catalog.title') }}</h1>

    <!-- Search input -->
    <input
      v-model="searchQuery"
      type="search"
      :placeholder="t('catalog.search_placeholder')"
      class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white placeholder:text-text-secondary text-base focus:outline-none focus:border-highlight"
    />

    <!-- Category filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="cat in ['All', ...CATEGORIES]"
        :key="cat"
        :class="[
          'shrink-0 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-colors',
          activeCategory === cat
            ? 'bg-interactive text-white'
            : 'bg-surface text-text-secondary border border-border',
        ]"
        @click="activeCategory = cat"
      >
        {{ cat === 'All' ? t('catalog.filter_all') : cat }}
      </button>
    </div>

    <!-- Product grid -->
    <div v-if="filtered.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
    </div>
    <p v-else class="text-text-secondary text-center py-8">{{ t('catalog.no_products') }}</p>
  </main>
</template>
