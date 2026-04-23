<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'
import { useJobsData } from '@/composables/useJobsData'

const { t } = useI18n()
const router = useRouter()
const { query, results, hasResults, setQuery, clearQuery } = useSearch()
const { jobs } = useJobsData()

const inputRef = ref(null)

onMounted(() => {
  inputRef.value?.focus()
})

onBeforeUnmount(() => {
  clearQuery()
})

// Navigation targets per category
const ROUTE_MAP = {
  jobs:        (item) => ({ name: 'job-detail', params: { id: item.id } }),
  products:    (item) => ({ name: 'product-detail', params: { id: item.id } }),
  quotes:      (item) => ({ name: 'job-detail', params: { id: item.jobId } }),
  documents:   (item) => { window.open(item.url, '_blank', 'noopener'); return null },
  videos:      (item) => { window.open(item.videoUrl, '_blank', 'noopener'); return null },
  orders:      (item) => ({ name: 'job-detail', params: { id: item.jobId }, query: { tab: 'orders' } }),
  inspections: (item) => ({ name: 'job-detail', params: { id: item.jobId }, query: { tab: 'inspections' } }),
}

function navigate(type, item) {
  const dest = ROUTE_MAP[type]?.(item)
  if (dest) router.push(dest)
}

// Per-category display config
const CAT_CONFIG = {
  jobs: {
    label: (item) => item.name,
    sub:   (item) => `${item.type} · ${item.status}`,
    icon:  'briefcase',
    color: 'text-interactive',
    bg:    'bg-interactive/15',
  },
  products: {
    label: (item) => item.name,
    sub:   (item) => `${item.sku} · ${item.category}`,
    icon:  'box',
    color: 'text-highlight',
    bg:    'bg-highlight/15',
  },
  quotes: {
    label: (item) => {
      const job = jobs.value.find((j) => j.id === item.jobId)
      return `v${item.version} — ${job?.name ?? item.jobId}`
    },
    sub:   (item) => item.status,
    icon:  'file-check',
    color: 'text-emerald',
    bg:    'bg-emerald/15',
  },
  documents: {
    label: (item) => item.name,
    sub:   (item) => `${item.type} · ${item.fileSize}`,
    icon:  'document',
    color: 'text-amber',
    bg:    'bg-amber/15',
  },
  videos: {
    label: (item) => item.title,
    sub:   (item) => `${item.duration} · ${item.category}`,
    icon:  'play',
    color: 'text-amber',
    bg:    'bg-amber/15',
  },
  orders: {
    label: (item) => item.poNumber,
    sub:   (item) => `${item.carrier ?? ''} · ${item.status}`.replace(/^·\s*/, ''),
    icon:  'truck',
    color: 'text-interactive',
    bg:    'bg-interactive/15',
  },
  inspections: {
    label: (item) => item.type,
    sub:   (item) => `${item.status} · ${item.repName ?? ''}`.replace(/·\s*$/, ''),
    icon:  'clipboard',
    color: 'text-highlight',
    bg:    'bg-highlight/15',
  },
}

const CATEGORY_LABELS = {
  jobs:        () => t('search.results_jobs'),
  products:    () => t('search.results_products'),
  quotes:      () => t('search.results_quotes'),
  documents:   () => t('search.results_documents'),
  videos:      () => t('search.results_videos'),
  orders:      () => t('search.results_orders'),
  inspections: () => t('search.results_inspections'),
}
</script>

<template>
  <div class="flex flex-col min-h-dvh bg-bg pb-16">

    <!-- ── Search header ── -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border shrink-0">
      <div class="relative flex-1">
        <svg
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref="inputRef"
          :value="query"
          type="search"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          :placeholder="t('search.placeholder')"
          class="w-full h-[52px] pl-10 pr-4 rounded-xl bg-surface border border-border text-white text-[15px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight transition-colors"
          @input="setQuery($event.target.value)"
        />
        <!-- Clear × button when query present -->
        <button
          v-if="query"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          :aria-label="t('common.close')"
          @click="setQuery('')"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Scrollable results area ── -->
    <div class="flex-1 overflow-y-auto overscroll-contain">

      <!-- No query — empty prompt -->
      <div v-if="!query" class="flex flex-col items-center px-8 pt-16 pb-8 gap-3 text-center">
        <div class="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center mb-1">
          <svg class="w-7 h-7 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <p class="text-white font-[700] text-[16px]">{{ t('search.placeholder') }}</p>
        <p class="text-text-secondary text-[14px]">{{ t('search.jump_to') }}</p>
      </div>

      <!-- Results by category -->
      <div v-else-if="hasResults" class="px-4 pt-4 pb-6 flex flex-col gap-6">
        <template v-for="(group, type) in results" :key="type">
          <div v-if="group.length" class="flex flex-col gap-1.5">

            <!-- Section header -->
            <div class="flex items-center gap-2 mb-1">
              <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary">
                {{ CATEGORY_LABELS[type]?.() }}
              </p>
              <span class="inline-flex items-center justify-center w-4 h-4 rounded bg-surface-alt text-text-secondary text-[10px] font-[800] leading-none">
                {{ group.length }}
              </span>
            </div>

            <!-- Result rows -->
            <button
              v-for="item in group"
              :key="item.id"
              class="w-full flex items-center gap-3 h-[60px] px-3.5 bg-surface border border-border rounded-xl text-left transition-colors active:bg-surface-alt"
              @click="navigate(type, item)"
            >
              <!-- Category icon in tinted square -->
              <div :class="['shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', CAT_CONFIG[type]?.bg]">
                <span :class="CAT_CONFIG[type]?.color">
                  <!-- Briefcase -->
                  <svg v-if="CAT_CONFIG[type]?.icon === 'briefcase'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                  <!-- Box -->
                  <svg v-else-if="CAT_CONFIG[type]?.icon === 'box'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <!-- File-check (quotes) -->
                  <svg v-else-if="CAT_CONFIG[type]?.icon === 'file-check'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <polyline points="9 15 11 17 15 13" />
                  </svg>
                  <!-- Document -->
                  <svg v-else-if="CAT_CONFIG[type]?.icon === 'document'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <!-- Play -->
                  <svg v-else-if="CAT_CONFIG[type]?.icon === 'play'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <!-- Truck (orders) -->
                  <svg v-else-if="CAT_CONFIG[type]?.icon === 'truck'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <!-- Clipboard (inspections) -->
                  <svg v-else-if="CAT_CONFIG[type]?.icon === 'clipboard'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </span>
              </div>

              <!-- Label + sub-label -->
              <div class="min-w-0 flex-1">
                <p class="text-white font-[600] text-[14px] leading-snug truncate">
                  {{ CAT_CONFIG[type]?.label(item) }}
                </p>
                <p class="text-text-secondary text-[12px] truncate">
                  {{ CAT_CONFIG[type]?.sub(item) }}
                </p>
              </div>

              <!-- Chevron -->
              <svg class="w-4 h-4 text-border shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

          </div>
        </template>
      </div>

      <!-- No results for query -->
      <div v-else class="flex flex-col items-center px-8 pt-16 pb-8 gap-3 text-center">
        <div class="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center mb-1">
          <svg class="w-6 h-6 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <p class="text-white font-[700] text-[16px]">{{ t('search.no_results_heading') }}</p>
        <p class="text-text-secondary text-[14px]">
          {{ t('search.no_results', { query }) }}
        </p>
      </div>

    </div>
  </div>
</template>
