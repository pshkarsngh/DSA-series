import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { Card, Difficulty, Pill, Progress } from './ui.jsx'

export default function TopicDetail() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [topic, setTopic] = useState(null)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ name: '', difficulty: 'medium', description: '', pattern: '' })
  const [adding, setAdding] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api.topic(slug)
      setData(d)
      setTopic(d.topic)
    } catch {
      setError(true)
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  if (error) {
    return (
      <div className="card stack">
        <h2>Topic not found</h2>
        <p className="muted">This topic doesn't exist.</p>
        <Link to="/topics" className="link">← Back to Topics</Link>
      </div>
    )
  }

  if (!data || !topic) {
    return <p className="muted">Loading topic…</p>
  }

  const t = topic
  const catStats = data.category_stats
  const pct = catStats.total ? Math.round((catStats.done || 0) / catStats.total * 100) : 0

  async function addProblem(e) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) {
      setFormError('Problem name is required.')
      return
    }
    try {
      await api.createProblem({
        topic_id: t.id,
        topic: t.name,
        name: form.name.trim(),
        difficulty: form.difficulty,
        description: form.description.trim(),
        pattern: form.pattern.trim(),
      })
      setForm({ name: '', difficulty: 'medium', description: '', pattern: '' })
      setAdding(false)
      load()
    } catch {
      setFormError('Could not save the problem. Try again.')
    }
  }

  async function toggleDone() {
    const updated = await api.toggleTopic(t.id, !t.done)
    setTopic(updated)
  }

  async function toggleProblem(problem) {
    const updated = await api.updateProblem(problem.id, { solved: !problem.solved })
    setData((prev) => ({
      ...prev,
      problems: prev.problems.map((p) => (p.id === updated.id ? updated : p)),
    }))
  }

  const doneProblems = data.problems.filter((p) => p.solved).length

  return (
    <div className="stack">
      <nav className="crumbs">
        <Link to="/topics" className="link">← Topics</Link>
        <span className="muted">/ {t.category}</span>
      </nav>

      <section className="card topic-hero">
        <div className="hero-main">
          <div className="hero-tags">
            <Difficulty value={t.difficulty} />
            {t.tier && <Pill>Tier {t.tier}</Pill>}
            <Pill>{t.roadmap.replace('-', ' ')}</Pill>
            <Pill className={t.done ? 'pill-green' : ''}>{t.done ? 'Completed' : 'Pending'}</Pill>
          </div>
          <h1>{t.name}</h1>
          <div className="muted">{t.category}</div>
          <div className="hero-actions">
            <button
              className={t.done ? 'primary ghost' : 'primary'}
              onClick={toggleDone}
            >
              {t.done ? 'Mark as incomplete' : 'Mark as complete'}
            </button>
            <Link to={`/topics/${t.slug}/problems`} className="link">
              {doneProblems}/{data.problems.length} problems solved →
            </Link>
          </div>
        </div>
        <div className="hero-progress">
          <Progress label={`${t.category} progress`} pct={pct} />
          <div className="muted">
            {catStats.done || 0} of {catStats.total} topics in this category complete
          </div>
        </div>
      </section>

      <div className="grid-2">
        <Card title="Overview">
          <div className="overview-block">
            <h3>What this topic is</h3>
            <p>{data.overview || 'No description available yet.'}</p>
          </div>
          <div className="overview-block">
            <h3>Why it matters</h3>
            <p>{data.why || '—'}</p>
          </div>
          <div className="overview-block">
            <h3>When to use it</h3>
            <p>{data.when || '—'}</p>
          </div>
        </Card>

        <Card title="Complexity">
          <div className="complexity">
            <div className="comp-row">
              <span>Time complexity</span>
              <code>{data.time_complexity || '—'}</code>
            </div>
            <div className="comp-row">
              <span>Space complexity</span>
              <code>{data.space_complexity || '—'}</code>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Core concepts">
        <ul className="concept-list">
          {data.concepts.length === 0 && <li className="muted">No concepts yet.</li>}
          {data.concepts.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong>
              <span>{c.description}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Patterns & templates">
        {data.patterns.length === 0 && <p className="muted">No patterns yet.</p>}
        <div className="pattern-grid">
          {data.patterns.map((p) => (
            <div key={p.name} className="pattern-card">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              {p.code && <pre><code>{p.code}</code></pre>}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Worked examples">
        {data.examples.length === 0 && <p className="muted">No examples yet.</p>}
        <div className="example-list">
          {data.examples.map((ex, i) => (
            <div key={ex.title} className="example">
              <div className="example-head">
                <h3>{i + 1}. {ex.title}</h3>
                <div className="muted">
                  {ex.time_complexity && <span>Time {ex.time_complexity} · </span>}
                  {ex.space_complexity && <span>Space {ex.space_complexity}</span>}
                </div>
              </div>
              <p className="example-problem">{ex.problem}</p>
              <div className="example-io">
                {ex.input && (
                  <div><span className="muted">Input</span><pre><code>{ex.input}</code></pre></div>
                )}
                {ex.output && (
                  <div><span className="muted">Output</span><pre><code>{ex.output}</code></pre></div>
                )}
              </div>
              {ex.explanation && <p>{ex.explanation}</p>}
              {ex.steps && ex.steps.length > 0 && (
                <ol className="steps">
                  {ex.steps.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Common mistakes">
        <ul className="mistake-list">
          {data.mistakes.length === 0 && <li className="muted">No mistakes listed yet.</li>}
          {data.mistakes.map((m) => (
            <li key={m.mistake}>
              <div><strong>✕</strong> {m.mistake}</div>
              <div className="fix"><strong>✓</strong> {m.fix}</div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={`Practice problems (${doneProblems}/${data.problems.length} solved)`}>
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
            {formError && <p className="muted" style={{ color: 'var(--red)' }}>{formError}</p>}
            <div className="row">
              <button type="submit" className="primary">Save problem</button>
              <button type="button" className="primary ghost" onClick={() => { setAdding(false); setFormError('') }}>
                Cancel
              </button>
            </div>
          </form>
        )}
        <ul className="problem-cards">
          {data.problems.length === 0 && <li className="muted">No problems yet.</li>}
          {data.problems.map((p) => (
            <li key={p.id}>
              <Link to={`/topics/${t.slug}/problems/${p.slug}`} className={`problem-card ${p.solved ? 'solved' : ''}`}>
                <input
                  type="checkbox"
                  checked={p.solved}
                  onClick={(e) => e.preventDefault()}
                  onChange={() => toggleProblem(p)}
                  aria-label={`Mark ${p.name} solved`}
                />
                <div className="pc-body">
                  <strong>{p.name}</strong>
                  <span className="muted">
                    {p.description}
                  </span>
                  <span className="pc-meta">
                    <Difficulty value={p.difficulty} />
                    {p.pattern && <Pill>{p.pattern}</Pill>}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <section className="card">
        <h2>Keep exploring</h2>
        <div className="pager">
          {data.prev_topic ? (
            <Link to={`/topics/${data.prev_topic.slug}`} className="pager-btn">
              <span className="muted">← Previous</span>
              <strong>{data.prev_topic.name}</strong>
            </Link>
          ) : <span />}
          {data.next_topic ? (
            <Link to={`/topics/${data.next_topic.slug}`} className="pager-btn right">
              <span className="muted">Next →</span>
              <strong>{data.next_topic.name}</strong>
            </Link>
          ) : <span />}
        </div>
        <div className="related">
          <div className="muted">Related topics</div>
          <div className="chip-row">
            {data.related_topics.map((r) => (
              <Link key={r.id} to={`/topics/${r.slug}`} className="chip">
                {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}