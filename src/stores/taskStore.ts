// src/stores/taskStore.ts
import { create } from 'zustand'
import { db } from '../lib/tauriStore'

export type Task = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

type TaskStore = {
  tasks: Task[]
  loaded: boolean
  loadTasks: () => Promise<void>
  addTask: (text: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loaded: false,

  // Load tasks from disk when app starts
  loadTasks: async () => {
    const saved = await db.get<Task[]>('tasks')
    set({ tasks: saved ?? [], loaded: true })
  },

  addTask: async (text) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    }
    const updated = [newTask, ...get().tasks]
    set({ tasks: updated })
    await db.set('tasks', updated)
  },

  toggleTask: async (id) => {
    const updated = get().tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    set({ tasks: updated })
    await db.set('tasks', updated)
  },

  deleteTask: async (id) => {
    const updated = get().tasks.filter(t => t.id !== id)
    set({ tasks: updated })
    await db.set('tasks', updated)
  },
}))