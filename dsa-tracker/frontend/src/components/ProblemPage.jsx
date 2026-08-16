import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { Card, Difficulty, Pill } from './ui.jsx'

const PLATFORMS = [
  { name: 'LeetCode', url: (q) => `https://leetcode.com/problemset/?search=${q}` },
  { name: 'GeeksforGeeks', url: (q) => `https://www.geeksforgeeks.org/?s=${q}` },
  { name: 'Codeforces', url: (q) => `https://codeforces.com/problemset?name=${q}` },
  { name: 'HackerRank', url: (q) => `https://www.hackerrank.com/search?query=${q}` },
  { name: 'CodeChef', url: (q) => `https://www.codechef.com/problems?search=${q}` },
  { name: 'HackerEarth', url: (q) => `https://www.hackerearth.com/practice/?search=${q}` },
  { name: 'AtCoder', url: (q) => `https://atcoder.jp/contests/archive?lang=en&keyword=${q}` },
  { name: 'InterviewBit', url: (q) => `https://www.interviewbit.com/practice/?q=${q}` },
  { name: 'Codewars', url: (q) => `https://www.codewars.com/kata/search/?q=${q}` },
]

export default function ProblemPage() {
  const { problemSlug, slug: topicSlug } = useParams()
  const [problem, setProblem] = useState(null)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    try {
      const p = await api.problem(problemSlug)
      setProblem(p)
      setNotes(p.notes || '')
    } catch {
      setError(true)
    }
  }, [problemSlug])

  useEffect(() => {
    load()
  }, [load])

  if (error) {
    return (
      <div className="card stack">
        <h2>Problem not found</h2>
        <p className="muted">This problem doesn't exist or was removed.</p>
        <Link to="/topics" className="link">← Back to Topics</Link>
      </div>
    )
  }

  if (!problem) {
    return <p className="muted">Loading problem…</p>
  }

  const p = problem
  const backHref = topicSlug ? `/topics/${topicSlug}` : '/topics'

  async function toggleSolved() {
    const updated = await api.updateProblem(p.id, { solved: !p.solved })
    setProblem((prev) => ({ ...prev, ...updated }))
  }

  async function saveNotes() {
    const updated = await api.updateProblem(p.id, { notes })
    setProblem((prev) => ({ ...prev, ...updated }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="stack">
      <nav className="crumbs">
        <Link to={backHref} className="link">← {topicSlug ? 'Back to topic' : 'Back to topics'}</Link>
        {p.topics && p.topics[0] && (
          <span className="muted">/ {p.topics[0].name}</span>
        )}
      </nav>

      <section className="card topic-hero">
        <div className="hero-main">
          <div className="hero-tags">
            <Difficulty value={p.difficulty} />
            {p.pattern && <Pill>{p.pattern}</Pill>}
            <Pill className={p.solved ? 'pill-green' : ''}>
              {p.solved ? 'Solved' : p.status}
            </Pill>
          </div>
          <h1>{p.name}</h1>
          <div className="muted">{p.topic}</div>
          <div className="hero-actions">
            <button className={p.solved ? 'primary ghost' : 'primary'} onClick={toggleSolved}>
              {p.solved ? 'Mark unsolved' : 'Mark as solved'}
            </button>
          </div>
        </div>
      </section>

      <Card title="Solve it on a platform">
        <p className="muted">Opens a search for this problem on each platform — pick the one you want to practice on.</p>
        <div className="chip-row platform-row">
          {PLATFORMS.map((pf) => (
            <a
              key={pf.name}
              href={pf.url(encodeURIComponent(p.name))}
              target="_blank"
              rel="noopener noreferrer"
              className="chip platform"
            >
              {pf.name} ↗
            </a>
          ))}
        </div>
      </Card>

      <Card title="Description">
        <p>{p.description || '—'}</p>
      </Card>

      <Card title="Constraints">
        <p className="muted">{p.constraints || '—'}</p>
      </Card>

      <Card title="Hints">
        {p.hints.length === 0 ? (
          <p className="muted">No hints available.</p>
        ) : (
          <ol className="hint-list">
            {p.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
        )}
      </Card>

      <Card title="Approach">
        <p>{p.approach || '—'}</p>
      </Card>

      <div className="grid-2">
        <Card title="Time complexity">
          <code>{p.time_complexity || '—'}</code>
        </Card>
        <Card title="Space complexity">
          <code>{p.space_complexity || '—'}</code>
        </Card>
      </div>

      <Card title="Solution explanation">
        <p>{p.solution || '—'}</p>
      </Card>

      <Card title="Personal notes">
        <textarea
          className="notes-input"
          rows={5}
          placeholder="Write your approach, mistakes, or aha moments here…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button className="primary" onClick={saveNotes}>
          {saved ? 'Saved ✓' : 'Save notes'}
        </button>
      </Card>

      <Card title="Related problems">
        {p.related_problems.length === 0 ? (
          <p className="muted">No related problems found.</p>
        ) : (
          <div className="chip-row">
            {p.related_problems.map((r) => (
              <Link key={r.id} to={`/problems/${r.slug}`} className="chip">
                {r.name}
              </Link>
            ))}
          </div>
        )}
      </Card>

      <section className="card">
        <h2>Explore the topic</h2>
        {p.topics.length > 0 ? (
          <div className="chip-row">
            {p.topics.map((t) => (
              <Link key={t.id} to={`/topics/${t.slug}`} className="chip">
                {t.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No topic pages linked yet.</p>
        )}
      </section>
    </div>
  )
}