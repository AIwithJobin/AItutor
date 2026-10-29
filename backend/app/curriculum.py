"""The learning path: 42 topics from variables to binary exponentiation."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Topic:
    id: int
    title: str
    has_exercises: bool


CURRICULUM: tuple[Topic, ...] = (
    Topic(1, "Variables & Data Types", False),
    Topic(2, "Basic Data Types (int, float, char, bool, string)", True),
    Topic(3, "Advanced Data Types (Arrays, Structs, Pointers)", True),
    Topic(4, "Revision: Variables, Data Types & Pointers", False),
    Topic(5, "Operators (Arithmetic, Logical, Relational)", True),
    Topic(6, "Bitwise Operators", True),
    Topic(7, "Expressions & Type Conversions", False),
    Topic(8, "Revision: Operators & Expressions", False),
    Topic(9, "Basic Conditional Statements (if, if-else, switch)", True),
    Topic(10, "Intermediate Conditional Statements", True),
    Topic(11, "Advanced Conditional Statements", True),
    Topic(12, "Revision: Conditional Statements", False),
    Topic(13, "Basics of Loops (for, while, do-while)", True),
    Topic(14, "Intermediate Loops (Nested Loops, Pattern Printing)", True),
    Topic(15, "Advanced Loops (Optimization, Break/Continue)", True),
    Topic(16, "Revision: Loops & Iterations", False),
    Topic(17, "Functions (Definition, Parameters, Return Types)", True),
    Topic(18, "Recursive Functions", True),
    Topic(19, "Basic Array Operations (Insertion, Deletion, Traversal)", True),
    Topic(20, "Revision: Functions & Arrays Basics", True),
    Topic(21, "String Operations (Concatenation, Comparison, Substring)", True),
    Topic(22, "String Manipulation (Reversal, Palindrome, Anagram)", True),
    Topic(23, "1D Arrays (Sorting, Searching, Merging)", True),
    Topic(24, "2D Arrays (Matrix Operations, Rotations, Transpose)", True),
    Topic(25, "Revision: Strings & Arrays", False),
    Topic(26, "Modular Arithmetic (GCD, LCM, Prime Numbers)", True),
    Topic(27, "Stacks (LIFO, Applications in Expressions, Undo)", True),
    Topic(28, "Queues (FIFO, Circular, Priority Queue)", True),
    Topic(29, "Revision: Modular Arithmetic & Stack/Queue", False),
    Topic(30, "Bitwise Operations (AND, OR, XOR, Left & Right Shifts)", True),
    Topic(31, "XOR Tricks (Finding Unique Elements, Missing Numbers)", True),
    Topic(32, "Basic Searching Algorithms (Linear, Binary)", True),
    Topic(33, "Advanced Searching (Exponential, Interpolation)", True),
    Topic(34, "Revision: Bitwise Operations & Searching", False),
    Topic(35, "Basic Sorting Algorithms (Bubble, Selection, Insertion)", True),
    Topic(36, "Advanced Sorting (Merge, Quick, Counting Sort)", True),
    Topic(37, "Sliding Window (Fixed & Variable Window Problems)", True),
    Topic(38, "Revision: Sorting & Sliding Window", False),
    Topic(39, "Recursion (Backtracking, Permutations, Combinations)", True),
    Topic(40, "Prefix Sum (Kadane's Algorithm, Subarray Sums)", True),
    Topic(41, "Binary Exponentiation & Fast Modulo Operations", True),
    Topic(42, "Final Revision: Recursion, Prefix Sum & Binary Exponentiation", True),
)

_BY_ID = {topic.id: topic for topic in CURRICULUM}


def get_topic(topic_id: int) -> Topic | None:
    return _BY_ID.get(topic_id)
