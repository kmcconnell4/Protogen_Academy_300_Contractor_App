<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormatDate } from '@/composables/useFormatDate'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import InspectionFindingResponse from './InspectionFindingResponse.vue'

const { t } = useI18n()
const { formatDate } = useFormatDate()

const props = defineProps({
  inspection: { type: Object, required: true },
  isExpanded:  { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

// Per-finding response text and resolved state
const responses = reactive({})
const resolvedMap = reactive({})
const submitted = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(`ridgeline_inspection_resp_${props.inspection.id}`)
  if (stored) submitted.value = true

  props.inspection.findings.forEach((f) => {
    responses[f.id] = ''
    resolvedMap[f.id] = f.resolved ?? false
  })
})

const resultConfig = {
  Pass: { cls: 'text-emerald', indicator: 'bg-emerald' },
  Fail: { cls: 'text-error',   indicator: 'bg-error' },
}

const severityConfig = {
  Major:  { cls: 'bg-error text-white' },
  Minor:  { cls: 'bg-amber/90 text-nav' },
  None:   { cls: 'bg-surface text-text-secondary' },
}

function submitAllResponses() {
  const hasAnyResponse = props.inspection.findings.some((f) => responses[f.id]?.trim())
  if (!hasAnyResponse) return
  localStorage.setItem(`ridgeline_inspection_resp_${props.inspection.id}`, new Date().toISOString().slice(0, 10))
  submitted.value = true
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden">

    <!-- Card header / tap target -->
    <button
      class="w-full flex items-start justify-between gap-3 p-4 text-left active:bg-surface-alt transition-colors"
      :aria-expanded="isExpanded"
      @click="emit('toggle')"
    >
      <div class="min-w-0">
        <p
          class="text-white font-[800] text-[1.1rem] leading-tight"
          style="font-family: var(--font-heading);"
        >
          {{ inspection.type }}
        </p>
        <p class="text-text-secondary text-[13px] mt-1">
          {{ t('inspections.conducted') }} {{ formatDate(inspection.conductedAt) }}
          &middot; {{ inspection.repName || t('common.unknown_rep') }}
        </p>
        <!-- Pass / Fail result line -->
        <div
          v-if="inspection.overallResult"
          :class="['inline-flex items-center gap-1.5 mt-1.5 text-[13px] font-[700]', resultConfig[inspection.overallResult]?.cls]"
        >
          <span
            :class="['inline-block w-2 h-2 rounded-full', resultConfig[inspection.overallResult]?.indicator]"
          />
          {{ t(`inspections.result_${inspection.overallResult.toLowerCase()}`) }}
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <StatusBadge :status="inspection.status" />
        <svg
          :class="['w-4 h-4 text-text-secondary transition-transform duration-200', isExpanded ? 'rotate-180' : '']"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </button>

    <!-- Expanded detail -->
    <div v-if="isExpanded" class="border-t border-border p-4 flex flex-col gap-5">

      <!-- Findings -->
      <div>
        <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary mb-3">
          {{ t('inspections.findings') }}
        </p>

        <div v-if="inspection.findings.length" class="flex flex-col gap-4">
          <div
            v-for="finding in inspection.findings"
            :key="finding.id"
            class="bg-surface-alt rounded-xl p-3 flex flex-col gap-3"
          >
            <!-- Severity + category header -->
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center px-2 py-[3px] rounded text-[10px] font-[700] uppercase tracking-[0.1em] leading-none',
                  severityConfig[finding.severity]?.cls ?? 'bg-surface text-text-secondary',
                ]"
              >
                {{ finding.severity }}
              </span>
              <span class="text-text-secondary text-[12px] font-[700] uppercase tracking-[0.08em]">{{ finding.category }}</span>
              <span v-if="resolvedMap[finding.id]" class="ml-auto inline-flex items-center gap-1 text-emerald text-[12px] font-[700]">
                <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                {{ t('inspections.finding_resolved') }}
              </span>
            </div>
            <p class="text-white text-[14px] leading-snug">{{ finding.description }}</p>

            <!-- Per-finding response (contractor only, open inspection) -->
            <InspectionFindingResponse
              v-if="['Pending Response', 'Response Overdue'].includes(inspection.status) && !submitted"
              :finding="finding"
              :response="responses[finding.id]"
              :resolved="resolvedMap[finding.id]"
              @update:response="responses[finding.id] = $event"
              @update:resolved="resolvedMap[finding.id] = $event"
            />
          </div>
        </div>

        <p v-else class="text-text-secondary text-[14px]">{{ t('inspections.no_findings') }}</p>
      </div>

      <!-- Single Submit Response button (contractor, open, not yet submitted) -->
      <div
        v-if="['Pending Response', 'Response Overdue'].includes(inspection.status)"
        class="flex flex-col gap-3"
      >
        <div v-if="!submitted">
          <button
            :disabled="!inspection.findings.some((f) => responses[f.id]?.trim())"
            class="flex items-center justify-center w-full h-[52px] rounded-xl bg-interactive text-white font-[700] uppercase tracking-[0.1em] text-[14px] transition-colors active:bg-highlight disabled:opacity-40 disabled:cursor-not-allowed"
            @click="submitAllResponses"
          >
            {{ t('inspections.submit_response') }}
          </button>
        </div>
        <div v-else class="flex items-center gap-2 text-emerald font-[700] text-[14px]">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {{ t('inspections.response_submitted_confirmation') }}
        </div>
      </div>

      <!-- Existing contractor response -->
      <div v-else-if="inspection.contractorResponse" class="flex flex-col gap-2">
        <p class="text-[11px] font-[700] uppercase tracking-[0.1em] text-text-secondary">
          {{ t('inspections.your_response') }}
        </p>
        <p class="text-white text-[14px] leading-relaxed bg-surface-alt rounded-xl p-3">
          {{ inspection.contractorResponse }}
        </p>
        <p v-if="inspection.responseSubmittedAt" class="text-text-secondary text-[12px]">
          {{ t('inspections.response_submitted', { date: formatDate(inspection.responseSubmittedAt) }) }}
        </p>
      </div>

    </div>
  </div>
</template>
