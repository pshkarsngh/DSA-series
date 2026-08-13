"""Contains Duplicate
Return True if any value appears at least twice, otherwise False.

Hint: HashSet.

Complexity:
Time:  O(n)
Space: O(n)
"""


def contains_duplicate(nums):
    # TODO: implement
    pass


def run_tests():
    assert contains_duplicate([1, 2, 3, 1]) is True
    assert contains_duplicate([1, 2, 3, 4]) is False
    assert contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) is True
    assert contains_duplicate([]) is False
    print("All tests passed")


if __name__ == "__main__":
    run_tests()
