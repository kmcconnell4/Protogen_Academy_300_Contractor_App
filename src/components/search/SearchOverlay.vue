<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

const { t } = useI18n()
const router = useRouter()
const { query, results, hasResults, setQuery, clearQuery } = useSearch()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

function close() {
  clearQuery()
  emit('update:modelValue', false)
}

const ROUTE_MAP = {
  jobs:      (item) => router.push({ name: 'job-detail', params: { id: item.id } }),
  products:  () => router.push({ name: 'catalog' }),
  quotes:    (item) => router.push({ name: 'job-detail', params: { id: item.jobId } }),
  documents: () => router.push({ name: 'documents' }),
  videos:    () => router.push({ name: 'videos' }),
}

function navigate(type, item) {
  ROUTE_MAP[type]?.(item)
  close()
}

function labelForItem(type, item) {
  if (type === 'jobs')      return item.name
  if (type === 'products')  return item.name
  if (type === 'quotes')    return `Quote v${item.version} — ${item.status}`
  if (type === 'documents') return item.name
  if (type === 'videos')    return item.title
  return ''
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex flex-col bg-bg"
      role="dialog"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border">
        <input
          :value="query"
          type="search"
          autofocus
          :placeholder="t('search.placeholder')"
          class="flex-1 h-[52px] px-4 rounded-xl bg-surface border border-border text-white placeholder:text-text-secondary text-base focus:outline-none focus:border-highlight"
          @input="setQuery($event.target.value)"
        />
        <button
          class="h-[52px] px-4 text-text-secondary font-bold"
          @click="close"
        >
          {{ t('common.close') }}
        </button>
      </div>

      <!-- Results -->
      <div class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
        <template v-if="hasResults">
          <div
            v-for="(group, type) in results"
            v-if="group.length"
            :key="type"
            class="flex flex-col gap-2"
          >
            <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
              {{ t(`search.results_${type}`) }}
            </p>
            <button
              v-for="item in group"
              :key="item.id"
              class="w-full text-left h-[52px] px-4 bg-surface border border-border rounded-xl text-white font-bold text-sm truncate"
              @click="navigate(type, item)"
            >
              {{ labelForItem(type, item) }}
            </button>
          </div>
        </template>
        <p v-else-if="query" class="text-text-secondary text-center pt-8">
          {{ t('search.no_results', { query }) }}
        </p>
      </div>
    </div>
  </Teleport>
</template>
