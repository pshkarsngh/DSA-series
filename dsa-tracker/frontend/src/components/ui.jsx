export function Card({ title, children, className = '', ...rest }) {
  return (
    <section className={`card ${className}`} {...rest}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="card stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="muted">{sub}</div>}
    </div>
  )
}

export function Bar({ label, done, total, pct }) {
  return (
    <div className="bar">
      <div className="bar-head">
        <span>{label}</span>
        <span className="muted">
          {done}/{total}
        </span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Progress({ pct, label }) {
  return (
    <div className="bar">
      {label && (
        <div className="bar-head">
          <span>{label}</span>
          <span className="muted">{pct}%</span>
        </div>
      )}
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Pill({ children, className = '' }) {
  return <span className={`pill ${className}`}>{children}</span>
}

export function Difficulty({ value }) {
  const cls = value ? `diff ${value}` : 'diff'
  return <span className={cls}>{value}</span>
}

export const fmtTime = (seconds) => {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h) return `${h}h ${m}m`
  if (m) return `${m}m ${s}s`
  return `${s}s`
}
