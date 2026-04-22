<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'
import QuoteLineItems from './QuoteLineItems.vue'

const { t } = useI18n()
const { role } = useRole()

const props = defineProps({
  quotes: { type: Array, required: true },
})

const expandedId = ref(null)

const statusColor = {
  Draft:     'bg-surface-alt text-text-secondary border border-border',
  Submitted: 'bg-amber text-bg',
  Approved:  'bg-emerald text-bg',
  Rejected:  'bg-error text-white',
}

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="quote in quotes"
      :key="quote.id"
      class="bg-surface border border-border rounded-xl overflow-hidden"
    >
      <button
        class="w-full flex items-center justify-between gap-3 p-4 text-left"
        @click="toggle(quote.id)"
      >
        <div>
          <p class="text-white font-bold">{{ t('quotes.version', { version: quote.version }) }}</p>
          <p class="text-text-secondary text-xs mt-0.5">{{ t('quotes.total') }}: ${{ quote.total.toLocaleString() }}</p>
        </div>
        <span :class="['px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest shrink-0', statusColor[quote.status]]">
          {{ t(`quotes.status_${quote.status.toLowerCase()}`) }}
        </span>
      </button>
      <div v-if="expandedId === quote.id" class="border-t border-border">
        <QuoteLineItems :line-items="quote.lineItems" :subtotal="quote.subtotal" :tax="quote.tax" :total="quote.total" />
        <!-- Sales Rep actions -->
        <div v-if="role === 'rep' && quote.status === 'Submitted'" class="flex gap-2 p-4 pt-0">
          <button class="flex-1 h-[52px] rounded-lg bg-emerald text-bg font-bold">{{ t('quotes.approve') }}</button>
          <button class="flex-1 h-[52px] rounded-lg bg-error text-white font-bold">{{ t('quotes.reject') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
