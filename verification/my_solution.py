from itertools import accumulate
from typing import List


def delivery_drone(orders: List[int]) -> int:

    result_way = [[]]
    orders = [(i, d) for i, d in enumerate(orders) if d]

    def search(rest_points, way, cur=0, min_way=99999):

        cur_way = sum(map(abs, way))

        if min_way < cur_way:
            return min_way

        if not rest_points:
            cur_way += cur

            if min_way > cur_way:
                result_way[0] = way + [-cur]

            return [min_way, cur_way][min_way > cur_way]

        for i, (p, t) in enumerate(rest_points):
            min_way = search(rest_points[:i]+rest_points[i+1:], 
                                way+[p-cur, t-p], t, min_way)

        return min_way

    rs = search(orders, [])
    steps = list(accumulate(result_way[0]))

    return rs, steps


if __name__ == '__main__':
    assert delivery_drone([0, 2, 0]) == 4
    assert delivery_drone([0, 0, 1, 2]) == 6
    assert delivery_drone([0, 2, 4, 0, 1, 0, 5]) == 12
    assert delivery_drone([0, 0, 1, 2, 3, 4]) == 10
    assert delivery_drone([0, 0, 0, 8, 7, 3, 2, 0, 0]) == 24

