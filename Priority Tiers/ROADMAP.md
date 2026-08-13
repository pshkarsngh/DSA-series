# Priority Tiers — DSA for Development + Interviews

Separates the full DSA syllabus by real-world usefulness and interview frequency.
Tiers are priority levels, not just difficulty.

## 🟢 Tier 1 — Must Master (spend ~50% of time)

Foundation of DSA. Appears constantly in interviews and real software.

- [ ] Arrays & Strings
- [ ] Hashing (HashMap / HashSet / frequency map)
- [ ] Two Pointers
- [ ] Sliding Window
- [ ] Prefix Sum
- [ ] Binary Search
- [ ] Sorting
- [ ] Stack & Queue (incl. Deque)
- [ ] Linked List (reverse, fast/slow, cycle)
- [ ] Trees (DFS, BFS, traversals, BST)
- [ ] Heap / Priority Queue
- [ ] BFS / DFS

**Goal:** Solve common easy + medium problems without much help.

**Must-practice problems:**
- Two Sum, 3Sum
- Maximum Subarray (Kadane)
- Best Time to Buy and Sell Stock
- Longest Substring Without Repeating Characters
- Product of Array Except Self
- Merge Intervals
- Rotate Array
- Next Greater Element (monotonic stack)
- Valid Parentheses
- Find duplicates / frequency counting

## 🟡 Tier 2 — Become Strong (spend ~30–35% of time)

Builds on Tier 1. Needs problem-solving ability more than memorization.

- [ ] Graph algorithms (representation, connected components, cycle detection)
- [ ] Dijkstra
- [ ] Topological Sort
- [ ] Greedy (activity selection, intervals, jump game, job sequencing)
- [ ] Recursion (subsets, permutations, combinations)
- [ ] Backtracking (N-Queens, Sudoku, Word Search, Combination Sum)
- [ ] Dynamic Programming (1D, 2D, knapsack, subset sum, coin change, LCS, LIS, edit distance, grid DP)

**DP thinking:** State → Transition → Base Case → Answer

**Greedy thinking:** When is the locally optimal choice also globally optimal?

## 🟠 Tier 3 — Learn After Comfortable (spend ~10–15% of time)

Useful for competitive programming, high-level interviews, data-heavy systems.

- [ ] Trie
- [ ] DSU / Union Find
- [ ] Segment Tree
- [ ] Fenwick Tree / BIT
- [ ] KMP
- [ ] Rabin-Karp
- [ ] Strongly Connected Components
- [ ] Advanced graph algorithms (bridges, articulation points, MST, Bellman-Ford, Floyd-Warshall)

## 🔴 Tier 4 — Advanced / Specialized (only if required)

Relevant to CP, research, specialized algorithmic work, or very hard interviews.

- [ ] Network Flow
- [ ] Digit DP
- [ ] Bitmask DP
- [ ] Computational Geometry
- [ ] Sparse Table
- [ ] Advanced string algorithms
- [ ] Advanced graph theory

---

## Top 30 highest-value topics

| #  | Topic / Algorithm     | Importance |
| -- | --------------------- | ---------- |
| 1  | Big O                 | ⭐⭐⭐⭐⭐      |
| 2  | Arrays                | ⭐⭐⭐⭐⭐      |
| 3  | Strings               | ⭐⭐⭐⭐⭐      |
| 4  | HashMap / HashSet     | ⭐⭐⭐⭐⭐      |
| 5  | Two Pointers          | ⭐⭐⭐⭐⭐      |
| 6  | Sliding Window        | ⭐⭐⭐⭐⭐      |
| 7  | Prefix Sum            | ⭐⭐⭐⭐⭐      |
| 8  | Binary Search         | ⭐⭐⭐⭐⭐      |
| 9  | Sorting               | ⭐⭐⭐⭐⭐      |
| 10 | Stack                 | ⭐⭐⭐⭐⭐      |
| 11 | Queue / Deque         | ⭐⭐⭐⭐       |
| 12 | Monotonic Stack       | ⭐⭐⭐⭐       |
| 13 | Linked List           | ⭐⭐⭐⭐       |
| 14 | Fast & Slow Pointer   | ⭐⭐⭐⭐       |
| 15 | Recursion             | ⭐⭐⭐⭐⭐      |
| 16 | Binary Tree           | ⭐⭐⭐⭐⭐      |
| 17 | Tree DFS/BFS          | ⭐⭐⭐⭐⭐      |
| 18 | BST                   | ⭐⭐⭐⭐       |
| 19 | Heap / Priority Queue | ⭐⭐⭐⭐⭐      |
| 20 | Graph BFS/DFS         | ⭐⭐⭐⭐⭐      |
| 21 | Topological Sort      | ⭐⭐⭐⭐       |
| 22 | Dijkstra              | ⭐⭐⭐⭐⭐      |
| 23 | Union Find / DSU      | ⭐⭐⭐⭐       |
| 24 | Greedy                | ⭐⭐⭐⭐       |
| 25 | Backtracking          | ⭐⭐⭐⭐       |
| 26 | 1D DP                 | ⭐⭐⭐⭐⭐      |
| 27 | 2D DP                 | ⭐⭐⭐⭐⭐      |
| 28 | Knapsack              | ⭐⭐⭐⭐⭐      |
| 29 | LCS/LIS               | ⭐⭐⭐⭐       |
| 30 | Trie                  | ⭐⭐⭐        |

---

## Developer reality check

Algorithms used directly every day ≠ algorithms interviewers ask about.

**Used daily in real apps:** HashMap, HashSet, Array/List, Stack, Queue, Heap/Priority Queue, Sorting, Binary Search, Trees, Graphs, Caching, Queues.

**Rarely implemented from scratch:** Quick Sort, Dijkstra, etc. — but understanding them helps choose the right data structure and reason about performance.

## Recommended order

Tier 1 → Tier 2 → Tier 3 → Tier 4

Don't wait to finish Tier 1 before practicing. For every topic:

**Learn → Implement → Easy problems → Medium problems → Review mistakes → Move on**

When you reach Tier 2, keep revising Tier 1. Being very strong at Tier 1 + Tier 2 beats knowing a little of everything.

## Learning model (house analogy)

```text
              🔴 TIER 4  Advanced / Specialized
              🟠 TIER 3  Advanced Data Structures
              🟡 TIER 2  Advanced Problem Solving
              🟢 TIER 1  Core DSA Foundation
```