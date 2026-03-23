import { create } from 'zustand'
import { db } from '../lib/tauriStore'


export type Card = {
    id: number
    front: string
    back: string
    easeFactor: number
    repetitions: number
    interval: number
    dueDate: number
}

export type Deck = {
    id: number
    cards: Card[]
    title: string
    dateModified: number
}

export type FlashcardStore = {
    decks: Deck[]
    selectedDeckId: number | null
    loaded: boolean
    addDeck: (title: string) => Promise<number>
    deleteDeck: (deckId: number) => Promise<void>
    reviewCard: (deckId: number, cardId: number, rating: number) => Promise<void>
    loadCards: () => Promise<void>
    addCard: (front: string, back: string, deckId: number) => Promise<number>
    deleteCard: (deckId: number, cardId: number) => Promise<void>
    editCard: (deckId: number, front: string, back: string, cardId: number) => Promise<void>
    editDeck: (deckId: number, title: string) => Promise<void>
}




export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
    decks: [],
    selectedDeckId: null,
    loaded: false,
    
    loadCards: async () => {
        const saved = await db.get<Deck[]>('decks')
        set({decks: saved ?? [], loaded: true})
    },

    addCard: async (front, back, deckId) => {
    

        const deck = get().decks.find(d => d.id === deckId)
        const cards = deck?.cards ?? []
    
        const nextId = cards.length === 0 ? 1 : Math.max(...cards.map(n => n.id)) + 1
    
        const newCard: Card = {
          id: nextId,
          front,
          back,
          easeFactor: 2.5,
          repetitions: 0,
          interval: 0,
          dueDate: Date.now()
        }
    
        const updated = get().decks.map(d =>
        d.id === deckId 
            ? { ...d, cards: [...d.cards, newCard], dateModified: Date.now() }
            : d
        )
        set({decks: updated})
        await db.set('decks', updated)
        return newCard.id
      },

      addDeck: async (title) => {
        
        const nextId = get().decks.length === 0 ? 1 : Math.max(...get().decks.map(n=> n.id))+ 1
        const newDeck: Deck = {
            id: nextId,
            title: title,
            cards: [],
            dateModified: Date.now()
        }
        const updated = [newDeck, ...get().decks]
        set({decks: updated})
        await db.set('decks', updated)
        return newDeck.id

      },

      deleteCard: async (deckId, cardId) => {
        const updated = get().decks.map(d =>
            d.id === deckId
                ? { ...d, cards: d.cards.filter(c => c.id !== cardId) , dateModified: Date.now() }
                : d
        )
        set ({decks: updated})
        await db.set('decks', updated)
      },

      deleteDeck: async (deckId) => {
        const updated = get().decks.filter(d => d.id !== deckId)
        set ({decks: updated})
        await db.set('decks', updated)
        
      },

      editCard: async (deckId, cardId, front, back) => {
        const updated = get().decks.map(d =>
        d.id === deckId
            ? { ...d, dateModified: Date.now(), cards: d.cards.map(c =>
                c.id === cardId ? { ...c, front, back } : c
            )}
            : d
        )
        set({ decks: updated })
        await db.set('decks', updated)
      },

      editDeck: async (deckId, title) => {
          const updated = get().decks.map(d => d.id === deckId ? {...d, title: title} : d)
          set({decks: updated})
          await db.set('decks', updated)
      },

      reviewCard: async (deckId, cardId, rating) => {
        const updated = get().decks.map(d =>
            d.id === deckId
            ? { ...d, cards: d.cards.map(c =>
                c.id === cardId ? { ...c, ...calculateSM2(c, rating) } : c
                )}
            : d
        )
        set({ decks: updated })
        await db.set('decks', updated)
      },
    

}))

function calculateSM2(card: Card, rating: number): Partial<Card> {
  let { easeFactor, interval, repetitions } = card  // copy the values

  if (rating < 3) {
    repetitions = 0
    interval = 1
  } 
  else {
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)))
    repetitions += 1
    if (repetitions === 1){
        interval = 1
    } 
    else if (repetitions === 2){
        interval = 6
    } 
    else {
        interval = Math.round(interval * easeFactor)
    }
  }

  const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000
  return { easeFactor, interval, repetitions, dueDate }
}