"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""
from random import randint, shuffle, sample
from my_solution import delivery_drone


def make_randoms(nums):
    tests = []
    for street in nums:

        package_num = randint(1, 9)
        packages = sample(range(1, street+1), min(street, package_num))

        packages += [0]*(street - len(packages))
        shuffle(packages)
        while any(i+1 == p for i, p in enumerate(packages) if p):
            shuffle(packages)
        packages = [0] + packages
        answer, steps = delivery_drone(packages)
        tests.append({'input': packages,
                      'answer': answer,
                      'explanation': steps})
    return tests


TESTS = {
    "Randoms": make_randoms((15, 20, 30)),
    "Basics": [
        {
            'input': [0, 2, 0],
            'answer': 4,
            'explanation': [1, 2, 0],
        },
        {
            'input': [0, 0, 1, 2],
            'answer': 6,
            'explanation': [3, 2, 2, 1, 0],
        },
        {
            'input': [0, 2, 4, 0, 1, 0, 5],
            'answer': 12,
            'explanation': [1, 2, 2, 4, 6, 5, 4, 1, 0],
        },
        {
            'input': [0, 0, 0, 8, 7, 3, 2, 0, 0], 
            'answer': 24,
            'explanation': [3, 8, 5, 3, 4, 7, 6, 2, 0],
        },
    ],
}
