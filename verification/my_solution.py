from itertools import permutations
from typing import List


def delivery_drone(orders: List[int]) -> int:
    orders = [(i, d) for i, d in enumerate(orders) if d]

    def distance(way):
        return sum(abs(b - a) for a, b in zip((0,) + way, way))

    ways = (sum(perm, ()) + (0,) for perm in permutations(orders))
    min_way = min(ways, key=distance)
    return distance(min_way), list(min_way)


if __name__ == '__main__':
    assert delivery_drone([0, 2, 0])[0] == 4
    assert delivery_drone([0, 0, 1, 2])[0] == 6
    assert delivery_drone([0, 2, 4, 0, 1, 0, 5])[0] == 12
    assert delivery_drone([0, 0, 1, 2, 3, 4])[0] == 10
    assert delivery_drone([0, 0, 0, 8, 7, 3, 2, 0, 0])[0] == 24

