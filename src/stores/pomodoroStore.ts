import { create } from 'zustand'
import { Howl } from 'howler'

export type Mode = 'work' | 'shortBreak' | 'longBreak'
export type WhiteNoiseType = 'none' | 'rain' | 'ocean' | 'white' | 'brown'

export type PomodoroSession = {
  id: number
  mode: Mode
  duration: number
  completedAt: number
}

export const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 25 * 60,
}

const timerEndSound = new Howl({ src: ['/sounds/timer-end.mp3'] })

const noiseSounds: Record<WhiteNoiseType, Howl | null> = {
  none: null,
  rain: new Howl({ src: ['/sounds/rain.mp3'], loop: true, volume: 0.3 }),
  ocean: new Howl({ src: ['/sounds/ocean.mp3'], loop: true, volume: 0.3 }),
  white: new Howl({ src: ['/sounds/white-noise.mp3'], loop: true, volume: 0.3 }),
  brown: new Howl({ src: ['/sounds/brown-noise.mp3'], loop: true, volume: 0.3 }),
}

// Helper to stop all noise sounds
const stopAllNoise = () => {
  Object.values(noiseSounds).forEach(sound => sound?.stop())
}

export type PomodoroStore = {
  mode: Mode
  timeLeft: number
  isRunning: boolean
  workSessionsCompleted: number
  audioOn: boolean
  whiteNoiseType: WhiteNoiseType
  sessions: PomodoroSession[]
  intervalId: ReturnType<typeof setInterval> | null
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  toggleAudio: () => void
  setWhiteNoise: (type: WhiteNoiseType) => void
  skipPhase: () => void
}

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  mode: 'work',
  timeLeft: DURATIONS.work,
  isRunning: false,
  workSessionsCompleted: 0,
  audioOn: true,
  whiteNoiseType: 'none',
  sessions: [],
  intervalId: null,

  start: () => {
    const { isRunning, tick, whiteNoiseType } = get()
    if (isRunning) return

    // Play whichever noise is selected
    if (whiteNoiseType !== 'none') {
      noiseSounds[whiteNoiseType]?.play()
    }

    const id = setInterval(() => tick(), 1000)
    set({ isRunning: true, intervalId: id })
  },

  pause: () => {
    const { intervalId } = get()
    if (intervalId) clearInterval(intervalId)
    stopAllNoise()
    set({ isRunning: false, intervalId: null })
  },

  reset: () => {
    const { intervalId, mode } = get()
    if (intervalId) clearInterval(intervalId)
    stopAllNoise()
    set({ isRunning: false, intervalId: null, timeLeft: DURATIONS[mode] })
  },

  tick: () => {
    const { timeLeft, mode, workSessionsCompleted, sessions, audioOn } = get()

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 })
      return
    }

    const { intervalId } = get()
    if (intervalId) clearInterval(intervalId)
    stopAllNoise()

    if (audioOn) timerEndSound.play()

    const newSession: PomodoroSession = {
      id: sessions.length + 1,
      mode,
      duration: DURATIONS[mode],
      completedAt: Date.now(),
    }

    const newWorkSessions = mode === 'work' ? workSessionsCompleted + 1 : workSessionsCompleted
    const nextMode: Mode = mode === 'work'
      ? newWorkSessions % 4 === 0 ? 'longBreak' : 'shortBreak'
      : 'work'

    set({
      isRunning: false,
      intervalId: null,
      timeLeft: DURATIONS[nextMode],
      mode: nextMode,
      workSessionsCompleted: newWorkSessions,
      sessions: [...sessions, newSession],
    })
  },

  skipPhase: () => {
    const { intervalId, mode, workSessionsCompleted } = get()
    if (intervalId) clearInterval(intervalId)
    stopAllNoise()

    const newWorkSessions = mode === 'work' ? workSessionsCompleted + 1 : workSessionsCompleted
    const nextMode: Mode = mode === 'work'
      ? newWorkSessions % 4 === 0 ? 'longBreak' : 'shortBreak'
      : 'work'

    set({
      isRunning: false,
      intervalId: null,
      timeLeft: DURATIONS[nextMode],
      mode: nextMode,
      workSessionsCompleted: newWorkSessions,
    })
  },

  toggleAudio: () => set(s => ({ audioOn: !s.audioOn })),

  // Stops current noise and starts the new one if timer is running
  setWhiteNoise: (type) => {
    const { isRunning } = get()
    stopAllNoise()
    if (type !== 'none' && isRunning) {
      noiseSounds[type]?.play()
    }
    set({ whiteNoiseType: type })
  },
}))