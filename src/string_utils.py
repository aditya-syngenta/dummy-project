def reverse_string(s):
    """Return the reversed version of the input string."""
    return s[::-1]


def capitalize_string(s):
    """Return the string with the first letter capitalized."""
    if not s:
        return s
    return s[0].upper() + s[1:]


def count_vowels(s):
    """Return the number of vowels in the string (case-insensitive)."""
    vowels = "aeiouAEIOU"
    return sum(1 for char in s if char in vowels)


def is_palindrome(s):
    """Check if a string is a palindrome (case-insensitive, ignoring spaces)."""
    cleaned = s.replace(" ", "").lower()
    return cleaned == cleaned[::-1]
