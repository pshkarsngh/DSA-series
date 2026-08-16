import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { Card, Difficulty, Pill } from './ui.jsx'

const ROADMAPS = [
  { id: 'must-do', label: 'Must Do' },
  { id: 'priority-tiers', label: 'Priority Tiers' },
]

export default function Topics() {
  const [roadmap, setRoadmap] = useState('must-do')
  const [topics, setTopics] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', topic: '', difficulty: 'medium', description: '', pattern: '' })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setTopics(await api.topics(roadmap))
  }, [roadmap])

  useEffect(() => {
    load()
  }, [load])

  async function toggle(topic, e) {
    e.stopPropagation()
    e.preventDefault()
    const updated = await api.toggleTopic(topic.id, !topic.done)
    setTopics((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  const grouped = useMemo(() => {
    const filtered = topics.filter((t) => {
      if (filter === 'done' && !t.done) return false
      if (filter === 'pending' && t.done) return false
      if (difficulty !== 'all' && t.difficulty !== difficulty) return false
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    const map = new Map()
    for (const t of filtered) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category).push(t)
    }
    return [...map.entries()]
  }, [topics, filter, search, difficulty])

  const done = topics.filter((t) => t.done).length

  async function addProblem(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.topic.trim()) {
      setError('Problem name and topic are required.')
      return
    }
    try {
      const p = await api.createProblem({
        topic: form.topic.trim(),
        name: form.name.trim(),
        difficulty: form.difficulty,
        description: form.description.trim(),
        pattern: form.pattern.trim(),
      })
      setForm({ name: '', topic: '', difficulty: 'medium', description: '', pattern: '' })
      setAdding(false)
      navigate(`/problems/${p.slug}`)
    } catch {
      setError('Could not save the problem. Try again.')
    }
  }

  return (
    <div className="stack">
      <Card title="Add a problem">
        {!adding ? (
          <button className="primary ghost" onClick={() => setAdding(true)}>+ Add a problem</button>
        ) : (
          <form className="problem-form" onSubmit={addProblem}>
            <div className="row">
              <input
                placeholder="Problem name (required)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Topic (required), e.g. Arrays"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <input
              placeholder="Pattern, e.g. Two pointers"
              value={form.pattern}
              onChange={(e) => setForm({ ...form, pattern: e.target.value })}
            />
            <textarea
              rows={3}
              placeholder="Short description of the problem"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {error && <p className="muted" style={{ color: 'var(--red)' }}>{error}</p>}
            <div className="row">
              <button type="submit" className="primary">Save problem</button>
              <button type="button" className="primary ghost" onClick={() => { setAdding(false); setError('') }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      <div className="toolbar">
        <div className="segmented">
          {ROADMAPS.map((r) => (
            <button
              key={r.id}
              className={roadmap === r.id ? 'seg active' : 'seg'}
              onClick={() => setRoadmap(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search topics…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="all">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="card summary">
        <strong>
          {done}/{topics.length} topics done
        </strong>
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{ width: `${topics.length ? (done / topics.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {grouped.map(([category, items]) => (
        <section key={category} className="card">
          <div className="category-head">
            <h2>{category}</h2>
            <span className="muted">
              {items.filter((t) => t.done).length}/{items.length}
            </span>
          </div>
          <ul className="topic-grid">
            {items.map((t) => (
              <li key={t.id}>
                <Link to={`/topics/${t.slug}`} className={`topic-card ${t.done ? 'done' : ''}`}>
                  <span className="topic-check">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) => toggle(t, e)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Mark ${t.name} complete`}
                    />
                  </span>
                  <span className="topic-body">
                    <span className="topic-name">{t.name}</span>
                    <span className="topic-meta">
                      <Difficulty value={t.difficulty} />
                      {t.tier && <Pill>T{t.tier}</Pill>}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}