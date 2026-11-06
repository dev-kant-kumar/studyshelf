const questions = [
  {
    id: 'precedence-vs-associativity-concept',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Differentiate between Operator Precedence and Operator Associativity. Give an example showing how associativity resolves expression binding.',
    answer: [
      '1. Operator Precedence: Determines the priority order in which operators with differing precedence levels are bound to their operands when an expression contains multiple distinct operators. Operators with higher precedence bind more tightly than operators with lower precedence. Example: In 5 + 3 * 2, multiplication has higher precedence than addition, so it evaluates as 5 + (3 * 2) = 11, not (5 + 3) * 2 = 16.',
      '2. Operator Associativity: Determines the binding direction (Left-to-Right or Right-to-Left) when an expression contains two or more operators sharing the EXACT SAME precedence level.',
      'Example of Left-to-Right Associativity: The subtraction operator (-) associates Left-to-Right. The expression 10 - 4 - 2 is grouped as ((10 - 4) - 2) = 4, rather than (10 - (4 - 2)) = 8.',
      'Example of Right-to-Left Associativity: The assignment operator (=) associates Right-to-Left. The chained assignment a = b = c = 10 is grouped as a = (b = (c = 10)), propagating the value 10 from right to left.'
    ]
  },
  {
    id: 'complete-precedence-hierarchy-and-rtl-groups',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Outline the 15-level operator precedence hierarchy in C. Identify the three specific operator groups that associate from Right-to-Left.',
    answer: [
      'The ISO C operator precedence table consists of 15 hierarchical levels (Level 1 being the highest priority):',
      'Level 1 (Highest): Postfix operators: (), [], ->, ., ++ (postfix), -- (postfix). Associativity: Left-to-Right.',
      'Level 2: Unary operators: ++ (prefix), -- (prefix), + (unary), - (unary), !, ~, (type) cast, * (dereference), & (address), sizeof. Associativity: RIGHT-TO-LEFT.',
      'Level 3: Multiplicative: *, /, %. Associativity: Left-to-Right.',
      'Level 4: Additive: +, -. Associativity: Left-to-Right.',
      'Level 5: Bitwise Shifts: <<, >>. Associativity: Left-to-Right.',
      'Level 6: Relational: <, <=, >, >=. Associativity: Left-to-Right.',
      'Level 7: Equality: ==, !=. Associativity: Left-to-Right.',
      'Level 8: Bitwise AND: &. Associativity: Left-to-Right.',
      'Level 9: Bitwise XOR: ^. Associativity: Left-to-Right.',
      'Level 10: Bitwise OR: |. Associativity: Left-to-Right.',
      'Level 11: Logical AND: &&. Associativity: Left-to-Right.',
      'Level 12: Logical OR: ||. Associativity: Left-to-Right.',
      'Level 13: Conditional / Ternary: ?:. Associativity: RIGHT-TO-LEFT.',
      'Level 14: Assignment operators: =, +=, -=, *=, /=, %=, &=, ^=, |=, <<=, >>=. Associativity: RIGHT-TO-LEFT.',
      'Level 15 (Lowest): Comma operator: ,. Associativity: Left-to-Right.',
      'The Three Right-to-Left Associativity Groups: (1) Unary operators (Level 2), (2) Conditional ternary operator (Level 13), and (3) Assignment operators (Level 14).'
    ]
  },
  {
    id: 'precedence-vs-order-of-evaluation',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain the critical distinction between Operator Precedence and Order of Evaluation in C. Why does higher precedence NOT guarantee prior execution?',
    answer: [
      'A widespread misconception among C programmers is assuming that an operator with higher precedence executes before an operator with lower precedence. In C, Precedence and Associativity govern SYNTAX GROUPING (how operands bind to operators in the Abstract Syntax Tree), NOT the temporal order of evaluation of operands!',
      'Proof and Example: Consider the expression: result = f() + g() * h();',
      'Due to operator precedence, the multiplication operator (*) binds tighter than addition (+). The syntax tree groups this as: f() + (g() * h()).',
      'However, the C standard imposes NO requirement on whether function f(), g(), or h() is called first by the CPU! The compiler is entirely free to evaluate f() first, or h() first, or g() first. If these functions modify shared global variables or perform I/O, relying on execution order produces non-deterministic bugs.',
      'Only four operators in C guarantee a temporal left-to-right order of evaluation and introduce a sequence point: (1) Logical AND (&&), (2) Logical OR (||), (3) Conditional operator (?: - condition evaluated before branches), and (4) Comma operator (,).'
    ]
  },
  {
    id: 'worked-expression-evaluation-traces',
    level: 'hard',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Solve this standard university exam expression evaluation problem step by step: Given a = 5, b = 10, c = 15, evaluate the expression: x = a + b * c / 5 - 20 % 6 + (a < b && b < c); Show the complete step-by-step reduction trace.',
    answer: [
      'Given Initial Values: a = 5, b = 10, c = 15.',
      'Target Expression: x = a + b * c / 5 - 20 % 6 + (a < b && b < c);',
      'Step 1: Evaluate Parentheses (Subexpression: a < b && b < c):',
      'Inside parentheses, relational operators (<) have higher precedence than logical AND (&&).',
      'Part A: a < b &rarr; 5 < 10 &rarr; 1 (true).',
      'Part B: b < c &rarr; 10 < 15 &rarr; 1 (true).',
      'Part C: 1 && 1 &rarr; 1.',
      'Expression reduces to: x = 5 + 10 * 15 / 5 - 20 % 6 + 1;',
      'Step 2: Evaluate Multiplicative Operators (*, /, %) from Left to Right (Level 3):',
      '10 * 15 &rarr; 150.',
      '150 / 5 &rarr; 30.',
      '20 % 6 &rarr; 2 (since 20 = 3 * 6 + 2).',
      'Expression reduces to: x = 5 + 30 - 2 + 1;',
      'Step 3: Evaluate Additive Operators (+, -) from Left to Right (Level 4):',
      '5 + 30 &rarr; 35.',
      '35 - 2 &rarr; 33.',
      '33 + 1 &rarr; 34.',
      'Step 4: Assignment (=) stores 34 into variable x.',
      'Final Result: x = 34.'
    ]
  },
  {
    id: 'sequence-points-and-unsequenced-evaluations',
    level: 'hard',
    tags: ['Interview practice', 'Language specification'],
    question: 'Define a Sequence Point in C. Explain why the C11 standard replaced sequence points with "Sequenced-Before", "Sequenced-After", and "Indeterminately Sequenced" relations.',
    answer: [
      '1. Classical Definition of Sequence Point (C89 / C99):',
      'A Sequence Point is a designated point in program execution at which all side effects of previous evaluations are guaranteed to be complete, and no side effects from subsequent evaluations have taken place.',
      'Classical Sequence Points occur: (a) At the semicolon terminating a full expression (statement). (b) At the comma operator (,). (c) After the left operand of &&, ||, and ?:. (d) Before a function call executes, after all arguments are evaluated.',
      '2. Modern C11 / C17 Ordering Relations:',
      'The C11 standard modernized memory order terminology to support multithreading and aggressive superscalar out-of-order CPU pipelines, defining three formal ordering relations:',
      '(a) Sequenced-Before: An evaluation A is sequenced-before B if A is guaranteed to complete before B begins (strict partial ordering).',
      '(b) Sequenced-After: Evaluation B is sequenced-after A if A is sequenced-before B.',
      '(c) Indeterminately Sequenced: Evaluations A and B can occur in either order, but cannot interleave (one finishes entirely before the other starts). For example, function calls in f() + g() are indeterminately sequenced.',
      '(d) Unsequenced: Neither A is sequenced-before B, nor B is sequenced-before A. Evaluations may execute in arbitrary order, or CPU instructions may interleave simultaneously.',
      'The Cardinal Safety Rule: If a side effect on an object is unsequenced relative to another side effect on the same object, or relative to a value computation using the object, the behavior is UNDEFINED (e.g., i = i++).'
    ]
  }
]

export default questions
