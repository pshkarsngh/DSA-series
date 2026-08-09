# 01 — Foundations

Complexity, Arrays, Strings, Linked List, Stack, Queue, Deque, Hashing, Binary Search, Sorting, Intervals.

---

## 1. Complexity Analysis

### Core concepts

- Time Complexity
- Space Complexity
- Big-O
- Big-Ω
- Big-Θ
- Amortized Analysis
- Best / Average / Worst case
- Auxiliary Space
- Recursion Stack Space

### Common complexities

| Complexity   | Typical technique           |
| ------------ | --------------------------- |
| `O(1)`       | Hash lookup, array access   |
| `O(log n)`   | Binary Search               |
| `O(n)`       | Two Pointer, Sliding Window |
| `O(n log n)` | Merge Sort, Heap Sort       |
| `O(n²)`      | Nested loops, basic DP      |
| `O(2ⁿ)`      | Subsets, recursion          |
| `O(n!)`      | Permutations                |

---

## 2. Arrays

Arrays are one of the most important DSA topics because many advanced patterns start from array problems.

### Techniques / Patterns

#### A. Traversal

- Forward traversal
- Reverse traversal
- Multiple traversals
- Nested traversal

#### B. Two Pointers

Used when dealing with:

- Sorted arrays
- Pairs
- Triplets
- Removing duplicates
- Partitioning

Patterns:

- Left + Right pointer
- Slow + Fast pointer
- Same-direction pointers
- Opposite-direction pointers

Examples:

- Two Sum II
- 3Sum
- Container With Most Water
- Remove Duplicates

#### C. Sliding Window

Two major types:

**Fixed-size window**

```text
window size = k
```

**Variable-size window**

```text
expand → satisfy condition → shrink
```

Used for:

- Subarrays
- Longest/shortest subarray
- Maximum/minimum sum
- Frequency constraints
- At most K / exactly K problems

Common patterns:

- Maximum sum subarray of size K
- Longest substring
- Minimum window
- At most K distinct
- Exactly K distinct

#### D. Prefix Sum

Build:

```text
prefix[i] = prefix[i-1] + arr[i]
```

Used for:

- Range sum
- Subarray sum
- Subarray sum equals K
- Range queries

Variants:

- 1D prefix sum
- 2D prefix sum
- Prefix XOR
- Prefix minimum/maximum

#### E. Difference Array

Useful for many range updates.

```text
diff[l] += x
diff[r+1] -= x
```

Used in:

- Range increment
- Interval updates
- Scheduling
- Range manipulation

#### F. Kadane's Algorithm

Used for:

- Maximum subarray sum
- Maximum subarray variants
- Maximum circular subarray

Core idea:

```text
current = max(x, current + x)
answer = max(answer, current)
```

#### G. Sorting + Scanning

Sort first, then solve using:

- Two pointers
- Greedy
- Grouping
- Intervals
- Duplicate detection

#### H. Hashing

Use:

- HashSet
- HashMap
- Frequency map

Patterns:

- Frequency counting
- Complement lookup
- Prefix sum + hashmap
- Duplicate detection
- Grouping

---

## 3. Strings

### Techniques

- Character frequency
- Hashing
- Two pointers
- Sliding window
- Prefix/suffix processing
- Palindrome checking
- String reversal
- Anagram detection
- Lexicographic ordering
- String compression
- Substring generation

### Important patterns

#### Frequency Map

```text
count[character]++
```

Used for:

- Anagrams
- Character constraints
- Permutations

#### Palindrome Pattern

```text
left → ← right
```

Variants:

- Valid palindrome
- Longest palindromic substring
- Palindromic subsequences

#### String Matching

Important algorithms:

- Naive pattern matching
- KMP
- Z Algorithm
- Rabin-Karp
- Rolling Hash

---

## 4. Linked List

### Fundamental techniques

- Traversal
- Insertion
- Deletion
- Reversal
- Merging
- Splitting

### Most important pattern: Fast & Slow Pointer

```text
slow = slow.next
fast = fast.next.next
```

Used for:

- Middle of linked list
- Cycle detection
- Cycle entry
- Palindrome
- Finding nth node
- Splitting list

