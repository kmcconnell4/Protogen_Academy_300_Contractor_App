<script setup>
import { useI18n } from 'vue-i18n'
import documents from '@/data/documents.json'

const { t } = useI18n()

const props = defineProps({
  product: { type: Object, required: true },
})

const productDocs = documents.filter((d) => props.product.documentIds.includes(d.id))

// Solid-fill only; canonical colors match DocTypeBadge
const docTypeConfig = {
  PDS:  { cls: 'bg-interactive text-white',             label: 'PDS' },
  SDS:  { cls: 'bg-amber text-bg',                      label: 'SDS' },
  Spec: { cls: 'bg-surface-alt text-text-secondary',    label: 'Spec' },
}

function formatPrice(price, unit) {
  const formatted = price < 1
    ? `$${price.toFixed(2)}`
    : `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  return `${formatted} / ${unit}`
}

</script>

<template>
  <router-link
    :to="{ name: 'product-detail', params: { id: product.id } }"
    class="block bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 active:opacity-80 transition-opacity"
  >

    <!-- Category + SKU meta row -->
    <div class="flex items-center justify-between gap-2">
      <span class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary leading-none truncate">
        {{ product.category }}
      </span>
      <span class="text-[11px] font-[600] text-text-secondary/70 shrink-0 font-mono">
        {{ product.sku }}
      </span>
    </div>

    <!-- Product name — Big Shoulders Display, authoritative -->
    <h3
      class="text-white font-[800] leading-tight text-[1.25rem] -mt-1"
      style="font-family: var(--font-heading);"
    >
      {{ product.name }}
    </h3>

    <!-- Description — 3-line clamp -->
    <p class="text-text-secondary text-[13px] leading-relaxed line-clamp-3">
      {{ product.description }}
    </p>

    <!-- Price -->
    <p class="text-highlight text-[13px] font-[700]">
      {{ formatPrice(product.pricePerUnit, product.unit) }}
    </p>

    <!-- Document links — solid chips, open in new tab -->
    <div v-if="productDocs.length" class="flex items-center gap-2 flex-wrap pt-1 border-t border-border">
      <span class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
        {{ t('catalog.documents') }}
      </span>
      <a
        v-for="doc in productDocs"
        :key="doc.id"
        :href="doc.fileUrl"
        :title="doc.name"
        target="_blank"
        rel="noopener noreferrer"
        :class="[
          'inline-flex items-center gap-1 h-[28px] px-2.5 rounded text-[11px] font-[700] uppercase tracking-[0.08em] leading-none transition-opacity hover:opacity-80',
          docTypeConfig[doc.type]?.cls ?? 'bg-surface-alt text-text-secondary',
        ]"
        @click.stop
      >
        <!-- Mini document icon -->
        <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ docTypeConfig[doc.type]?.label ?? doc.type }}
      </a>
    </div>

  </router-link>
</template>
