// src/lib/tauriStore.ts
import { load, Store } from '@tauri-apps/plugin-store'

let store: Store | null = null

async function getStore(): Promise<Store> {
  if (!store) {
    store = await load('appdata.json', { defaults: {} }) 
  }
  return store
}

export const db = {
  get: async <T>(key: string): Promise<T | undefined> => {
    const s = await getStore()
    return s.get<T>(key)
  },
  set: async <T>(key: string, value: T): Promise<void> => {
    const s = await getStore()
    return s.set(key, value)
  },
  delete: async (key: string): Promise<void> => {
    const s = await getStore()
    await s.delete(key) 
  },
}