<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'
import productsData from '@/data/products.json'
import documentsData from '@/data/documents.json'
import videosData from '@/data/videos.json'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { addItem } = useRecentlyViewed()

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push({ name: 'search' })
  }
}

const product = computed(() => productsData.find((p) => p.id === route.params.id) ?? null)

const relatedDocs = computed(() => {
  if (!product.value) return []
  return documentsData.filter((d) => product.value.documentIds.includes(d.id))
})

const relatedVideos = computed(() => {
  if (!product.value) return []
  const productTags = new Set(product.value.tags.map((t) => t.toLowerCase()))
  return videosData.filter((v) =>
    v.tags.some((tag) => productTags.has(tag.toLowerCase()))
  )
})

const heroUrl = computed(() => {
  if (!product.value) return ''
  const label = encodeURIComponent(product.value.sku)
  return `https://placehold.co/600x360/1E2A3E/A8B8D0?text=${label}`
})

function formatPrice(price, unit) {
  const formatted =
    price < 1
      ? `$${price.toFixed(2)}`
      : `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  return `${formatted} / ${unit}`
}

const docTypeConfig = {
  PDS:  { cls: 'bg-interactive text-white',          label: 'PDS' },
  SDS:  { cls: 'bg-amber text-bg',                   label: 'SDS' },
  Spec: { cls: 'bg-surface-alt text-text-secondary', label: 'Spec' },
}

onMounted(() => {
  if (product.value) {
    addItem({
      id: product.value.id,
      type: 'product',
      name: product.value.name,
      routeName: 'product-detail',
      routeParams: { id: product.value.id },
    })
  }
})
</script>

<template>
  <!-- Product not found -->
  <div v-if="!product" class="flex flex-col items-center px-6 pt-20 pb-8 gap-4 text-center">
    <p class="text-text-secondary text-[15px]">{{ t('catalog.not_found') }}</p>
    <router-link :to="{ name: 'search' }" class="text-highlight font-[700] text-[14px]">
      {{ t('common.back') }}
    </router-link>
  </div>

  <div v-else class="flex flex-col min-h-dvh bg-bg pb-36">

    <!-- ── Back nav ── -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
      <button
        class="flex items-center gap-1.5 h-[44px] text-text-secondary hover:text-white transition-colors"
        @click="goBack()"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span class="text-[13px] font-[700] uppercase tracking-[0.08em]">{{ t('common.back') }}</span>
      </button>
    </div>

    <!-- ── Hero ── -->
    <div class="mx-4 rounded-xl overflow-hidden bg-surface border border-border shrink-0">
      <img
        :src="heroUrl"
        :alt="product.name"
        class="w-full aspect-[5/3] object-cover"
        loading="lazy"
      />
    </div>

    <!-- ── Identity block ── -->
    <div class="px-4 pt-5 pb-4 flex flex-col gap-2 border-b border-border">
      <!-- Category badge + SKU -->
      <div class="flex items-center justify-between gap-2">
        <span class="inline-flex items-center h-[22px] px-2.5 rounded bg-interactive/20 text-highlight text-[10px] font-[700] uppercase tracking-[0.12em]">
          {{ product.category }}
        </span>
        <span class="text-[12px] font-[600] font-mono text-text-secondary">{{ product.sku }}</span>
      </div>

      <!-- Name -->
      <h1
        class="text-white font-[800] text-[1.6rem] leading-tight"
        style="font-family: var(--font-heading);"
      >
        {{ product.name }}
      </h1>

      <!-- Price -->
      <p class="text-highlight text-[16px] font-[700]">
        {{ formatPrice(product.pricePerUnit, product.unit) }}
      </p>
    </div>

    <!-- ── Description ── -->
    <div class="px-4 pt-5 pb-5 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-2">
        {{ t('catalog.description') }}
      </p>
      <p class="text-white text-[15px] leading-relaxed font-[500]">
        {{ product.description }}
      </p>
    </div>

    <!-- ── Related Documents ── -->
    <div v-if="relatedDocs.length" class="px-4 pt-5 pb-5 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ t('catalog.related_docs') }}
      </p>
      <div class="flex flex-col gap-2">
        <a
          v-for="doc in relatedDocs"
          :key="doc.id"
          :href="doc.fileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 h-[56px] px-3.5 bg-surface border border-border rounded-xl transition-colors active:bg-surface-alt"
        >
          <!-- Type badge -->
          <span
            :class="[
              'shrink-0 inline-flex items-center h-[22px] px-2 rounded text-[10px] font-[700] uppercase tracking-[0.09em]',
              docTypeConfig[doc.type]?.cls ?? 'bg-surface-alt text-text-secondary',
            ]"
          >
            {{ docTypeConfig[doc.type]?.label ?? doc.type }}
          </span>
          <!-- Name -->
          <div class="min-w-0 flex-1">
            <p class="text-white font-[600] text-[13px] truncate">{{ doc.name }}</p>
            <p class="text-text-secondary text-[11px]">{{ doc.version }} · {{ doc.fileSize }}</p>
          </div>
          <!-- Download icon -->
          <svg class="w-4 h-4 text-text-secondary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      </div>
    </div>

    <!-- ── Related Videos ── -->
    <div v-if="relatedVideos.length" class="px-4 pt-5 pb-5 border-b border-border">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ t('catalog.related_videos') }}
      </p>
      <div class="flex flex-col gap-2">
        <a
          v-for="vid in relatedVideos"
          :key="vid.id"
          :href="vid.videoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 h-[64px] px-3.5 bg-surface border border-border rounded-xl transition-colors active:bg-surface-alt overflow-hidden"
        >
          <!-- Thumbnail -->
          <img
            :src="vid.thumbnailUrl"
            :alt="vid.title"
            class="w-10 h-10 rounded-lg object-cover shrink-0"
            loading="lazy"
          />
          <!-- Info -->
          <div class="min-w-0 flex-1">
            <p class="text-white font-[600] text-[13px] truncate">{{ vid.title }}</p>
            <p class="text-text-secondary text-[11px]">{{ vid.duration }} · {{ vid.category }}</p>
          </div>
          <!-- Play icon -->
          <svg class="w-4 h-4 text-text-secondary shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </a>
      </div>
    </div>

    <!-- ── Installation Notes ── -->
    <div class="px-4 pt-5 pb-6">
      <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ t('catalog.installation_notes') }}
      </p>
      <div class="flex items-center justify-center h-[72px] rounded-xl bg-surface border border-border border-dashed">
        <p class="text-text-secondary text-[13px] font-[500]">
          {{ t('catalog.installation_notes_placeholder') }}
        </p>
      </div>
    </div>

  </div>
</template>
