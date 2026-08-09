# 06 — Problem-Solving Patterns

60 technique combinations, the most important patterns.

---

## 46. Important Problem-Solving Patterns

This is perhaps the **most important section**.

When you see a new problem, identify which pattern it belongs to.

## Pattern 1 — Two Pointers

Look for:

```text
array/string
+
sorted
+
pair/triplet
```

---

## Pattern 2 — Sliding Window

Look for:

```text
contiguous subarray/substring
```

with:

- longest
- shortest
- maximum
- minimum
- at most K
- exactly K

---

## Pattern 3 — Fast & Slow Pointer

Look for:

```text
linked list
cycle
middle
repeated movement
```

---

## Pattern 4 — Prefix Sum

Look for:

```text
subarray sum
range sum
repeated range queries
```

---

## Pattern 5 — HashMap

Look for:

```text
frequency
complement
duplicate
prefix state
```

---

## Pattern 6 — Binary Search

Look for:

```text
sorted
```

or:

```text
minimum/maximum answer
+
can we check feasibility?
```

---

## Pattern 7 — Stack

Look for:

```text
previous/next greater/smaller
nested structure
matching parentheses
```

---

## Pattern 8 — Monotonic Stack

Look for:

```text
next greater
next smaller
previous greater
previous smaller
```

---

## Pattern 9 — Heap

Look for:

```text
top K
minimum/maximum repeatedly
scheduling
streaming median
```

---

## Pattern 10 — BFS

Look for:

```text
minimum number of steps
unweighted graph
level-by-level
```

---

## Pattern 11 — DFS

Look for:

```text
explore all possibilities
connected components
tree traversal
cycle detection
```

---

## Pattern 12 — Multi-source BFS

Look for:

```text
multiple starting points
spread/propagation
minimum distance from any source
```

Example:

```text
Rotting Oranges
```

---

## Pattern 13 — Backtracking

Look for:

```text
generate all possibilities
```

Examples:

- subsets
- permutations
- combinations
- N Queens
- Sudoku

---

## Pattern 14 — Greedy

Look for:

```text
locally optimal decision
+
can prove it doesn't hurt global optimum
```

---

## Pattern 15 — DP

Look for:

```text
overlapping subproblems
+
optimal substructure
```

Ask:

> "What is my state?"

---

## Pattern 16 — Union Find

Look for:

```text
groups/components
+
connections being added
```

---

## Pattern 17 — Topological Sort

Look for:

```text
dependencies
prerequisites
ordering
```

---

## Pattern 18 — Trie

Look for:

```text
prefix
dictionary
autocomplete
word search
```

---

## Pattern 19 — Monotonic Queue

Look for:

```text
sliding window
+
maximum/minimum
```

---

## Pattern 20 — Sweep Line

Look for:

```text
intervals
events
overlap
timeline
```

---

# 47. The "Take / Don't Take" Pattern

Extremely important.

Used in:

- Subsets
- Subsequences
- 0/1 Knapsack
- Some DP problems

Think:

```text
                item
              /      \
           take      don't take
```

---

# 48. The "Choose / Explore / Unchoose" Pattern

Backtracking:

```text
choose
   ↓
explore
   ↓
unchoose
```

Used for:

- Permutations
- Combinations
- N Queens
- Sudoku
- Word Search

---

# 49. State Compression

Instead of storing a huge state, encode it compactly.

Examples:

```text
bitmask
tuple
integer encoding
```

Used in:

- Bitmask DP
- Graph states
- BFS states
- Game problems

---

# 50. Meet in the Middle

Split problem into two halves.

Instead of:

```text
2^n
```

you may get approximately:

```text
2^(n/2) + 2^(n/2)
```

Used for:

- Subset Sum
- Large subset enumeration
- Optimization problems

---

# 51. Memoization

Top-down DP:

```text
solve(state)

if state already calculated:
    return memo[state]
```

Good when:

- Not every state needs to be visited
- Recursive formulation is natural

---

# 52. Tabulation

Bottom-up DP:

```text
calculate smaller states
↓
calculate larger states
```

Good when:

- State ordering is obvious
- Want to avoid recursion overhead

---

# 53. Space Optimization in DP

For example:

Instead of:

```text
dp[n][m]
```

sometimes only previous row is required:

```text
prev[m]
curr[m]
```

Can reduce:

```text
O(nm) → O(m)
```

---

# 54. Online vs Offline Algorithms

