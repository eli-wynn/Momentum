import { useEffect } from 'react'
import { useTaskStore } from '../../stores/taskStore'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

export default function TaskList() {
  const { tasks, loaded, loadTasks } = useTaskStore()

  useEffect(() => {
    if (!loaded) loadTasks()
  }, [])

  const incomplete = tasks.filter(t => !t.completed)
  const complete = tasks.filter(t => t.completed)

  return (
    <div className="max-w-xl">
      <h1
        className="text-[22px] font-semibold tracking-tight mb-5"
        style={{ color: 'var(--text-primary)' }}
      >
        Tasks
      </h1>

      <TaskForm />

      <div className="flex flex-col gap-2">
        {incomplete.map(task => <TaskItem key={task.id} task={task} />)}
      </div>

      {complete.length > 0 && (
        <>
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mt-5 mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Completed
          </p>
          <div className="flex flex-col gap-2">
            {complete.map(task => <TaskItem key={task.id} task={task} />)}
          </div>
        </>
      )}

      {tasks.length === 0 && (
        <p className="text-[13px] mt-4" style={{ color: 'var(--text-tertiary)' }}>
          No tasks yet — add one above.
        </p>
      )}
    </div>
  )
}