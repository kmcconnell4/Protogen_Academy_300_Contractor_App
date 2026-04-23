<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import products from '@/data/products.json'
import ProductCard from '@/components/products/ProductCard.vue'

const { t } = useI18n()
const route = useRoute()

const CATEGORIES = [...new Set(products.map((p) => p.category))]
const searchQuery = ref('')
const activeCategory = ref('All')

onMounted(() => {
  const productId = route.query.product
  if (productId) {
    const match = products.find((p) => p.id === productId)
    if (match) searchQuery.value = match.name
  }
})

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
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }
  return list
})

const categoryCounts = computed(() =>
  Object.fromEntries(CATEGORIES.map((c) => [c, products.filter((p) => p.category === c).length])),
)
</script>

<template>
  <main class="flex flex-col pb-36">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <h1
        class="text-[2.25rem] font-[800] text-white leading-none"
        style="font-family: var(--font-heading);"
      >
        {{ t('catalog.title') }}
      </h1>
    </div>

    <div class="px-4 pt-4 flex flex-col gap-3">

      <!-- Search -->
      <div class="relative">
        <svg
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          :placeholder="t('catalog.search_placeholder')"
          :aria-label="t('catalog.search_placeholder')"
          class="w-full h-[52px] pl-10 pr-4 rounded-xl bg-surface border border-border text-white placeholder:text-text-secondary text-[15px] font-[500] focus:outline-none focus:border-highlight transition-colors"
        />
      </div>

      <!-- Category filter chips -->
      <div class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
        <button
          :class="[
            'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeCategory === 'All'
              ? 'bg-interactive text-white'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="activeCategory = 'All'"
        >
          {{ t('catalog.filter_all') }}
          <span :class="['ml-1.5 tabular-nums', activeCategory === 'All' ? 'text-white/60' : 'text-text-secondary/50']">
            {{ products.length }}
          </span>
        </button>

        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          :class="[
            'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeCategory === cat
              ? 'bg-interactive text-white'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="activeCategory = cat"
        >
          {{ t('catalog.categories.' + cat) || cat }}
          <span :class="['ml-1.5 tabular-nums', activeCategory === cat ? 'text-white/60' : 'text-text-secondary/50']">
            {{ categoryCounts[cat] }}
          </span>
        </button>
      </div>

    </div>

    <!-- Product list — single column on mobile, 2-col on tablet+ -->
    <div class="px-4 mt-4">
      <div v-if="filtered.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ProductCard v-for="product in filtered" :key="product.id" :product="product" />
      </div>
      <div v-else class="py-12 text-center flex flex-col items-center gap-3">
        <p class="text-text-secondary text-[15px]">
          {{ searchQuery.trim() || activeCategory !== 'All' ? t('catalog.no_products_filtered') : t('catalog.no_products') }}
        </p>
        <button
          v-if="searchQuery.trim() || activeCategory !== 'All'"
          class="text-highlight text-[13px] font-[700] uppercase tracking-[0.1em] hover:underline"
          @click="searchQuery = ''; activeCategory = 'All'"
        >
          {{ t('catalog.filter_all') }}
        </button>
      </div>
    </div>

  </main>
</template>
