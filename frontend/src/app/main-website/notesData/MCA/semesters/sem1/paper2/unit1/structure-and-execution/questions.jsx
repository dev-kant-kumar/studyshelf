const questions = [
  {
    id: 'basic-structure-of-c-program',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Describe the six standard structural sections of a C program. Explain the significance of the main() function as the entry point.',
    answer: [
      'A canonical C program is organized into six functional sections:',
      '1. Documentation Section: Header comments containing program description, author identity, version, and licensing information (enclosed in /* ... */ or //).',
      '2. Link / Preprocessor Section: Directives such as #include <stdio.h> instructing the preprocessor to paste header declarations into the source before compilation.',
      '3. Definition Section: Preprocessor macro definitions (#define MAX_SIZE 100) and symbolic constants.',
      '4. Global Declaration Section: Declarations of global variables, user-defined types (struct, typedef), and function prototypes accessible throughout the compilation unit.',
      '5. main() Function Section: The mandatory execution entry point of every C program. In ISO C, its standard prototypes are int main(void) or int main(int argc, char *argv[]). Execution begins here and terminates when main returns an exit status code to the operating system.',
      '6. Subprogram / Function Definition Section: The implementation bodies of user-defined functions declared in the global section.'
    ]
  },
  {
    id: 'four-stages-of-compilation',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Trace the Four Stages of C Compilation. Detail the role of the Preprocessor, Compiler, Assembler, and Linker, including intermediate file formats.',
    answer: [
      'The GCC / Clang toolchain transforms high-level C source code into an executable binary through four sequential stages:',
      '1. Preprocessing (cpp): Handles directives starting with #. (a) Expands all header files (#include). (b) Replaces macro definitions (#define). (c) Evaluates conditional compilation directives (#ifdef, #endif). (d) Strips all comments. Input: source.c. Output: Preprocessed source (source.i), generated via: gcc -E source.c -o source.i.',
      '2. Compilation (cc1): The core compiler parses the preprocessed source, validates C grammar syntax, executes lexical and semantic analysis, applies optimizations (-O2), and translates C code into target processor assembly instructions. Output: Assembly file (source.s), generated via: gcc -S source.i -o source.s.',
      '3. Assembly (as): The assembler translates assembly language mnemonics (mov, add, push) into raw machine code opcodes, generating relocatable machine code. Output: Relocatable Object File (source.o), generated via: gcc -c source.s -o source.o.',
      '4. Linking (ld): The linker merges one or more object files (source.o, helper.o) with precompiled standard C runtime libraries (libc.a or libc.so), resolves external symbolic cross-references (such as calls to printf), resolves relocations, and packages the binary into the final executable format (ELF on Linux, PE on Windows): gcc source.o -o program.'
    ]
  },
  {
    id: 'memory-layout-of-c-process',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Illustrate and explain the Virtual Memory Layout of a running C process: Text, Data, BSS, Heap, and Stack segments.',
    answer: [
      'When the operating system loads an executable into memory, the process virtual address space is partitioned into five canonical segments:',
      '1. Text / Code Segment: Read-only memory region holding the compiled machine code instructions and string literals. Mapped with execute permissions (r-x) and write-protected to prevent accidental or malicious self-modification.',
      '2. Initialized Data Segment (.data): Stores global, static, and extern variables that are explicitly initialized by the programmer to non-zero values (e.g., int count = 10;). Allocated in the executable binary and loaded directly into read-write memory.',
      '3. Uninitialized Data Segment (.bss - Block Started by Symbol): Stores global and static variables that are uninitialized or initialized to zero (e.g., static int buffer[1024];). Wastes zero space in the on-disk binary; the operating system kernel zeroes this memory region dynamically during process loading.',
      '4. Heap Segment: Region allocated for dynamic memory at runtime via malloc(), calloc(), and realloc(). Begins immediately above the BSS segment and grows upward toward higher memory addresses. Managed by the user-space heap allocator and expanded via the brk/sbrk or mmap system calls.',
      '5. Call Stack Segment: Manages function call execution frames, local automatic variables, function parameters, and return addresses. Begins at high memory addresses and grows downward toward lower memory addresses. Managed automatically by CPU stack pointer registers (RSP/ESP).'
    ]
  },
  {
    id: 'static-vs-dynamic-linking-and-plt-got',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Compare Static Linking with Dynamic Linking in C. Explain how the dynamic linker (ld.so) utilizes the Global Offset Table (GOT) and Procedure Linkage Table (PLT) for Position-Independent Code (PIC).',
    answer: [
      '1. Static vs Dynamic Linking:',
      'Static Linking (gcc -static): The linker copies all library object code (from libc.a) directly into the final executable binary. Advantages: Self-contained binary with zero external dependencies; immune to "DLL Hell" or shared library version changes. Disadvantages: Bloated binary file sizes; wastes RAM because every running process loads duplicate copies of library code.',
      'Dynamic Linking (Default): The linker embeds only symbolic references and library dependency records (DT_NEEDED libc.so) into the executable. Advantages: Minimal binary size; operating system shares a single copy of library text pages across hundreds of concurrent processes in physical RAM.',
      '2. Lazy Binding via PLT and GOT in Position-Independent Code (PIC):',
      'Because shared libraries are loaded at random base addresses by ASLR, code cannot contain hardcoded function addresses. Linux resolves shared library calls lazily upon first execution:',
      'Step 1: When user code calls printf(), it actually calls a stub in the Procedure Linkage Table: printf@plt.',
      'Step 2: The PLT stub executes an indirect jump through an entry in the Global Offset Table: jmp *GOT[printf].',
      'Step 3: On the very first call, GOT[printf] points back to the next instruction in the PLT stub, which pushes the relocation index and jumps to the Dynamic Linker (ld.so).',
      'Step 4: ld.so resolves the true virtual memory address of printf in libc.so, writes that resolved address directly into the GOT[printf] entry, and transfers execution to printf.',
      'Step 5: On all subsequent calls, jmp *GOT[printf] jumps directly to printf in libc with zero dynamic linker overhead!'
    ]
  },
  {
    id: 'exit-vs-return-and-cleanup',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Analyze what occurs when a C program terminates via return 0 from main() vs exit(0) vs _exit(0). Detail atexit() handlers, stdio flushing, and parent process notifications.',
    answer: [
      'Process termination in C operates across distinct user-space library and kernel boundary tiers:',
      '1. return 0 in main():',
      'The C runtime startup code (crt1.o) that originally called main() receives the integer return value and immediately calls exit(status). Thus, returning from main() is functionally equivalent to invoking exit(). However, return from main destructs local stack variables in main before calling exit.',
      '2. exit(int status):',
      'High-level user-space termination function in stdlib.h. It executes three critical cleanup phases before invoking the kernel: (a) Executes all functions registered via atexit() and on_exit() in reverse order of registration (LIFO). (b) Flushes all open standard I/O stream output buffers (fflush) and closes all active streams (fclose). (c) Deletes all temporary files created by tmpfile(). (d) Invokes the kernel _exit() system call.',
      '3. _exit(int status) / _Exit(int status):',
      'Direct operating system system call (sys_exit). It terminates the process immediately in the kernel without executing atexit handlers and WITHOUT flushing stdio buffers! If buffered data remained in stdout, invoking _exit() permanently discards that unwritten data.',
      'Kernel Notification: In all cases, the kernel reclaims process memory pages, closes open file descriptors, transitions the process into a Zombie state (<defunct>), and delivers a SIGCHLD signal to the parent process, storing the 8-bit exit status in the task_struct until harvested by the parent via wait() or waitpid().'
    ]
  }
]

export default questions
