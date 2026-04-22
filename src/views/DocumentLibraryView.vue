<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import documents from '@/data/documents.json'
import products from '@/data/products.json'
import DocumentCard from '@/components/documents/DocumentCard.vue'

const { t } = useI18n()
const route = useRoute()

const DOC_TYPES = ['PDS', 'SDS', 'Spec']
const searchQuery = ref('')
const activeType = ref('All')
const activeProduct = ref('All')

// Counts scoped only to search/product filter (not type) so chips show meaningful numbers
const typeCounts = computed(() => {
  let base = documents
  if (activeProduct.value !== 'All') {
    base = base.filter((d) => d.productId === activeProduct.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    base = base.filter((d) => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))
  }
  return Object.fromEntries(
    ['All', ...DOC_TYPES].map((t) => [
      t,
      t === 'All' ? base.length : base.filter((d) => d.type === t).length,
    ])
  )
})

onMounted(() => {
  if (route.query.search) searchQuery.value = route.query.search
})

const filtered = computed(() => {
  let list = documents
  if (activeType.value !== 'All') {
    list = list.filter((d) => d.type === activeType.value)
  }
  if (activeProduct.value !== 'All') {
    list = list.filter((d) => d.productId === activeProduct.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    )
  }
  return list
})
</script>

<template>
  <main class="flex flex-col pb-24">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <h1
        class="text-[2.25rem] font-[800] text-white leading-none"
        style="font-family: var(--font-heading);"
      >
        {{ t('documents.title') }}
      </h1>
    </div>

    <div class="px-4 pt-4 flex flex-col gap-3">

    <!-- Search input -->
    <input
      v-model="searchQuery"
      type="search"
      :placeholder="t('documents.search_placeholder')"
      class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white placeholder:text-text-secondary text-base focus:outline-none focus:border-highlight"
    />

    <!-- Type filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        <button
          v-for="type in ['All', ...DOC_TYPES]"
          :key="type"
          :class="[
            'shrink-0 h-[52px] px-3.5 rounded-lg text-[11px] font-[700] uppercase tracking-[0.1em] transition-colors',
            activeType === type
              ? 'bg-interactive text-white'
              : 'bg-surface text-text-secondary border border-border',
          ]"
          @click="activeType = type"
        >
          {{ type === 'All' ? t('documents.filter_all') : t(`documents.filter_${type.toLowerCase()}`) }}
          <span
            :class="[
              'ml-1.5 tabular-nums',
              activeType === type ? 'text-white/60' : 'text-text-secondary/50',
            ]"
          >{{ typeCounts[type] }}</span>
        </button>
    </div>

    <!-- Product filter -->
    <label for="product-filter" class="sr-only">{{ t('documents.filter_product') }}</label>
    <select
      id="product-filter"
      v-model="activeProduct"
      class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white text-base focus:outline-none focus:border-highlight"
    >
      <option value="All">{{ t('documents.filter_product') }}</option>
      <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>

    <!-- Document list -->
    <div v-if="filtered.length" class="flex flex-col gap-3">
      <DocumentCard v-for="doc in filtered" :key="doc.id" :doc="doc" />
    </div>
    <div v-else class="py-12 text-center flex flex-col items-center gap-3">
      <p class="text-text-secondary text-[15px]">
        {{ searchQuery.trim() || activeType !== 'All' || activeProduct !== 'All' ? t('documents.no_documents_filtered') : t('documents.no_documents') }}
      </p>
      <button
        v-if="searchQuery.trim() || activeType !== 'All' || activeProduct !== 'All'"
        class="text-highlight text-[13px] font-[700] uppercase tracking-[0.1em] hover:underline"
        @click="searchQuery = ''; activeType = 'All'; activeProduct = 'All'"
      >
        {{ t('documents.filter_all') }}
      </button>
    </div>
  </div>
  </main>
</template>
