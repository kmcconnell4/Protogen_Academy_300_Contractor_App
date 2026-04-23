<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

const { t } = useI18n()
const router = useRouter()
const { setQuery } = useSearch()

// Voice search state
const isListening = ref(false)

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

const hasSpeechRecognition = computed(() => !!SpeechRecognition)

let recognition = null

function openSearch() {
  router.push({ name: 'search' })
}

function startVoiceSearch() {
  if (!SpeechRecognition) return

  recognition = new SpeechRecognition()
  recognition.lang = document.documentElement.lang || 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  isListening.value = true

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    setQuery(transcript)
    router.push({ name: 'search' })
  }

  recognition.onerror = () => {
    isListening.value = false
  }

  recognition.onend = () => {
    isListening.value = false
  }

  recognition.start()
}

onBeforeUnmount(() => {
  recognition?.stop()
})
</script>

<template>
  <div class="fixed bottom-16 inset-x-0 z-39 px-4 pb-2 pointer-events-none">
    <div
      class="flex items-center h-[52px] bg-brand border border-brand rounded-full pointer-events-auto"
      style="box-shadow: 0 -4px 24px 0 rgba(0,0,0,0.5), 0 2px 12px 0 rgba(22,77,166,0.35);"
    >
      <!-- Bar body: tap to navigate to search -->
      <button
        type="button"
        class="flex items-center gap-3 flex-1 h-full pl-4 pr-2 min-w-0"
        :aria-label="t('search.placeholder')"
        @click="openSearch"
      >
        <!-- Search icon -->
        <svg
          class="w-4 h-4 text-white/70 shrink-0"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <!-- Placeholder text -->
        <span class="text-white/70 text-[15px] font-[500] truncate flex-1 text-left">
          {{ t('search.placeholder') }}
        </span>
      </button>

      <!-- Mic button — only rendered if browser supports Web Speech API -->
      <button
        v-if="hasSpeechRecognition"
        type="button"
        class="flex items-center justify-center w-[52px] h-full shrink-0 transition-colors"
        :class="isListening ? 'text-amber' : 'text-white/80'"
        :aria-label="t('search.start_voice_search')"
        @click="startVoiceSearch"
      >
        <!-- Mic icon -->
        <svg
          class="w-5 h-5 transition-opacity"
          :class="isListening ? 'animate-pulse' : ''"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M19 10a7 7 0 01-14 0" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      </button>

      <!-- Right padding when no mic -->
      <div v-else class="w-4 shrink-0" />
    </div>
  </div>
</template>
