<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useJobsData } from '@/composables/useJobsData'

const { t } = useI18n()
const router = useRouter()
const { addJob } = useJobsData()

const name        = ref('')
const address     = ref('')
const type        = ref('Commercial')
const sqFootage   = ref('')
const submitting  = ref(false)

const JOB_TYPES = ['Commercial', 'Residential', 'Multi-Unit']

function today() {
  return new Date().toISOString().slice(0, 10)
}

function handleSubmit() {
  if (!name.value.trim() || !address.value.trim()) return

  submitting.value = true

  const newJob = {
    id:           'job-' + Date.now(),
    name:         name.value.trim(),
    address:      address.value.trim(),
    type:         type.value,
    status:       'Bid',
    squareFootage: sqFootage.value ? Number(sqFootage.value) : null,
    createdAt:    today(),
    updatedAt:    today(),
    contractorId: null,
    repId:        null,
    quoteIds:     [],
    orderIds:     [],
    inspectionIds: [],
    notes:        '',
  }

  addJob(newJob)
  router.push({ name: 'job-detail', params: { id: newJob.id } })
}
</script>

<template>
  <div class="flex flex-col min-h-dvh bg-bg pb-36">

    <!-- ── Back nav ── -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
      <button
        class="flex items-center gap-1.5 h-[44px] text-text-secondary hover:text-white transition-colors"
        @click="router.back()"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span class="text-[13px] font-[700] uppercase tracking-[0.08em]">{{ t('common.back') }}</span>
      </button>
    </div>

    <!-- ── Page heading ── -->
    <div class="px-4 pt-2 pb-5 border-b border-border">
      <h1
        class="text-white font-[800] text-[2rem] leading-tight"
        style="font-family: var(--font-heading);"
      >
        {{ t('jobs.create_job') }}
      </h1>
    </div>

    <!-- ── Form ── -->
    <form class="px-4 pt-6 pb-8 flex flex-col gap-5" @submit.prevent="handleSubmit">

      <!-- Job Name -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary" for="job-name">
          {{ t('jobs.detail.job_name') }}<span class="text-error ml-0.5">*</span>
        </label>
        <input
          id="job-name"
          v-model="name"
          type="text"
          required
          autocomplete="off"
          :placeholder="t('jobs.create_name_placeholder')"
          class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white text-[15px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight transition-colors"
        />
      </div>

      <!-- Address -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary" for="job-address">
          {{ t('jobs.detail.address') }}<span class="text-error ml-0.5">*</span>
        </label>
        <input
          id="job-address"
          v-model="address"
          type="text"
          required
          autocomplete="street-address"
          :placeholder="t('jobs.create_address_placeholder')"
          class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white text-[15px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight transition-colors"
        />
      </div>

      <!-- Type -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary" for="job-type">
          {{ t('jobs.detail.type') }}
        </label>
        <select
          id="job-type"
          v-model="type"
          class="select-field w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white text-[15px] font-[500] focus:outline-none focus:border-highlight transition-colors"
        >
          <option v-for="jt in JOB_TYPES" :key="jt" :value="jt">{{ jt }}</option>
        </select>
      </div>

      <!-- Square Footage -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary" for="job-sqft">
          {{ t('jobs.detail.square_footage') }}
        </label>
        <input
          id="job-sqft"
          v-model="sqFootage"
          type="number"
          min="0"
          step="1"
          :placeholder="t('jobs.create_sqft_placeholder')"
          class="w-full h-[52px] px-4 rounded-xl bg-surface border border-border text-white text-[15px] font-[500] placeholder:text-text-secondary focus:outline-none focus:border-highlight transition-colors"
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="submitting || !name.trim() || !address.trim()"
        class="mt-2 w-full h-[56px] rounded-xl bg-interactive text-white text-[15px] font-[700] uppercase tracking-[0.1em] transition-colors active:bg-highlight disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {{ t('jobs.create_save') }}
      </button>

    </form>

  </div>
</template>
