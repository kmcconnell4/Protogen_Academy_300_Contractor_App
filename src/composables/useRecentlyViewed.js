import { ref } from 'vue'

const STORAGE_KEY = 'carlisle_recently_viewed'
const MAX_ITEMS = 6

/**
 * Tracks recently viewed products and documents.
 * Entries are persisted to localStorage and surfaced on the Home screen.
 *
 * Each entry: { id, type: 'product' | 'document', name, routeName, routeParams }
 */
export function useRecentlyViewed() {
  const stored = localStorage.getItem(STORAGE_KEY)
  const recentlyViewed = ref(stored ? JSON.parse(stored) : [])

  function addItem(item) {
    // Remove any existing entry with the same id to avoid duplicates
    const filtered = recentlyViewed.value.filter((i) => i.id !== item.id)
    // Prepend the new item and cap at MAX_ITEMS
    recentlyViewed.value = [item, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed.value))
  }

  function clearAll() {
    recentlyViewed.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return { recentlyViewed, addItem, clearAll }
}
