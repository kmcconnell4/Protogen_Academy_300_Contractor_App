<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'
import { useFormatDate } from '@/composables/useFormatDate'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import InspectionResponseForm from './InspectionResponseForm.vue'

const { t } = useI18n()
const { role } = useRole()
const { formatDate } = useFormatDate()

const props = defineProps({
  inspection: { type: Object, required: true },
  isExpanded:  { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])

// Tracks rep's client-side "Mark as Reviewed" action
const localStatus = ref(props.inspection.status)

const resultConfig = {
  Pass: { cls: 'text-emerald', indicator: 'bg-emerald' },
  Fail: { cls: 'text-error',   indicator: 'bg-error' },
}

const severityConfig = {
  Major:  { cls: 'bg-error text-white' },
  Minor:  { cls: 'bg-amber/90 text-nav' },
  None:   { cls: 'bg-surface text-text-secondary' },
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
          &middot; {{ inspection.repName }}
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
        <StatusBadge :status="localStatus" />
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

        <div v-if="inspection.findings.length" class="flex flex-col gap-2">
          <div
            v-for="finding in inspection.findings"
            :key="finding.id"
            class="bg-surface-alt rounded-xl p-3 flex flex-col gap-2"
          >
            <!-- Severity + category -->
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
              <!-- Resolved checkmark -->
              <span v-if="finding.resolved" class="ml-auto text-emerald text-[12px] font-[700]">{{ t('inspections.finding_resolved') }}</span>
            </div>
            <p class="text-white text-[14px] leading-snug">{{ finding.description }}</p>
          </div>
        </div>

        <p v-else class="text-text-secondary text-[14px]">{{ t('inspections.no_findings') }}</p>
      </div>

      <!-- Contractor response form (open inspections) -->
      <InspectionResponseForm
        v-if="['Pending Response', 'Response Overdue'].includes(inspection.status) && role === 'contractor'"
        :inspection-id="inspection.id"
      />

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

      <!-- Rep: mark reviewed -->
      <div v-if="role === 'rep' && localStatus !== 'Reviewed'">
        <button
          class="w-full h-tap rounded-xl bg-interactive font-[700] text-white transition-opacity active:opacity-80"
          @click="localStatus = 'Reviewed'"
        >
          {{ t('inspections.mark_reviewed') }}
        </button>
      </div>

    </div>
  </div>
</template>
