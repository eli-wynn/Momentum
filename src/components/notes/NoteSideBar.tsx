/*
    - Sidebar on the right side of the app, the purpose is to hold all the noteItems and display them for easy access
    - Default sorting will be last modified at the top
    - Search bar will be at the top allowing users to search for specific notes 
        - search uses direct matching first then levenshtein distancing (algorithm that allows for typos (if one letter off from a word levenshtein distance is 1))
*/

import {useEffect, useState} from 'react'
import { useNoteStore } from '../../stores/noteStore'
import NoteItem from './NoteItem'
import {distance} from 'fastest-levenshtein'

export default function NoteSidebar({ onSelect }: { onSelect: (id: number) => void }) {
  const { notes, loaded, loadNotes } = useNoteStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!loaded) loadNotes()
  }, [])

  const sortedNotes = [...notes]
  .sort((a, b) => b.lastEditedAt - a.lastEditedAt)
  .filter(note => search === '' ? true : matchesSearch(note.title, search))

  return (
    <div className="flex flex-col h-full" style={{ borderRight: '1px solid var(--border)' }}>
      
      {/* Search bar */}
      <div className="p-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-lg px-3 py-2 text-[13px] border outline-none"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Note list */}
      <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1">
        {sortedNotes.length === 0 && (
          <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            No notes found.
          </p>
        )}
        {sortedNotes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            onSelect={() => onSelect(note.id)}
          />
        ))}
      </div>

    </div>
  )


}




function matchesSearch(title: string, search: string): boolean {
    title = title.toLowerCase()
    const titleWords = title.split(" ")
    search = search.toLowerCase()
    for (const item of titleWords){
        if(item === search){
            return true
        }
        const levDist = distance(title, search)
        if (levDist < 3){
            return true
        }
    }
    return false
}