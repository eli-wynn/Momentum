import { useState, useEffect } from 'react'
import { useFlashcardStore } from '../../stores/flascardStore'

type View = 'deckList' | 'deckView' | 'fullStudy' | 'spacedStudy'
const [view, setView] = useState<View>('deckList')
const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null)