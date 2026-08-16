import { useCallback, useEffect, useState } from 'react'
import { Card } from './ui.jsx'
import { api } from '../api.js'

const SLOTS = {
  morning: [
    { key: 'dsa', time: '3:00 – 5:30', focus: 'DSA', what: 'Learn pattern → solve new problems → re-solve old problems' },
    { key: 'system-design', time: '5:30 – 6:30', focus: 'System Design', what: 'Learn concepts → make diagrams → explain them' },
    { key: 'ai-ml', time: '6:30 – 7:30', focus: 'AI/ML', what: 'Learn concept → code/practice' },
    { key: 'english', time: '7:30 – 8:00', focus: 'English', what: 'Speaking + reading + writing' },
  ],
  evening: [
    { key: 'web-dev', time: '5:00 – 6:15', focus: 'Web Development', what: 'Learn briefly → code extensively' },
    { key: 'major-project', time: '6:15 – 7:15', focus: 'Major Project', what: 'Build features, debug, integrate' },
    { key: 'aptitude', time: '7:15 – 8:00', focus: 'Aptitude', what: 'Timed problem solving' },
  ],
}

const collegeGaps = [
  'Reviewing DSA notes',
  'Flashcards/recall',
  'Reading English',
  'Thinking about your project',
  'Short aptitude questions',
]

function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function shiftDate(d, days) {
  const c = new Date(d)
  c.setDate(c.getDate() + days)
  return c
}

function fmtLabel(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function ScheduleTable({ rows, slots, onToggle }) {
  return (
    <div className="timetable-table">
      <div className="timetable-row timetable-head">
        <span />
        <span>Time</span>
        <span>Focus</span>
        <span>What to do</span>
      </div>
      {rows.map((r) => {
        const done = !!(slots && slots[r.key])
        return (
          <div key={r.key} className={`timetable-row${done ? ' done' : ''}`}>
            <label className="timetable-check" title={done ? 'Mark not done' : 'Mark done'}>
              <input type="checkbox" checked={done} onChange={(e) => onToggle(r.key, e.target.checked)} />
            </label>
            <span className="timetable-time">{r.time}</span>
            <strong className="timetable-focus">{r.focus}</strong>
            <span className="muted">{r.what}</span>
          </div>
        )
      })}
    </div>
  )
}

function HistoryStrip({ days }) {
  const byDate = {}
  days.forEach((d) => {
    byDate[d.date] = d.done
  })
  const items = []
  for (let i = 13; i >= 0; i--) {
    const d = shiftDate(new Date(), -i)
    const iso = toISODate(d)
    const done = byDate[iso] || 0
    items.push({ iso, label: `${d.getDate()}/${d.getMonth() + 1}`, done })
  }
  return (
    <div className="tt-days">
      {items.map((it) => (
        <div key={it.iso} className={`tt-day${it.done > 0 ? ' on' : ''}`} title={`${it.iso} · ${it.done} blocks done`}>
          <span className="tt-day-label">{it.label}</span>
          <span className="tt-day-dot">{it.done || ''}</span>
        </div>
      ))}
    </div>
  )
}

export default function Timetable() {
  const [date, setDate] = useState(() => new Date())
  const [day, setDay] = useState(null)
  const [summary, setSummary] = useState(null)
  const todayIso = toISODate(new Date())

  const loadDay = useCallback(async (d) => {
    setDay(await api.timetableDay(toISODate(d)))
  }, [])

  useEffect(() => {
    loadDay(date)
  }, [date, loadDay])

  useEffect(() => {
    api.timetableSummary().then(setSummary).catch(() => {})
  }, [day])

  async function toggle(key, done) {
    try {
      const next = await api.timetableToggle(toISODate(date), key, done)
      setDay(next)
    } catch {
      setDay((prev) => ({ ...prev, slots: { ...prev.slots, [key]: !done } }))
    }
  }

  const isToday = toISODate(date) === todayIso
  const pct = day && day.total ? Math.round((day.done / day.total) * 100) : 0

  return (
    <div className="stack">
      <Card title="Your Daily Timetable">
        <div className="timetable-actions">
          <div className="row">
            <button className="seg" onClick={() => setDate(shiftDate(date, -1))}>← Prev</button>
            <button className="seg" onClick={() => setDate(new Date())} disabled={isToday}>Today</button>
            <button className="seg" onClick={() => setDate(shiftDate(date, 1))}>Next →</button>
          </div>
          <div className="timetable-date">
            <strong>{fmtLabel(date)}</strong>
            {isToday && <span className="pill pill-green">Today</span>}
          </div>
        </div>
        {day && (
          <div className="timetable-progress">
            <span className="timetable-progress-label">
              {day.done}/{day.total} blocks done
            </span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </Card>

      <Card title="Morning — 3:00 AM to 8:00 AM">
        <ScheduleTable rows={SLOTS.morning} slots={day?.slots} onToggle={toggle} />
      </Card>

      <Card title="College — 9:00 AM to 5:00 PM">
        <p className="muted">During small gaps at college, don't force heavy studying. If you have free time, use it for:</p>
        <ul className="timetable-list">
          {collegeGaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </Card>

      <Card title="Evening — 5:00 PM to 8:00 PM">
        <p className="muted">This is your big-screen practical session.</p>
        <ScheduleTable rows={SLOTS.evening} slots={day?.slots} onToggle={toggle} />
      </Card>

      <Card title="Night">
        <ul className="timetable-list">
          <li>8:00 – 8:30 PM → Dinner + wind down</li>
          <li>8:30 PM → Sleep</li>
        </ul>
        <p className="muted">
          Try to get 7+ hours of sleep if possible. If you sleep at 8:30 PM, starting at 3:30 AM would give you 7 hours.
        </p>
      </Card>

      <Card title={`Last 14 days${summary ? ` · ${summary.streak}-day streak` : ''}`}>
        <HistoryStrip days={summary?.days || []} />
        <p className="muted">Mark a block done each day — the strip shows how many of the 7 blocks you completed.</p>
      </Card>
    </div>
  )
}