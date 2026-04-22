import { ref } from 'vue'
import jobsJson from '@/data/jobs.json'

// Module-level singleton — one reactive jobs array shared across all components.
// Follow the useOutdoorMode.js pattern: ref lives outside the exported function
// so it is created once per application lifetime, not once per call.
const jobs = ref([...jobsJson])

export function useJobsData() {
  function addJob(newJob) {
    jobs.value.push(newJob)
  }

  function jobById(id) {
    return jobs.value.find((j) => j.id === id) ?? null
  }

  return { jobs, addJob, jobById }
}
