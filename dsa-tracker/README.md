# DSA Tracker

A full-stack DSA learning platform: roadmap topics, study sessions, and practice problems — each with its own dedicated page, rich learning content, and persistent progress.

## Stack

- **Backend:** FastAPI + SQLite (`backend/`)
- **Frontend:** Vite + React + React Router (`frontend/`)

## Quick start

### 1. Backend (port 8000)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
```

On first run it auto-creates `tracker.db` and seeds 164 topics across both roadmaps
(`Must Do` and `Priority Tiers`) with full learning content — concepts, patterns, worked
examples, common mistakes, and 475+ practice problems. Interactive API docs:
http://localhost:8000/docs

### 2. Frontend (port 5174)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5174

> Port 5174 is pinned to avoid clashing with other Vite projects on 5173.

## Pages / routes

| Route | Page |
| ----- | ---- |
| `/` | Dashboard — progress, streak, study time, weak/strong areas, recommendations |
| `/topics` | Topic list — both roadmaps, search, filter, checkbox-only completion |
| `/topics/:slug` | Dedicated topic page — overview, concepts, patterns, examples, mistakes, practice problems |
| `/topics/:slug/problems/:problemSlug` | Practice problem page |
| `/problems/:problemSlug` | Standalone problem page (from search) |
| `/sessions` | Study sessions — timer with pause/resume, notes, history, stats |

## Features

- **Dashboard** — topics done, problems solved, current streak, total study time, progress
  by tier/roadmap/category, weak & strong areas, recommended next topic, recently completed
  topics and solved problems, current session, recent activity
- **Topic pages** — every one of the 164 topics has a dedicated page with what/why/when,
  time & space complexity, core concepts, patterns with code, worked examples, common
  mistakes, and linked practice problems. Prev/next and related-topic navigation included.
- **Problem pages** — description, constraints, hints, approach, complexities, solution
  explanation, personal notes, related problems, mark-as-solved.
- **Sessions** — start a timed session against a topic, pause/resume, finish, add notes,
  full history with totals and average duration.
- **Search** — the header search box searches topic names, categories, patterns, and
  problem names across the whole catalog; results link to the right page.
- **Progress** — all completion state is persisted to SQLite and reflected everywhere
  (topics page, dashboard, category progress, recommendations, streaks).

## API overview

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/api/stats` | Overall progress + activity + recommendations |
| GET | `/api/topics?roadmap=` | List topics |
| GET | `/api/topics/{slug}` | Topic detail with concepts, patterns, examples, problems |
| POST | `/api/topics/{id}/toggle` | Mark topic done/pending |
| GET | `/api/search?q=` | Search topics, patterns, problems |
| GET | `/api/problems/{slug}` | Problem detail with related problems |
| PATCH | `/api/problems/{id}` | Update status / notes / solved |
| GET/POST | `/api/sessions` | List / create sessions |
| GET/PATCH | `/api/sessions/{id}` | Get / update session (timer state) |
| GET/POST | `/api/problems` | List / create problems |

## Content

Educational content lives in `backend/content/group1.json` … `group9.json` (one file per
topic group). To add a new topic: add it to `ROADMAPS` in `backend/app/seed.py`, author a
matching slug entry in the content JSON, delete `tracker.db` and restart the backend to
reseed.

## Notes

- Data lives in `backend/tracker.db` (SQLite) — delete it and restart the backend to reseed from scratch.
- CORS allows `localhost:5174` and `localhost:5173` for the dev frontend.