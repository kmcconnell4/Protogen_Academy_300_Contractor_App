import { ref } from 'vue'
import quotesJson from '@/data/quotes.json'
import { useJobsData } from './useJobsData'
import { useOrdersData } from './useOrdersData'

// Module-level singleton — shared reactive quotes array.
// Dependency chain: useQuotesData → useJobsData, useOrdersData (no circular deps).
const quotes = ref([...quotesJson])

export function useQuotesData() {
  function addQuote(newQuote) {
    quotes.value.push(newQuote)
  }

  function quotesByJobId(jobId) {
    return quotes.value.filter((q) => q.jobId === jobId)
  }

  /**
   * Finalizes an approved quote as an order:
   * 1. Sets quote.status → 'Ordered'
   * 2. Creates a new order stub and adds it via useOrdersData
   * 3. Pushes the new orderId into the parent job's orderIds array
   * Returns the new order object.
   */
  function finalizeQuoteAsOrder(quoteId) {
    const quote = quotes.value.find((q) => q.id === quoteId)
    if (!quote) return null

    quote.status = 'Ordered'

    const today = new Date().toISOString().slice(0, 10)
    const newOrder = {
      id: `order-${Date.now()}`,
      jobId: quote.jobId,
      quoteId: quote.id,
      poNumber: `PO-${Date.now()}`,
      status: 'Processing',
      orderedAt: today,
      shippedAt: null,
      deliveredAt: null,
      carrier: null,
      trackingNumber: null,
      lineItems: quote.lineItems.map((li) => ({ ...li })),
    }

    const { addOrder } = useOrdersData()
    addOrder(newOrder)

    const { jobById } = useJobsData()
    const job = jobById(quote.jobId)
    if (job && !job.orderIds.includes(newOrder.id)) {
      job.orderIds.push(newOrder.id)
    }

    return newOrder
  }

  return { quotes, addQuote, quotesByJobId, finalizeQuoteAsOrder }
}
