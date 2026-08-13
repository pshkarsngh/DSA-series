"""Two Sum
Return indices of the two numbers such that they add up to target.

Hint: iterate once, store seen values in a dict, look up (target - x).

Complexity:
Time:  O(n)
Space: O(n)
"""


def two_sum(nums, target):
    # TODO: implement
    pass


def run_tests():
    assert sorted(two_sum([2, 7, 11, 15], 9)) == [0, 1]
    assert sorted(two_sum([3, 2, 4], 6)) == [1, 2]
    assert sorted(two_sum([3, 3], 6)) == [0, 1]
    assert two_sum([1, 2, 3], 7) is None or two_sum([1, 2, 3], 7) == []
    print("All tests passed")


if __name__ == "__main__":
    run_tests()
