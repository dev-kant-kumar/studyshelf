const questions = [
  {
    id: 'problem-solving-phases-and-flowcharts',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Outline the structured phases of problem-solving using C. Differentiate between an Algorithm and a Flowchart.',
    answer: [
      'Developing robust software in C follows a disciplined multi-phase methodology:',
      '1. Problem Definition: Formulate clear boundary conditions, valid input domains, precision limits, and expected outputs.',
      '2. Algorithm Design: Construct a step-by-step, finite, unambiguous sequence of logical operations that transforms inputs into outputs.',
      '3. Visual Flowcharting: Diagrammatically represent the algorithm using standardized ANSI symbols (Ovals for terminal Start/End, Parallelograms for Input/Output, Rectangles for Computation, Rhombuses for Decision Branching, and Directed Arrows for Control Flow).',
      '4. Implementation (Coding): Translate the flowchart into standard ISO C source code using structured constructs.',
      '5. Compilation and Static Analysis: Compile with strict diagnostic flags (gcc -Wall -Wextra -pedantic) to resolve syntax errors and warnings.',
      '6. Testing and Debugging: Execute test suites across nominal cases, boundary limits (e.g., zero, negative inputs, empty files), and stress tests to eliminate runtime and logic errors.',
      '7. Documentation and Maintenance: Add descriptive header comments, document preconditions/postconditions, and preserve clean code formatting.'
    ]
  },
  {
    id: 'printf-and-scanf-mechanics',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Detail the internal mechanics of printf() and scanf(). Why is validating the return value of scanf() vital for robust systems programming?',
    answer: [
      '1. printf() Mechanics:',
      'Defined in stdio.h, int printf(const char *format, ...); is a variadic function that writes formatted output to stdout. It parses the format string character by character: plain characters are output directly, while conversion specifications (%d, %u, %f, %lf, %c, %s, %p) instruct printf to extract arguments from the call stack according to standard calling conventions. It returns the total number of characters successfully printed, or a negative value upon output failure.',
      '2. scanf() Mechanics and the Address Operator:',
      'int scanf(const char *format, ...); reads formatted input from stdin. Unlike languages with call-by-reference, C passes all parameters by value. Therefore, scanf requires the memory address (&variable) of target variables so it can directly store parsed values into their physical memory locations.',
      '3. Why Validating scanf() Return Value is Critical:',
      'scanf() returns an integer representing the number of input items successfully matched and assigned. If an expected integer (%d) encounters non-numeric characters (e.g., user inputs "abc"), matching fails immediately without assigning a value to the target variable, and the offending characters remain unconsumed in the stdin buffer.',
      'If code fails to check scanf return value, the target variable retains uninitialized garbage memory, leading to undefined behavior or infinite loops. Defensive C code must always check: if (scanf("%d", &val) != 1) { /* handle error and flush buffer */ }.'
    ]
  },
  {
    id: 'standard-streams-and-buffering',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Explain standard I/O streams (stdin, stdout, stderr) and their buffering modes. How does fflush() operate, and why should fflush(stdin) NEVER be used?',
    answer: [
      '1. The Three Standard Streams:',
      'Every C program automatically inherits three open file streams upon launch: (a) stdin (standard input, fd 0): source of user input (keyboard/pipe). (b) stdout (standard output, fd 1): primary stream for program output (terminal/redirected file). (c) stderr (standard error, fd 2): unbuffered diagnostic channel for warnings and error traces, isolated from standard output.',
      '2. Stream Buffering Modes in C (setvbuf):',
      '(a) Fully Buffered (_IOFBF): Data is flushed to the OS kernel only when the internal buffer (typically 4 KB or 8 KB) fills completely. Default when stdout is redirected to a physical disk file.',
      '(b) Line Buffered (_IOLBF): Data is flushed whenever a newline character (\\n) is encountered or the buffer fills. Default for stdout when connected to an interactive terminal.',
      '(c) Unbuffered (_IONBF): Every character write is immediately committed to the OS via write() system calls with zero caching. Default for stderr to ensure crash diagnostics appear instantly.',
      '3. fflush() Semantics:',
      'int fflush(FILE *stream); forces all buffered, unwritten data for an OUTPUT stream to be written to the underlying file or device.',
      'Why fflush(stdin) is Undefined Behavior: The ISO C standard (ISO/IEC 9899, section 7.21.5.2) explicitly states that fflush() is defined ONLY for output streams and update streams whose previous operation was not input. Applying fflush() to an input stream like stdin produces Undefined Behavior. Portable code flushes stdin by consuming lingering characters in a loop: int c; while ((c = getchar()) != \'\\n\' && c != EOF);.'
    ]
  },
  {
    id: 'defensive-programming-example',
    level: 'hard',
    tags: ['Exam practice', 'Implementation practice'],
    question: 'Write a complete, robust C program that reads N floating-point grades, computes their arithmetic mean and sample standard deviation, and validates all inputs defensively.',
    answer: [
      'Here is a production-grade, defensive C11 implementation:',
      '#include <stdio.h>',
      '#include <stdlib.h>',
      '#include <math.h>',
      '#include <stdbool.h>',
      '',
      'void flush_stdin(void) {',
      '    int c;',
      '    while ((c = getchar()) != \'\\n\' && c != EOF);',
      '}',
      '',
      'int main(void) {',
      '    int n = 0;',
      '    printf("Enter number of grades (2 to 1000): ");',
      '    while (scanf("%d", &n) != 1 || n < 2 || n > 1000) {',
      '        printf("Invalid input. Please enter an integer between 2 and 1000: ");',
      '        flush_stdin();',
      '    }',
      '',
      '    double *grades = malloc((size_t)n * sizeof(double));',
      '    if (grades == NULL) {',
      '        fprintf(stderr, "Fatal Error: Memory allocation failed.\\n");',
      '        return EXIT_FAILURE;',
      '    }',
      '',
      '    double sum = 0.0;',
      '    for (int i = 0; i < n; i++) {',
      '        printf("Grade #%d (0.0 to 100.0): ", i + 1);',
      '        while (scanf("%lf", &grades[i]) != 1 || grades[i] < 0.0 || grades[i] > 100.0) {',
      '            printf("Invalid grade. Re-enter Grade #%d: ", i + 1);',
      '            flush_stdin();',
      '        }',
      '        sum += grades[i];',
      '    }',
      '',
      '    double mean = sum / n;',
      '    double variance_sum = 0.0;',
      '    for (int i = 0; i < n; i++) {',
      '        double diff = grades[i] - mean;',
      '        variance_sum += diff * diff;',
      '    }',
      '    double std_dev = sqrt(variance_sum / (n - 1));',
      '',
      '    printf("\\n--- Statistical Summary ---\\n");',
      '    printf("Sample Count (N)   : %d\\n", n);',
      '    printf("Arithmetic Mean    : %.2f\\n", mean);',
      '    printf("Sample Std Dev     : %.2f\\n", std_dev);',
      '',
      '    free(grades);',
      '    return EXIT_SUCCESS;',
      '}'
    ]
  },
  {
    id: 'compiler-flags-and-static-analysis',
    level: 'hard',
    tags: ['Interview practice', 'Toolchain engineering'],
    question: 'How do GCC/Clang compiler diagnostic flags (-Wall -Wextra -Werror -pedantic -std=c11 -O2 -fsanitize=address) harden C software against defects?',
    answer: [
      'In professional C systems engineering, the compiler is the first and most powerful static analysis defense line against defects:',
      '1. -std=c11: Enforces adherence to the ISO/IEC 9899:2011 standard baseline, disabling non-standard compiler extensions and ensuring portability.',
      '2. -Wall: Enables a broad suite of high-confidence warning diagnostics, including uninitialized variables, unused variables, missing return statements in non-void functions, and faulty format strings in printf/scanf.',
      '3. -Wextra: Activates additional rigorous checks not covered by -Wall, such as unsigned-signed comparison warnings, unused function parameters, and empty body statements.',
      '4. -pedantic: Strictly issues warnings for any code construct that violates the ISO C standard, even if the compiler would normally accept it as an extension.',
      '5. -Werror: Upgrades all compiler warnings into fatal errors, completely blocking build completion until every warning is cleanly resolved.',
      '6. -O2: Activates aggressive compiler optimizations (loop unrolling, dead code elimination, constant propagation, register allocation). High optimization levels also empower the compiler data-flow analyzer to detect subtle uninitialized paths that lower optimization levels miss.',
      '7. -fsanitize=address,undefined (ASan / UBSan): Injects runtime instrumentation that detects out-of-bounds array indexing, use-after-free, double frees, and undefined signed integer overflows instantly with detailed memory stack dumps.'
    ]
  }
]

export default questions
