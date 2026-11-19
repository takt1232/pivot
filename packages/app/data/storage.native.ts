import AsyncStorage from '@react-native-async-storage/async-storage'

import type { StorageAdapter } from './storage-types'

export const storage: StorageAdapter = {
  getItem(key) {
    return AsyncStorage.getItem(key)
  },

  setItem(key, value) {
    return AsyncStorage.setItem(key, value)
  },
}
