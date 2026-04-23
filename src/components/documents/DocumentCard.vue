<script setup>
import { computed } from 'vue'
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

// Per-type image background colors matching DocTypeBadge
const imgColors = { PDS: '2E6FD8/FFFFFF', SDS: 'F5A623/151C28', Spec: '243044/A8B8D0' }
const placeholderImg = computed(() => {
  const colors = imgColors[props.doc.type] ?? '243044/A8B8D0'
  return `https://placehold.co/480x220/${colors}?text=${encodeURIComponent(props.doc.type)}`
})

function handleOpen() {
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
  <a
    :href="doc.fileUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="block bg-surface border border-border rounded-xl overflow-hidden flex flex-col active:opacity-80 transition-opacity h-full"
    @click="handleOpen"
  >
    <!-- Document preview image -->
    <img
      :src="placeholderImg"
      :alt="doc.type"
      loading="lazy"
      class="w-full aspect-[16/9] object-cover"
    />

    <div class="p-4 flex flex-col gap-2">
      <!-- Name + type badge -->
      <div class="flex items-start justify-between gap-2">
        <p
          class="text-white font-[800] text-[1rem] leading-snug"
          style="font-family: var(--font-heading);"
        >{{ doc.name }}</p>
        <DocTypeBadge :type="doc.type" class="shrink-0" />
      </div>
      <!-- Metadata -->
      <div class="flex flex-col gap-0.5 text-xs text-text-secondary">
        <span v-if="product">{{ product.name }}</span>
        <span>{{ t('documents.version') }}: {{ doc.version }} &middot; {{ doc.updatedAt }}</span>
        <span>{{ doc.fileSize }}</span>
      </div>
    </div>
  </a>
</template>
