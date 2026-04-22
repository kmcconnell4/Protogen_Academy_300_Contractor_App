<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  /** Group title key — should match a search.results_* i18n key */
  groupKey: { type: String, required: true },
  /** Array of result objects */
  items: { type: Array, required: true },
  /** Called with the item when the user taps a result */
  onSelect: { type: Function, required: true },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
      {{ t(`search.results_${groupKey}`) }}
    </p>
    <button
      v-for="item in items"
      :key="item.id"
      class="w-full text-left h-[52px] px-4 bg-surface border border-border rounded-xl text-white font-bold text-sm truncate"
      @click="onSelect(item)"
    >
      <slot :item="item">{{ item.name ?? item.title }}</slot>
    </button>
  </div>
</template>
