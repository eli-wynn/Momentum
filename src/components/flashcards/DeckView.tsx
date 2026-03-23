import { useState, useEffect } from 'react'
import { useFlashcardStore } from '../../stores/flashcardStore'

type DeckViewProps = {
  deckId: number
  onBack: () => void
  onStudyFull: () => void
  onStudySpaced: () => void
}

export default function DeckView({ deckId, onBack, onStudyFull, onStudySpaced }: DeckViewProps) {
  const { decks, loaded, loadCards, addCard, deleteCard } = useFlashcardStore()
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [editingCardId, setEditingCardId] = useState<number | null>(null)
  const [editFront, setEditFront] = useState('')
  const [editBack, setEditBack] = useState('')

  useEffect(() => {
    if (!loaded) loadCards()
  }, [])

  const selectedDeck = decks.find(d => d.id === deckId) ?? null
  if (!selectedDeck) return <p style={{ color: 'var(--text-tertiary)' }}>Deck not found.</p>

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFront.trim() || !newBack.trim()) return
    await addCard(newFront.trim(), newBack.trim(), deckId)
    setNewFront('')
    setNewBack('')
  }

  const handleStartEdit = (card: { id: number; front: string; back: string }) => {
    setEditingCardId(card.id)
    setEditFront(card.front)
    setEditBack(card.back)
  }

  const handleSaveEdit = async () => {
    if (!editFront.trim() || !editBack.trim() || editingCardId === null) return
    await useFlashcardStore.getState().editCard(deckId, editingCardId, editFront.trim(), editBack.trim())
    setEditingCardId(null)
    setEditFront('')
    setEditBack('')
  }

  const dueCount = selectedDeck.cards.filter(c => c.dueDate <= Date.now()).length
  const studyPercentage = selectedDeck.cards.length === 0 ? 0
    : Math.round(selectedDeck.cards.filter(c => c.easeFactor > 3).length / selectedDeck.cards.length * 100)

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-[13px] transition hover:opacity-70"
          style={{ color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }}
        >
          ← Back
        </button>
        <h1
          className="text-[22px] font-semibold tracking-tight flex-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {selectedDeck.title}
        </h1>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {selectedDeck.cards.length} cards
        </p>
        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {studyPercentage}% mastered
        </p>
        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {dueCount} due
        </p>
      </div>

      {/* Study buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={onStudyFull}
          disabled={selectedDeck.cards.length === 0}
          className="rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-95 disabled:opacity-40"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          Study All
        </button>
        <button
          onClick={onStudySpaced}
          disabled={dueCount === 0}
          className="rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-95 disabled:opacity-40"
          style={{
            background: 'var(--card)',
            color: 'var(--text-primary)',
            border: '0.5px solid var(--border)',
          }}
        >
          Study Due Cards {dueCount > 0 && `(${dueCount})`}
        </button>
      </div>

      {/* Add card form */}
      <form onSubmit={handleAddCard} className="flex gap-2 mb-6">
        <input
          value={newFront}
          onChange={e => setNewFront(e.target.value)}
          placeholder="Question..."
          className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] border outline-none transition-all duration-150"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--text-secondary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <input
          value={newBack}
          onChange={e => setNewBack(e.target.value)}
          placeholder="Answer..."
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
          Add Card
        </button>
      </form>

      {/* Card list */}
      <div className="flex flex-col gap-2">
        {selectedDeck.cards.length === 0 && (
          <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            No cards yet — add one above.
          </p>
        )}
        {selectedDeck.cards.map(card => (
          <div
            key={card.id}
            className="px-4 py-3 rounded-xl border group transition-all duration-150 hover:shadow-md"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {editingCardId === card.id ? (
              // Edit mode
              <div className="flex flex-col gap-2">
                <input
                  value={editFront}
                  onChange={e => setEditFront(e.target.value)}
                  className="rounded-lg px-3 py-2 text-[13px] border outline-none"
                  style={{
                    background: 'var(--bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <input
                  value={editBack}
                  onChange={e => setEditBack(e.target.value)}
                  className="rounded-lg px-3 py-2 text-[13px] border outline-none"
                  style={{
                    background: 'var(--bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition hover:opacity-80"
                    style={{ background: 'var(--green)', color: 'white' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCardId(null)}
                    className="rounded-lg px-3 py-1.5 text-[12px] transition hover:opacity-70"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                    {card.front}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {card.back}
                  </p>
                </div>
                {/* Ease factor indicator */}
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    background: card.easeFactor > 3 ? 'var(--color-background-success)' : 'var(--color-background-warning)',
                    color: card.easeFactor > 3 ? 'var(--color-text-success)' : 'var(--color-text-warning)',
                  }}
                >
                  {card.easeFactor.toFixed(1)}
                </span>
                {/* Edit button */}
                <button
                  onClick={() => handleStartEdit(card)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-150 hover:opacity-70"
                  style={{ color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); deleteCard(deckId, card.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-150 hover:opacity-70"
                  style={{ background: 'var(--red)', color: 'white' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}