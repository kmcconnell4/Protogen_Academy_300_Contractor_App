import { useI18n } from 'vue-i18n'

/**
 * Returns a formatDate helper that respects the active i18n locale.
 * Renders dates in the form "Apr 5, 2025" (short month, day, year).
 *
 * Usage:
 *   const { formatDate } = useFormatDate()
 *   formatDate('2026-04-15') // → "Apr 15, 2026"
 *   formatDate(null)         // → null
 */
export function useFormatDate() {
  const { locale } = useI18n()

  function formatDate(iso) {
    if (!iso) return null
    return new Intl.DateTimeFormat(locale.value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso + 'T00:00:00'))
  }

  return { formatDate }
}
