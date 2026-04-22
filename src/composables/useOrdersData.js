import { ref } from 'vue'
import ordersJson from '@/data/orders.json'

// Module-level singleton — shared reactive orders array.
const orders = ref([...ordersJson])

export function useOrdersData() {
  function addOrder(newOrder) {
    orders.value.push(newOrder)
  }

  function ordersByJobId(jobId) {
    return orders.value.filter((o) => o.jobId === jobId)
  }

  return { orders, addOrder, ordersByJobId }
}
