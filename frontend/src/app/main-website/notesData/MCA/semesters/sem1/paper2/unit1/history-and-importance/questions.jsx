const questions = [
  {
    id: 'history-and-evolution-of-c',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Trace the history and evolution of the C programming language. List the major ANSI/ISO C standards and their milestones.',
    answer: [
      'The C programming language was conceived between 1969 and 1973 by Dennis Ritchie at Bell Laboratories (AT&T). It evolved directly from Martin Richards BCPL (Basic Combined Programming Language, 1967) and Ken Thompson B language (1970). Thompson originally developed B to implement early iterations of the UNIX operating system on the DEC PDP-7, but B was untyped and tied to machine-word granularity. Ritchie extended B by introducing a structured type system, byte-level addressing, and structured control flow, naming the successor C.',
      'In 1973, UNIX was famously rewritten almost entirely in C, marking the first time a major operating system kernel achieved hardware portability without sacrificing low-level performance.',
      'Major Standardization Milestones:',
      '1. K&R C (1978): Brian Kernighan and Dennis Ritchie published "The C Programming Language", serving as the de facto language specification.',
      '2. ANSI C / C89 / ISO C90: Standardized by ANSI (X3.159-1989) and ISO (ISO/IEC 9899:1990). Introduced function prototypes, void pointers, const and volatile qualifiers, and the standardized C library.',
      '3. C99 (ISO/IEC 9899:1999): Added inline functions, variable-length arrays (VLAs), flexible array members, designated initializers, bool type in stdbool.h, long long int, and stdint.h fixed-width integer types.',
      '4. C11 (ISO/IEC 9899:2011): Introduced atomic operations, native multithreading support (threads.h), static assertions (_Static_assert), anonymous structs/unions, and removed the insecure gets() function.',
      '5. C17 / C18: Bug-fix and defect correction release without adding new syntactic features.',
      '6. C23: Modern standard integrating native bool, true/false keywords, typeof operator, nullptr keyword, [[nodiscard]] attributes, and binary integer constants.'
    ]
  },
  {
    id: 'c-as-middle-level-language',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Why is C categorized as a "middle-level" language? How does it bridge high-level abstraction with low-level hardware control?',
    answer: [
      'C is termed a "middle-level" programming language because it combines the structural clarity and high-level abstractions of third-generation languages with the direct bit-level manipulation and raw memory control characteristic of assembly language.',
      '1. High-Level Characteristics: (a) Structured control flow: rich branching and iterative constructs (if-else, switch, while, for). (b) Modularity: procedural decomposition into reusable functions with localized scope. (c) Abstract user-defined data structures: structures, unions, and enumerated types. (d) Hardware independence: programs adhere to standard ISO contracts, allowing cross-compilation across x86, ARM, RISC-V, and MIPS without rewriting algorithms.',
      '2. Low-Level Characteristics: (a) Direct memory manipulation: raw memory pointers permit arbitrary address dereferencing and arithmetic. (b) Bit-level operators: bitwise AND, OR, XOR, NOT, and shift operators map directly to single machine opcodes. (c) Inline assembly: ability to embed raw processor assembly instructions within C functions. (d) Minimal runtime overhead: zero automatic garbage collection, zero runtime bounds checking, and zero virtual machine abstraction layers. A C executable executes straight on the bare metal processor.'
    ]
  },
  {
    id: 'importance-for-data-structures-and-systems',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Explain why C is the foundational programming language for studying Data Structures and developing systems software.',
    answer: [
      'C is uniquely suited for mastering data structures because it exposes physical memory layout rather than hiding it behind opaque runtime abstractions:',
      '1. Transparent Physical Representation: In managed languages like Python or Java, an array of objects is actually an array of pointers pointing to scattered heap allocations with object headers and garbage-collection metadata. In C, an array is a strictly contiguous sequence of raw memory bytes. The student learns the exact formula connecting logical index i to physical byte address: Base + (i * element_size).',
      '2. Explicit Node Linking: Implementing linked lists, trees, and graphs in C requires declaring explicit memory pointers (*next, *left, *right) and tracking pointer lifetimes. This cultivates deep systems intuition regarding memory indirection, structural traversals, and cache spatial locality.',
      '3. Dominance in Systems Infrastructure: The world critical computing infrastructure is written in C: the Linux and Windows kernels, relational databases (PostgreSQL, MySQL, SQLite), high-performance web servers (Nginx), compiler toolchains (GCC, Clang/LLVM), and the language runtimes of Python (CPython) and Node.js (V8 engine hooks).'
    ]
  },
  {
    id: 'c-memory-model-vs-managed-runtimes',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Contrast C explicit memory management with managed runtimes (Java / Python). Analyze the trade-offs regarding deterministic latency, cache locality, and memory safety.',
    answer: [
      '1. Explicit Memory Management (C):',
      'Memory is requested explicitly via malloc() / calloc() and returned to the operating system via free().',
      'Advantages: (a) Deterministic Latency: Allocations and deallocations execute in bounded, predictable time without "Stop-The-World" garbage collection pauses, making C mandatory for real-time systems, audio/video codecs, and operating system kernels. (b) Optimal Cache Locality: Structs and arrays can be laid out contiguously in memory, maximizing CPU L1/L2 cache hit rates and hardware prefetcher efficiency. (c) Minimal Footprint: Zero garbage collector heap tracking, zero object header bloat, and zero VM memory overhead.',
      'Disadvantages: The programmer bears absolute responsibility for correctness. Common catastrophic bugs include: (1) Memory Leaks: Failing to free allocated memory, gradually starving the system. (2) Dangling Pointers: Dereferencing pointers after the target memory has been freed (Use-After-Free). (3) Double Free: Calling free() twice on the identical pointer, corrupting the heap allocator metadata.',
      '2. Managed Runtimes (Java, Python, C#):',
      'The language runtime automatically tracks object references and reclaims unreferenced memory via garbage collection algorithms (Mark-Sweep, Generational, Tracing GC).',
      'Trade-Off: Eliminates dangling pointers and double frees (memory safety), but introduces unpredictable GC pause spikes, heavy memory overhead (16-byte object headers per primitive object), and poor spatial cache locality due to scattered heap allocations.'
    ]
  },
  {
    id: 'c-behavior-taxonomy',
    level: 'hard',
    tags: ['Interview practice', 'Language specification'],
    question: 'Differentiate between Implementation-Defined Behavior, Unspecified Behavior, and Undefined Behavior in the ISO C Standard. Provide concrete code examples of each.',
    answer: [
      'The ISO C Standard strictly categorizes runtime operations into three distinct behavioral classes to balance compiler optimization flexibility across diverse hardware architectures:',
      '1. Implementation-Defined Behavior: The C standard allows the compiler implementation to make a specific choice, but the compiler documentation MUST explicitly specify its behavior.',
      'Example: The physical bit width and signedness of plain char (whether char is signed or unsigned by default), the size of integer types (whether int is 16, 32, or 64 bits), and the behavior of right-shifting a negative signed integer (arithmetic vs logical shift).',
      '2. Unspecified Behavior: The C standard allows multiple valid behavioral choices, and the compiler implementation is NOT required to document which choice it makes.',
      'Example: The order of argument evaluation in a function call. In f(g(), h()), whether g() or h() executes first is unspecified by the standard; relying on execution order is non-portable.',
      '3. Undefined Behavior (UB): The C standard imposes ABSOLUTELY NO REQUIREMENTS. The program is invalid: the compiler may generate corrupted machine code, crash with a segmentation fault, silently compute incorrect results, or erase formatting.',
      'Examples of UB: (a) Dereferencing a NULL or dangling pointer (*ptr). (b) Reading or writing out of array bounds (arr[10] on a 5-element array). (c) Signed integer arithmetic overflow (INT_MAX + 1). (d) Modifying a variable multiple times without an intervening sequence point: i = i++ + ++i.'
    ]
  }
]

export default questions
