# Session 13-08-2026 — Arrays & Strings: Core Patterns

**Level:** Beginner | **Language:** Python
**Roadmap stage:** Complexity → **Arrays/Strings** → Recursion → Linked List → ...

## Goal

Master the 4 foundational array patterns. For each: learn concept → implement from scratch → solve → explain complexity.

## Topics

| Pattern | Concept | Problems |
| ------- | ------- | -------- |
| Two Pointers | Left/right pointers on sorted input | `two_sum.py`, `valid_palindrome.py` |
| Hashing / Complement lookup | Store seen values, look up `target - x` | `two_sum.py` |
| Sliding Window | Expand + shrink window | `best_time_to_buy_sell.py` (1-pass) |
| Kadane's Algorithm | `cur = max(x, cur + x)` | `max_subarray.py` |

## Order of work

1. **Learn** — read `DSA-Patterns-Guide/01-Foundations.md` §2 (Arrays) and §3 (Strings).
2. **Implement** each file below from scratch (no looking up).
3. **Verify** — run `python <file>.py`, all tests must pass.
4. **Explain** — write the time/space complexity as a docstring in each file.

## Problems (easy, curated for this session)

1. **Two Sum** — `two_sum.py` — return indices of two numbers that add to target.
2. **Contains Duplicate** — `contains_duplicate.py` — true if any value appears twice.
3. **Maximum Subarray** — `max_subarray.py` — max sum of a contiguous subarray (Kadane).
4. **Best Time to Buy & Sell Stock** — `best_time_to_buy_sell.py` — max profit from one buy + one sell.
5. **Valid Palindrome** — `valid_palindrome.py` — ignore non-alphanumerics, case-insensitive (two pointers).

## Definition of "done"

- All 5 files implemented and passing.
- Each file has a docstring stating time + space complexity.
- Can explain each pattern aloud without notes.

## Next session (suggested)

Recursion + Linked Lists — build on the same loop cycle.
