import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Card, StatCard, fmtTime } from './ui.jsx'

export default function Sessions() {
  const [sessions, setSessions] = useState([])
  const [topics, setTopics] = useState([])
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [topicId, setTopicId] = useState('')
  const [targetMinutes, setTargetMinutes] = useState(30)
  const [selectedId, setSelectedId] = useState(null)

  // Active timer state
  const [active, setActive] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const tickRef = useRef(null)

  const loadSessions = useCallback(async () => {
    setSessions(await api.sessions())
  }, [])

  const loadTopics = useCallback(async () => {
    setTopics(await api.topics())
  }, [])

  useEffect(() => {
    loadSessions()
    loadTopics()
  }, [loadSessions, loadTopics])

  // Timer tick
  useEffect(() => {
    if (running && active) {
      tickRef.current = setInterval(() => {
        setElapsed((e) => e + 1)
      }, 1000)
    }
    return () => clearInterval(tickRef.current)
  }, [running, active])

  useEffect(() => {
    const s = sessions.find((x) => x.status === 'active' || x.status === 'paused')
    if (s && !active) {
      setActive(s)
      const started = s.started_at ? new Date(s.started_at).getTime() : Date.now()
      const base = s.duration_seconds || 0
      const live = s.status === 'active' ? Math.floor((Date.now() - started) / 1000) : 0
      setElapsed(base + live)
      setRunning(s.status === 'active')
    }
  }, [sessions, active])

  async function startSession(e) {
    e.preventDefault()
    if (!title.trim()) return
    const s = await api.createSession({
      title,
      notes,
      date,
      topic_id: topicId ? Number(topicId) : null,
      target_minutes: Number(targetMinutes) || 0,
    })
    setTitle('')
    setNotes('')
    setActive(s)
    setElapsed(0)
    setRunning(true)
    await loadSessions()
  }

  async function finishSession() {
    if (!active) return
    const updated = await api.updateSession(active.id, {
      status: 'finished',
      duration_seconds: elapsed,
      ended_at: new Date().toISOString(),
    })
    setActive(null)
    setRunning(false)
    setElapsed(0)
    await loadSessions()
    if (selectedId === updated.id) setSelectedId(null)
  }

  async function togglePause() {
    if (!active) return
    const paused = running
    await api.updateSession(active.id, {
      status: paused ? 'paused' : 'active',
      started_at: paused ? active.started_at : new Date().toISOString(),
      duration_seconds: elapsed,
      ended_at: paused ? new Date().toISOString() : null,
    })
    setRunning(!running)
  }

  function selectSession(id) {
    setSelectedId(id)
  }

  const totalSeconds = sessions
    .filter((s) => s.status === 'finished')
    .reduce((sum, s) => sum + (s.duration_seconds || 0), 0)
  const finished = sessions.filter((s) => s.status === 'finished')
  const avgSeconds = finished.length
    ? Math.round(finished.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / finished.length)
    : 0

  return (
    <div className="stack">
      <div className="grid-4">
        <StatCard label="Total study time" value={fmtTime(totalSeconds)} sub="All sessions" />
        <StatCard label="Sessions completed" value={finished.length} sub={`${new Set(finished.map((s) => s.date)).size} active days`} />
        <StatCard label="Avg session" value={fmtTime(avgSeconds)} sub="Per finished session" />
        <StatCard label="Now" value={active ? (running ? '● running' : '⏸ paused') : 'idle'} sub={active ? active.title : 'Start a session below'} />
      </div>

      <div className="grid-2">
        <Card title={active ? 'Active study session' : 'New study session'}>
          {active ? (
            <div className="stack">
              <div className="timer">
                <div className="timer-time">{fmtTime(elapsed)}</div>
                <div className="muted">
                  {active.title} · target {active.target_minutes}m
                </div>
              </div>
              <div className="row">
                <button className={running ? 'primary ghost' : 'primary'} onClick={togglePause}>
                  {running ? 'Pause' : 'Resume'}
                </button>
                <button className="primary danger-solid" onClick={finishSession}>
                  Finish session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={startSession} className="stack">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <input
                placeholder="Session title — e.g. Sliding Window practice"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                <option value="">General / no topic</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <label className="muted">
                Target duration (minutes)
                <input
                  type="number"
                  min={1}
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(e.target.value)}
                />
              </label>
              <textarea
                placeholder="Notes — what you learned, mistakes to revisit…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
              <button type="submit" className="primary">
                Start session
              </button>
            </form>
          )}
        </Card>

        <Card title="Session history">
          <ul className="session-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  className={`session-btn ${selectedId === s.id ? 'active' : ''}`}
                  onClick={() => selectSession(s.id)}
                >
                  <div className="session-row">
                    <strong>{s.title}</strong>
                    <span className={`pill ${s.status === 'finished' ? 'pill-green' : 'pill-amber'}`}>
                      {s.status}
                    </span>
                  </div>
                  <span className="muted">
                    {s.date} · {fmtTime(s.duration_seconds || 0)}
                    {s.topic_name ? ` · ${s.topic_name}` : ''}
                  </span>
                  {s.notes && <span className="muted session-notes">{s.notes}</span>}
                </button>
              </li>
            ))}
            {sessions.length === 0 && <li className="muted">No sessions yet.</li>}
          </ul>
        </Card>
      </div>

      <Card title="Session details">
        {selectedId ? (
          (() => {
            const s = sessions.find((x) => x.id === selectedId)
            if (!s) return <p className="muted">Select a session.</p>
            return (
              <div className="session-detail">
                <h3>{s.title}</h3>
                <div className="muted">
                  {s.date} · {s.status} · {fmtTime(s.duration_seconds || 0)}
                  {s.topic_name ? ` · ${s.topic_name}` : ''}
                </div>
                {s.notes && <p className="session-notes">{s.notes}</p>}
                {s.topic_id && (
                  <div className="chip-row">
                    {(() => {
                      const tp = topics.find((x) => x.id === s.topic_id)
                      return tp ? <Link to={`/topics/${tp.slug}`} className="chip">{tp.name}</Link> : null
                    })()}
                  </div>
                )}
              </div>
            )
          })()
        ) : (
          <p className="muted">Select a session from the history to view details.</p>
        )}
      </Card>
    </div>
  )
}