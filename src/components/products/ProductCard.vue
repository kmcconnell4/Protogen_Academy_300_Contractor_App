<script setup>
const props = defineProps({
  product: { type: Object, required: true },
})

function formatPrice(price, unit) {
  const formatted = price < 1
    ? `$${price.toFixed(2)}`
    : `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  return `${formatted} / ${unit}`
}

const placeholderImg = `https://placehold.co/480x220/243044/A8B8D0?text=${encodeURIComponent(props.product.category)}`
</script>

<template>
  <router-link
    :to="{ name: 'product-detail', params: { id: product.id } }"
    class="block bg-surface border border-border rounded-xl overflow-hidden flex flex-col active:opacity-80 transition-opacity"
  >
    <!-- Product image -->
    <img
      :src="placeholderImg"
      :alt="product.name"
      loading="lazy"
      class="w-full aspect-[16/9] object-cover"
    />

    <div class="p-4 flex flex-col gap-2">
      <!-- Category + SKU meta row -->
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] font-[700] uppercase tracking-[0.12em] text-text-secondary leading-none truncate">
          {{ product.category }}
        </span>
        <span class="text-[11px] font-[600] text-text-secondary/70 shrink-0 font-mono">
          {{ product.sku }}
        </span>
      </div>

      <!-- Product name -->
      <h3
        class="text-white font-[800] leading-tight text-[1.25rem]"
        style="font-family: var(--font-heading);"
      >
        {{ product.name }}
      </h3>

      <!-- Description — 2-line clamp -->
      <p class="text-text-secondary text-[13px] leading-relaxed line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price -->
      <p class="text-highlight text-[13px] font-[700]">
        {{ formatPrice(product.pricePerUnit, product.unit) }}
      </p>
    </div>
  </router-link>
</template>
