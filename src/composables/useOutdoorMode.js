import { ref, watch } from 'vue'

const STORAGE_KEY = 'carlisle_outdoor_mode'

const isOutdoorMode = ref(localStorage.getItem(STORAGE_KEY) === 'true')

// Apply initial state safely — guard against SSR / non-browser environments
if (typeof document !== 'undefined' && isOutdoorMode.value) {
  document.body.classList.add('outdoor-mode')
}

/**
 * Toggles Outdoor Mode — a CSS class on <body> that increases font sizes,
 * tap targets, and text contrast for on-site use in direct sunlight.
 * State is persisted to localStorage.
 */
export function useOutdoorMode() {
  watch(isOutdoorMode, (enabled) => {
    if (enabled) {
      document.body.classList.add('outdoor-mode')
    } else {
      document.body.classList.remove('outdoor-mode')
    }
    localStorage.setItem(STORAGE_KEY, String(enabled))
  })

  function toggle() {
    isOutdoorMode.value = !isOutdoorMode.value
  }

  function enable() {
    isOutdoorMode.value = true
  }

  function disable() {
    isOutdoorMode.value = false
  }

  return { isOutdoorMode, toggle, enable, disable }
}
