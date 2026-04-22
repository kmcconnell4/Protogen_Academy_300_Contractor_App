<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'
import jobs from '@/data/jobs.json'
import GreetingWeather from '@/components/home/GreetingWeather.vue'
import AlertCards from '@/components/home/AlertCards.vue'
import JobCard from '@/components/jobs/JobCard.vue'
import RecentContractors from '@/components/home/RecentContractors.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'
import QuickAccess from '@/components/home/QuickAccess.vue'

const { t } = useI18n()
const { role } = useRole()

const recentJob = computed(() =>
  [...jobs]
    .filter((j) => j.status !== 'Closed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] ?? null
)
</script>

<template>
  <main class="flex flex-col pb-24 bg-bg">
    <!-- Greeting: generous top space, comfortable bottom clearance before alerts -->
    <div class="px-4 pt-7 pb-8">
      <GreetingWeather />
    </div>

    <!-- Alerts: contractor sees their own, rep sees across all contractors -->
    <AlertCards />

    <!-- Recent job (contractor) / Recent contractors (rep) -->
    <section class="px-4 mt-6">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ role === 'rep' ? t('home.section_recent_contractors') : t('home.section_continue') }}
      </p>
      <JobCard v-if="role === 'contractor' && recentJob" :job="recentJob" />
      <div v-else-if="role === 'contractor'" class="bg-surface border border-border rounded-xl px-4 py-8 text-center">
        <p class="text-white font-bold mb-1">{{ t('home.no_active_jobs') }}</p>
        <p class="text-text-secondary text-sm">{{ t('home.no_active_jobs_hint') }}</p>
      </div>
      <RecentContractors v-else />
    </section>

    <!-- Recently viewed: label padded, row bleeds to edges for natural scroll -->
    <section class="mt-7">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary mb-3 px-4">
        {{ t('home.section_recently_viewed') }}
      </p>
      <RecentlyViewed />
    </section>

    <!-- Quick access -->
    <section class="px-4 mt-7">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ t('home.section_quick_access') }}
      </p>
      <QuickAccess />
    </section>

  </main>
</template>

