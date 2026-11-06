const questions = [
  {
    id: 'string-literal-vs-char-array-memory',
    level: 'medium',
    tags: ['Memory segmentation', 'Pointers'],
    question: "What is the critical difference in memory storage and mutability between 'char *s = \"hello\";' and 'char s[] = \"hello\";'?",
    answer: "In 'char *s = \"hello\";', the string literal \"hello\" is placed by the compiler in the read-only data section (.rodata or text segment) of the executable, and s is a pointer storing the address of that immutable memory. Attempting to modify characters through s (e.g., s[0] = 'H';) triggers a hardware memory protection fault, resulting in a runtime Segmentation Fault (SIGSEGV). In contrast, 'char s[] = \"hello\";' allocates an automatic array of 6 bytes on the local stack frame and copies the characters (including the terminating '\\0') into that mutable stack memory, permitting safe character reads and writes."
  },
  {
    id: 'gets-function-removal-in-c11',
    level: 'easy',
    tags: ['Security', 'Standards'],
    question: "Why was the gets() function deprecated in C99 and completely removed from the ISO C11 standard?",
    answer: "The gets() function reads characters from standard input into a destination buffer until a newline or EOF is encountered. However, gets() has no parameter to specify the maximum capacity of the destination buffer. If the user or an attacker enters more characters than the buffer can hold, gets() writes unconditionally past the allocated memory boundary. This classic stack buffer overflow overwrites adjacent local variables, frame pointers, and the function return address on the call stack, enabling arbitrary remote code execution (as demonstrated by the 1988 Morris Worm). C11 removed gets() entirely, requiring fgets(buf, sizeof(buf), stdin) instead."
  },
  {
    id: 'strncpy-null-termination-hazard-vs-snprintf',
    level: 'hard',
    tags: ['Defensive programming', 'Buffer safety'],
    question: "Why does strncpy() fail to guarantee null-termination, and how does snprintf() provide a safer alternative?",
    answer: "According to the ISO C standard, if the length of the source string is greater than or equal to the specified limit n, strncpy(dest, src, n) copies exactly n bytes and does NOT append a terminating null byte ('\\0'). The resulting buffer is not a valid C string, causing subsequent string functions (like strlen or printf) to read past the buffer until encountering a random zero byte in memory. Additionally, if the source string is shorter than n, strncpy zero-fills the remainder of the buffer, causing performance overhead. A far safer, standard idiom is snprintf(dest, sizeof(dest), \"%s\", src), which is guaranteed to null-terminate the destination buffer as long as sizeof(dest) > 0."
  },
  {
    id: 'kr-string-copy-idiom-evaluation',
    level: 'medium',
    tags: ['Idioms', 'Pointers'],
    question: "How does the Ritchie K&R while loop 'while ((*dest++ = *src++));' copy a string in C?",
    answer: "The idiomatic K&R string copy loop evaluates in four synchronized steps per iteration: 1. *src dereferences the current source character; 2. *dest = *src assigns that character into the current destination cell; 3. The post-increment operators (dest++, src++) advance both pointers to point to their next respective memory addresses; 4. The value of the assignment expression is the character copied. For non-zero characters (ASCII 1 to 255), the controlling condition evaluates to non-zero (true), continuing the loop. When the terminating null byte ('\\0', ASCII 0) is copied, the expression evaluates to 0 (false), terminating the loop after the null terminator has already been written."
  },
  {
    id: 'strtok-thread-safety-and-mutation',
    level: 'hard',
    tags: ['Concurrency', 'POSIX'],
    question: "Why is strtok() considered non-reentrant and thread-unsafe, and what standard alternative should be used?",
    answer: "strtok() maintains its parsing state between successive calls using an internal static local pointer variable. Because this static pointer is shared across the entire process, calling strtok() simultaneously from multiple concurrent threads or nesting strtok() calls to parse inner tokens overwrites the shared state, corrupting the parse stream. Furthermore, strtok() mutates the original string in-place by writing null bytes ('\\0') over delimiter characters, meaning it cannot parse read-only string literals. In multithreaded systems, developers must use the reentrant POSIX function strtok_r(), which accepts an explicit context pointer parameter (char **saveptr)."
  }
]

export default questions
