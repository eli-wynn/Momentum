// src/components/pomodoro/Pomodoro.tsx
import { usePomodoroStore, Mode, WhiteNoiseType, DURATIONS } from '../../stores/pomodoroStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForwardStep, faArrowRotateLeft, faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons'

const modeLabels: Record<Mode, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

const modeColors: Record<Mode, string> = {
  work: '#ef4444',
  shortBreak: '#34c759',
  longBreak: '#378ADD',
}

export default function Pomodoro() {
  const {
    timeLeft,
    mode,
    isRunning,
    workSessionsCompleted,
    sessions,
    start,
    pause,
    reset,
    skipPhase,
    toggleAudio,
    setWhiteNoise,
    audioOn,
    whiteNoiseType,
  } = usePomodoroStore()

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const circumference = 2 * Math.PI * 148

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full">

      {/* Timer centre */}
      <div className="relative flex items-center justify-center">

        {/* Background rings */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="absolute pointer-events-none z-0"
        >
          {/* Outer decorative ring */}
          <circle
            cx="160"
            cy="160"
            r="148"
            fill="none"
            stroke={modeColors[mode]}
            strokeWidth="1"
            opacity="0.15"
          />
          {/* Middle ring */}
          <circle
            cx="160"
            cy="160"
            r="132"
            fill="none"
            stroke={modeColors[mode]}
            strokeWidth="0.5"
            opacity="0.1"
          />
          {/* Progress ring — shrinks as time runs out */}
          <circle
            cx="160"
            cy="160"
            r="148"
            fill="none"
            stroke={modeColors[mode]}
            strokeWidth="3"
            opacity="0.6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - timeLeft / DURATIONS[mode])}
            transform="rotate(-90 160 160)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Timer text sits on top of rings */}
        <div className="flex flex-col items-center gap-3 z-10">
          <p
            className="text-[13px] font-medium uppercase tracking-widest"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {modeLabels[mode]}
          </p>
          <h1
            className="text-[80px] font-semibold tracking-tight tabular-nums"
            style={{ color: modeColors[mode], lineHeight: 1 }}
          >
            {display}
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            {workSessionsCompleted} sessions completed today
          </p>
        </div>

      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-5 mt-10">

        {/* Reset */}
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full flex items-center justify-center transition hover:opacity-70"
          style={{
            background: 'var(--card)',
            border: '0.5px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} />
        </button>

        {/* Start / Pause */}
        <button
          onClick={isRunning ? pause : start}
          className="w-20 h-20 rounded-full flex items-center justify-center text-white font-medium text-[15px] transition active:scale-95 hover:brightness-90"
          style={{ background: modeColors[mode] }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        {/* Skip */}
        <button
          onClick={skipPhase}
          className="w-10 h-10 rounded-full flex items-center justify-center transition hover:opacity-70"
          style={{
            background: 'var(--card)',
            border: '0.5px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </button>

      </div>

      {/* Bottom right — audio controls */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3">

        {/* Notification toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
            Notifications
          </span>
          <button
            onClick={toggleAudio}
            className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-70"
            style={{
              background: audioOn ? 'var(--green)' : 'var(--card)',
              border: '0.5px solid var(--border)',
              color: audioOn ? 'white' : 'var(--text-tertiary)',
            }}
          >
            <FontAwesomeIcon icon={audioOn ? faBell : faBellSlash} fontSize={13} />
          </button>
        </div>

        {/* White noise dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
            White noise
          </span>
          <select
            value={whiteNoiseType}
            onChange={e => setWhiteNoise(e.target.value as WhiteNoiseType)}
            className="text-[12px] rounded-lg px-2 py-1.5 border outline-none transition"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="none">Off</option>
            <option value="rain">Rain</option>
            <option value="ocean">Ocean</option>
            <option value="white">White noise</option>
            <option value="brown">Brown noise</option>
          </select>
        </div>

      </div>

      {/* Bottom left — session history */}
      {sessions.length > 0 && (
        <div className="absolute bottom-6 left-6 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Today's sessions
          </p>
          {[...sessions].reverse().map(session => (
            <div
              key={session.id}
              className="flex items-center gap-2 text-[12px]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: modeColors[session.mode] }}
              />
              <span>{modeLabels[session.mode]}</span>
              <span style={{ color: 'var(--text-tertiary)' }}>
                {new Date(session.completedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}