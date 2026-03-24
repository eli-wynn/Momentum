import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Tasks from './components/tasks/TaskList'
import Notes from './components/notes/Notes'
import Pomodoro from './components/pomodoro/Pomodoro'
import Flashcards from './components/flashcards/Flashcards'
// import Calculator from './components/calculator/Calculator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all duration-150 ${
        isActive
          ? 'bg-black/7 text-[var(--text-primary)] font-medium'
          : 'text-[var(--text-secondary)] hover:bg-black/4 hover:text-[var(--text-primary)]'
      }`
    }
  >
    <span className="text-[15px]">{icon}</span>
    {label}
  </NavLink>
)

export default function App() {
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <div style={{ background: 'var(--bg)' }} className="h-screen w-screen transition-colors duration-200 flex flex-col">
      <BrowserRouter>

        {/* Topbar */}
        <header
          className="flex items-center px-3 h-10 flex-shrink-0 border-b"
          style={{
            background: 'var(--surface)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md transition hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <aside
            className="flex-shrink-0 flex flex-col gap-0.5 p-3 border-r overflow-hidden transition-all duration-300"
            style={{
              width: sidebarOpen ? '208px' : '0px',
              padding: sidebarOpen ? '' : '0px',
              background: 'var(--surface)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderColor: 'var(--border)',
            }}
          >
            <p
              className="text-[13px] font-semibold px-2 pb-3 tracking-tight whitespace-nowrap"
              style={{ color: 'var(--text-primary)' }}
            >
              Momentum
            </p>

            <NavItem to="/" icon="✓" label="Tasks" />
            <NavItem to="/notes" icon="✎" label="Notes" />
            <NavItem to="/pomodoro" icon="◎" label="Pomodoro" />
            <NavItem to="/flashcards" icon="🂡" label="Flashcards" />
            {/* <NavItem to="/calculator" icon="∑" label="Calculator" /> */}

            <div className="mt-auto flex items-center gap-2 px-2 pb-1">
              <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                {dark ? 'Dark' : 'Light'}
              </span>
              <button
                onClick={() => setDark(!dark)}
                className="relative w-8 h-[18px] rounded-full transition-colors duration-200 flex-shrink-0"
                style={{ background: dark ? '#34c759' : '#d1d1d6' }}
              >
                <span
                  className="absolute top-0.5 left-[1px] w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200"
                  style={{ transform: dark ? 'translateX(14px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-7">
            <Routes>
              <Route path="/" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/flashcards" element={<Flashcards />} />
              {/* <Route path="/calculator" element={<Calculator />} /> */}
            </Routes>
          </main>

        </div>
      </BrowserRouter>
    </div>
  )
}