const questions = [
  {
    id: 'dangling-else-ambiguity',
    level: 'easy',
    tags: ['Grammar', 'Control flow'],
    question: "What is the dangling else problem in C, and how does the ISO C compiler resolve it?",
    answer: "The dangling else problem is an ambiguity in nested conditional statements where an else clause follows an inner if statement without explicit block delimiters. For example, in 'if (a) if (b) s1; else s2;', it is syntactically ambiguous whether the else belongs to the outer if or the inner if. ISO C resolves this ambiguity via a strict grammar rule: an else clause is always matched with the nearest preceding unmatched if statement in the same block. To prevent logical bugs and eliminate ambiguity, developers should always enclose nested control blocks within braces {}."
  },
  {
    id: 'switch-jump-table-vs-binary-tree',
    level: 'hard',
    tags: ['Optimization', 'Compiler design'],
    question: "How does the C compiler optimize a switch statement using jump tables versus binary search trees?",
    answer: "When switch case values are densely distributed over a compact integer range, the compiler constructs a jump table (an array of code memory addresses) in the read-only data segment. At runtime, the switch expression value is checked against the range bounds, and execution jumps directly to the target case address using indexed indirect addressing in O(1) constant time, regardless of the number of cases. If case values are sparsely distributed over a wide range, building a jump table would waste excessive memory; in that scenario, the compiler generates a balanced binary search decision tree (O(log n) comparisons) or a linear comparison cascade (O(n))."
  },
  {
    id: 'switch-restrictions-floats-strings',
    level: 'medium',
    tags: ['Language specification', 'Type system'],
    question: "Why can floating-point numbers and strings not be used as switch case labels in C?",
    answer: "ISO C restricts switch expression types and case labels strictly to integer types (including char, short, int, long, and enum) and requires case labels to be integer constant expressions known at compile-time. Floating-point numbers cannot be used because IEEE 754 representations suffer from rounding precision errors, making exact equality comparison unreliable, and their continuous domain prevents the construction of discrete indexed jump tables. String literals cannot be used because in C, strings are represented as null-terminated character arrays; comparing strings in a switch would compare their pointer memory addresses rather than their contents, which requires calling strcmp()."
  },
  {
    id: 'switch-fallthrough-semantics',
    level: 'medium',
    tags: ['Control flow', 'Standards'],
    question: "What is switch fallthrough, when is it useful, and how is it safely annotated in modern C?",
    answer: "In C, case labels inside a switch act purely as entry points in assembly. Execution does not stop automatically at the end of a case block; unless a break, return, or goto statement is reached, execution continues into subsequent cases. This is known as fallthrough. While unintended fallthrough is a notorious source of bugs, deliberate fallthrough is useful for grouping multiple cases that share identical logic (such as stacking case 'a': case 'A':). In modern standards (C23), deliberate fallthrough across cases with code is formally annotated using the [[fallthrough]]; attribute (or lint comments like /* fallthrough */) to suppress compiler diagnostic warnings."
  },
  {
    id: 'goto-systems-error-handling',
    level: 'hard',
    tags: ['Systems programming', 'Kernel patterns'],
    question: "Under what conditions is the goto statement considered acceptable in professional systems programming?",
    answer: "While arbitrary use of goto leads to unstructured, unmaintainable 'spaghetti code', its use is standard practice in low-level systems programming (such as the Linux kernel, device drivers, and embedded runtimes) for centralized error handling and resource unwinding. When a function allocates multiple sequential resources (e.g., allocating memory, acquiring a mutex, and opening a file descriptor), encountering a failure midway requires releasing only previously acquired resources in reverse order. A sequence of labeled cleanup blocks at the end of the function (e.g., goto out_free_mutex;) provides clean, single-exit error management without deeply nested repetitive if-else blocks."
  }
]

export default questions
