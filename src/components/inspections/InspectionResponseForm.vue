<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  inspectionId: { type: String, required: true },
})

const response = ref('')
const submitted = ref(false)

function submit() {
  if (!response.value.trim()) return
  // TODO: wire to data layer / API
  submitted.value = true
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
      {{ t('inspections.your_response') }}
    </p>
    <div v-if="!submitted">
      <textarea
        v-model="response"
        :placeholder="t('inspections.response_placeholder')"
        rows="4"
        class="w-full rounded-xl bg-surface-alt border border-border text-white p-3 text-base placeholder:text-text-secondary focus:outline-none focus:border-highlight resize-none"
      />
      <button
        :disabled="!response.trim()"
        class="mt-3 w-full h-[52px] rounded-xl bg-interactive text-white font-bold disabled:opacity-40"
        @click="submit"
      >
        {{ t('inspections.submit_response') }}
      </button>
    </div>
    <p v-else class="text-emerald font-bold text-sm">✓ {{ t('inspections.response_submitted', { date: new Date().toISOString().slice(0, 10) }) }}</p>
  </div>
</template>
