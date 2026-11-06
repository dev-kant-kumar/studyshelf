const questions = [
  {
    id: 'constants-vs-variables-and-const',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Differentiate between Constants and Variables in C. Compare preprocessor #define constants with const-qualified variables.',
    answer: [
      '1. Constants vs Variables:',
      'A Variable is a named storage location in physical computer memory whose value can be dynamically inspected and modified during program execution. Every variable has a data type, memory address (&var), and value.',
      'A Constant is a fixed data value that cannot be altered by the program during execution (e.g., literal constants 42, 3.14159, \'A\', "Hello").',
      '2. #define vs const Variables:',
      '#define MACRO_NAME value: A textual preprocessor directive. (a) Handled before compilation by cpp. (b) Does not allocate physical memory. (c) Has zero type safety (simple textual substitution). (d) Has global file scope without respecting C lexical block boundaries.',
      'const data_type var_name = value: A C compiler-enforced type qualifier. (a) Handled during semantic compilation. (b) Possesses an explicit C data type and obeys standard block scoping rules. (c) May be placed in read-only memory (.rodata). (d) Can be inspected by debuggers (unlike macro constants).'
    ]
  },
  {
    id: 'primitive-types-and-twos-complement',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Detail the primitive integer data types in C. Explain how negative numbers are represented in memory using Two Complement arithmetic.',
    answer: [
      '1. Primitive Integer Types and Bit Widths (Standard x86-64 Data Models):',
      '(a) char: Exactly 1 byte (8 bits), range -128 to 127 (signed) or 0 to 255 (unsigned).',
      '(b) short int: Typically 2 bytes (16 bits), range -32,768 to 32,767.',
      '(c) int: Typically 4 bytes (32 bits), range -2,147,483,648 to 2,147,483,647.',
      '(d) long int: 8 bytes on 64-bit Linux (LP64) or 4 bytes on 64-bit Windows (LLP64).',
      '(e) long long int: Guaranteed minimum 8 bytes (64 bits), range -9.22 * 10<sup>18</sup> to 9.22 * 10<sup>18</sup>.',
      '2. Two Complement Representation:',
      'Virtually all modern microprocessors represent signed negative integers using Two Complement:',
      'Step 1: Write the positive binary representation of the magnitude.',
      'Step 2: Invert all bits (One Complement: flip 0s to 1s and 1s to 0s).',
      'Step 3: Add 1 to the least significant bit (LSB).',
      'Worked Example: Represent -5 in an 8-bit signed char:',
      '+5 in binary = 00000101.',
      'One Complement = 11111010.',
      'Add 1 = 11111010 + 1 = 11111011 (0xFB in hexadecimal).',
      'Why Two Complement is Universal: It provides a single representation for zero (unlike Sign-Magnitude, which has +0 and -0) and allows the CPU arithmetic logic unit (ALU) to perform subtraction using identical addition circuits without separate subtractor hardware!'
    ]
  },
  {
    id: 'floating-point-ieee754-representation',
    level: 'medium',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Explain IEEE 754 Floating-Point representation (float vs double). Why can decimal fractions like 0.1 not be represented exactly in binary floating-point?',
    answer: [
      '1. IEEE 754 Floating-Point Standard:',
      'Real numbers are stored in scientific notation: (-1)<sup>Sign</sup> * (1 + Fraction) * 2<sup>Exponent - Bias</sup>.',
      '(a) Single-Precision (float - 32 bits): 1 Sign bit, 8 Exponent bits (Bias = 127), 23 Mantissa / Fraction bits (~7 decimal digits of precision).',
      '(b) Double-Precision (double - 64 bits): 1 Sign bit, 11 Exponent bits (Bias = 1023), 52 Mantissa bits (~15 to 17 decimal digits of precision).',
      '2. Why 0.1 Cannot Be Represented Exactly in Binary:',
      'In base 10, a fraction has a finite terminating expansion if and only if the denominator prime factors are 2 and 5 (powers of 10). Thus, 1/10 = 0.1.',
      'In base 2 (binary), a fraction has a finite terminating expansion if and only if the denominator is a power of 2.',
      'When converting 0.1 to binary by repeated multiplication by 2:',
      '0.1 * 2 = 0.2 (0), 0.2 * 2 = 0.4 (0), 0.4 * 2 = 0.8 (0), 0.8 * 2 = 1.6 (1), 0.6 * 2 = 1.2 (1), 0.2 * 2 = 0.4 (0)...',
      'Result = 0.00011001100110011... (an infinite repeating non-terminating binary sequence!).',
      'Because physical registers hold a finite number of mantissa bits (23 or 52), the bit sequence must be rounded and truncated. This creates microscopic rounding errors: in C, comparing (0.1 + 0.2 == 0.3) evaluates to false because 0.1 + 0.2 = 0.30000000000000004! Floating-point comparisons must always test for proximity within an epsilon threshold: fabs(a - b) < 1e-9.'
    ]
  },
  {
    id: 'storage-classes-deep-dive',
    level: 'hard',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Compare the four C storage classes: auto, register, static, and extern across storage duration, scope, linkage, and memory segment allocation. Trace static local variables across function invocations.',
    answer: [
      'A storage class in C governs four fundamental properties: Storage Duration (lifetime), Scope (visibility), Linkage (visibility across files), and Memory Segment.',
      '1. auto (Automatic): Default for local variables declared inside a block. Stored on the Call Stack. Lifetime: duration of the enclosing block. Scope: local to the block. Linkage: none. Initial value: uninitialized garbage.',
      '2. register: Informs compiler to store the variable directly in a CPU register (e.g., RAX, RBX) for ultra-fast access. Memory address: has NO memory address (&reg is illegal in C!). Modern optimizing compilers (GCC -O2) ignore the keyword and allocate registers automatically.',
      '3. static:',
      '(a) Static Local Variable: Declared inside a function. Stored in .data (if initialized) or .bss (if zero). Lifetime: entire program execution! Retains its value across successive function calls. Initialized exactly ONCE when the process loads.',
      '(b) Static Global Variable / Function: Declared at file scope. Restricts linkage to Internal Linkage: the variable or function cannot be referenced or accessed by any other source file (.c) in the project, enforcing data encapsulation.',
      '4. extern: Declares a global variable or function with External Linkage whose physical definition and storage reside in another translation unit. Used to share global states across multiple source files without allocating duplicate storage.'
    ]
  },
  {
    id: 'lvalue-vs-rvalue-and-fixed-width-types',
    level: 'hard',
    tags: ['Interview practice', 'Language specification'],
    question: 'Explain Lvalue vs Rvalue in C. Why does x + 1 = 5 fail to compile? Detail fixed-width integer types from stdint.h.',
    answer: [
      '1. Lvalues and Rvalues in C:',
      'An Lvalue (Locator Value) is an expression that designates an object occupying an identifiable, physical memory address. A modifiable lvalue can appear on the left-hand side of an assignment operator (e.g., variable x, array element arr[0], or dereferenced pointer *ptr).',
      'An Rvalue (Read Value) is a temporary data value resulting from an expression evaluation that does not possess an identifiable memory location. An rvalue can only appear on the right-hand side of an assignment (e.g., literal 42, temporary computation x + 1).',
      'Why (x + 1) = 5 Fails to Compile: The expression (x + 1) computes a transient temporary value stored temporarily in a CPU register; it does not represent an addressable memory location (it is an rvalue). Since an assignment requires an lvalue on the left side to receive the stored bytes, the compiler rejects it with: "lvalue required as left operand of assignment".',
      '2. Fixed-Width Integer Types (C99 stdint.h):',
      'Because the sizes of int, long, and short vary across 32-bit and 64-bit operating systems, professional data structure implementations require exact, portable bit widths defined in <stdint.h>:',
      'int8_t / uint8_t: Exactly 8 bits (1 byte).',
      'int16_t / uint16_t: Exactly 16 bits (2 bytes).',
      'int32_t / uint32_t: Exactly 32 bits (4 bytes).',
      'int64_t / uint64_t: Exactly 64 bits (8 bytes).',
      'size_t: Unsigned integer type returned by sizeof; guarantees capacity to hold the maximum size of any object in memory.'
    ]
  }
]

export default questions
