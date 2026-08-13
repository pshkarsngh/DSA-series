"""Best Time to Buy and Sell Stock
Given prices where prices[i] is the price on day i, return the max profit
from one buy + one sell. Must buy before selling. 0 if no profit.

Hint: track the minimum price seen so far and the best profit.

Complexity:
Time:  O(n)
Space: O(1)
"""


def max_profit(prices):
    # TODO: implement
    pass


def run_tests():
    assert max_profit([7, 1, 5, 3, 6, 4]) == 5
    assert max_profit([7, 6, 4, 3, 1]) == 0
    assert max_profit([2, 4, 1]) == 2
    assert max_profit([1]) == 0
    print("All tests passed")


if __name__ == "__main__":
    run_tests()
