# 05 — Advanced Topics

Bit Manipulation, Trie, Segment Tree, Fenwick, Sweep Line, Math, Combinatorics, Advanced Graph/String, Geometry, Randomized.

---

## 28. Bit Manipulation

Operators:

```text
&
|
^
~
<<
>>
```

### Patterns

#### Check Odd/Even

```text
n & 1
```

#### Check/Set/Clear Bit

```text
n & (1 << i)
n | (1 << i)
n & ~(1 << i)
```

#### XOR

Important properties:

```text
x ^ x = 0
x ^ 0 = x
```

Used for:

- Single Number
- Missing Number
- XOR tricks

### Other techniques

- Brian Kernighan's algorithm
- Count set bits
- Power of two
- Bitmask
- Subset generation
- XOR prefix
- XOR basis

---

## 29. Trie

Trie is a prefix tree.

Operations:

```text
insert
search
startsWith
```

Used for:

- Prefix search
- Autocomplete
- Dictionary
- Word Search
- Word Break
- Maximum XOR

### Advanced Trie

- Binary Trie
- Trie + DFS
- Trie + Backtracking

---

## 30. Segment Tree

Used for dynamic range queries.

Supports things like:

```text
range sum
range minimum
range maximum
range GCD
```

Typical complexity:

```text
Build: O(n)
Query: O(log n)
Update: O(log n)
```

### Advanced technique

**Lazy Propagation**

Useful for:

```text
range update
+
range query
```

---

## 31. Fenwick Tree / BIT

Binary Indexed Tree.

Usually used for:

- Prefix sum
- Point update
- Frequency counting
- Inversion counting
- Coordinate compression + queries

Complexity:

```text
Update: O(log n)
Query: O(log n)
```

Simpler than Segment Tree for many prefix/range-sum problems.

---

## 32. Coordinate Compression

When values are huge:

```text
10
1000000000
500000000
```

but only their relative ordering matters.

Convert:

```text
10 → 0
500000000 → 1
1000000000 → 2
```

Used with:

- Fenwick Tree
- Segment Tree
- Range queries
- Sweep line
- Geometry

---

## 33. Sweep Line

Process events sorted by coordinate/time.

Typical events:

```text
start
end
```

Used for:

- Interval overlap
- Meeting rooms
- Maximum simultaneous events
- Computational geometry
- Skyline
- Range problems

Often combined with:

- Heap
- Sorting
- Difference array
- Ordered map

---

## 34. Math / Number Theory

Important DSA math techniques.

### GCD

Euclidean algorithm:

```text
gcd(a,b) = gcd(b,a%b)
```

### LCM

```text
LCM(a,b) = a / gcd(a,b) * b
```

### Prime Numbers

- Trial division
- Sieve of Eratosthenes
- Segmented Sieve
- Prime factorization

### Modular Arithmetic

- Modulo properties
- Modular inverse
- Fast exponentiation
- Fermat's Little Theorem
- Euler's theorem

---

## 35. Fast / Binary Exponentiation

Calculate:

```text
a^n
```

in:

```text
O(log n)
```

Pattern:

```text
if n is odd
    answer *= a

a *= a
n /= 2
```

Useful for:

- Large powers
- Matrix exponentiation
- Modular arithmetic

---

## 36. Combinatorics

Important concepts:

- Permutations
- Combinations
- Factorials
- Binomial coefficients
- Pascal's Triangle
- Inclusion-Exclusion
- Catalan Numbers

### Common formulas

```text
nCr
nPr
```

Used in:

- Counting problems
- DP
- Probability
- Combinatorial optimization

---

## 37. Matrix / 2D Algorithms

Techniques:

- Matrix traversal
- Spiral traversal
- Transpose
- Rotate matrix
- Prefix sum
- Flood fill
- DFS/BFS
- Matrix multiplication
- Matrix exponentiation

### Common patterns

- Boundary traversal
- Layer-by-layer processing
- Direction vectors
- In-place transformation

---

## 38. Advanced Graph Patterns

After basic graphs, learn:

### Strongly Connected Components

Algorithms:

- Kosaraju
- Tarjan

### Bridges

Use:

- DFS
- Low-link values

### Articulation Points

Use:

- DFS
- Discovery time
- Low-link value

### Bipartite Graph

Use:

- BFS coloring
- DFS coloring

Colors:

```text
0 / 1
```

### Eulerian Path/Circuit

Concepts:

- Degree
- Euler path
- Euler circuit
- Hierholzer's algorithm

### Hamiltonian Path

Different from Euler:

- Euler → edges
- Hamiltonian → vertices

Usually solved with:

- Backtracking
- Bitmask DP for small `n`

---

## 39. Advanced String Algorithms

Learn these after basic string patterns:

### KMP

Find pattern in text efficiently.

```text
LPS / prefix function
```

### Z Algorithm

Computes:

```text
Z[i]
```

representing matching prefix length.

### Rabin-Karp

Uses:

```text
rolling hash
```

### Manacher's Algorithm

Find all/longest palindromic substrings in:

```text
O(n)
```

### Suffix Array

Useful for advanced substring problems.

### Suffix Tree

Advanced string indexing.

---

## 40. Computational Geometry

Advanced but useful in competitive programming.

Techniques:

- Orientation
- Cross product
- Dot product
- Line intersection
- Segment intersection
- Convex hull
- Sweep line
- Closest pair of points
- Polygon area
- Point inside polygon

Algorithms:

- Graham Scan
- Monotonic Chain
- Bentley-Ottmann concepts

---

## 41. Randomized Algorithms

Techniques:

- Randomized QuickSort
- Randomized QuickSelect
- Reservoir Sampling
- Randomized hashing

Used when deterministic worst-case behavior is undesirable or randomization simplifies expected complexity.

---

## 42. Divide and Conquer

General pattern:

```text
Divide
↓
Solve subproblems
↓
Combine
```

Examples:

- Merge Sort
- Quick Sort
- Binary Search
- Closest Pair
- Fast Exponentiation

---

## 43. Selection Algorithms

Find:

- kth smallest
- kth largest
- median

Techniques:

### Sorting

```text
O(n log n)
```

### Heap

```text
O(n log k)
```

### QuickSelect

Average:

```text
O(n)
```

---

## 44. Reservoir Sampling

Used when:

> Data is streamed and you don't know its total size.

Useful for:

- Random sample from stream
- Random linked-list node
- Streaming algorithms

---

## 45. Randomized / Hashing Techniques

Advanced hashing patterns:

- Rolling Hash
- Polynomial Hash
- Double Hashing
- Randomized Hashing
- Zobrist Hashing

Used for:

- String matching
- Duplicate detection
- Substring comparison
- Game states
