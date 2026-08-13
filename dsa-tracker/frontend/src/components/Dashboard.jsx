import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { Card, StatCard, Bar, Progress, Difficulty, fmtTime } from './ui.jsx'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  const load = useCallback(async () => {
    setStats(await api.stats())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!stats) {
    return <p className="muted">Loading stats…</p>
  }

  const t = stats.topics
  const pctByTier = stats.by_tier.map((r) => ({
    ...r,
    pct: r.total ? Math.round((r.done / r.total) * 100) : 0,
  }))

  return (
    <div className="stack">
      <section className="grid-4">
        <StatCard label="Topics completed" value={`${t.done}/${t.total}`} sub={`${t.percent}% overall`} />
        <StatCard label="Problems solved" value={stats.problems.solved} sub={`${stats.problems.total} total logged`} />
        <StatCard label="Current streak" value={`${stats.sessions.streak} days`} sub="Sessions or solved problems" />
        <StatCard label="Total study time" value={fmtTime(stats.sessions.total_seconds)} sub={`${stats.sessions.total} sessions`} />
      </section>

      <section className="grid-2">
        <Card title="Progress by tier">
          <div className="stack">
            {pctByTier.map((r) => (
              <Bar key={r.tier} label={`Tier ${r.tier}`} done={r.done} total={r.total} pct={r.pct} />
            ))}
          </div>
        </Card>

        <Card title="By roadmap">
          <div className="stack">
            {stats.by_roadmap.map((r) => (
              <Bar
                key={r.roadmap}
                label={r.roadmap.replace('-', ' ')}
                done={r.done}
                total={r.total}
                pct={r.total ? Math.round((r.done / r.total) * 100) : 0}
              />
            ))}
          </div>
          <div className="section-gap" />
          <Card title="Recommendation">
            {stats.recommended ? (
              <div className="recommend">
                <div className="muted">Next up — highest priority pending topic</div>
                <Link to={`/topics/${stats.recommended.slug}`} className="link strong">
                  {stats.recommended.name}
                </Link>
                <div className="muted">
                  {stats.recommended.category} · <Difficulty value={stats.recommended.difficulty} />
                </div>
              </div>
            ) : (
              <p className="muted">All topics complete — great work!</p>
            )}
          </Card>
        </Card>
      </section>

      <section className="grid-2">
        <Card title="Weak areas">
          {stats.weak_areas.length === 0 ? (
            <p className="muted">No weak areas — you're ahead of the curve.</p>
          ) : (
            <div className="stack">
              {stats.weak_areas.map((c) => (
                <Progress key={c.category} label={c.category} pct={c.percent} />
              ))}
            </div>
          )}
        </Card>

        <Card title="Strong areas">
          {stats.strong_areas.length === 0 ? (
            <p className="muted">Start completing topics to build momentum.</p>
          ) : (
            <div className="stack">
              {stats.strong_areas.map((c) => (
                <Progress key={c.category} label={c.category} pct={c.percent} />
              ))}
            </div>
          )}
        </Card>
      </section>

      <section className="grid-3">
        <Card title="Recently completed topics">
          {stats.recent_completed.length === 0 ? (
            <p className="muted">Nothing completed yet.</p>
          ) : (
            <ul className="plain-list">
              {stats.recent_completed.map((r) => (
                <li key={r.slug}>
                  <Link to={`/topics/${r.slug}`}>{r.name}</Link>
                  <span className="muted">{r.category}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recently solved problems">
          {stats.recent_solved.length === 0 ? (
            <p className="muted">No problems solved yet.</p>
          ) : (
            <ul className="plain-list">
              {stats.recent_solved.map((r) => (
                <li key={r.slug}>
                  <Link to={`/problems/${r.slug}`}>{r.name}</Link>
                  <span className="muted">{r.pattern}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Topics studied most">
          {stats.top_topics.length === 0 ? (
            <p className="muted">No study sessions yet.</p>
          ) : (
            <ul className="plain-list">
              {stats.top_topics.map((r) => (
                <li key={r.slug}>
                  <Link to={`/topics/${r.slug}`}>{r.name}</Link>
                  <span className="muted">{r.sessions} sessions</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {stats.current_session && (
        <Card title="Current study session">
          <div className="current-session">
            <strong>{stats.current_session.title}</strong>
            <span className="muted">
              {stats.current_session.topic_name || 'General'} · {stats.current_session.status}
              {stats.current_session.started_at ? ` · started ${new Date(stats.current_session.started_at).toLocaleTimeString()}` : ''}
            </span>
            <Link to="/sessions" className="link">Go to Sessions →</Link>
          </div>
        </Card>
      )}

      <Card title="Recent activity">
        {stats.recent_activity.length === 0 ? (
          <p className="muted">No sessions yet — log today's work in Sessions.</p>
        ) : (
          <ul className="activity">
            {stats.recent_activity.map((r) => (
              <li key={r.date}>
                <strong>{r.date}</strong>
                <span>{r.problems} problems</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}