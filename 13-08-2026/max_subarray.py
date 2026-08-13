"""Maximum Subarray (Kadane's Algorithm)
Return the sum of the contiguous subarray with the largest sum.

Core idea:
    current = max(x, current + x)
    answer  = max(answer, current)

Complexity:
Time:  O(n)
Space: O(1)
"""


def max_subarray(nums):
    # TODO: implement
    pass


def run_tests():
    assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert max_subarray([1]) == 1
    assert max_subarray([5, 4, -1, 7, 8]) == 23
    assert max_subarray([-1, -2, -3]) == -1
    print("All tests passed")


if __name__ == "__main__":
    run_tests()
