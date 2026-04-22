<script setup>
import { useI18n } from 'vue-i18n'
import { useRole } from '@/composables/useRole'
import GreetingWeather from '@/components/home/GreetingWeather.vue'
import AlertCards from '@/components/home/AlertCards.vue'
import RecentJobCard from '@/components/home/RecentJobCard.vue'
import RecentContractors from '@/components/home/RecentContractors.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'
import QuickAccess from '@/components/home/QuickAccess.vue'

const { t } = useI18n()
const { role } = useRole()
</script>

<template>
  <main class="flex flex-col pb-24 bg-bg">
    <!-- Greeting: generous top space, comfortable bottom clearance before alerts -->
    <div class="px-4 pt-7 pb-5">
      <GreetingWeather />
    </div>

    <!-- Alerts: contractor sees their own, rep sees across all contractors -->
    <AlertCards />

    <!-- Recent job (contractor) / Recent contractors (rep) -->
    <section class="px-4 mt-6">
      <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary mb-3">
        {{ role === 'rep' ? t('home.section_recent_contractors') : t('home.section_continue') }}
      </p>
      <RecentJobCard v-if="role === 'contractor'" />
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

    <!-- CTA: contractor starts a job, rep adds a contractor -->
    <div class="px-4 mt-8">
      <router-link
        v-if="role === 'contractor'"
        to="/jobs"
        class="flex items-center justify-center w-full h-tap rounded-xl bg-interactive text-white font-bold text-base tracking-wide transition-opacity active:opacity-80"
        style="font-family: var(--font-body);"
      >
        + {{ t('home.cta_new_job') }}
      </router-link>
      <button
        v-else
        class="flex items-center justify-center w-full h-tap rounded-xl bg-amber text-bg font-bold text-base tracking-wide transition-opacity active:opacity-80"
        style="font-family: var(--font-body);"
      >
        + {{ t('home.cta_add_contractor') }}
      </button>
    </div>
  </main>
</template>

