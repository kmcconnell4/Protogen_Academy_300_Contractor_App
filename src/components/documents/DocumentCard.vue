<template>
  <a :href="doc.href" class="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm active:bg-gray-50">
    <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#C8102E] shrink-0">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        <path d="M14 2v6h6" />
      </svg>
    </div>
    <div class="min-w-0 flex-1">
      <p class="font-semibold text-gray-800 text-sm truncate">{{ doc.title }}</p>
      <p class="text-xs text-gray-400 mt-0.5">{{ doc.category }} · {{ doc.fileSize }} · Updated {{ doc.updatedDate }}</p>
    </div>
    <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  </a>
</template>

<script setup>
defineProps({ doc: Object })
</script>
