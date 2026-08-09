# 03 — Graphs

Graphs, Traversal, Grid, Cycle Detection, Topological Sort, Shortest Path, MST, Union-Find.

---

## 17. Graphs

This is one of the largest DSA areas.

### Graph representations

#### Adjacency Matrix

```text
graph[u][v]
```

#### Adjacency List

```text
graph[u] = [v1, v2, ...]
```

#### Edge List

```text
(u, v, weight)
```

---

## 18. Graph Traversal

### DFS

Used for:

- Connected components
- Cycle detection
- Path finding
- Islands
- Backtracking on graph
- Topological sorting

### BFS

Used for:

- Shortest path in unweighted graph
- Level traversal
- Minimum number of moves
- Multi-source problems

---

## 19. Grid / Matrix

Grid problems are basically graph problems.

### Techniques

- DFS
- BFS
- Multi-source BFS
- Flood Fill
- Boundary traversal
- Direction arrays

Typical directions:

```text
up
down
left
right
```

Sometimes:

```text
8 directions
```

### Problems

- Number of Islands
- Flood Fill
- Rotting Oranges
- Shortest Path in Grid
- Word Search
- Surrounded Regions

---

## 20. Cycle Detection

### Undirected Graph

#### DFS

Track:

```text
parent
```

#### BFS

Track:

```text
node + parent
```

#### DSU

Union-Find is also commonly used.

### Directed Graph

Use DFS state:

```text
0 = unvisited
1 = visiting
2 = completed
```

A back-edge to a `visiting` node indicates a cycle.

Also:

- Kahn's Algorithm
- Topological sort

---

## 21. Topological Sort

Only works on:

```text
DAG
```

Directed Acyclic Graph.

### Techniques

#### Kahn's Algorithm

Uses:

```text
indegree + queue
```

#### DFS Topological Sort

Uses:

```text
DFS + stack
```

Applications:

- Course Schedule
- Dependency resolution
- Build systems
- Task ordering
- Package dependencies

---

## 22. Shortest Path

### Unweighted Graph

Use:

#### BFS

```text
distance[v] = distance[u] + 1
```

### Weighted Graph

#### Dijkstra

Use when:

```text
edge weights >= 0
```

Usually:

```text
priority queue
```

#### Bellman-Ford

Supports:

```text
negative edges
```

Can detect:

```text
negative cycles
```

#### Floyd-Warshall

All-pairs shortest path.

Complexity:

```text
O(V³)
```

#### 0-1 BFS

When edge weights are only:

```text
0 or 1
```

Uses:

```text
deque
```

---

## 23. Minimum Spanning Tree

Goal:

> Connect all vertices with minimum total edge weight.

### Algorithms

#### Kruskal

Uses:

```text
sort edges
+
DSU
```

#### Prim

Uses:

```text
priority queue
```

### Important concepts

- Cut property
- DSU
- Union
- Find
- Path compression
- Union by rank/size

---

## 24. Disjoint Set Union / Union-Find

Very important graph pattern.

Operations:

```text
find(x)
union(a,b)
```

Optimizations:

- Path compression
- Union by rank
- Union by size

Used for:

- Connected components
- Cycle detection
- Kruskal
- Dynamic connectivity
- Network connections
- Account merging
