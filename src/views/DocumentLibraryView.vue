<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import documents from '@/data/documents.json'
import products from '@/data/products.json'
import DocumentCard from '@/components/documents/DocumentCard.vue'

const { t } = useI18n()

const DOC_TYPES = ['PDS', 'SDS', 'Spec']
const searchQuery = ref('')
const activeType = ref('All')
const activeProduct = ref('All')

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
  <main class="flex flex-col gap-4 pb-24 px-4 pt-4">
    <h1 class="text-xl font-bold text-white">{{ t('documents.title') }}</h1>

    <!-- Search input -->
    <input
      v-model="searchQuery"
      type="search"
      :placeholder="t('documents.search_placeholder')"
      class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white placeholder:text-text-secondary text-base focus:outline-none focus:border-highlight"
    />

    <!-- Type filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="type in ['All', ...DOC_TYPES]"
        :key="type"
        :class="[
          'shrink-0 px-3 py-1.5 rounded-full text-sm font-bold tracking-wide transition-colors',
          activeType === type
            ? 'bg-interactive text-white'
            : 'bg-surface text-text-secondary border border-border',
        ]"
        @click="activeType = type"
      >
        {{ type === 'All' ? t('documents.filter_all') : type }}
      </button>
    </div>

    <!-- Product filter -->
    <select
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
    <p v-else class="text-text-secondary text-center py-8">{{ t('documents.no_documents') }}</p>
  </main>
</template>
