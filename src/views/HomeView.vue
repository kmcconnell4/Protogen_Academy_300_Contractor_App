<script setup>
import { useI18n } from 'vue-i18n'
import GreetingWeather from '@/components/home/GreetingWeather.vue'
import AlertCards from '@/components/home/AlertCards.vue'
import RecentJobCard from '@/components/home/RecentJobCard.vue'
import RecentlyViewed from '@/components/home/RecentlyViewed.vue'
import QuickAccess from '@/components/home/QuickAccess.vue'

const { t } = useI18n()
</script>

<template>
  <main class="flex flex-col gap-6 pb-24 px-4 pt-4">
    <GreetingWeather />
    <AlertCards />
    <section>
      <h2 class="text-xs font-bold tracking-widest uppercase text-text-secondary mb-3">
        {{ t('home.section_continue') }}
      </h2>
      <RecentJobCard />
    </section>
    <section>
      <h2 class="text-xs font-bold tracking-widest uppercase text-text-secondary mb-3">
        {{ t('home.section_recently_viewed') }}
      </h2>
      <RecentlyViewed />
    </section>
    <section>
      <h2 class="text-xs font-bold tracking-widest uppercase text-text-secondary mb-3">
        {{ t('home.section_quick_access') }}
      </h2>
      <QuickAccess />
    </section>
    <router-link
      to="/jobs/new"
      class="flex items-center justify-center w-full min-h-[52px] rounded-xl bg-interactive text-white font-bold text-base tracking-wide"
    >
      + {{ t('home.cta_new_job') }}
    </router-link>
  </main>
</template>
