<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import productsData from '@/data/products.json'
import documentsData from '@/data/documents.json'
import videosData from '@/data/videos.json'
import ProductCard from '@/components/products/ProductCard.vue'
import DocumentCard from '@/components/documents/DocumentCard.vue'
import VideoCard from '@/components/videos/VideoCard.vue'

const { t } = useI18n()
const router = useRouter()

const featuredProducts = computed(() => productsData.filter((p) => p.featured))
const featuredDocs = computed(() => documentsData.filter((d) => d.featured))
const featuredVideos = computed(() => videosData.filter((v) => v.featured))
</script>

<template>
  <main class="flex flex-col pb-24">

    <!-- Page header -->
    <div class="px-4 pt-6 pb-5 border-b border-border">
      <h1
        class="text-[2.25rem] font-[800] text-white leading-none"
        style="font-family: var(--font-heading);"
      >
        {{ t('library.title') }}
      </h1>
    </div>

    <div class="flex flex-col gap-8 pt-6 pb-2">

      <!-- ── Featured Products ── -->
      <section v-if="featuredProducts.length">

        <!-- Section header -->
        <div class="flex items-center justify-between px-4 mb-3">
          <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary">
            {{ t('library.featured_products') }}
          </p>
          <button
            class="flex items-center gap-1 text-[12px] font-[700] text-interactive active:opacity-70 transition-opacity"
            @click="router.push({ name: 'catalog' })"
          >
            {{ t('library.see_all') }}
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Horizontal scroll row -->
        <div class="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="shrink-0 w-[72vw] max-w-[300px]"
          >
            <ProductCard :product="product" />
          </div>
          <div class="shrink-0 w-4" aria-hidden="true" />
        </div>
      </section>

      <!-- ── Featured Documents ── -->
      <section v-if="featuredDocs.length">

        <!-- Section header -->
        <div class="flex items-center justify-between px-4 mb-3">
          <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary">
            {{ t('library.featured_docs') }}
          </p>
          <button
            class="flex items-center gap-1 text-[12px] font-[700] text-interactive active:opacity-70 transition-opacity"
            @click="router.push({ name: 'documents' })"
          >
            {{ t('library.see_all') }}
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Compact list -->
        <div class="mx-4 rounded-xl overflow-hidden border border-border divide-y divide-border">
          <DocumentCard
            v-for="doc in featuredDocs"
            :key="doc.id"
            :doc="doc"
          />
        </div>
      </section>

      <!-- ── Featured Videos ── -->
      <section v-if="featuredVideos.length">

        <!-- Section header -->
        <div class="flex items-center justify-between px-4 mb-3">
          <p class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary">
            {{ t('library.featured_videos') }}
          </p>
          <button
            class="flex items-center gap-1 text-[12px] font-[700] text-interactive active:opacity-70 transition-opacity"
            @click="router.push({ name: 'videos' })"
          >
            {{ t('library.see_all') }}
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- 2-col grid -->
        <div class="grid grid-cols-2 gap-3 px-4">
          <VideoCard
            v-for="video in featuredVideos"
            :key="video.id"
            :video="video"
          />
        </div>
      </section>

    </div>
  </main>
</template>
