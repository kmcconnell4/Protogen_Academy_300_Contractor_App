<script setup>
import { useI18n } from 'vue-i18n'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'
import products from '@/data/products.json'
import DocTypeBadge from '@/components/shared/DocTypeBadge.vue'

const { t } = useI18n()
const { addItem } = useRecentlyViewed()

const props = defineProps({
  doc: { type: Object, required: true },
})

const product = products.find((p) => p.id === props.doc.productId) ?? null

function handleDownload() {
  addItem({
    id: props.doc.id,
    type: 'document',
    name: props.doc.name,
    routeName: 'documents',
    routeParams: {},
  })
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
    <div class="flex items-start justify-between gap-2">
      <p class="text-white font-bold text-sm leading-snug">{{ doc.name }}</p>
      <DocTypeBadge :type="doc.type" class="shrink-0" />
    </div>
    <div class="flex flex-col gap-0.5 text-xs text-text-secondary">
      <span v-if="product">{{ t('documents.associated_product') }}: {{ product.name }}</span>
      <span>{{ t('documents.version') }}: {{ doc.version }} &middot; {{ t('documents.updated') }}: {{ doc.updatedAt }}</span>
      <span>{{ t('documents.file_size') }}: {{ doc.fileSize }}</span>
    </div>
    <a
      :href="doc.fileUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-1 inline-flex items-center justify-center h-tap rounded-lg bg-interactive text-white font-bold text-sm"
      @click="handleDownload"
    >
      ↓ {{ t('documents.download') }}
    </a>
  </div>
</template>
