import { useTaskStore, Task } from '../../stores/taskStore'

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTaskStore()

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border group transition-all duration-150 hover:shadow-md"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className="w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          borderColor: task.completed ? '#34c759' : 'var(--text-tertiary)',
          background: task.completed ? '#34c759' : 'transparent',
        }}
      >
        {task.completed && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        className="flex-1 text-[14px] tracking-tight transition-colors duration-150"
        style={{
          color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      >
        {task.text}
      </span>

      {/* Delete — appears on hover */}
      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[11px] px-2 py-0.5 rounded-md"
        style={{ color: 'var(--text-tertiary)' }}
      >
        Delete
      </button>
    </div>
  )
}