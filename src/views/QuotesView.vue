<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">Quotes</h1>
      <button @click="showForm = true" class="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg active:opacity-80">
        + New Quote
      </button>
    </div>

    <div class="space-y-3">
      <QuoteCard
        v-for="quote in filteredQuotes"
        :key="quote.id"
        :quote="quote"
        :canApprove="role === 'rep' && quote.status === 'Submitted'"
        @approve="updateStatus(quote.id, 'Approved')"
        @reject="updateStatus(quote.id, 'Rejected')"
      />
    </div>

    <!-- New Quote form modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" @click.self="showForm = false">
        <div class="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">New Quote</h2>
            <button @click="showForm = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <form @submit.prevent="submitQuote" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Name</label>
              <input v-model="form.jobName" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700" />
            </div>
            <div class="border-t pt-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Line Items</p>
              <div v-for="(item, idx) in form.lineItems" :key="idx" class="flex gap-2 mb-2">
                <input v-model="item.description" placeholder="Description" class="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-700" />
                <input v-model.number="item.quantity" type="number" min="1" placeholder="Qty" class="w-14 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-700" />
                <input v-model.number="item.unitPrice" type="number" min="0" placeholder="$/unit" class="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-700" />
              </div>
              <button type="button" @click="form.lineItems.push({ description: '', quantity: 1, unitPrice: 0, total: 0 })" class="text-xs text-red-700 font-medium">+ Add Line</button>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="form.notes" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"></textarea>
            </div>
            <button type="submit" class="w-full bg-[#C8102E] text-white font-semibold py-2.5 rounded-lg">Save as Draft</button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import allQuotes from '../data/quotes.json'
import { useRole } from '../composables/useRole.js'
import QuoteCard from '../components/quotes/QuoteCard.vue'

const { role } = useRole()
const quotes = ref([...allQuotes])
const showForm = ref(false)
const form = ref({ jobName: '', lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }], notes: '' })

const filteredQuotes = computed(() =>
  role.value === 'rep' ? quotes.value : quotes.value.filter(q => q.contractorId === 'c1')
)

function updateStatus(id, status) {
  const q = quotes.value.find(q => q.id === id)
  if (q) q.status = status
}

function submitQuote() {
  const lineItems = form.value.lineItems.map(li => ({ ...li, total: li.quantity * li.unitPrice }))
  const subtotal = lineItems.reduce((s, li) => s + li.total, 0)
  quotes.value.push({
    id: `q${Date.now()}`,
    contractorId: 'c1',
    jobId: 'j1',
    jobName: form.value.jobName,
    createdDate: new Date().toISOString().slice(0, 10),
    status: 'Draft',
    lineItems,
    subtotal,
    tax: Math.round(subtotal * 0.07),
    grandTotal: Math.round(subtotal * 1.07),
    notes: form.value.notes
  })
  form.value = { jobName: '', lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }], notes: '' }
  showForm.value = false
}
</script>
