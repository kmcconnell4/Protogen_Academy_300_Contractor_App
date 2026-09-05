<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJobsData } from '@/composables/useJobsData'
import GreetingWeather from '@/components/home/GreetingWeather.vue'
import AlertCards from '@/components/home/AlertCards.vue'
import JobCard from '@/components/jobs/JobCard.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'
import QuickAccess from '@/components/home/QuickAccess.vue'

const { t } = useI18n()
const { jobs } = useJobsData()

const recentJob = computed(() =>
  [...jobs.value]
    .filter((j) => j.status !== 'Closed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] ?? null
)
</script>

<template>
  <main class="flex flex-col pb-36 bg-bg">
    <!-- Greeting: generous top space, comfortable bottom clearance before alerts -->
    <div class="px-4 pt-7 pb-8">
      <GreetingWeather />
    </div>

    <!-- Alerts -->
    <AlertCards />

    <!-- Recent job -->
    <section class="px-4 mt-6">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ t('home.section_continue') }}
      </p>
      <JobCard v-if="recentJob" :job="recentJob" />
      <div v-else class="bg-surface border border-border rounded-xl px-4 py-8 text-center">
        <p class="text-white font-bold mb-1">{{ t('home.no_active_jobs') }}</p>
        <p class="text-text-secondary text-sm">{{ t('home.no_active_jobs_hint') }}</p>
      </div>
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

