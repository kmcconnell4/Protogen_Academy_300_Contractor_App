import { ref, provide, inject } from 'vue'

const ROLE_KEY = Symbol('role')

/**
 * Provides the global role state at the app root.
 * Call once in App.vue: setupRole()
 */
export function setupRole() {
  const role = ref(localStorage.getItem('carlisle_role') ?? 'contractor')

  function setRole(newRole) {
    role.value = newRole
    localStorage.setItem('carlisle_role', newRole)
  }

  provide(ROLE_KEY, { role, setRole })
  return { role, setRole }
}

/**
 * Inject the role state anywhere in the component tree.
 */
export function useRole() {
  const context = inject(ROLE_KEY)
  if (!context) {
    throw new Error('useRole() must be used within a component that has called setupRole()')
  }
  return context
}
