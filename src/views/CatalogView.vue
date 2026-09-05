<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import products from '@/data/products.json'
import ProductCard from '@/components/products/ProductCard.vue'

const { t } = useI18n()
const route = useRoute()

// UI-only grouping layered over products.json's flat `category` field —
// only Membranes maps to more than one category today, so it's the only
// group that reveals a second filter tier.
const CATEGORY_GROUPS = {
  Membranes: ['TPO Membrane', 'EPDM Membrane'],
  Insulation: ['Insulation'],
  Accessories: ['Accessories'],
  Flashing: ['Flashing'],
  'Sheet Metal': ['Sheet Metal'],
  'System Packages': ['System Packages'],
  Adhesives: ['Adhesives'],
}
const GROUPS = Object.keys(CATEGORY_GROUPS)

function groupLabel(group) {
  return group === 'Membranes' ? t('catalog.groups.Membranes') : t('catalog.categories.' + group)
}

const searchQuery = ref('')
const activeGroup = ref('All')
const activeSubCategory = ref('All')

const activeGroupCategories = computed(() =>
  activeGroup.value === 'All' ? [] : CATEGORY_GROUPS[activeGroup.value]
)
const showSubTier = computed(() => activeGroupCategories.value.length > 1)

function selectGroup(group) {
  activeGroup.value = group
  activeSubCategory.value = 'All'
}

onMounted(() => {
  const productId = route.query.product
  if (productId) {
    const match = products.find((p) => p.id === productId)
    if (match) searchQuery.value = match.name
  }
})

function matchesSearch(p, q) {
  return (
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    p.tags.some((tag) => tag.toLowerCase().includes(q))
  )
}

const filtered = computed(() => {
  let list = products
  if (activeGroup.value !== 'All') {
    list =
      activeSubCategory.value !== 'All'
        ? list.filter((p) => p.category === activeSubCategory.value)
        : list.filter((p) => activeGroupCategories.value.includes(p.category))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((p) => matchesSearch(p, q))
  }
  return list
})

// Group counts scoped only to search, so chips stay meaningful while typing
const groupCounts = computed(() => {
  let base = products
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    base = base.filter((p) => matchesSearch(p, q))
  }
  return Object.fromEntries(
    ['All', ...GROUPS].map((g) => [
      g,
      g === 'All' ? base.length : base.filter((p) => CATEGORY_GROUPS[g].includes(p.category)).length,
    ])
  )
})

// Sub-category counts scoped to the active group + search
const subCategoryCounts = computed(() => {
  if (!showSubTier.value) return {}
  let base = products.filter((p) => activeGroupCategories.value.includes(p.category))
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    base = base.filter((p) => matchesSearch(p, q))
  }
  return Object.fromEntries(
    ['All', ...activeGroupCategories.value].map((c) => [
      c,
      c === 'All' ? base.length : base.filter((p) => p.category === c).length,
    ])
  )
})

function clearFilters() {
  searchQuery.value = ''
  activeGroup.value = 'All'
  activeSubCategory.value = 'All'
}
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

      <!-- Row 1: group chips -->
      <div class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
        <button
          :class="[
            'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeGroup === 'All'
              ? 'bg-interactive text-white'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="selectGroup('All')"
        >
          {{ t('catalog.filter_all') }}
          <span :class="['ml-1.5 tabular-nums', activeGroup === 'All' ? 'text-white/60' : 'text-text-secondary/50']">
            {{ groupCounts['All'] }}
          </span>
        </button>

        <button
          v-for="group in GROUPS"
          :key="group"
          :class="[
            'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeGroup === group
              ? 'bg-interactive text-white'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="selectGroup(group)"
        >
          {{ groupLabel(group) }}
          <span :class="['ml-1.5 tabular-nums', activeGroup === group ? 'text-white/60' : 'text-text-secondary/50']">
            {{ groupCounts[group] }}
          </span>
        </button>
      </div>

      <!-- Row 2: sub-category chips — only when the active group has more than one category -->
      <div v-if="showSubTier" class="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
        <button
          :class="[
            'shrink-0 h-[44px] px-3 rounded-lg text-[11px] font-[700] uppercase tracking-[0.08em] transition-colors',
            activeSubCategory === 'All'
              ? 'bg-highlight/20 text-highlight border-2 border-highlight'
              : 'bg-surface-alt text-text-secondary border border-border',
          ]"
          @click="activeSubCategory = 'All'"
        >
          {{ t('catalog.filter_all') }}
          <span :class="['ml-1.5 tabular-nums', activeSubCategory === 'All' ? 'text-highlight/60' : 'text-text-secondary/50']">
            {{ subCategoryCounts['All'] }}
          </span>
        </button>
        <button
          v-for="cat in activeGroupCategories"
          :key="cat"
          :class="[
            'shrink-0 h-[44px] px-3 rounded-lg text-[11px] font-[700] uppercase tracking-[0.08em] transition-colors',
            activeSubCategory === cat
              ? 'bg-highlight/20 text-highlight border-2 border-highlight'
              : 'bg-surface-alt text-text-secondary border border-border',
          ]"
          @click="activeSubCategory = cat"
        >
          {{ t('catalog.categories.' + cat) }}
          <span :class="['ml-1.5 tabular-nums', activeSubCategory === cat ? 'text-highlight/60' : 'text-text-secondary/50']">
            {{ subCategoryCounts[cat] }}
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
          {{ searchQuery.trim() || activeGroup !== 'All' ? t('catalog.no_products_filtered') : t('catalog.no_products') }}
        </p>
        <button
          v-if="searchQuery.trim() || activeGroup !== 'All'"
          class="text-highlight text-[13px] font-[700] uppercase tracking-[0.1em] hover:underline"
          @click="clearFilters"
        >
          {{ t('catalog.filter_all') }}
        </button>
      </div>
    </div>

  </main>
</template>
