<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatDate } from '@/composables/useFormatDate'
import { useQuotesData } from '@/composables/useQuotesData'
import { useRouter } from 'vue-router'
import QuoteLineItems from './QuoteLineItems.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const { t } = useI18n()
const { formatDate } = useFormatDate()
const { quotes, finalizeQuoteAsOrder } = useQuotesData()
const router = useRouter()

const props = defineProps({
  quotes: { type: Array, required: true },
})

// Latest version first
const sortedQuotes = computed(() => [...props.quotes].sort((a, b) => b.version - a.version))

// Default-open the latest quote
const expandedId = ref(sortedQuotes.value[0]?.id ?? null)

const placingOrderId = ref(null)

function effectiveStatus(quote) {
  // Read from reactive singleton so status mutations are reflected immediately
  return quotes.value.find((q) => q.id === quote.id)?.status ?? quote.status
}

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function placeOrder(quote) {
  if (placingOrderId.value) return
  placingOrderId.value = quote.id
  const newOrder = finalizeQuoteAsOrder(quote.id)
  if (newOrder) {
    router.push({ query: { tab: 'orders' } })
  }
  placingOrderId.value = null
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
        :aria-expanded="expandedId === quote.id"
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
          <StatusBadge :status="effectiveStatus(quote)" />
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

        <!-- Place Order CTA for Approved quotes -->
        <div
          v-if="effectiveStatus(quote) === 'Approved'"
          class="p-4 pt-0"
        >
          <button
            :disabled="placingOrderId === quote.id"
            class="w-full h-[52px] rounded-xl bg-interactive text-white text-[14px] font-[700] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-colors active:bg-highlight disabled:opacity-40 disabled:cursor-not-allowed"
            @click="placeOrder(quote)"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 5v3h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            {{ t('quotes.place_order') }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