### Reversal Patterns

#### Iterative reversal

```text
prev
curr
next
```

#### Recursive reversal

### Important patterns

- Reverse entire list
- Reverse sublist
- Reverse in K groups
- Pairwise reversal
- Merge sorted lists
- Detect cycle
- Find cycle start
- Intersection of two lists
- Add numbers represented by lists

---

## 5. Stack

Stack follows:

```text
LIFO
```

### Techniques

- Push / Pop
- Stack simulation
- Expression evaluation
- Parentheses matching
- Recursion simulation

### Major pattern: Monotonic Stack

Maintain stack in:

- Increasing order
- Decreasing order

Used for:

- Next Greater Element
- Next Smaller Element
- Previous Greater
- Previous Smaller
- Stock Span
- Daily Temperatures
- Largest Rectangle in Histogram
- Trapping Rain Water variants

### Expression patterns

- Infix
- Prefix
- Postfix
- Infix → Postfix
- Postfix evaluation
- Parentheses matching

---

## 6. Queue

Queue:

```text
FIFO
```

### Types

- Simple Queue
- Circular Queue
- Deque
- Priority Queue

### Patterns

- BFS
- Level-order traversal
- Sliding window maximum
- Task scheduling
- Multi-source BFS

---

## 7. Deque

Double-ended queue.

Operations:

- Push front
- Push back
- Pop front
- Pop back

### Important pattern: Monotonic Deque

Used for:

- Sliding Window Maximum
- Sliding Window Minimum
- Maintaining candidates for optimization

---

## 8. Hashing

One of the most important interview techniques.

### Structures

- HashMap
- HashSet
- Frequency Map
- Counter

### Patterns

#### Frequency Counting

```text
map[x]++
```

#### Complement Lookup

For Two Sum:

```text
target - x
```

#### Prefix Sum + HashMap

Very important for:

- Subarray sum = K
- Longest subarray with condition
- Zero-sum subarray
- Equal 0s and 1s

#### Hashing + Sliding Window

Used for:

- Longest substring
- Anagrams
- Frequency constraints

---

## 9. Binary Search

Don't think of binary search only as:

> "Find an element in a sorted array."

It is a much broader technique.

### A. Classic Binary Search

```text
low
mid
high
```

### B. Lower Bound

Find first position:

```text
arr[i] >= target
```

### C. Upper Bound

Find first position:

```text
arr[i] > target
```

### D. First / Last Occurrence

Used with duplicates.

### E. Search in Rotated Sorted Array

Patterns:

- One half is sorted
- Determine which half contains answer

### F. Binary Search on Answer

Extremely important.

Instead of searching an array:

```text
search answer space
```

Example:

```text
minimum possible capacity
maximum possible distance
minimum time
maximum minimum value
```

Need a monotonic feasibility function:

```text
possible(x)
```

Then:

```text
False False False True True True
```

or

```text
True True True False False
```

---

## 10. Sorting

### Basic sorting

- Bubble Sort
- Selection Sort
- Insertion Sort

### Advanced sorting

- Merge Sort
- Quick Sort
- Heap Sort
- Counting Sort
- Radix Sort
- Bucket Sort

### Important techniques

#### Merge Sort

Useful beyond sorting:

- Count inversions
- Count smaller elements
- Divide-and-conquer problems

#### Quick Sort

Important concept:

- Partitioning
- Pivot
- Hoare partition
- Lomuto partition

#### Counting Sort

Useful when:

- Value range is small

#### Custom Comparator

Extremely useful for:

- Intervals
- Greedy problems
- Sorting objects
- Scheduling

---

## 11. Intervals

This is a major interview pattern.

### Standard approach

Usually:

```text
sort intervals by start time
```

or sometimes:

```text
sort by end time
```

### Problems

- Merge Intervals
- Insert Interval
- Meeting Rooms
- Meeting Rooms II
- Non-overlapping Intervals
- Minimum number of rooms
- Interval scheduling
- Maximum number of non-overlapping intervals

### Techniques

- Sorting
- Greedy
- Sweep Line
- Priority Queue
- Difference Array
