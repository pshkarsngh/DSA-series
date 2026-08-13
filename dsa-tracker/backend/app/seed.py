import json
import re
from pathlib import Path

from .db import get_conn

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"

ROADMAPS = [
    {
        "name": "must-do",
        "category": "Foundations",
        "tier": "1",
        "topics": [
            "Time & space complexity (Big O, Omega, Theta)",
            "Recursion",
            "Basic mathematics for programming",
            "Bit manipulation",
        ],
    },
    {
        "name": "must-do",
        "category": "Arrays & Strings",
        "tier": "1",
        "topics": [
            "1D/2D arrays",
            "Prefix sum",
            "Difference arrays",
            "Two pointers",
            "Sliding window",
            "Kadane's algorithm",
            "Sorting-based problems",
            "String manipulation",
            "Frequency counting / hashing",
        ],
    },
    {
        "name": "must-do",
        "category": "Linked Lists",
        "tier": "1",
        "topics": [
            "Singly linked list",
            "Doubly linked list",
            "Circular linked list",
            "Reverse a linked list",
            "Fast & slow pointers",
            "Cycle detection",
            "Merge linked lists",
            "LRU Cache",
        ],
    },
    {
        "name": "must-do",
        "category": "Stack & Queue",
        "tier": "1",
        "topics": [
            "Stack",
            "Queue",
            "Circular queue",
            "Deque",
            "Monotonic stack",
            "Monotonic queue",
            "Next Greater Element",
            "Valid Parentheses",
            "Expression evaluation",
        ],
    },
    {
        "name": "must-do",
        "category": "Hashing",
        "tier": "1",
        "topics": [
            "HashMap / HashSet",
            "Frequency maps",
            "Collision concepts",
            "Hashing with arrays/strings",
            "Prefix-sum + hashing problems",
        ],
    },
    {
        "name": "must-do",
        "category": "Sorting & Searching",
        "tier": "1",
        "topics": [
            "Bubble sort",
            "Selection sort",
            "Insertion sort",
            "Merge sort",
            "Quick sort",
            "Heap sort",
            "Counting sort",
            "Radix sort",
            "Binary search",
            "Lower/upper bound",
            "Binary search on answer",
        ],
    },
    {
        "name": "must-do",
        "category": "Trees",
        "tier": "1",
        "topics": [
            "Binary tree",
            "DFS",
            "BFS / level order",
            "Preorder",
            "Inorder",
            "Postorder",
            "Height/depth",
            "Diameter",
            "Balanced trees",
            "Lowest Common Ancestor",
            "Binary Search Tree",
            "BST operations",
            "Tree views",
            "Tree construction",
            "Serialization/deserialization",
        ],
    },
    {
        "name": "must-do",
        "category": "Heap / Priority Queue",
        "tier": "1",
        "topics": [
            "Min heap",
            "Max heap",
            "Heapify",
            "Priority queue",
            "Top K problems",
            "Kth largest/smallest",
            "Median from data stream",
        ],
    },
    {
        "name": "must-do",
        "category": "Trie",
        "tier": "2",
        "topics": [
            "Trie implementation",
            "Insert/search",
            "Prefix search",
            "Word search",
            "Word Dictionary",
            "Bitwise Trie",
        ],
    },
    {
        "name": "must-do",
        "category": "Graphs",
        "tier": "1",
        "topics": [
            "Graph representation",
            "BFS",
            "DFS",
            "Connected components",
            "Cycle detection",
            "Bipartite graphs",
            "Topological sorting",
            "Kahn's algorithm",
            "Shortest path",
            "Dijkstra",
            "Bellman-Ford",
            "Floyd-Warshall",
            "Minimum Spanning Tree",
            "Prim's",
            "Kruskal's",
            "Disjoint Set Union (DSU)",
            "Strongly Connected Components",
            "Bridges & articulation points",
        ],
    },
    {
        "name": "must-do",
        "category": "Greedy Algorithms",
        "tier": "1",
        "topics": [
            "Activity selection",
            "Fractional Knapsack",
            "Job scheduling",
            "Interval problems",
            "Huffman coding",
            "Greedy + sorting",
        ],
    },
    {
        "name": "must-do",
        "category": "Backtracking",
        "tier": "1",
        "topics": [
            "Subsets",
            "Subsequences",
            "Permutations",
            "Combination Sum",
            "N-Queens",
            "Sudoku",
            "Rat in a Maze",
            "Word Search",
        ],
    },
    {
        "name": "must-do",
        "category": "Dynamic Programming",
        "tier": "1",
        "topics": [
            "Memoization",
            "Tabulation",
            "1D DP",
            "2D DP",
            "Knapsack",
            "Subset Sum",
            "Partition DP",
            "LCS",
            "LIS",
            "Edit Distance",
            "Matrix Chain Multiplication",
            "Grid DP",
            "DP on Trees",
            "DP on Strings",
            "Bitmask DP",
            "Digit DP",
        ],
    },
    {
        "name": "must-do",
        "category": "Advanced topics",
        "tier": "3",
        "topics": [
            "Segment Tree",
            "Fenwick Tree / BIT",
            "Sparse Table",
            "Advanced graph algorithms",
            "Network Flow",
            "Computational geometry basics",
            "KMP, Z algorithm, Rabin-Karp",
            "Rolling hash",
        ],
    },
    {
        "name": "priority-tiers",
        "category": "Tier 1 — Must Master",
        "tier": "1",
        "topics": [
            "Arrays & Strings",
            "Hashing",
            "Two Pointers",
            "Sliding Window",
            "Prefix Sum",
            "Binary Search",
            "Sorting",
            "Stack & Queue",
            "Linked List",
            "Trees",
            "Heap / Priority Queue",
            "BFS / DFS",
        ],
    },
    {
        "name": "priority-tiers",
        "category": "Tier 2 — Become Strong",
        "tier": "2",
        "topics": [
            "Graph algorithms",
            "Dijkstra",
            "Topological Sort",
            "Greedy",
            "Recursion",
            "Backtracking",
            "Dynamic Programming",
        ],
    },
    {
        "name": "priority-tiers",
        "category": "Tier 3 — Learn After Comfortable",
        "tier": "3",
        "topics": [
            "Trie",
            "DSU / Union Find",
            "Segment Tree",
            "Fenwick Tree / BIT",
            "KMP",
            "Rabin-Karp",
            "Strongly Connected Components",
            "Advanced graph algorithms",
        ],
    },
    {
        "name": "priority-tiers",
        "category": "Tier 4 — Advanced / Specialized",
        "tier": "4",
        "topics": [
            "Network Flow",
            "Digit DP",
            "Bitmask DP",
            "Computational Geometry",
            "Sparse Table",
            "Advanced string algorithms",
            "Advanced graph theory",
        ],
    },
]


