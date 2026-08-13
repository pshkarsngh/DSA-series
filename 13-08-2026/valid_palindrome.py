"""Valid Palindrome
Return True if the string is a palindrome after ignoring non-alphanumeric
characters and case.

Hint: two pointers moving toward each other; skip non-alphanumerics.

Complexity:
Time:  O(n)
Space: O(1)
"""


def is_palindrome(s):
    # TODO: implement
    pass


def run_tests():
    assert is_palindrome("A man, a plan, a canal: Panama") is True
    assert is_palindrome("race a car") is False
    assert is_palindrome(" ") is True
    assert is_palindrome("ab_a") is True
    print("All tests passed")


if __name__ == "__main__":
    run_tests()
