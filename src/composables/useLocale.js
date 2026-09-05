import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'ridgeline_locale'
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'pt']

/**
 * Manages the active locale and persists the preference to localStorage.
 * Must be called inside a component with access to the vue-i18n context.
 */
export function useLocale() {
  const { locale } = useI18n()

  const savedLocale = localStorage.getItem(STORAGE_KEY)
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
    locale.value = savedLocale
  }

  const currentLocale = ref(locale.value)

  watch(locale, (newLocale) => {
    currentLocale.value = newLocale
  })

  function setLocale(newLocale) {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return
    locale.value = newLocale
    currentLocale.value = newLocale
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  return {
    currentLocale,
    supportedLocales: SUPPORTED_LOCALES,
    setLocale,
  }
}
