import { useState, useEffect } from 'react'
import { useFlashcardStore } from '../../stores/flashcardStore'

type StudySRProps = {
  deckId: number
  onBack: () => void
}

const ratingColors: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#84cc16',
  5: '#34c759',
}

const ratingLabels: Record<number, string> = {
  1: 'Unknown',
  2: 'Wrong',
  3: 'Hard',
  4: 'Good',
  5: 'Perfect',
}

export default function StudySpacedRepetition({ deckId, onBack }: StudySRProps) {
  const { decks, loaded, loadCards, reviewCard } = useFlashcardStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [ratings, setRatings] = useState<Record<number, number>>({})

  useEffect(() => {
    if (!loaded) loadCards()
  }, [])

  const deck = decks.find(d => d.id === deckId) ?? null
  if (!deck) return <p style={{ color: 'var(--text-tertiary)' }}>Deck not found.</p>

  const cards = deck.cards
  const dueCards = cards.filter(c => c.dueDate <= Date.now())
  const currentCard = dueCards[currentIndex]

  const handleRate = async (rating: number) => {
    await reviewCard(deckId, currentCard.id, rating)
    setRatings(prev => ({ ...prev, [currentCard.id]: rating }))

    if (currentIndex + 1 >= dueCards.length) {
      setIsFinished(true)
    } else {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  // Results screen
  if (isFinished) {
    const ratingValues = Object.values(ratings)
    const average = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    const mastered = ratingValues.filter(r => r >= 4).length
    const struggling = ratingValues.filter(r => r < 3).length

    return (
      <div className="max-w-lg mx-auto flex flex-col items-center gap-6 pt-16">
        <h1
          className="text-[28px] font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Session complete
        </h1>
        <p className="text-[15px]" style={{ color: 'var(--text-tertiary)' }}>
          You studied all {dueCards.length} cards that were due, come back in a few days to study more
        </p>

        {/* Stats */}
        <div className="w-full flex gap-3">
          <div
            className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-[24px] font-semibold" style={{ color: '#34c759' }}>
              {mastered}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Mastered</p>
          </div>
          <div
            className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-[24px] font-semibold" style={{ color: '#ef4444' }}>
              {struggling}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Struggling</p>
          </div>
          <div
            className="flex-1 rounded-xl p-4 flex flex-col items-center gap-1"
            style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}
          >
            <p className="text-[24px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {average.toFixed(1)}
            </p>
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Avg rating</p>
          </div>
        </div>

        {/* Per card breakdown */}
        <div className="w-full flex flex-col gap-2">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Card breakdown
          </p>
          {dueCards.map(card => (
            <div
              key={card.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex-1">
                <p className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                  {card.front}
                </p>
              </div>
              <span
                className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: ratingColors[ratings[card.id]] + '22',
                  color: ratingColors[ratings[card.id]],
                }}
              >
                {ratingLabels[ratings[card.id]]}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                Due {new Date(card.dueDate).toLocaleDateString()}
            </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="rounded-xl px-4 py-2.5 text-[13px] font-medium transition active:scale-95"
            style={{
              background: 'var(--card)',
              color: 'var(--text-primary)',
              border: '0.5px solid var(--border)',
            }}
          >
            Back to deck
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0)
              setIsFlipped(false)
              setIsFinished(false)
              setRatings({})
            }}
            className="rounded-xl px-4 py-2.5 text-[13px] font-medium transition active:scale-95"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            Study again
          </button>
        </div>
      </div>
    )
  }

  // Study screen
  return (
    <div className="max-w-lg mx-auto flex flex-col items-center gap-6 pt-10">

      {/* Header */}
      <div className="w-full flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-[13px] transition hover:opacity-70"
          style={{ color: 'var(--text-secondary)', border: '0.5px solid var(--border)' }}
        >
          ← Back
        </button>
        <p className="text-[13px] flex-1" style={{ color: 'var(--text-tertiary)' }}>
          {deck.title}
        </p>
        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {currentIndex + 1} / {dueCards.length}
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(currentIndex / dueCards.length) * 100}%`,
            background: 'var(--accent)',
          }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full min-h-64 rounded-2xl border flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-150 hover:shadow-md"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {isFlipped ? 'Answer' : 'Question'}
        </p>
        <p
          className="text-[20px] font-medium text-center tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {isFlipped ? currentCard.back : currentCard.front}
        </p>
        {!isFlipped && (
          <p className="text-[12px] mt-6" style={{ color: 'var(--text-tertiary)' }}>
            Click to reveal answer
          </p>
        )}
      </div>

      {/* Rating buttons — only show after flip */}
      {isFlipped && (
        <div className="w-full flex flex-col gap-2">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider text-center"
            style={{ color: 'var(--text-tertiary)' }}
          >
            How well did you know it?
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className="flex-1 py-3 rounded-xl text-[13px] font-medium transition-all duration-150 active:scale-95 hover:opacity-90 flex flex-col items-center gap-1"
                style={{ background: ratingColors[rating], color: 'white' }}
              >
                <span className="text-[16px] font-semibold">{rating}</span>
                <span className="text-[10px] opacity-80">{ratingLabels[rating]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}