<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'
import QuoteLineItems from './QuoteLineItems.vue'

const { t } = useI18n()
const { role } = useRole()

const props = defineProps({
  quotes: { type: Array, required: true },
})

// Latest version first
const sortedQuotes = computed(() => [...props.quotes].sort((a, b) => b.version - a.version))

// Default-open the latest quote
const expandedId = ref(sortedQuotes.value[0]?.id ?? null)

const statusConfig = {
  Draft:     { cls: 'bg-surface-alt text-text-secondary' },
  Submitted: { cls: 'bg-amber/90 text-nav' },
  Approved:  { cls: 'bg-emerald text-nav' },
  Rejected:  { cls: 'bg-error text-white' },
}

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function formatDate(iso) {
  if (!iso) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(iso + 'T00:00:00'))
}
</script>

<template>
  <div class="flex flex-col gap-3">

    <div
      v-for="(quote, idx) in sortedQuotes"
      :key="quote.id"
      class="bg-surface border border-border rounded-xl overflow-hidden"
    >

      <!-- Accordion header -->
      <button
        class="w-full flex items-start justify-between gap-3 p-4 text-left active:bg-surface-alt transition-colors"
        @click="toggle(quote.id)"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p
              class="text-white font-[800] text-lg leading-none"
              style="font-family: var(--font-heading);"
            >
              {{ t('quotes.version', { version: quote.version }) }}
            </p>
            <!-- "Latest" badge on first (highest version) quote -->
            <span
              v-if="idx === 0"
              class="inline-flex items-center px-2 py-[3px] rounded bg-interactive/20 text-highlight text-[10px] font-[700] uppercase tracking-[0.1em] leading-none"
            >
              {{ t('quotes.latest') }}
            </span>
          </div>
          <p class="text-text-secondary text-[13px] mt-1">
            ${{ quote.total.toLocaleString() }}
            <span v-if="quote.submittedAt" class="opacity-60"> · {{ formatDate(quote.submittedAt) }}</span>
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-[5px] rounded text-[11px] font-[700] uppercase tracking-widest leading-none',
              statusConfig[quote.status]?.cls ?? 'bg-surface-alt text-text-secondary',
            ]"
          >
            {{ t(`quotes.status_${quote.status.toLowerCase()}`) }}
          </span>
          <!-- Chevron -->
          <svg
            :class="['w-4 h-4 text-text-secondary transition-transform duration-200', expandedId === quote.id ? 'rotate-180' : '']"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      <!-- Accordion content -->
      <div v-if="expandedId === quote.id" class="border-t border-border">

        <!-- Date metadata strip -->
        <div class="bg-surface-alt px-4 py-3 flex flex-wrap gap-x-6 gap-y-2 border-b border-border">
          <div v-if="quote.createdAt" class="flex flex-col gap-0.5">
            <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
              {{ t('jobs.detail.created') }}
            </span>
            <span class="text-white text-[13px] font-[600]">{{ formatDate(quote.createdAt) }}</span>
          </div>
          <div v-if="quote.approvedAt" class="flex flex-col gap-0.5">
            <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-emerald/80">
              {{ t('quotes.status_approved') }}
            </span>
            <span class="text-emerald text-[13px] font-[600]">{{ formatDate(quote.approvedAt) }}</span>
          </div>
        </div>

        <QuoteLineItems
          :line-items="quote.lineItems"
          :subtotal="quote.subtotal"
          :tax="quote.tax"
          :total="quote.total"
        />

        <!-- Rep: Approve / Reject actions -->
        <div
          v-if="role === 'rep' && quote.status === 'Submitted'"
          class="flex gap-2 p-4 pt-0"
        >
          <button class="flex-1 h-tap rounded-lg bg-emerald font-[700] text-nav">
            {{ t('quotes.approve') }}
          </button>
          <button class="flex-1 h-tap rounded-lg bg-error font-[700] text-white">
            {{ t('quotes.reject') }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
