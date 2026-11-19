import type { StorageAdapter } from './storage-types'

/**
 * Web (and SSR-safe) adapter. Metro resolves `storage.native.ts` on iOS and
 * Android, so AsyncStorage never reaches the server bundle.
 */
export const storage: StorageAdapter = {
  async getItem(key) {
    if (typeof window === 'undefined') return null

    return window.localStorage.getItem(key)
  },

  async setItem(key, value) {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(key, value)
  },
}
