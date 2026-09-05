<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  finding:  { type: Object, required: true },
  response: { type: String,  default: '' },
  resolved: { type: Boolean, default: false },
})

const emit = defineEmits(['update:response', 'update:resolved'])

const fileInputRef = ref(null)
const addedPhotos = ref([])

function openFilePicker() {
  fileInputRef.value?.click()
}

function handleFileSelect(event) {
  const files = [...(event.target.files ?? [])]
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      addedPhotos.value.push({ id: `${Date.now()}-${Math.random()}`, url: reader.result, name: file.name })
    }
    reader.readAsDataURL(file)
  })
  // Reset so selecting the same file again still fires @change
  event.target.value = ''
}

function removeAddedPhoto(id) {
  addedPhotos.value = addedPhotos.value.filter((p) => p.id !== id)
}
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

    <!-- Add Photo — native file picker; mobile OSes offer camera + library, desktop opens a file browser -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />
    <button
      type="button"
      class="flex items-center gap-2 h-[44px] px-3 rounded-xl border border-dashed border-border text-text-secondary text-[12px] font-[700] uppercase tracking-[0.08em] hover:border-highlight hover:text-highlight transition-colors"
      @click="openFilePicker"
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

    <!-- Staged remediation photos -->
    <div v-if="addedPhotos.length" class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <div
        v-for="photo in addedPhotos"
        :key="photo.id"
        class="relative h-24 w-24 shrink-0"
      >
        <img
          :src="photo.url"
          :alt="photo.name"
          class="h-full w-full rounded-lg object-cover border border-border"
        />
        <button
          type="button"
          class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-nav border border-border flex items-center justify-center text-text-secondary hover:text-white transition-colors"
          :aria-label="t('common.close')"
          @click="removeAddedPhoto(photo.id)"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

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
