import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Topics from './components/Topics.jsx'
import TopicDetail from './components/TopicDetail.jsx'
import ProblemPage from './components/ProblemPage.jsx'
import Sessions from './components/Sessions.jsx'
import Timetable from './components/Timetable.jsx'
import { api } from './api.js'

function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/:slug" element={<TopicDetail />} />
        <Route path="/topics/:slug/problems/:problemSlug" element={<ProblemPage />} />
        <Route path="/problems/:problemSlug" element={<ProblemPage />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

function Header() {
  useScrollToTop()
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [open, setOpen] = useState(false)

  async function onChange(value) {
    setQ(value)
    if (value.trim().length < 2) {
      setResults(null)
      setOpen(false)
      return
    }
    try {
      const r = await api.search(value.trim())
      setResults(r)
      setOpen(true)
    } catch {
      setResults(null)
    }
  }

  return (
    <header className="topbar">
      <div className="brand">
        <Link to="/" className="logo">DSA Tracker</Link>
        <nav className="mainnav">
          <NavLink to="/" end className="nav">Dashboard</NavLink>
          <NavLink to="/topics" className="nav">Topics</NavLink>
          <NavLink to="/sessions" className="nav">Sessions</NavLink>
          <NavLink to="/timetable" className="nav">Timetable</NavLink>
        </nav>
      </div>

      <div className="searchbox" onBlur={() => setTimeout(() => setOpen(false), 150)}>
        <input
          type="search"
          placeholder="Search topics, patterns, problems…"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results && setOpen(true)}
        />
        {open && results && (
          <div className="search-results">
            {results.topics.length > 0 && (
              <div className="search-group">
                <div className="search-group-title">Topics</div>
                {results.topics.slice(0, 6).map((t) => (
                  <Link key={`t${t.id}`} to={`/topics/${t.slug}`} className="search-item">
                    <strong>{t.name}</strong>
                    <span className="muted">{t.category}</span>
                  </Link>
                ))}
              </div>
            )}
            {results.problems.length > 0 && (
              <div className="search-group">
                <div className="search-group-title">Problems</div>
                {results.problems.slice(0, 6).map((p) => (
                  <Link key={`p${p.id}`} to={`/problems/${p.slug}`} className="search-item">
                    <strong>{p.name}</strong>
                    <span className="muted">{p.difficulty} · {p.pattern}</span>
                  </Link>
                ))}
              </div>
            )}
            {results.topics.length === 0 && results.problems.length === 0 && (
              <div className="muted search-empty">No matches for “{q}”.</div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function NotFound() {
  return (
    <div className="card stack">
      <h2>Page not found</h2>
      <p className="muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="link">← Back to Dashboard</Link>
    </div>
  )
}