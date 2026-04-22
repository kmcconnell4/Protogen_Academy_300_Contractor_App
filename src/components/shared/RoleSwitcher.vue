<script setup>
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'

const { t } = useI18n()
const { role, setRole } = useRole()

const props = defineProps({
  /** When true, renders as a compact icon-only toggle for the NavBar. */
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <!-- Compact mode: used in NavBar -->
  <button
    v-if="compact"
    :title="t('role_switcher.label') + ': ' + t(`role_switcher.${role}`)"
    class="h-[44px] px-2 flex items-center gap-1 rounded-lg text-xs font-bold uppercase tracking-wider"
    :class="role === 'rep' ? 'text-amber' : 'text-text-secondary'"
    @click="setRole(role === 'contractor' ? 'rep' : 'contractor')"
  >
    {{ role === 'rep' ? 'Rep' : 'Con' }}
  </button>

  <!-- Full mode: used in ProfileView -->
  <div v-else class="flex rounded-xl overflow-hidden border border-border">
    <button
      :class="[
        'flex-1 flex items-center justify-center h-tap font-bold text-sm transition-colors',
        role === 'contractor' ? 'bg-interactive text-white' : 'bg-surface text-text-secondary',
      ]"
      @click="setRole('contractor')"
    >
      {{ t('role_switcher.contractor') }}
    </button>
    <button
      :class="[
        'flex-1 flex items-center justify-center h-tap font-bold text-sm transition-colors',
        role === 'rep' ? 'bg-amber text-bg' : 'bg-surface text-text-secondary',
      ]"
      @click="setRole('rep')"
    >
      {{ t('role_switcher.rep') }}
    </button>
  </div>
</template>
