"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""


TESTS = {
    "Basics": [
        {
            'input': [0, 2, 0],
            'answer': 2,
            'explanation': [1, 2],
        },
        {
            'input': [0, 0, 1, 2],
            'answer': 5,
            'explanation': [3, 2, 2, 1],
        },
        {
            'input': [0, 2, 4, 0, 1, 0, 5],
            'answer': 11,
            'explanation': [1, 2, 2, 4, 6, 5, 4, 1],
        },
        {
            'input': [0, 0, 0, 8, 7, 3, 2, 0, 0], 
            'answer': 22,
            'explanation': [3, 8, 5, 3, 4, 7, 6, 2],
        },
    ],
}
