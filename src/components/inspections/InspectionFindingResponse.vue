<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  finding:  { type: Object, required: true },
  response: { type: String,  default: '' },
  resolved: { type: Boolean, default: false },
})

const emit = defineEmits(['update:response', 'update:resolved'])
</script>

<template>
  <div class="flex flex-col gap-3">

    <!-- Finding photos -->
    <div v-if="finding.photoUrls?.length" class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <img
        v-for="(url, i) in finding.photoUrls"
        :key="i"
        :src="url"
        :alt="`${finding.category} photo ${i + 1}`"
        class="h-24 w-36 shrink-0 rounded-lg object-cover border border-border"
        loading="lazy"
      />
    </div>

    <!-- Response textarea -->
    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
        {{ t('inspections.your_response') }}
      </label>
      <textarea
        :value="response"
        :placeholder="t('inspections.response_placeholder')"
        rows="3"
        class="w-full rounded-xl bg-bg border border-border text-white p-3 text-[14px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight resize-none transition-colors"
        @input="emit('update:response', $event.target.value)"
      />
    </div>

    <!-- Add Photo affordance (demo — no file input) -->
    <button
      type="button"
      class="flex items-center gap-2 h-[44px] px-3 rounded-xl border border-dashed border-border text-text-secondary text-[12px] font-[700] uppercase tracking-[0.08em] hover:border-highlight hover:text-highlight transition-colors"
    >
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
        <line x1="12" y1="8" x2="12" y2="14" stroke-width="2.5" />
        <line x1="9" y1="11" x2="15" y2="11" stroke-width="2.5" />
      </svg>
      {{ t('inspections.add_photo') }}
    </button>

    <!-- Mark Resolved toggle -->
    <button
      type="button"
      :class="[
        'flex items-center gap-2 h-[44px] px-3 rounded-xl border text-[12px] font-[700] uppercase tracking-[0.08em] transition-colors',
        resolved
          ? 'border-emerald bg-emerald/10 text-emerald'
          : 'border-border text-text-secondary hover:border-highlight hover:text-highlight',
      ]"
      @click="emit('update:resolved', !resolved)"
    >
      <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {{ resolved ? t('inspections.finding_resolved') : t('inspections.mark_finding_resolved') }}
    </button>

  </div>
</template>
