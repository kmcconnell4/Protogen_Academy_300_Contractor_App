<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'
import InspectionResponseForm from './InspectionResponseForm.vue'

const { t } = useI18n()
const { role } = useRole()

const props = defineProps({
  inspection: { type: Object, required: true },
})

const isExpanded = ref(false)

const statusColor = {
  'Pending Response': 'bg-amber text-bg',
  'Response Overdue': 'bg-error text-white',
  'Reviewed':         'bg-emerald text-bg',
}

const resultColor = {
  Pass: 'text-emerald',
  Fail: 'text-error',
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden">
    <button
      class="w-full flex items-start justify-between gap-3 p-4 text-left"
      @click="isExpanded = !isExpanded"
    >
      <div class="min-w-0">
        <p class="text-white font-bold">{{ inspection.type }}</p>
        <p class="text-text-secondary text-xs mt-0.5">
          {{ t('inspections.conducted') }} {{ inspection.conductedAt }}
          &middot; {{ inspection.repName }}
        </p>
        <p v-if="inspection.overallResult" :class="['text-sm font-bold mt-1', resultColor[inspection.overallResult]]">
          {{ t(`inspections.result_${inspection.overallResult.toLowerCase()}`) }}
        </p>
      </div>
      <span :class="['px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest shrink-0', statusColor[inspection.status] ?? 'bg-surface-alt text-text-secondary']">
        {{ inspection.status }}
      </span>
    </button>

    <div v-if="isExpanded" class="border-t border-border p-4 flex flex-col gap-4">
      <!-- Findings -->
      <div v-if="inspection.findings.length">
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
          {{ t('inspections.findings') }}
        </p>
        <div v-for="finding in inspection.findings" :key="finding.id" class="flex flex-col gap-1 bg-surface-alt rounded-lg p-3 mb-2">
          <div class="flex items-center gap-2">
            <span :class="['text-xs font-bold px-2 py-0.5 rounded-full',
              finding.severity === 'Major' ? 'bg-error text-white' :
              finding.severity === 'Minor' ? 'bg-amber text-bg' :
              'bg-surface text-text-secondary']">
              {{ finding.severity }}
            </span>
            <span class="text-text-secondary text-xs font-bold">{{ finding.category }}</span>
          </div>
          <p class="text-white text-sm">{{ finding.description }}</p>
        </div>
      </div>
      <p v-else class="text-text-secondary text-sm">{{ t('inspections.no_findings') }}</p>

      <!-- Contractor response -->
      <InspectionResponseForm
        v-if="['Pending Response', 'Response Overdue'].includes(inspection.status) && role === 'contractor'"
        :inspection-id="inspection.id"
      />
      <div v-else-if="inspection.contractorResponse" class="flex flex-col gap-1">
        <p class="text-xs font-bold uppercase tracking-widest text-text-secondary">
          {{ t('inspections.your_response') }}
        </p>
        <p class="text-white text-sm bg-surface-alt rounded-lg p-3">{{ inspection.contractorResponse }}</p>
        <p v-if="inspection.responseSubmittedAt" class="text-text-secondary text-xs">
          {{ t('inspections.response_submitted', { date: inspection.responseSubmittedAt }) }}
        </p>
      </div>

      <!-- Rep mark reviewed -->
      <div v-if="role === 'rep' && inspection.status !== 'Reviewed'" class="pt-2">
        <button class="w-full h-[52px] rounded-lg bg-interactive text-white font-bold">
          {{ t('inspections.mark_reviewed') }}
        </button>
      </div>
    </div>
  </div>
</template>
