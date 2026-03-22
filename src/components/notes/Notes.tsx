// src/components/notes/Notes.tsx
/*
    - When notes is selected it goes to a clean slate page with 2 segments: with a blank note on the right and all previous notes on a sidebar on the left
    - When a note is selected the right panel will display that note
*/

import { useState, useEffect } from 'react'
import { useNoteStore } from '../../stores/noteStore'
import NoteSidebar from './NoteSideBar'

export default function Notes() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { addNote, updateNote, loadNotes, loaded, notes } = useNoteStore()

  useEffect(() => {
    if (!loaded) loadNotes()
  }, [])

  const selectedNote = notes.find(n => n.id === selectedId) ?? null

  const handleCreateNote = async () => {
    const id = await addNote('Untitled', '')
    setSelectedId(id)
  }

  return (
    <div className="flex h-full w-full">
      <NoteSidebar onSelect={setSelectedId} />
      <div
        className="flex-1 flex flex-col p-7 cursor-text"
        onClick={selectedId === null ? handleCreateNote : undefined}
      >
        {selectedNote === null ? (
          <p
            className="text-[15px] mt-4"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Click anywhere to create a new note
          </p>
        ) : (
          <div className="flex flex-col gap-4 h-full">
            <input
              className="text-[22px] font-semibold bg-transparent border-none outline-none tracking-tight"
              style={{ color: 'var(--text-primary)' }}
              value={selectedNote.title}
              placeholder="Untitled"
              onChange={e => updateNote(selectedNote.id, e.target.value, selectedNote.text)}
            />
            <textarea
              className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
              value={selectedNote.text}
              placeholder="Start writing..."
              onChange={e => updateNote(selectedNote.id, selectedNote.title, e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}