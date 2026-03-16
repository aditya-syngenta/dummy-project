import pytest
from src.string_utils import reverse_string, capitalize_string, count_vowels, is_palindrome


class TestReverseString:
    def test_reverse_simple(self):
        assert reverse_string("hello") == "olleh"

    def test_reverse_empty(self):
        assert reverse_string("") == ""

    def test_reverse_single_char(self):
        assert reverse_string("a") == "a"

    def test_reverse_palindrome(self):
        assert reverse_string("madam") == "madam"

    def test_reverse_with_spaces(self):
        assert reverse_string("hi there") == "ereht ih"


class TestCapitalizeString:
    def test_capitalize_lowercase(self):
        assert capitalize_string("hello") == "Hello"

    def test_capitalize_already_capitalized(self):
        assert capitalize_string("Hello") == "Hello"

    def test_capitalize_empty(self):
        assert capitalize_string("") == ""

    def test_capitalize_single_char(self):
        assert capitalize_string("a") == "A"

    def test_capitalize_preserves_rest(self):
        assert capitalize_string("hELLO") == "HELLO"


class TestCountVowels:
    def test_count_vowels_simple(self):
        assert count_vowels("hello") == 2

    def test_count_vowels_all_vowels(self):
        assert count_vowels("aeiou") == 5

    def test_count_vowels_no_vowels(self):
        assert count_vowels("bcdfg") == 0

    def test_count_vowels_empty(self):
        assert count_vowels("") == 0

    def test_count_vowels_case_insensitive(self):
        assert count_vowels("AEIOU") == 5

    def test_count_vowels_mixed_case(self):
        assert count_vowels("HeLLo WoRLd") == 3


class TestIsPalindrome:
    def test_palindrome_simple(self):
        assert is_palindrome("madam") is True

    def test_not_palindrome(self):
        assert is_palindrome("hello") is False

    def test_palindrome_with_spaces(self):
        assert is_palindrome("race car") is True

    def test_palindrome_case_insensitive(self):
        assert is_palindrome("Madam") is True

    def test_palindrome_empty(self):
        assert is_palindrome("") is True

    def test_palindrome_single_char(self):
        assert is_palindrome("a") is True
