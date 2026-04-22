<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-4">Inspections</h1>
    <div class="space-y-3">
      <InspectionCard
        v-for="insp in filteredInspections"
        :key="insp.id"
        :inspection="insp"
        :canReview="role === 'rep'"
        @respond="openResponse(insp)"
        @mark-reviewed="markReviewed(insp.id)"
      />
    </div>

    <!-- Response modal -->
    <Teleport to="body">
      <div v-if="responding" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" @click.self="responding = null">
        <div class="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">Submit Response</h2>
            <button @click="responding = null" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <p class="text-sm text-gray-600 mb-3"><span class="font-medium">Finding:</span> {{ responding.findings }}</p>
          <textarea v-model="responseText" rows="4" placeholder="Describe the corrective actions taken..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700 mb-3"></textarea>
          <button @click="submitResponse" class="w-full bg-[#C8102E] text-white font-semibold py-2.5 rounded-lg">Submit Response</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import allInspections from '../data/inspections.json'
import { useRole } from '../composables/useRole.js'
import InspectionCard from '../components/inspections/InspectionCard.vue'

const { role } = useRole()
const inspections = ref([...allInspections])
const responding = ref(null)
const responseText = ref('')

const filteredInspections = computed(() =>
  role.value === 'rep' ? inspections.value : inspections.value.filter(i => i.contractorId === 'c1')
)

function openResponse(insp) {
  responding.value = insp
  responseText.value = insp.contractorResponse ?? ''
}

function submitResponse() {
  const insp = inspections.value.find(i => i.id === responding.value.id)
  if (insp) {
    insp.contractorResponse = responseText.value
    insp.responseStatus = 'Pending Review'
  }
  responding.value = null
  responseText.value = ''
}

function markReviewed(id) {
  const insp = inspections.value.find(i => i.id === id)
  if (insp) insp.responseStatus = 'Reviewed'
}
</script>
