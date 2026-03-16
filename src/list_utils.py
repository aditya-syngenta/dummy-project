def flatten_list(nested_list):
    """Flatten a nested list into a single-level list."""
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten_list(item))
        else:
            result.append(item)
    return result


def remove_duplicates(lst):
    """Remove duplicates from a list while preserving order."""
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result


def find_max(lst):
    """Find the maximum value in a list. Raises ValueError if list is empty."""
    if not lst:
        raise ValueError("Cannot find max of empty list")
    max_val = lst[0]
    for item in lst[1:]:
        if item > max_val:
            max_val = item
    return max_val


def chunk_list(lst, size):
    """Split a list into chunks of the given size."""
    if size <= 0:
        raise ValueError("Chunk size must be positive")
    return [lst[i:i + size] for i in range(0, len(lst), size)]
