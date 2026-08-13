const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = new Error(`${res.status} ${res.statusText}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export const api = {
  stats: () => request('/stats'),
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
  topics: (roadmap) =>
    request(`/topics${roadmap ? `?roadmap=${roadmap}` : ''}`),
  topic: (slug) => request(`/topics/${slug}`),
  toggleTopic: (id, done) =>
    request(`/topics/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ done }),
    }),
  problem: (slug) => request(`/problems/${slug}`),
  sessions: () => request('/sessions'),
  session: (id) => request(`/sessions/${id}`),
  createSession: (body) =>
    request('/sessions', { method: 'POST', body: JSON.stringify(body) }),
  updateSession: (id, body) =>
    request(`/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  problems: (sessionId) =>
    request(`/problems${sessionId ? `?session_id=${sessionId}` : ''}`),
  createProblem: (body) =>
    request('/problems', { method: 'POST', body: JSON.stringify(body) }),
  updateProblem: (id, body) =>
    request(`/problems/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProblem: (id) =>
    request(`/problems/${id}`, { method: 'DELETE' }),
}