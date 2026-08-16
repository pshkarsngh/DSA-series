import json
import os
from datetime import date, datetime, timedelta

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .db import get_conn, init_db
from .seed import assign_missing_slugs, seed

init_db()
seed()
assign_missing_slugs()

app = FastAPI(title="DSA Tracker API")

_cors_origins = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _cors_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Schemas ----------
class TopicOut(BaseModel):
    id: int
    slug: str
    name: str
    roadmap: str
    tier: str | None
    category: str
    difficulty: str
    done: bool


class TopicToggle(BaseModel):
    done: bool


class SessionIn(BaseModel):
    date: str | None = None
    title: str
    notes: str = ""
    topic_id: int | None = None
    target_minutes: int = 0


class SessionOut(BaseModel):
    id: int
    date: str
    title: str
    notes: str
    topic_id: int | None
    topic_name: str | None = None
    target_minutes: int
    status: str
    started_at: str | None
    ended_at: str | None
    duration_seconds: int


class SessionUpdate(BaseModel):
    notes: str | None = None
    status: str | None = None
    started_at: str | None = None
    ended_at: str | None = None
    duration_seconds: int | None = None


class ProblemIn(BaseModel):
    session_id: int | None = None
    topic_id: int | None = None
    topic: str
    name: str
    difficulty: str = "easy"
    status: str = "pending"
    notes: str = ""


class ProblemUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None
    solved: bool | None = None


class TimetableToggle(BaseModel):
    done: bool


def row_to_topic(r):
    return TopicOut(
        id=r["id"],
        slug=r["slug"],
        name=r["name"],
        roadmap=r["roadmap"],
        tier=r["tier"],
        category=r["category"],
        difficulty=r["difficulty"],
        done=bool(r["done"]),
    )


def row_to_session(r):
    return SessionOut(
        id=r["id"],
        date=r["date"],
        title=r["title"],
        notes=r["notes"],
        topic_id=r["topic_id"],
        target_minutes=r["target_minutes"],
        status=r["status"],
        started_at=r["started_at"],
        ended_at=r["ended_at"],
        duration_seconds=r["duration_seconds"],
    )


def row_to_problem(r, topics=None):
    return {
        "id": r["id"],
        "slug": r["slug"],
        "topic": r["topic"],
        "topic_id": r["topic_id"],
        "name": r["name"],
        "difficulty": r["difficulty"],
        "status": r["status"],
        "solved": bool(r["solved"]),
        "description": r["description"],
        "constraints": r["constraints"],
        "hints": json.loads(r["hints"] or "[]"),
        "approach": r["approach"],
        "pattern": r["pattern"],
        "time_complexity": r["time_complexity"],
        "space_complexity": r["space_complexity"],
        "solution": r["solution"],
        "tags": json.loads(r["tags"] or "[]"),
        "notes": r["notes"],
        "topics": topics or [],
    }


