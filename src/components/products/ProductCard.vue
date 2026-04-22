<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'
import documents from '@/data/documents.json'

const { t } = useI18n()
const router = useRouter()
const { addItem } = useRecentlyViewed()

const props = defineProps({
  product: { type: Object, required: true },
})

const productDocs = documents.filter((d) => props.product.documentIds.includes(d.id))

const docTypeBadge = {
  PDS:  'bg-interactive text-white',
  SDS:  'bg-amber text-bg',
  Spec: 'bg-surface-alt text-text-secondary border border-border',
}

function trackAndNavigate() {
  addItem({
    id: props.product.id,
    type: 'product',
    name: props.product.name,
    routeName: 'catalog',
    routeParams: {},
  })
}
</script>

<template>
  <div
    class="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 cursor-pointer"
    @click="trackAndNavigate"
  >
    <div>
      <p class="text-white font-bold text-base leading-snug">{{ product.name }}</p>
      <p class="text-text-secondary text-xs mt-0.5">{{ t('catalog.sku') }}: {{ product.sku }}</p>
      <p class="text-text-secondary text-xs">{{ product.category }}</p>
    </div>
    <p class="text-text-secondary text-sm line-clamp-2">{{ product.description }}</p>
    <div class="flex items-center gap-2 flex-wrap">
      <a
        v-for="doc in productDocs"
        :key="doc.id"
        :href="doc.fileUrl"
        target="_blank"
        rel="noopener noreferrer"
        :class="['inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide', docTypeBadge[doc.type]]"
        @click.stop
      >
        {{ t(`catalog.doc_types.${doc.type}`) }}
      </a>
    </div>
  </div>
</template>
