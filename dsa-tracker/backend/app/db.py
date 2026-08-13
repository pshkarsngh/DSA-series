import os
import sqlite3
from pathlib import Path

_default_db = Path(__file__).resolve().parent.parent / "tracker.db"
_env_db = os.environ.get("DB_PATH")
if _env_db:
    _p = Path(_env_db)
    try:
        _p.parent.mkdir(parents=True, exist_ok=True)
        _default_db = _p
    except OSError:
        pass
DB_PATH = _default_db


def get_conn():
    try:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    except OSError:
        pass
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_conn()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT NOT NULL,
            name TEXT NOT NULL,
            roadmap TEXT NOT NULL,
            tier TEXT,
            category TEXT,
            difficulty TEXT DEFAULT 'medium',
            overview TEXT DEFAULT '',
            why TEXT DEFAULT '',
            when_use TEXT DEFAULT '',
            time_complexity TEXT DEFAULT '',
            space_complexity TEXT DEFAULT '',
            done INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS topic_concepts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            pos INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS topic_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            code TEXT DEFAULT '',
            pos INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS topic_examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            problem TEXT NOT NULL,
            input TEXT DEFAULT '',
            output TEXT DEFAULT '',
            explanation TEXT DEFAULT '',
            steps TEXT DEFAULT '[]',
            time_complexity TEXT DEFAULT '',
            space_complexity TEXT DEFAULT '',
            pos INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS topic_mistakes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL,
            mistake TEXT NOT NULL,
            fix TEXT NOT NULL,
            pos INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT,
            session_id INTEGER,
            topic_id INTEGER,
            topic TEXT NOT NULL,
            name TEXT NOT NULL,
            difficulty TEXT NOT NULL DEFAULT 'easy',
            status TEXT NOT NULL DEFAULT 'pending',
            description TEXT DEFAULT '',
            constraints TEXT DEFAULT '',
            hints TEXT DEFAULT '[]',
            approach TEXT DEFAULT '',
            pattern TEXT DEFAULT '',
            time_complexity TEXT DEFAULT '',
            space_complexity TEXT DEFAULT '',
            solution TEXT DEFAULT '',
            tags TEXT DEFAULT '[]',
            notes TEXT DEFAULT '',
            solved INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            notes TEXT DEFAULT '',
            topic_id INTEGER,
            target_minutes INTEGER DEFAULT 0,
            status TEXT DEFAULT 'finished',
            started_at TEXT,
            ended_at TEXT,
            duration_seconds INTEGER DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS problem_topics (
            problem_id INTEGER NOT NULL,
            topic_id INTEGER NOT NULL,
            PRIMARY KEY (problem_id, topic_id),
            FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        );
        """
    )
    migrate(conn)
    conn.commit()
    conn.close()


def migrate(conn):
    """Add missing columns to existing tables (idempotent upgrades)."""
    def columns(table):
        return {r[1] for r in conn.execute(f"PRAGMA table_info({table})").fetchall()}

    topic_cols = columns("topics")
    for col, ddl in [
        ("slug", "TEXT NOT NULL DEFAULT ''"),
        ("difficulty", "TEXT DEFAULT 'medium'"),
        ("overview", "TEXT DEFAULT ''"),
        ("why", "TEXT DEFAULT ''"),
        ("when_use", "TEXT DEFAULT ''"),
        ("time_complexity", "TEXT DEFAULT ''"),
        ("space_complexity", "TEXT DEFAULT ''"),
    ]:
        if col not in topic_cols:
            conn.execute(f"ALTER TABLE topics ADD COLUMN {col} {ddl}")

    prob_cols = columns("problems")
    for col, ddl in [
        ("slug", "TEXT"),
        ("topic_id", "INTEGER"),
        ("description", "TEXT DEFAULT ''"),
        ("constraints", "TEXT DEFAULT ''"),
        ("hints", "TEXT DEFAULT '[]'"),
        ("approach", "TEXT DEFAULT ''"),
        ("pattern", "TEXT DEFAULT ''"),
        ("time_complexity", "TEXT DEFAULT ''"),
        ("space_complexity", "TEXT DEFAULT ''"),
        ("solution", "TEXT DEFAULT ''"),
        ("tags", "TEXT DEFAULT '[]'"),
        ("solved", "INTEGER NOT NULL DEFAULT 0"),
    ]:
        if col not in prob_cols:
            conn.execute(f"ALTER TABLE problems ADD COLUMN {col} {ddl}")

    sess_cols = columns("sessions")
    for col, ddl in [
        ("topic_id", "INTEGER"),
        ("target_minutes", "INTEGER DEFAULT 0"),
        ("status", "TEXT DEFAULT 'finished'"),
        ("started_at", "TEXT"),
        ("ended_at", "TEXT"),
        ("duration_seconds", "INTEGER DEFAULT 0"),
    ]:
        if col not in sess_cols:
            conn.execute(f"ALTER TABLE sessions ADD COLUMN {col} {ddl}")