/**
 * The one seam every feature uses for persistence.
 *
 * Today it is backed by browser storage on web and AsyncStorage on native.
 * Swapping it for SQLite or Supabase only replaces the adapter, not the store.
 */
export type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
}
