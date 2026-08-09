# 02 — Recursion and Trees

Recursion, Backtracking, Trees, BST, Heap / Priority Queue.

---

## 12. Recursion

### Core concepts

- Base case
- Recursive case
- Call stack
- Backtracking
- Divide and conquer

### Patterns

#### Linear recursion

```text
f(n) → f(n-1)
```

#### Binary recursion

```text
f(n) → f(n-1) + f(n-2)
```

#### Tree recursion

```text
left subtree
right subtree
```

#### Divide and Conquer

```text
divide
solve
combine
```

Examples:

- Merge Sort
- Quick Sort
- Binary Search
- Tree algorithms

---

## 13. Backtracking

Think:

```text
Choose
Explore
Undo
```

or:

```text
Choose
→ Recurse
→ Backtrack
```

### Major patterns

#### Subsets

```text
take / not take
```

#### Subsequences

```text
take / not take
```

#### Permutations

```text
choose unused element
```

#### Combination

```text
choose candidates
```

#### Constraint Satisfaction

- N Queens
- Sudoku
- Rat in Maze
- Word Search

### Backtracking optimizations

- Pruning
- Sorting candidates
- Duplicate elimination
- Constraint propagation
- Early termination
- Bitmasking

---

## 14. Trees

### Traversals

#### DFS

- Preorder
- Inorder
- Postorder

#### BFS

- Level Order
- Zigzag Level Order
- Reverse Level Order

### Tree Patterns

#### Pattern 1: Recursive DFS

```text
solve(left)
solve(right)
combine
```

Used for:

- Height
- Diameter
- Balanced tree
- Maximum path
- Tree DP

#### Pattern 2: Global Answer

Maintain:

```text
answer
```

outside recursive return.

Used for:

- Diameter
- Maximum path sum
- Longest path

#### Pattern 3: Return Multiple Values

Return:

```text
(height, answer)
```

or an object/tuple.

Useful for:

- Balanced tree
- Tree DP
- Subtree calculations

#### Pattern 4: Lowest Common Ancestor

Used for:

- LCA
- Distance between nodes
- Path queries

---

## 15. Binary Search Tree

BST property:

```text
left < root < right
```

### Techniques

- Search
- Insert
- Delete
- Find minimum
- Find maximum
- Successor
- Predecessor
- Validate BST
- Kth smallest
- Kth largest
- LCA in BST

### Key pattern

**Inorder traversal of BST → sorted order**

---

## 16. Heap / Priority Queue

Types:

- Min Heap
- Max Heap

### Patterns

#### Top K

- K largest
- K smallest
- K most frequent

Usually:

```text
heap size = K
```

#### Two Heaps

Maintain:

```text
maxHeap
minHeap
```

Used for:

- Median of stream
- Running median
- Balance two halves

#### Heap + Greedy

Used for:

- Scheduling
- CPU tasks
- Meeting rooms
- Reorganizing strings
- Minimum cost problems

#### K-way Merge

Use heap to merge:

- K sorted arrays
- K sorted linked lists
- Multiple streams
