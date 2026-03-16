import pytest
from src.list_utils import flatten_list, remove_duplicates, find_max, chunk_list


class TestFlattenList:
    def test_flatten_nested(self):
        assert flatten_list([[1, 2], [3, 4]]) == [1, 2, 3, 4]

    def test_flatten_deeply_nested(self):
        assert flatten_list([[1, [2, 3]], [4]]) == [1, 2, 3, 4]

    def test_flatten_already_flat(self):
        assert flatten_list([1, 2, 3]) == [1, 2, 3]

    def test_flatten_empty(self):
        assert flatten_list([]) == []

    def test_flatten_single_element(self):
        assert flatten_list([[1]]) == [1]

    def test_flatten_mixed_types(self):
        assert flatten_list([[1, "a"], [2, "b"]]) == [1, "a", 2, "b"]


class TestRemoveDuplicates:
    def test_remove_duplicates_simple(self):
        assert remove_duplicates([1, 2, 2, 3, 3, 3]) == [1, 2, 3]

    def test_remove_duplicates_no_duplicates(self):
        assert remove_duplicates([1, 2, 3]) == [1, 2, 3]

    def test_remove_duplicates_empty(self):
        assert remove_duplicates([]) == []

    def test_remove_duplicates_all_same(self):
        assert remove_duplicates([1, 1, 1]) == [1]

    def test_remove_duplicates_preserves_order(self):
        assert remove_duplicates([3, 1, 2, 1, 3]) == [3, 1, 2]

    def test_remove_duplicates_strings(self):
        assert remove_duplicates(["a", "b", "a"]) == ["a", "b"]


class TestFindMax:
    def test_find_max_simple(self):
        assert find_max([1, 3, 2]) == 3

    def test_find_max_negative_numbers(self):
        assert find_max([-1, -3, -2]) == -1

    def test_find_max_single_element(self):
        assert find_max([42]) == 42

    def test_find_max_empty_raises(self):
        with pytest.raises(ValueError, match="Cannot find max of empty list"):
            find_max([])

    def test_find_max_all_same(self):
        assert find_max([5, 5, 5]) == 5

    def test_find_max_floats(self):
        assert find_max([1.5, 2.5, 0.5]) == 2.5


class TestChunkList:
    def test_chunk_even_split(self):
        assert chunk_list([1, 2, 3, 4], 2) == [[1, 2], [3, 4]]

    def test_chunk_uneven_split(self):
        assert chunk_list([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]

    def test_chunk_size_larger_than_list(self):
        assert chunk_list([1, 2], 5) == [[1, 2]]

    def test_chunk_size_one(self):
        assert chunk_list([1, 2, 3], 1) == [[1], [2], [3]]

    def test_chunk_empty_list(self):
        assert chunk_list([], 3) == []

    def test_chunk_size_zero_raises(self):
        with pytest.raises(ValueError, match="Chunk size must be positive"):
            chunk_list([1, 2], 0)

    def test_chunk_negative_size_raises(self):
        with pytest.raises(ValueError, match="Chunk size must be positive"):
            chunk_list([1, 2], -1)
