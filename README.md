# DSA Series

A full DSA preparation repository: daily practice, roadmap planners, a topic-wise
patterns guide, and a complete full-stack **DSA Tracker** app to track your progress.

## Contents

| Path | What it is |
| ---- | ---------- |
| [`dsa-tracker/`](dsa-tracker/) | Full-stack DSA learning tracker — FastAPI + SQLite backend, React frontend, with dedicated pages for every topic & problem |
| [`DSA-Patterns-Guide/`](DSA-Patterns-Guide/) | Topic-wise technique & pattern reference (foundations, trees, graphs, DP, problem-solving patterns) |
| [`Must Do/`](Must Do/) | Must-do roadmap planner |
| [`Priority Tiers/`](Priority Tiers/) | Priority-tier roadmap planner |
| `DD-MM-YYYY/` | Daily practice folders (one per day's work) |

## DSA Tracker

A full-stack app with a dark, developer-dashboard UI:

- **Dashboard** — topics done, problems solved, streak, study time, weak/strong areas, recommendations
- **Topics** — Must Do & Priority Tiers roadmaps, search + filter, checkbox-only completion
- **Topic pages** — every topic (150+) has a dedicated page: concepts, patterns, worked examples, mistakes, practice problems
- **Problem pages** — description, constraints, hints, approach, complexity, solution, notes
- **Sessions** — timed study sessions with pause/resume, history, and stats

### Run it

```bash
# Terminal 1 — backend on port 8000
cd dsa-tracker/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000

# Terminal 2 — frontend on port 5174
cd dsa-tracker/frontend
npm install
npm run dev
```

Open http://localhost:5174 — first backend start auto-creates `tracker.db` and seeds
all topics with learning content.

## Getting Started

Clone the repo and explore:

```bash
git clone https://github.com/pshkarsngh/DSA-series.git
```