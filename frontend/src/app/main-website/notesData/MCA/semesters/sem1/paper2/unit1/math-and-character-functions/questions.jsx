const questions = [
  {
    id: 'gcc-lm-flag-linking',
    level: 'medium',
    tags: ['Toolchain', 'Compilation'],
    question: "Why must GCC link with the -lm flag when compiling programs using math.h on POSIX systems?",
    answer: "On POSIX and Unix-like systems, the standard C library is divided into two separate binaries: libc.so (which contains general runtime routines such as printf, malloc, and string utilities) and libm.so (which contains floating-point mathematical routines such as sqrt, pow, sin, and cos). By default, the GCC driver automatically links against libc, but it does not link against libm to avoid unnecessary binary bloat and link overhead in non-mathematical programs. Passing the flag -lm instructs the linker (ld) to include libm.so during the symbol resolution stage, resolving external floating-point mathematical symbol definitions."
  },
  {
    id: 'edom-vs-erange-handling',
    level: 'hard',
    tags: ['Error handling', 'Language specification'],
    question: "What is the difference between domain errors (EDOM) and range errors (ERANGE) in math.h, and how are they handled?",
    answer: "A domain error (EDOM) occurs when an input argument lies outside the mathematical domain over which the function is defined, such as calling sqrt(-5.0) or log(-1.0). In such cases, the function sets errno to EDOM and returns NaN (Not-a-Number). A range error (ERANGE) occurs when the mathematically valid result cannot be represented within the finite precision and dynamic range of the return type (float or double), resulting in either overflow (such as pow(10.0, 500.0), which sets errno to ERANGE and returns HUGE_VAL or infinity) or underflow (returning zero or a subnormal number)."
  },
  {
    id: 'ctype-signed-char-bug',
    level: 'hard',
    tags: ['Security', 'Undefined behavior'],
    question: "Why do ctype.h classification functions take an int argument instead of a char, and what bug occurs if a signed char is passed directly?",
    answer: "Functions in ctype.h (such as isalpha, isdigit, and isspace) take an int argument because they must accept all valid values representable as an unsigned char (values 0 through 255) as well as the distinct negative integer macro EOF (typically -1) returned by getchar() or fgetc(). If a platform treats plain char as signed (with values -128 to +127), passing a negative byte directly results in passing a negative integer other than EOF. Because standard library ctype implementations typically use internal lookup tables indexed by the passed value offset, a negative index invokes undefined behavior or accesses out-of-bounds memory. To ensure safety, any char passed to ctype functions must be explicitly cast to unsigned char: isalpha((unsigned char)ch)."
  },
  {
    id: 'abs-vs-fabs-int-min-overflow',
    level: 'medium',
    tags: ['Exam practice', 'Integer arithmetic'],
    question: "How do abs() and fabs() differ in C, and what happens if abs() is called on INT_MIN?",
    answer: "abs() is declared in stdlib.h and operates strictly on integer values (int), returning an int. In contrast, fabs() is declared in math.h and operates on double-precision floating-point numbers (double), returning a double (with fabsf() for float and fabsl() for long double). When abs() is invoked on INT_MIN (-2,147,483,648 in 32-bit two's complement), its true mathematical absolute value (+2,147,483,648) cannot be represented within a signed 32-bit int, whose maximum value is INT_MAX (+2,147,483,647). This condition causes signed integer arithmetic overflow, which is undefined behavior in ISO C."
  },
  {
    id: 'ascii-arithmetic-case-conversion',
    level: 'easy',
    tags: ['ASCII', 'Bitwise operations'],
    question: "How can case conversion and digit conversion be performed directly using ASCII arithmetic without calling library functions?",
    answer: "In the ASCII standard, uppercase letters ('A' through 'Z') occupy codes 65 through 90, and lowercase letters ('a' through 'z') occupy codes 97 through 122. The difference between corresponding upper and lower case letters is exactly 32 ('a' - 'A' = 32), which corresponds to bit 5 (2 to the power of 5). Lowercase conversion can be performed by adding 32 or bitwise OR-ing with 32: ch | 32. Uppercase conversion can be performed by subtracting 32 or bitwise AND-ing with ~32: ch & ~32. For numeric characters ('0' through '9', codes 48 through 57), the numeric value is derived by subtracting the character literal '0': int digit = ch - '0'."
  }
]

export default questions
