import { create } from 'zustand'
import { db } from '../lib/tauriStore'

export type Note = {
  id: number
  title: string
  text: string
  createdAt: number
  lastEditedAt: number
}

type NoteStore = {
  notes: Note[]
  loaded: boolean
  loadNotes: () => Promise<void>
  addNote: (title: string, text: string) => Promise<number>
  deleteNote: (id: number) => Promise<void>
  updateNote: (id: number, title: string, text: string, lastEditedAt?: number) => Promise<void>
  copyNote: (id: number) => Promise<number>
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  loaded: false,

  loadNotes: async () => {
    const saved = await db.get<Note[]>('notes')
    set({ notes: saved ?? [], loaded: true })
  },

  addNote: async (title, text) => {
    const notes = get().notes

    const nextId = notes.length === 0 ? 1 : Math.max(...notes.map(n => n.id)) + 1

    const newNote: Note = {
      id: nextId,
      title,
      text,
      createdAt: Date.now(),
      lastEditedAt: Date.now(),
    }

    const updated = [newNote, ...notes]
    set({ notes: updated })
    await db.set('notes', updated)
    return newNote.id
  },

  copyNote: async (id: number) => {
    const notes = get().notes
    const original = notes.find(n => n.id === id)
    if (!original) throw new Error('Note not found')
    else{
        const nextId = notes.length === 0 ? 1 : Math.max(...notes.map(n => n.id)) + 1

        const newNote: Note = {
            id: nextId,
            title: original.title + ' (copy)',
            text: original.text,
            createdAt: Date.now(),
            lastEditedAt: Date.now(),
        }
        const updated = [newNote, ...notes]
        set({ notes: updated })
        await db.set('notes', updated)
        return newNote.id
    }
    
  },

  deleteNote: async (id) => {
    const updated = get().notes.filter(n => n.id !== id)
    set({ notes: updated })
    await db.set('notes', updated)
  },

  updateNote: async (id, title, text, lastEditedAt=Date.now()) => {
    const updated = get().notes.map(n =>
      n.id === id ? { ...n, title, text, lastEditedAt } : n
    )
    set({ notes: updated })
    await db.set('notes', updated)
  },
}))