### Online

Process input as it arrives.

Examples:

- Streaming median
- Online queries

### Offline

Read all data first, then reorder/process.

Examples:

- Offline queries
- Sort queries + process
- Mo's Algorithm

---

# 55. Mo's Algorithm

Advanced range-query technique.

Used when:

- Many range queries
- Array doesn't change or has limited updates

Reorder queries to reduce pointer movement.

Typical complexity around:

```text
O((N + Q)√N)
```

depending on implementation/problem.

---

# 56. Lazy Techniques

Instead of immediately applying every operation:

> Delay the work until necessary.

Examples:

- Lazy Segment Tree
- Lazy deletion in heaps
- Lazy propagation
- Deferred updates

---

# 57. Caching / Memoization Pattern

General pattern:

```text
state → result
```

Can use:

- HashMap
- Array
- DP table

This is the core idea behind memoization.

---

# 58. State Machine Pattern

Very useful for DP.

Example states:

```text
holding stock
not holding stock
cooldown
```

Used in:

- Stock problems
- Automata
- String matching
- Game states

---

# 59. In-Place Algorithms

Modify input without extra array.

Examples:

- Rotate array
- Reverse array
- Move zeroes
- Remove duplicates
- Matrix rotation

Usually uses:

```text
two pointers
```

---

# 60. Important "Technique Combinations"

Real DSA problems often combine multiple techniques.

### Array + HashMap

```text
Two Sum
Subarray Sum
```

### Array + Sorting + Two Pointer

```text
3Sum
4Sum
```

### Sliding Window + HashMap

```text
Longest substring
```

### Prefix Sum + HashMap

```text
Subarray sum = K
```

### Binary Search + Greedy

```text
Minimum capacity
minimum time
```

### Heap + Greedy

```text
Scheduling
Top K
```

### BFS + HashSet

```text
Shortest transformation
```

### DFS + Memoization

```text
Grid DP
Graph DP
```

### Trie + DFS

```text
Word Search II
```

### Sorting + Greedy

```text
Activity selection
interval problems
```

### DSU + Sorting

```text
Kruskal
```

### Segment Tree + Coordinate Compression

```text
Large-coordinate range problems
```

### Bitmask + DP

```text
TSP
assignment problems
```

### Binary Search + DP

```text
LIS
optimization problems
```

---

# ⭐ The Most Important 20 Patterns

If your goal is **coding interviews / LeetCode**, prioritize these:

| #  | Pattern          | Recognize when you see      |
| -- | ---------------- | --------------------------- |
| 1  | HashMap          | frequency/complement        |
| 2  | Two Pointers     | sorted array/pairs          |
| 3  | Sliding Window   | contiguous subarray/string  |
| 4  | Prefix Sum       | range/subarray sum          |
| 5  | Binary Search    | sorted/monotonic answer     |
| 6  | Fast & Slow      | linked-list cycle/middle    |
| 7  | Stack            | nested/previous/next        |
| 8  | Monotonic Stack  | next greater/smaller        |
| 9  | Heap             | top K / repeated min-max    |
| 10 | Intervals        | overlapping ranges          |
| 11 | DFS              | explore/connectivity        |
| 12 | BFS              | minimum steps               |
| 13 | Multi-source BFS | spreading from many sources |
| 14 | Backtracking     | generate possibilities      |
| 15 | Greedy           | local optimal choice        |
| 16 | DP               | overlapping subproblems     |
| 17 | Union Find       | dynamic components          |
| 18 | Topological Sort | dependencies                |
| 19 | Trie             | prefixes/words              |
| 20 | Bitmask          | subsets/state compression   |

### The key skill

When you get a new problem, don't immediately ask:

> **"Which algorithm do I know?"**

Instead ask:

> **"What structure does this problem have?"**

For example:

```text
Contiguous + longest
        ↓
Sliding Window

Sorted + pair
        ↓
Two Pointer

Next greater/smaller
        ↓
Monotonic Stack

Minimum steps + unweighted graph
        ↓
BFS

Dependencies
        ↓
Topological Sort

Repeated subproblems
        ↓
DP

Top K
        ↓
Heap

Dynamic connectivity
        ↓
DSU

Prefix-related words
        ↓
Trie

Minimum possible X
+
can check whether X works
        ↓
Binary Search on Answer
```

**That pattern-recognition ability is what turns DSA from hundreds of unrelated problems into a manageable set of reusable techniques.**