# ---------- Topics ----------
@app.get("/api/topics", response_model=list[TopicOut])
def list_topics(roadmap: str | None = None):
    conn = get_conn()
    if roadmap:
        rows = conn.execute(
            "SELECT * FROM topics WHERE roadmap = ? ORDER BY id", (roadmap,)
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM topics ORDER BY id").fetchall()
    conn.close()
    return [row_to_topic(r) for r in rows]


@app.post("/api/topics/{topic_id}/toggle", response_model=TopicOut)
def toggle_topic(topic_id: int, body: TopicToggle):
    conn = get_conn()
    cur = conn.execute(
        "UPDATE topics SET done = ? WHERE id = ?", (1 if body.done else 0, topic_id)
    )
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Topic not found")
    conn.commit()
    row = conn.execute("SELECT * FROM topics WHERE id = ?", (topic_id,)).fetchone()
    conn.close()
    return row_to_topic(row)


@app.get("/api/topics/{slug}")
def topic_detail(slug: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM topics WHERE slug = ?", (slug,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Topic not found")

    topic = row_to_topic(row)

    concepts = [dict(r) for r in conn.execute(
        "SELECT name, description FROM topic_concepts WHERE topic_id = ? ORDER BY pos",
        (row["id"],),
    ).fetchall()]

    patterns = [dict(r) for r in conn.execute(
        "SELECT name, description, code FROM topic_patterns WHERE topic_id = ? ORDER BY pos",
        (row["id"],),
    ).fetchall()]

    examples = []
    for r in conn.execute(
        "SELECT * FROM topic_examples WHERE topic_id = ? ORDER BY pos", (row["id"],)
    ).fetchall():
        d = dict(r)
        d["steps"] = json.loads(d["steps"] or "[]")
        examples.append(d)

    mistakes = [dict(r) for r in conn.execute(
        "SELECT mistake, fix FROM topic_mistakes WHERE topic_id = ? ORDER BY pos",
        (row["id"],),
    ).fetchall()]

    problems = []
    for r in conn.execute(
        "SELECT p.* FROM problems p JOIN problem_topics pt ON pt.problem_id = p.id "
        "WHERE pt.topic_id = ? ORDER BY p.difficulty, p.name",
        (row["id"],),
    ).fetchall():
        problems.append(row_to_problem(r))

    # Prev / next within the same roadmap
    siblings = conn.execute(
        "SELECT id, slug, name, done FROM topics WHERE roadmap = ? ORDER BY id",
        (row["roadmap"],),
    ).fetchall()
    idx = next((i for i, s in enumerate(siblings) if s["id"] == row["id"]), -1)
    prev_topic = dict(siblings[idx - 1]) if idx > 0 else None
    next_topic = dict(siblings[idx + 1]) if idx >= 0 and idx + 1 < len(siblings) else None

    # Related topics sharing the same category
    related = [dict(r) for r in conn.execute(
        "SELECT id, slug, name, difficulty, done FROM topics "
        "WHERE category = ? AND id != ? ORDER BY id LIMIT 6",
        (row["category"], row["id"]),
    ).fetchall()]

    # Weak / strong stats for the category
    cat_stats = conn.execute(
        "SELECT COUNT(*) AS total, SUM(done) AS done FROM topics WHERE category = ?",
        (row["category"],),
    ).fetchone()

    conn.close()
    return {
        "topic": topic,
        "overview": row["overview"],
        "why": row["why"],
        "when": row["when_use"],
        "time_complexity": row["time_complexity"],
        "space_complexity": row["space_complexity"],
        "concepts": concepts,
        "patterns": patterns,
        "examples": examples,
        "mistakes": mistakes,
        "problems": problems,
        "prev_topic": prev_topic,
        "next_topic": next_topic,
        "related_topics": related,
        "category_stats": dict(cat_stats),
    }


# ---------- Search ----------
@app.get("/api/search")
def search(q: str = ""):
    conn = get_conn()
    term = f"%{q}%"
    topics = []
    for r in conn.execute(
        "SELECT id, slug, name, category, difficulty, done FROM topics "
        "WHERE name LIKE ? OR category LIKE ? ORDER BY name LIMIT 30",
        (term, term),
    ).fetchall():
        topics.append(dict(r))

    problems = []
    for r in conn.execute(
        "SELECT id, slug, name, difficulty, solved, pattern, tags FROM problems "
        "WHERE name LIKE ? OR pattern LIKE ? OR tags LIKE ? "
        "ORDER BY name LIMIT 30",
        (term, term, term),
    ).fetchall():
        problems.append(dict(r))

    # Also match topics whose content contains the term (patterns etc.)
    for r in conn.execute(
        "SELECT DISTINCT t.id, t.slug, t.name, t.category, t.difficulty, t.done "
        "FROM topics t JOIN topic_patterns tp ON tp.topic_id = t.id "
        "WHERE tp.name LIKE ? OR tp.description LIKE ? ORDER BY t.name LIMIT 30",
        (term, term),
    ).fetchall():
        if all(t["slug"] != r["slug"] for t in topics):
            topics.append(dict(r))

    conn.close()
    return {"topics": topics, "problems": problems}


# ---------- Problems ----------
@app.get("/api/problems")
def list_problems(session_id: int | None = None, status: str | None = None, topic_id: int | None = None):
    conn = get_conn()
    q = "SELECT * FROM problems WHERE 1=1"
    params = []
    if session_id is not None:
        q += " AND session_id = ?"
        params.append(session_id)
    if status:
        q += " AND status = ?"
        params.append(status)
    if topic_id is not None:
        q += " AND topic_id = ?"
        params.append(topic_id)
    q += " ORDER BY id DESC"
    rows = conn.execute(q, params).fetchall()
    conn.close()
    return [row_to_problem(r) for r in rows]


@app.post("/api/problems")
def create_problem(body: ProblemIn):
    conn = get_conn()
    cur = conn.execute(
        "INSERT INTO problems (session_id, topic_id, topic, name, difficulty, status, notes) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (body.session_id, body.topic_id, body.topic, body.name, body.difficulty, body.status, body.notes),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM problems WHERE id = ?", (cur.lastrowid,)).fetchone()
    conn.close()
    return row_to_problem(row)


@app.get("/api/problems/{slug}")
def problem_detail(slug: str):
    conn = get_conn()
    row = conn.execute("SELECT * FROM problems WHERE slug = ?", (slug,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Problem not found")

    topics = [dict(r) for r in conn.execute(
        "SELECT t.id, t.slug, t.name, t.category FROM topics t "
        "JOIN problem_topics pt ON pt.topic_id = t.id WHERE pt.problem_id = ?",
        (row["id"],),
    ).fetchall()]

    related = []
    tags = json.loads(row["tags"] or "[]")
    for tag in tags:
        for r in conn.execute(
            "SELECT p.id, p.slug, p.name, p.difficulty, p.solved FROM problems p "
            "WHERE p.id != ? AND p.tags LIKE ? LIMIT 6",
            (row["id"], f"%{tag}%"),
        ).fetchall():
            if all(x["id"] != r["id"] for x in related):
                related.append(dict(r))

    session = None
    if row["session_id"]:
        s = conn.execute("SELECT * FROM sessions WHERE id = ?", (row["session_id"],)).fetchone()
        if s:
            session = dict(s)

    conn.close()
    return {**row_to_problem(row, topics=topics), "related_problems": related, "session": session}


@app.patch("/api/problems/{problem_id}")
def update_problem(problem_id: int, body: ProblemUpdate):
    conn = get_conn()
    row = conn.execute("SELECT * FROM problems WHERE id = ?", (problem_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Problem not found")
    new_status = body.status if body.status is not None else row["status"]
    new_notes = body.notes if body.notes is not None else row["notes"]
    new_solved = (1 if body.solved else 0) if body.solved is not None else row["solved"]
    if body.solved is True and new_status == "pending":
        new_status = "solved"
    if body.solved is False and new_status == "solved":
        new_status = "pending"
    conn.execute(
        "UPDATE problems SET status = ?, notes = ?, solved = ? WHERE id = ?",
        (new_status, new_notes, new_solved, problem_id),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM problems WHERE id = ?", (problem_id,)).fetchone()
    conn.close()
    return row_to_problem(row)


@app.delete("/api/problems/{problem_id}")
def delete_problem(problem_id: int):
    conn = get_conn()
    cur = conn.execute("DELETE FROM problems WHERE id = ?", (problem_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        raise HTTPException(status_code=404, detail="Problem not found")
    return {"ok": True}


# ---------- Sessions ----------
@app.get("/api/sessions", response_model=list[SessionOut])
def list_sessions():
    conn = get_conn()
    rows = conn.execute(
        "SELECT s.*, t.name AS topic_name FROM sessions s "
        "LEFT JOIN topics t ON t.id = s.topic_id "
        "ORDER BY s.date DESC, s.id DESC"
    ).fetchall()
    conn.close()
    return [with_topic_name(r) for r in rows]


def with_topic_name(r):
    o = row_to_session(r)
    o.topic_name = r["topic_name"]
    return o


@app.post("/api/sessions", response_model=SessionOut)
def create_session(body: SessionIn):
    conn = get_conn()
    d = body.date or date.today().isoformat()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO sessions (date, title, notes, topic_id, target_minutes, status, started_at, duration_seconds) "
        "VALUES (?, ?, ?, ?, ?, 'finished', ?, 0)",
        (d, body.title, body.notes, body.topic_id, body.target_minutes, now),
    )
    conn.commit()
    row = conn.execute(
        "SELECT s.*, t.name AS topic_name FROM sessions s "
        "LEFT JOIN topics t ON t.id = s.topic_id WHERE s.id = ?",
        (cur.lastrowid,),
    ).fetchone()
    conn.close()
    return with_topic_name(row)


@app.get("/api/sessions/{session_id}", response_model=SessionOut)
def get_session(session_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT s.*, t.name AS topic_name FROM sessions s "
        "LEFT JOIN topics t ON t.id = s.topic_id WHERE s.id = ?",
        (session_id,),
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Session not found")
    return with_topic_name(row)


@app.patch("/api/sessions/{session_id}", response_model=SessionOut)
def update_session(session_id: int, body: SessionUpdate):
    conn = get_conn()
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Session not found")
    notes = body.notes if body.notes is not None else row["notes"]
    status = body.status if body.status is not None else row["status"]
    started_at = body.started_at if body.started_at is not None else row["started_at"]
    ended_at = body.ended_at if body.ended_at is not None else row["ended_at"]
    duration = body.duration_seconds if body.duration_seconds is not None else row["duration_seconds"]
    conn.execute(
        "UPDATE sessions SET notes = ?, status = ?, started_at = ?, ended_at = ?, duration_seconds = ? WHERE id = ?",
        (notes, status, started_at, ended_at, duration, session_id),
    )
    conn.commit()
    row = conn.execute(
        "SELECT s.*, t.name AS topic_name FROM sessions s "
        "LEFT JOIN topics t ON t.id = s.topic_id WHERE s.id = ?",
        (session_id,),
    ).fetchone()
    conn.close()
    return with_topic_name(row)


# ---------- Timetable ----------
TIMETABLE_KEYS = {
    "dsa",
    "system-design",
    "ai-ml",
    "english",
    "web-dev",
    "major-project",
    "aptitude",
}


def timetable_payload(conn, d):
    rows = conn.execute(
        "SELECT slot, done FROM timetable_days WHERE date = ?", (d,)
    ).fetchall()
    slots = {r["slot"]: bool(r["done"]) for r in rows}
    return {
        "date": d,
        "slots": slots,
        "done": sum(1 for v in slots.values() if v),
        "total": len(TIMETABLE_KEYS),
    }


@app.get("/api/timetable/{d}")
def timetable_day(d: str):
    conn = get_conn()
    payload = timetable_payload(conn, d)
    conn.close()
    return payload


@app.patch("/api/timetable/{d}/{slot}")
def timetable_toggle(d: str, slot: str, body: TimetableToggle):
    if slot not in TIMETABLE_KEYS:
        raise HTTPException(status_code=400, detail="Unknown slot")
    conn = get_conn()
    conn.execute(
        "INSERT INTO timetable_days (date, slot, done) VALUES (?, ?, ?) "
        "ON CONFLICT(date, slot) DO UPDATE SET done = excluded.done",
        (d, slot, 1 if body.done else 0),
    )
    conn.commit()
    payload = timetable_payload(conn, d)
    conn.close()
    return payload


@app.get("/api/timetable")
def timetable_summary():
    conn = get_conn()
    rows = conn.execute(
        "SELECT date, COUNT(*) AS done FROM timetable_days WHERE done = 1 "
        "GROUP BY date ORDER BY date DESC"
    ).fetchall()
    conn.close()
    days = [{"date": r["date"], "done": r["done"]} for r in rows]
    active = {r["date"] for r in rows if r["done"] > 0}
    return {"days": days, "streak": compute_streak(active)}


# ---------- Stats ----------
@app.get("/api/stats")
def stats():
    conn = get_conn()
    total = conn.execute("SELECT COUNT(*) FROM topics").fetchone()[0]
    done = conn.execute("SELECT COUNT(*) FROM topics WHERE done = 1").fetchone()[0]

    by_tier = [
        dict(r)
        for r in conn.execute(
            "SELECT tier, COUNT(*) AS total, SUM(done) AS done FROM topics "
            "GROUP BY tier ORDER BY tier"
        ).fetchall()
    ]

    by_roadmap = [
        dict(r)
        for r in conn.execute(
            "SELECT roadmap, COUNT(*) AS total, SUM(done) AS done FROM topics "
            "GROUP BY roadmap"
        ).fetchall()
    ]

    by_category = [
        dict(r)
        for r in conn.execute(
            "SELECT category, COUNT(*) AS total, SUM(done) AS done FROM topics "
            "GROUP BY category"
        ).fetchall()
    ]

    problem_total = conn.execute("SELECT COUNT(*) FROM problems").fetchone()[0]
    problem_by_status = [
        dict(r)
        for r in conn.execute(
            "SELECT status, COUNT(*) AS count FROM problems GROUP BY status"
        ).fetchall()
    ]
    problems_solved = conn.execute("SELECT COUNT(*) FROM problems WHERE solved = 1").fetchone()[0]

    sessions = conn.execute(
        "SELECT COUNT(*) AS count, COUNT(DISTINCT date) AS days FROM sessions"
    ).fetchone()
    total_seconds = conn.execute(
        "SELECT COALESCE(SUM(duration_seconds), 0) FROM sessions WHERE status = 'finished'"
    ).fetchone()[0]
    avg_seconds = conn.execute(
        "SELECT COALESCE(AVG(duration_seconds), 0) FROM sessions WHERE status = 'finished' AND duration_seconds > 0"
    ).fetchone()[0]

    recent = [
        dict(r)
        for r in conn.execute(
            "SELECT s.date AS date, COUNT(*) AS problems FROM problems p "
            "JOIN sessions s ON s.id = p.session_id "
            "GROUP BY s.date ORDER BY s.date DESC LIMIT 7"
        ).fetchall()
    ]

    recent_completed = [dict(r) for r in conn.execute(
        "SELECT slug, name, category, difficulty FROM topics WHERE done = 1 "
        "ORDER BY id DESC LIMIT 6"
    ).fetchall()]

    recent_solved = [dict(r) for r in conn.execute(
        "SELECT slug, name, difficulty, pattern, topic FROM problems WHERE solved = 1 "
        "ORDER BY id DESC LIMIT 6"
    ).fetchall()]

    # Weak / strong categories
    def pct(c):
        return round((c["done"] or 0) / c["total"] * 100) if c["total"] else 0

    cats = sorted(by_category, key=pct)
    weak_areas = [dict(c, percent=pct(c)) for c in cats[:5] if pct(c) < 100]
    strong_areas = [dict(c, percent=pct(c)) for c in cats[-4:] if pct(c) > 0]

    # Recommended next topic: highest priority (lowest tier) not done
    recommended = None
    row = conn.execute(
        "SELECT slug, name, category, difficulty FROM topics WHERE done = 0 "
        "ORDER BY CAST(tier AS INTEGER), id LIMIT 1"
    ).fetchone()
    if row:
        recommended = dict(row)

    # Topics studied most
    top_topics = [dict(r) for r in conn.execute(
        "SELECT t.slug, t.name, COUNT(*) AS sessions FROM sessions s "
        "JOIN topics t ON t.id = s.topic_id "
        "WHERE s.status = 'finished' GROUP BY t.id ORDER BY sessions DESC LIMIT 5"
    ).fetchall()]

    # Streak (consecutive days with finished sessions or solved problems)
    days = set()
    for r in conn.execute("SELECT DISTINCT date FROM sessions WHERE status = 'finished'").fetchall():
        days.add(r["date"])
    for r in conn.execute(
        "SELECT substr(created_at, 1, 10) AS d FROM problems WHERE solved = 1"
    ).fetchall():
        days.add(r["d"])
    streak = compute_streak(days)

    current_session = None
    r = conn.execute(
        "SELECT s.*, t.name AS topic_name FROM sessions s "
        "LEFT JOIN topics t ON t.id = s.topic_id "
        "WHERE s.status = 'active' OR s.status = 'paused' ORDER BY s.id DESC LIMIT 1"
    ).fetchone()
    if r:
        current_session = dict(with_topic_name(r))

    conn.close()
    return {
        "topics": {"total": total, "done": done, "percent": round(done / total * 100, 1) if total else 0},
        "by_tier": by_tier,
        "by_roadmap": by_roadmap,
        "by_category": by_category,
        "problems": {
            "total": problem_total,
            "solved": problems_solved,
            "by_status": problem_by_status,
        },
        "sessions": {
            "total": sessions["count"],
            "days": sessions["days"],
            "total_seconds": total_seconds,
            "avg_seconds": int(avg_seconds),
            "streak": streak,
        },
        "recent_activity": recent,
        "recent_completed": recent_completed,
        "recent_solved": recent_solved,
        "weak_areas": weak_areas,
        "strong_areas": strong_areas,
        "recommended": recommended,
        "top_topics": top_topics,
        "current_session": current_session,
    }


def compute_streak(days):
    if not days:
        return 0
    d = sorted(set(days), reverse=True)
    today = date.today().isoformat()
    if d[0] < today:
        if d[0] != (date.today() - timedelta(days=1)).isoformat():
            return 0
    streak = 0
    cur = datetime.strptime(d[0], "%Y-%m-%d").date() if d[0] else None
    for day in d:
        if cur is None:
            break
        if day == cur.isoformat():
            streak += 1
            cur -= timedelta(days=1)
        else:
            break
    return streak


@app.get("/api/health")
def health():
    return {"status": "ok"}