<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Orders</h1>
    <div class="space-y-3">
      <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import allOrders from '../data/orders.json'
import { useRole } from '../composables/useRole.js'
import OrderCard from '../components/orders/OrderCard.vue'

const { role } = useRole()

const filteredOrders = computed(() =>
  role.value === 'rep' ? allOrders : allOrders.filter(o => o.contractorId === 'c1')
)
</script>
