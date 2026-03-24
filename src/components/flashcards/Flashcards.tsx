import { useState, useEffect } from 'react'
import { useFlashcardStore, Deck } from '../../stores/flashcardStore'
import { db } from '../../lib/tauriStore'
import DeckView from './DeckView'
import StudyFullDeck from './StudyFullDeck'
import StudySpacedRepetition from './StudySpacedRepetition'
import { open, save } from '@tauri-apps/plugin-dialog'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileImport } from '@fortawesome/free-solid-svg-icons'

type View = 'deckList' | 'deckView' | 'fullStudy' | 'spacedStudy'

export default function Flashcards() {
  const [view, setView] = useState<View>('deckList')
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null)
  const { decks, loaded, loadCards, addDeck, deleteDeck } = useFlashcardStore()
  const [newDeckTitle, setNewDeckTitle] = useState('')

  useEffect(() => {
    if (!loaded) loadCards()
  }, [])

  // Defined before conditional returns so they're always available
  const handleExport = async (deck: Deck) => {
    const json = JSON.stringify(deck, null, 2)
    const path = await save({
      filters: [{ name: 'JSON', extensions: ['json'] }],
      defaultPath: `${deck.title}.json`
    })
    if (!path) return
    await writeTextFile(path, json)
  }

  const handleImport = async () => {
    const path = await open({
      filters: [{ name: 'JSON', extensions: ['json'] }],
      multiple: false
    })
    if (!path) return

    const content = await readTextFile(path as string)
    const imported = JSON.parse(content) as Deck

    const nextDeckId = decks.length === 0
      ? 1
      : Math.max(...decks.map(d => d.id)) + 1

    const allCardIds = decks.flatMap(d => d.cards.map(c => c.id))
    const nextCardId = allCardIds.length === 0
      ? 1
      : Math.max(...allCardIds) + 1

    const fixedCards = imported.cards.map((card, index) => ({
      ...card,
      id: nextCardId + index
    }))

    const fixedDeck: Deck = {
      ...imported,
      id: nextDeckId,
      cards: fixedCards,
      dateModified: Date.now()
    }

    const updatedDecks = [fixedDeck, ...decks]
    useFlashcardStore.setState({ decks: updatedDecks })
    await db.set('decks', updatedDecks)
  }

  const handleAddDeck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeckTitle.trim()) return
    await addDeck(newDeckTitle.trim())
    setNewDeckTitle('')
  }

  if (view === 'deckView' && selectedDeckId) {
    return (
      <DeckView
        deckId={selectedDeckId}
        onBack={() => setView('deckList')}
        onStudyFull={() => setView('fullStudy')}
        onStudySpaced={() => setView('spacedStudy')}
        onExport={handleExport}
      />
    )
  }

  if (view === 'fullStudy' && selectedDeckId) {
    return (
      <StudyFullDeck
        deckId={selectedDeckId}
        onBack={() => setView('deckView')}
      />
    )
  }

  if (view === 'spacedStudy' && selectedDeckId) {
    return (
      <StudySpacedRepetition
        deckId={selectedDeckId}
        onBack={() => setView('deckView')}
      />
    )
  }

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1
          className="text-[22px] font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Flashcards
        </h1>
        {/* Import button sits in the top right of the header */}
        <button
          onClick={handleImport}
          className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-all duration-150 hover:opacity-80 active:scale-95"
          style={{
            background: 'var(--card)',
            color: 'var(--text-secondary)',
            border: '0.5px solid var(--border)',
          }}
        >
          <FontAwesomeIcon icon={faFileImport} fontSize={13} />
          Import deck
        </button>
      </div>

      {/* New deck form */}
      <form onSubmit={handleAddDeck} className="flex gap-2 mb-6">
        <input
          value={newDeckTitle}
          onChange={e => setNewDeckTitle(e.target.value)}
          placeholder="New deck title..."
          className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] border outline-none transition-all duration-150"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--text-secondary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          type="submit"
          className="rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-95"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          New Deck
        </button>
      </form>

      {/* Deck list */}
      <div className="flex flex-col gap-2">
        {decks.length === 0 && (
          <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            No decks yet — create one above.
          </p>
        )}
        {decks.map(deck => {
          const studyPercentage = deck.cards.length === 0 ? 0
            : Math.round(deck.cards.filter(c => c.easeFactor > 3).length / deck.cards.length * 100)
          const dueCount = deck.cards.filter(c => c.dueDate <= Date.now()).length

          return (
            <div
              key={deck.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border group transition-all duration-150 hover:shadow-md cursor-pointer"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onClick={() => { setSelectedDeckId(deck.id); setView('deckView') }}
            >
              <div className="flex-1">
                <p
                  className="text-[14px] font-medium tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {deck.title}
                </p>
                <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                  {deck.cards.length} cards · {studyPercentage}% mastered · {dueCount} due
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); deleteDeck(deck.id) }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-150 hover:opacity-70"
                style={{ background: 'var(--red)', color: 'white' }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}