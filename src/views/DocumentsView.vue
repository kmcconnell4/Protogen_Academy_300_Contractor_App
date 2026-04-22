<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">Documents</h1>
      <select v-model="activeCategory" class="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-700">
        <option value="All">All</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <div class="space-y-3">
      <DocumentCard v-for="doc in filteredDocs" :key="doc.id" :doc="doc" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import allDocs from '../data/documents.json'
import DocumentCard from '../components/documents/DocumentCard.vue'

const activeCategory = ref('All')
const categories = [...new Set(allDocs.map(d => d.category))]

const filteredDocs = computed(() =>
  activeCategory.value === 'All' ? allDocs : allDocs.filter(d => d.category === activeCategory.value)
)
</script>
