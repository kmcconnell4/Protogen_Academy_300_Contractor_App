<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import productsData from '@/data/products.json'
import { useQuotesData } from '@/composables/useQuotesData'
import { useJobsData } from '@/composables/useJobsData'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { addQuote } = useQuotesData()
const { quotes } = useQuotesData()
const { jobById } = useJobsData()

const jobId = route.params.id
const job = computed(() => jobById(jobId))

// Next version number = max existing version for this job + 1
const nextVersion = computed(() => {
  const jobQuotes = quotes.value.filter((q) => q.jobId === jobId)
  return jobQuotes.length ? Math.max(...jobQuotes.map((q) => q.version)) + 1 : 1
})

// Line-item row model
function emptyRow() {
  return { productId: '', description: '', qty: 1, unitPrice: 0 }
}

const rows = ref([emptyRow()])
const submitting = ref(false)

const TAX_RATE = 0.08

function onProductChange(row) {
  const product = productsData.find((p) => p.id === row.productId)
  if (product) {
    row.description = product.name
    row.unitPrice   = product.pricePerUnit
  } else {
    row.description = ''
    row.unitPrice   = 0
  }
}

function rowTotal(row) {
  return (Number(row.qty) || 0) * (Number(row.unitPrice) || 0)
}

const subtotal = computed(() => rows.value.reduce((sum, r) => sum + rowTotal(r), 0))
const tax      = computed(() => subtotal.value * TAX_RATE)
const total    = computed(() => subtotal.value + tax.value)

function addRow() {
  rows.value.push(emptyRow())
}

function removeRow(index) {
  if (rows.value.length > 1) rows.value.splice(index, 1)
}

function formatCurrency(val) {
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function handleSubmit() {
  const validRows = rows.value.filter((r) => r.productId && r.qty > 0)
  if (!validRows.length) return

  submitting.value = true

  const lineItems = validRows.map((r) => ({
    productId: r.productId,
    description: r.description,
    qty: Number(r.qty),
    unit: productsData.find((p) => p.id === r.productId)?.unit ?? 'ea',
    unitPrice: Number(r.unitPrice),
    total: rowTotal(r),
  }))

  const newQuote = {
    id:          'quote-' + Date.now(),
    jobId,
    version:     nextVersion.value,
    status:      'Draft',
    createdAt:   today(),
    submittedAt: null,
    approvedAt:  null,
    repId:       job.value?.repId ?? null,
    subtotal:    subtotal.value,
    tax:         tax.value,
    total:       total.value,
    lineItems,
  }

  addQuote(newQuote)
  router.push({ name: 'job-detail', params: { id: jobId }, query: { tab: 'quotes' } })
}
</script>

<template>
  <div class="flex flex-col min-h-dvh bg-bg pb-16">

    <!-- ── Back nav ── -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
      <button
        class="flex items-center gap-1.5 h-[44px] text-text-secondary hover:text-white transition-colors"
        @click="router.back()"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span class="text-[13px] font-[700] uppercase tracking-[0.08em]">{{ t('common.back') }}</span>
      </button>
    </div>

    <!-- ── Page heading ── -->
    <div class="px-4 pt-2 pb-4 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-1">
        {{ job?.name ?? jobId }}
      </p>
      <h1
        class="text-white font-[800] text-[1.9rem] leading-tight"
        style="font-family: var(--font-heading);"
      >
        {{ t('quotes.create_title') }}
        <span class="text-text-secondary text-[1.3rem] font-[700] ml-1">v{{ nextVersion }}</span>
      </h1>
    </div>

    <!-- ── Form ── -->
    <form class="px-4 pt-5 pb-8 flex flex-col gap-6" @submit.prevent="handleSubmit">

      <!-- Line items -->
      <div class="flex flex-col gap-3">
        <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary">
          {{ t('quotes.line_items') }}
        </p>

        <!-- Row -->
        <div
          v-for="(row, index) in rows"
          :key="index"
          class="bg-surface border border-border rounded-xl p-3 flex flex-col gap-3"
        >

          <!-- Product select -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
              {{ t('quotes.product') }}
            </label>
            <select
              v-model="row.productId"
              class="select-field w-full h-[48px] px-3 rounded-lg bg-surface-alt border border-border text-white text-[14px] font-[500] focus:outline-none focus:border-highlight transition-colors"
              @change="onProductChange(row)"
            >
              <option value="" disabled>{{ t('quotes.select_product') }}</option>
              <option v-for="p in productsData" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
              {{ t('quotes.description') }}
            </label>
            <input
              v-model="row.description"
              type="text"
              class="w-full h-[44px] px-3 rounded-lg bg-surface-alt border border-border text-white text-[14px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight transition-colors"
            />
          </div>

          <!-- Qty + Unit Price + Total row -->
          <div class="grid grid-cols-3 gap-2">
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
                {{ t('quotes.qty') }}
              </label>
              <input
                v-model="row.qty"
                type="number"
                min="1"
                step="1"
                class="w-full h-[44px] px-3 rounded-lg bg-surface-alt border border-border text-white text-[14px] font-[500] focus:outline-none focus:border-highlight transition-colors"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
                {{ t('quotes.unit_price') }}
              </label>
              <input
                v-model="row.unitPrice"
                type="number"
                min="0"
                step="0.01"
                class="w-full h-[44px] px-3 rounded-lg bg-surface-alt border border-border text-white text-[14px] font-[500] focus:outline-none focus:border-highlight transition-colors"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
                {{ t('quotes.line_total') }}
              </label>
              <div class="h-[44px] px-3 rounded-lg bg-surface-alt border border-border flex items-center text-highlight text-[14px] font-[700]">
                {{ formatCurrency(rowTotal(row)) }}
              </div>
            </div>
          </div>

          <!-- Remove row -->
          <button
            v-if="rows.length > 1"
            type="button"
            class="self-end text-[11px] font-[700] uppercase tracking-[0.08em] text-error/70 hover:text-error transition-colors"
            @click="removeRow(index)"
          >
            {{ t('quotes.remove_line') }}
          </button>

        </div>

        <!-- Add row -->
        <button
          type="button"
          class="w-full h-[48px] rounded-xl border border-dashed border-border text-text-secondary text-[13px] font-[700] uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-colors hover:border-highlight hover:text-highlight"
          @click="addRow"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {{ t('quotes.add_line') }}
        </button>
      </div>

      <!-- Totals -->
      <div class="bg-surface border border-border rounded-xl overflow-hidden">
        <div class="divide-y divide-border">
          <div class="px-4 py-3 flex items-center justify-between">
            <p class="text-[13px] font-[600] text-text-secondary">{{ t('quotes.subtotal') }}</p>
            <p class="text-white font-[700] text-[15px]">{{ formatCurrency(subtotal) }}</p>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <p class="text-[13px] font-[600] text-text-secondary">{{ t('quotes.tax') }} (8%)</p>
            <p class="text-white font-[700] text-[15px]">{{ formatCurrency(tax) }}</p>
          </div>
          <div class="px-4 py-3 flex items-center justify-between">
            <p class="text-[13px] font-[800] uppercase tracking-[0.08em] text-white">{{ t('quotes.total') }}</p>
            <p class="text-highlight font-[800] text-[18px]">{{ formatCurrency(total) }}</p>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="submitting || !rows.some((r) => r.productId && r.qty > 0)"
        class="w-full h-[56px] rounded-xl bg-interactive text-white text-[15px] font-[700] uppercase tracking-[0.1em] flex items-center justify-center transition-colors active:bg-highlight disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ t('quotes.save_quote') }}
      </button>

    </form>

  </div>
</template>
