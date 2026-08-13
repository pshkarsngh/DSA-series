import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Difficulty, Pill } from './ui.jsx'

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

  return (
    <div className="stack">
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