const questions = [
  {
    id: 'operator-classification-in-c',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Classify the primary operators in C into their eight functional categories with syntax examples.',
    answer: [
      'C organizes operators into eight major functional categories based on their operational semantics:',
      '1. Arithmetic Operators: Binary addition (+), subtraction (-), multiplication (*), division (/), and modulo division (%). Modulo requires integer operands.',
      '2. Relational Operators: Binary comparison evaluating to integer 1 (true) or 0 (false): ==, !=, <, <=, >, >=.',
      '3. Logical Operators: Boolean conjunction (&& - AND), disjunction (|| - OR), and unary negation (! - NOT).',
      '4. Bitwise Operators: Direct bit manipulation: & (AND), | (OR), ^ (XOR), ~ (One Complement NOT), << (Left Shift), >> (Right Shift).',
      '5. Assignment Operators: Simple assignment (=) and compound shorthand assignments (+=, -=, *=, /=, %=, &=, |=, ^=, <<=, >>=).',
      '6. Increment & Decrement Operators: Unary prefix and postfix modifications: ++x, x++, --x, x--.',
      '7. Conditional / Ternary Operator: Only ternary operator in C: condition ? expr_if_true : expr_if_false.',
      '8. Special Operators: sizeof (computes byte size at compile time), comma operator (, - evaluates left to right, yields rightmost value), addressof (&), and pointer dereference (*).'
    ]
  },
  {
    id: 'short-circuit-evaluation-and-defensive-guards',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain Short-Circuit Evaluation in C logical expressions. How does it enable defensive pointer null-checks?',
    answer: [
      '1. Short-Circuit Evaluation Mechanics:',
      'In C, the logical AND (&&) and logical OR (||) operators guarantee strict left-to-right evaluation and introduce a sequence point between their left and right operands:',
      '(a) Logical AND (expr1 && expr2): If expr1 evaluates to false (0), the entire compound expression CANNOT possibly be true. Therefore, expr2 is NEVER evaluated!',
      '(b) Logical OR (expr1 || expr2): If expr1 evaluates to true (non-zero), the entire expression is guaranteed to be true. Therefore, expr2 is NEVER evaluated!',
      '2. Defensive Pointer Guard Idiom:',
      'Short-circuit evaluation is essential for preventing segmentation faults when working with pointers and dynamic arrays:',
      'if (ptr != NULL && ptr->data == 42) { /* safe */ }',
      'If ptr is NULL (0), the left operand (ptr != NULL) evaluates to false. Due to short-circuit evaluation, the right operand (ptr->data == 42) is never executed, completely preventing a fatal NULL pointer dereference crash. Swapping the operands to (ptr->data == 42 && ptr != NULL) would dereference NULL and immediately crash the program!'
    ]
  },
  {
    id: 'bitwise-operations-and-bitmasks',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Detail the six Bitwise Operators in C. Explain how to Set, Clear, Toggle, and Test an arbitrary bit k using bitmask idioms.',
    answer: [
      'Bitwise operators operate directly on individual binary bits of integer operands:',
      '1. Bitwise Operations:',
      '& (Bitwise AND): Output bit is 1 if and only if both input bits are 1.',
      '| (Bitwise OR): Output bit is 1 if either input bit is 1.',
      '^ (Bitwise XOR): Output bit is 1 if input bits differ (odd parity).',
      '~ (Bitwise NOT): Inverts all bits (One Complement).',
      '<< (Left Shift): Shifts bits left by n positions, filling low bits with 0s (equivalent to multiplying by 2<sup>n</sup> for positive values).',
      '>> (Right Shift): Shifts bits right by n positions (equivalent to dividing by 2<sup>n</sup>). For unsigned types, zeroes are shifted in (logical shift); for signed types, the sign bit is typically replicated (arithmetic shift).',
      '2. Standard Bitmask Idioms for Bit k (where mask = (1U << k)):',
      '(a) Setting Bit k to 1: value = value | (1U << k);',
      '(b) Clearing Bit k to 0: value = value & ~(1U << k);',
      '(c) Toggling Bit k (Invert): value = value ^ (1U << k);',
      '(d) Testing Bit k: bool is_set = (value & (1U << k)) != 0;'
    ]
  },
  {
    id: 'prefix-vs-postfix-and-undefined-behavior',
    level: 'hard',
    tags: ['Interview practice', 'Language specification'],
    question: 'Compare Prefix (++x) vs Postfix (x++) increment operators. Explain why expressions like i = i++ or arr[i] = i++ produce Undefined Behavior in C.',
    answer: [
      '1. Prefix vs Postfix Semantics:',
      '(a) Prefix Increment (++x): Increments the value of x by 1 first, and yields the updated value as the result of the expression.',
      '(b) Postfix Increment (x++): Yields the original, un-incremented value of x for the enclosing expression, and schedules an increment side-effect to take place before the next sequence point.',
      '2. Why i = i++ and arr[i] = i++ are Undefined Behavior (UB):',
      'In ISO C (C11 section 6.5 paragraph 2), between the previous and next sequence point, an object shall have its stored value modified at most once by the evaluation of an expression, and the prior value shall be read only to determine the value to be stored.',
      'In i = i++;: The variable i is modified TWICE without an intervening sequence point: once by the postfix increment side-effect, and once by the assignment operator. Because the C standard specifies no ordering between when the assignment stores its value and when the postfix side-effect commits, the compiler is free to reorder the instructions arbitrarily.',
      'In arr[i] = i++;: Variable i is read (to determine array index) and modified (by i++) without a sequence point, resulting in unsequenced side-effects. The compiler may evaluate the left side before or after the increment, producing nondeterministic results or crashes. Modern GCC issues a warning: "operation on i may be undefined".'
    ]
  },
  {
    id: 'type-promotions-and-usual-arithmetic-conversions',
    level: 'hard',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Explain Integer Promotion and the Usual Arithmetic Conversions in C. Analyze the silent unsigned comparison trap: if (-1 < sizeof(int)).',
    answer: [
      '1. Integer Promotion Rules in C:',
      'Whenever small integer types (char, signed char, unsigned char, short, unsigned short) appear in expressions, the compiler automatically promotes them to int (or unsigned int if int cannot represent all values of the original type) before performing operations.',
      '2. Usual Arithmetic Conversions (The Hierarchy):',
      'When binary operators combine operands of differing types, the compiler systematically promotes the operand of lower rank to match the higher rank:',
      'long double > double > float > unsigned long long > long long > unsigned long > long > unsigned int > int.',
      '3. The Silent Unsigned Comparison Trap:',
      'Consider the code snippet: int x = -1; if (x < sizeof(int)) printf("True\\n"); else printf("False\\n");',
      'Intuitive expectation: -1 is less than 4, so it should print "True".',
      'Actual C execution: It prints "False"!',
      'Root Cause: The sizeof operator returns a value of type size_t, which is an UNSIGNED integer type (unsigned long). When the comparison operator (<) compares signed int x with unsigned size_t, the Usual Arithmetic Conversions dictate that the signed operand x must be implicitly converted to unsigned type.',
      'Under Two Complement, -1 converted to an unsigned 64-bit integer becomes 0xFFFFFFFFFFFFFFFF (18,446,744,073,709,551,615), which is vastly greater than 4! The condition evaluates to false silently, a frequent source of critical security vulnerabilities.'
    ]
  }
]

export default questions
