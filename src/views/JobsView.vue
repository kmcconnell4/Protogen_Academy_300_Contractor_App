<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-gray-800">Jobs</h1>
      <button @click="showForm = true" class="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg active:opacity-80">
        + New Job
      </button>
    </div>

    <div class="space-y-3">
      <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" @select="selectedJob = job" />
    </div>

    <!-- Job Detail modal -->
    <Teleport to="body">
      <div v-if="selectedJob" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" @click.self="selectedJob = null">
        <div class="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl p-6 md:mb-0">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">{{ selectedJob.name }}</h2>
            <button @click="selectedJob = null" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <dl class="space-y-2 text-sm text-gray-600">
            <div class="flex gap-2"><dt class="font-medium text-gray-700 w-24 shrink-0">Address</dt><dd>{{ selectedJob.address }}</dd></div>
            <div class="flex gap-2"><dt class="font-medium text-gray-700 w-24 shrink-0">Type</dt><dd>{{ selectedJob.type }}</dd></div>
            <div class="flex gap-2"><dt class="font-medium text-gray-700 w-24 shrink-0">Start Date</dt><dd>{{ selectedJob.startDate }}</dd></div>
            <div class="flex gap-2"><dt class="font-medium text-gray-700 w-24 shrink-0">Status</dt><dd><StatusBadge :status="selectedJob.status" /></dd></div>
            <div v-if="role === 'rep'" class="flex gap-2"><dt class="font-medium text-gray-700 w-24 shrink-0">Contractor</dt><dd>{{ selectedJob.contractorId }}</dd></div>
          </dl>
        </div>
      </div>
    </Teleport>

    <!-- New Job form modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" @click.self="showForm = false">
        <div class="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">New Job</h2>
            <button @click="showForm = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          <form @submit.prevent="submitJob" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Name</label>
              <input v-model="form.name" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input v-model="form.address" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="form.type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700">
                <option>Commercial Re-Roof</option>
                <option>New Construction</option>
                <option>Repair</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input v-model="form.startDate" type="date" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700" />
            </div>
            <button type="submit" class="w-full bg-[#C8102E] text-white font-semibold py-2.5 rounded-lg mt-2">Add Job</button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import allJobs from '../data/jobs.json'
import { useRole } from '../composables/useRole.js'
import JobCard from '../components/jobs/JobCard.vue'
import StatusBadge from '../components/shared/StatusBadge.vue'

const { role } = useRole()
const jobs = ref([...allJobs])
const selectedJob = ref(null)
const showForm = ref(false)
const form = ref({ name: '', address: '', type: 'Commercial Re-Roof', startDate: '' })

const filteredJobs = computed(() =>
  role.value === 'rep' ? jobs.value : jobs.value.filter(j => j.contractorId === 'c1')
)

function submitJob() {
  jobs.value.push({
    id: `j${Date.now()}`,
    contractorId: 'c1',
    ...form.value,
    status: 'Pending'
  })
  form.value = { name: '', address: '', type: 'Commercial Re-Roof', startDate: '' }
  showForm.value = false
}
</script>
