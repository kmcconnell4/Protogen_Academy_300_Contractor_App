import { ref } from 'vue'

const role = ref('contractor') // 'contractor' | 'rep'

export function useRole() {
  function toggle() {
    role.value = role.value === 'contractor' ? 'rep' : 'contractor'
  }
  function setRole(r) {
    role.value = r
  }
  return { role, toggle, setRole }
}
