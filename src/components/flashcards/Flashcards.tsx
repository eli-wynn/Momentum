import { useState, useEffect } from 'react'
import { useFlashcardStore } from '../../stores/flashcardStore'
import DeckView from './DeckView'
import StudyFullDeck from './StudyFullDeck'
import StudySpacedRepetition from './StudySpacedRepetition'

type View = 'deckList' | 'deckView' | 'fullStudy' | 'spacedStudy'

export default function Flashcards() {
  const [view, setView] = useState<View>('deckList')
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null)
  const { decks, loaded, loadCards, addDeck, deleteDeck } = useFlashcardStore()
  const [newDeckTitle, setNewDeckTitle] = useState('')

  useEffect(() => {
    if (!loaded) loadCards()
  }, [])

  if (view === 'deckView' && selectedDeckId) {
    return (
      <DeckView
        deckId={selectedDeckId}
        onBack={() => setView('deckList')}
        onStudyFull={() => setView('fullStudy')}
        onStudySpaced={() => setView('spacedStudy')}
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

  // Default — deck list
  const handleAddDeck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeckTitle.trim()) return
    await addDeck(newDeckTitle.trim())
    setNewDeckTitle('')
  }

  return (
    <div className="max-w-2xl">
      <h1
        className="text-[22px] font-semibold tracking-tight mb-5"
        style={{ color: 'var(--text-primary)' }}
      >
        Flashcards
      </h1>

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
              {/* Deck info */}
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

              {/* Delete button */}
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