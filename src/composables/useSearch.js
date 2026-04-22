import { ref, computed } from 'vue'
import jobs from '@/data/jobs.json'
import products from '@/data/products.json'
import quotes from '@/data/quotes.json'
import documents from '@/data/documents.json'
import videos from '@/data/videos.json'
import orders from '@/data/orders.json'
import inspections from '@/data/inspections.json'

const query = ref('')

/**
 * Cross-entity search across jobs, products, quotes, documents, and videos.
 * Results are grouped by entity type for display in SearchOverlay.
 */
export function useSearch() {
  const results = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return null

    return {
      jobs: jobs.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.address.toLowerCase().includes(q) ||
          j.type.toLowerCase().includes(q)
      ),
      products: products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ),
      quotes: quotes.filter((qt) => {
        const job = jobs.find((j) => j.id === qt.jobId)
        return (
          job?.name.toLowerCase().includes(q) ||
          qt.status.toLowerCase().includes(q)
        )
      }),
      documents: documents.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q)
      ),
      videos: videos.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      ),
      orders: orders.filter(
        (o) =>
          o.poNumber.toLowerCase().includes(q) ||
          (o.carrier ?? '').toLowerCase().includes(q) ||
          (o.trackingNumber ?? '').toLowerCase().includes(q)
      ),
      inspections: inspections.filter(
        (i) =>
          i.type.toLowerCase().includes(q) ||
          i.status.toLowerCase().includes(q) ||
          (i.repName ?? '').toLowerCase().includes(q)
      ),
    }
  })

  const hasResults = computed(() => {
    if (!results.value) return false
    return Object.values(results.value).some((group) => group.length > 0)
  })

  function setQuery(value) {
    query.value = value
  }

  function clearQuery() {
    query.value = ''
  }

  return { query, results, hasResults, setQuery, clearQuery }
}
