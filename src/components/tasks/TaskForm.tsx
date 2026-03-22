import { useState } from 'react'
import { useTaskStore } from '../../stores/taskStore'

export default function TaskForm() {
  const [text, setText] = useState('')
  const addTask = useTaskStore(s => s.addTask)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    await addTask(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] border outline-none transition-all duration-150"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--text-secondary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      <button
        type="submit"
        className="rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-95"
        style={{ background: 'var(--accent)', color: 'var(--bg)' }}
      >
        Add
      </button>
    </form>
  )
}