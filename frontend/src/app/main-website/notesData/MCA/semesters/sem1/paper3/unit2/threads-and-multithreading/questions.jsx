const questions = [
  {
    id: 'process-vs-thread-state',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'What is a thread, and what execution state is private to each thread versus shared among threads in a process?',
    answer: [
      'A thread is the fundamental unit of CPU execution, often called a lightweight process (LWP). It represents an independent stream of control executing instructions within the address space of a host process.',
      'Per-thread private state includes: (1) a unique Thread Identifier (TID), (2) a private Program Counter (PC) tracking its current instruction, (3) a private CPU register set storing live calculation values, (4) a private runtime stack containing local variable activation records and return addresses, and (5) Thread-Local Storage (such as the thread-private errno variable).',
      'Shared process state across all sibling threads includes: (1) the executable code (Text segment), (2) global and static variables (.data and .bss segments), (3) the dynamic heap memory, (4) open file descriptors and socket handles, (5) process credentials and user ID, and (6) registered signal handling actions.'
    ]
  },
  {
    id: 'user-vs-kernel-threads',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare User-Level Threads (ULT) and Kernel-Level Threads (KLT) across management overhead, blocking behavior, and multicore scaling.',
    answer: [
      'User-Level Threads (ULT) are managed entirely in user space by a runtime thread library (such as GNU Portable Threads or early Green Threads) without kernel awareness. Thread creation, scheduling, and context switching occur via local function calls without transitioning to Ring 0, making them exceptionally fast. However, if any user thread issues a blocking system call (such as a synchronous disk read), the entire process and all sibling threads are blocked because the kernel treats the entire process as a single schedulable unit. Furthermore, ULT cannot execute simultaneously on multiple physical CPU cores.',
      'Kernel-Level Threads (KLT) are directly maintained, recognized, and scheduled by the operating system kernel. If one thread blocks on an I/O operation, the kernel can immediately schedule another sibling thread to continue computation on the CPU. KLT can also execute concurrently across multiple physical CPU cores, achieving true hardware parallelism. The trade-off is higher creation and context switching overhead because every thread operation requires a kernel privilege switch (Ring 3 to Ring 0).'
    ]
  },
  {
    id: 'multithreading-models-analysis',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Describe the Many-to-One, One-to-One, and Many-to-Many multithreading models, highlighting the model adopted by modern Linux.',
    answer: [
      'The Many-to-One model maps multiple user-level threads onto a single kernel thread. Thread management is efficient in user space, but true multicore parallelism is impossible, and one blocking system call halts all threads.',
      'The One-to-One model maps each user thread directly to an independent kernel thread. This provides high concurrency because blocking calls do not stall sibling threads, and multiple threads execute in parallel across multicore processors. Modern Linux (using the Native POSIX Thread Library, NPTL) and modern Windows utilize the One-to-One model.',
      'The Many-to-Many model multiplexes many user threads onto a smaller or equal number of kernel threads. Developers can create hundreds of threads without overloading kernel resources, and blocking system calls do not freeze the entire application. However, the architectural complexity of coordinating user and kernel schedulers (scheduler activations) has led most modern general-purpose operating systems to favor the One-to-One model instead.'
    ]
  },
  {
    id: 'concurrency-vs-parallelism',
    level: 'easy',
    tags: ['Concept check', 'Interview practice'],
    question: 'Distinguish between concurrency and parallelism with respect to single-core and multi-core CPU architectures.',
    answer: [
      'Concurrency is the capability of an operating system to manage, structure, and make progress on multiple tasks over overlapping time frames. On a single-core CPU, concurrency is achieved through rapid time slicing: the scheduler rapidly switches execution between threads, creating the illusion of simultaneity even though only one instruction is executing at any discrete instant in time.',
      'Parallelism is the simultaneous execution of two or more distinct instructions or threads at the exact same physical instant in hardware. Parallelism requires multiple physical execution cores, independent ALU hardware units, or distributed processor nodes.',
      'In short: concurrency is about structure and handling lots of things at once; parallelism is about simultaneous execution and doing lots of things at once.'
    ]
  },
  {
    id: 'thread-cancellation-modes',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'Explain thread cancellation and compare asynchronous cancellation with deferred cancellation.',
    answer: [
      'Thread cancellation is the mechanism of terminating a target thread before it has completed its standard execution routine (such as canceling a long-running search thread once another thread finds the answer).',
      'Asynchronous cancellation forces the target thread to terminate immediately when the cancellation signal arrives. This is dangerous because if the thread is halted mid-operation while holding a mutex lock, allocating heap memory, or writing to a shared data structure, resources remain permanently locked and shared memory is left corrupted, producing application deadlocks.',
      'Deferred cancellation is the standard and safe model. The target thread does not terminate immediately upon receiving the cancellation request. Instead, a cancellation pending flag is set, and the thread terminates only when it reaches explicitly defined cancellation points (such as POSIX system calls read(), write(), sleep(), or an explicit call to pthread_testcancel()). This ensures that the thread can run cleanup handlers, release mutex locks, and exit without leaving shared state corrupted.'
    ]
  }
]

export default questions