def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = s.strip("-")
    return s


def load_content():
    """Load all content JSON files into {slug: entry}."""
    entries = {}
    if not CONTENT_DIR.exists():
        return entries
    for path in sorted(CONTENT_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8-sig"))
        except Exception:
            continue
        for entry in data:
            entries[entry["slug"]] = entry
    return entries


def seed(force=False):
    conn = get_conn()
    if force:
        for t in ["topic_mistakes", "topic_examples", "topic_patterns", "topic_concepts",
                  "problem_topics", "problems", "sessions", "topics"]:
            conn.execute(f"DELETE FROM {t}")
        conn.commit()
    count = conn.execute("SELECT COUNT(*) FROM topics").fetchone()[0]
    content = load_content()
    if count:
        conn.close()
        return count

    used_slugs = {}
    inserted = 0
    problems_by_slug = {}

    for roadmap in ROADMAPS:
        for topic in roadmap["topics"]:
            base = slugify(topic)
            slug = base
            if base in used_slugs:
                slug = f"{base}-{roadmap['name']}"
            used_slugs[slug] = True

            entry = content.get(base, {})
            cur = conn.execute(
                "INSERT INTO topics (slug, name, roadmap, tier, category, difficulty, "
                "overview, why, when_use, time_complexity, space_complexity) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    slug,
                    topic,
                    roadmap["name"],
                    roadmap["tier"],
                    roadmap["category"],
                    entry.get("difficulty", "medium"),
                    entry.get("overview", ""),
                    entry.get("why", ""),
                    entry.get("when", ""),
                    (entry.get("complexity") or {}).get("time", ""),
                    (entry.get("complexity") or {}).get("space", ""),
                ),
            )
            topic_id = cur.lastrowid
            inserted += 1

            for i, c in enumerate(entry.get("concepts", [])):
                conn.execute(
                    "INSERT INTO topic_concepts (topic_id, name, description, pos) "
                    "VALUES (?, ?, ?, ?)",
                    (topic_id, c.get("name", ""), c.get("description", ""), i),
                )
            for i, p in enumerate(entry.get("patterns", [])):
                conn.execute(
                    "INSERT INTO topic_patterns (topic_id, name, description, code, pos) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (topic_id, p.get("name", ""), p.get("description", ""), p.get("code", ""), i),
                )
            for i, e in enumerate(entry.get("examples", [])):
                conn.execute(
                    "INSERT INTO topic_examples (topic_id, title, problem, input, output, "
                    "explanation, steps, time_complexity, space_complexity, pos) "
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        topic_id,
                        e.get("title", ""),
                        e.get("problem", ""),
                        e.get("input", ""),
                        e.get("output", ""),
                        e.get("explanation", ""),
                        json.dumps(e.get("steps", [])),
                        (e.get("complexity") or {}).get("time", ""),
                        (e.get("complexity") or {}).get("space", ""),
                        i,
                    ),
                )
            for i, m in enumerate(entry.get("mistakes", [])):
                conn.execute(
                    "INSERT INTO topic_mistakes (topic_id, mistake, fix, pos) "
                    "VALUES (?, ?, ?, ?)",
                    (topic_id, m.get("mistake", ""), m.get("fix", ""), i),
                )

            for p in entry.get("problems", []):
                pslug = p.get("slug", "")
                if not pslug:
                    pslug = slugify(p.get("name", ""))
                if pslug in problems_by_slug:
                    pid = problems_by_slug[pslug]
                else:
                    cur2 = conn.execute(
                        "INSERT INTO problems (slug, topic_id, topic, name, difficulty, "
                        "description, constraints, hints, approach, pattern, time_complexity, "
                        "space_complexity, solution, tags) "
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (
                            pslug,
                            topic_id,
                            topic,
                            p.get("name", ""),
                            p.get("difficulty", "easy"),
                            p.get("description", ""),
                            p.get("constraints", ""),
                            json.dumps(p.get("hints", [])),
                            p.get("approach", ""),
                            p.get("pattern", ""),
                            p.get("time", ""),
                            p.get("space", ""),
                            p.get("solution", ""),
                            json.dumps(p.get("tags", [])),
                        ),
                    )
                    pid = cur2.lastrowid
                    problems_by_slug[pslug] = pid
                conn.execute(
                    "INSERT OR IGNORE INTO problem_topics (problem_id, topic_id) VALUES (?, ?)",
                    (pid, topic_id),
                )

    conn.commit()
    conn.close()
    return inserted


def assign_missing_slugs():
    """Backfill slugs for topics created by the old seeder (no content)."""
    conn = get_conn()
    rows = conn.execute("SELECT id, name FROM topics WHERE slug = '' OR slug IS NULL").fetchall()
    for r in rows:
        conn.execute("UPDATE topics SET slug = ? WHERE id = ?", (slugify(r["name"]), r["id"]))
    conn.commit()
    conn.close()
    return len(rows)