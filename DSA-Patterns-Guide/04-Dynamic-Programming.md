# 04 — Dynamic Programming

DP framework, DP patterns, Greedy.

---

## 25. Dynamic Programming

DP is not one algorithm. It is a **problem-solving framework**.

The fundamental process:

```text
1. Define state
2. Define transition
3. Define base case
4. Determine computation order
5. Optimize space if possible
```

---

## 26. DP Patterns

### A. 1D DP

Examples:

```text
dp[i]
```

Used for:

- Climbing stairs
- House robber
- Fibonacci
- Decode ways

### B. 2D DP

```text
dp[i][j]
```

Used for:

- Grid paths
- LCS
- Edit Distance
- Knapsack variants

### C. Knapsack DP

#### 0/1 Knapsack

Each item:

```text
take once
or don't take
```

#### Unbounded Knapsack

Item can be used repeatedly.

### D. Subsequence DP

Patterns:

- LIS
- LCS
- Longest Palindromic Subsequence
- Edit Distance

### E. String DP

- LCS
- Edit Distance
- Palindrome DP
- Word Break
- Regex matching

### F. Grid DP

```text
dp[i][j]
```

Transitions usually come from:

```text
top
left
diagonal
```

### G. Partition DP

Split array/string into pieces.

Examples:

- Matrix Chain Multiplication
- Palindrome Partitioning
- Partition problems

### H. Interval DP

State:

```text
dp[l][r]
```

Used when solving an interval `[l,r]`.

Examples:

- Matrix Chain Multiplication
- Burst Balloons
- Palindrome-related problems

### I. Bitmask DP

State contains:

```text
mask
```

Used for:

- Traveling Salesman
- Assignment
- Subset selection
- Visiting states

### J. Digit DP

Used for counting numbers satisfying digit constraints.

State may include:

```text
position
tight
started
sum
remainder
```

### K. Tree DP

DP on trees.

Common state:

```text
dp[node][state]
```

Examples:

- House Robber III
- Maximum independent set
- Tree matching

### L. DAG DP

Topological ordering + DP.

Used for:

- Longest path in DAG
- Number of paths
- Dependency problems

### M. DP + Binary Search

Important example:

- LIS in `O(n log n)`

---

## 27. Greedy Algorithms

Greedy means:

> Make the best local decision while maintaining the possibility of an optimal global answer.

### Major patterns

- Sort + greedy
- Earliest finishing time
- Maximum/minimum choice
- Priority queue + greedy
- Exchange argument

### Problems

- Activity Selection
- Fractional Knapsack
- Jump Game
- Gas Station
- Assign Cookies
- Meeting Rooms
- Huffman Coding
- Job Sequencing
- Minimum Platforms

### Important question

Before using greedy, ask:

> Why is the local choice safe?

Greedy usually requires a correctness argument.
