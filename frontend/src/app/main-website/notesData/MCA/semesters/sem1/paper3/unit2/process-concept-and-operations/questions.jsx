const questions = [
  {
    id: 'process-definition-and-memory-layout',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define a process and describe its memory layout in virtual address space.',
    answer: [
      'A process is an active program in execution. While a program is a passive entity stored on disk as an executable file (such as an ELF binary), a process is an active entity with an execution state, program counter, CPU registers, and an isolated virtual address space allocated by the operating system.',
      'The virtual address space of a standard 32-bit or 64-bit user process is organized into distinct segments: the Text segment (read-only executable machine code instructions), the Initialized Data segment (.data, holding global and static variables initialized by the programmer), the Uninitialized Data segment (.bss, holding zero-initialized global and static variables), the Heap (dynamically allocated memory that grows upward toward higher addresses via brk, sbrk, or mmap), and the Stack (activation frames, local variables, and return addresses that grow downward toward lower addresses).',
      'Between the dynamic heap and user stack lies an unmapped virtual address gap, which allows both dynamic structures to grow during runtime without colliding until physical memory or virtual address limits are exhausted.'
    ]
  },
  {
    id: 'pcb-contents-and-role',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'What is a Process Control Block (PCB)? Detail at least five critical fields stored within it.',
    answer: [
      'The Process Control Block (PCB), represented as struct task_struct in the Linux kernel, is the central kernel data structure that stores all metadata and execution state required to manage an active process.',
      'Five critical fields stored in the PCB include: (1) Process State (indicates whether the process is Ready, Running, Waiting, or Terminated), (2) Program Counter and CPU Registers (saves %rip, %rsp, base pointers, and general-purpose registers when the process is suspended during a context switch), (3) CPU Scheduling Information (process priority, scheduling queue pointers, and virtual runtime vruntime in Linux CFS), (4) Memory Management Information (pointers to page tables, base/limit registers, and mm_struct detailing valid memory segments), and (5) Accounting and I/O Status Information (process ID PID, parent PID PPID, CPU time consumed, open file descriptor table, and assigned peripheral devices).'
    ]
  },
  {
    id: 'context-switching-direct-vs-indirect-cost',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'Explain the mechanics of a context switch and distinguish between direct and indirect context switching overhead.',
    answer: [
      'A context switch is the sequence of kernel operations that stops the currently running process on a CPU core, preserves its complete hardware execution context, and restores the saved execution context of another process selected from the ready queue.',
      'Direct overhead encompasses the deterministic CPU cycles spent executing kernel instructions: saving the current CPU register set into the outgoing process PCB, switching the kernel stack pointer, updating the page directory base register (such as loading CR3 on x86-64), and loading the incoming process registers. Direct switching typically consumes between 1 and 5 microseconds.',
      'Indirect overhead arises from architectural cache disruption: changing the active virtual address space flushes the Translation Lookaside Buffer (TLB) unless Address Space Identifiers (ASID/PCID) are enabled, and the incoming process encounters a cold L1/L2/L3 hardware cache. Subsequent instruction fetches and data reads suffer repeated cache misses and main memory stalls until the working set is reloaded into cache hierarchies, causing significant latency penalties.'
    ]
  },
  {
    id: 'fork-exec-cow-mechanics',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'How do fork() and exec() interact, and why is Copy-on-Write (COW) essential for efficient process creation?',
    answer: [
      'In POSIX operating systems, process creation is decoupled into two distinct system calls: fork() creates an exact duplicate clone of the calling parent process, while execve() replaces the calling process memory image, text, and heap with a completely new executable binary from disk.',
      'Without optimization, fork() would require physically copying every RAM page allocated to the parent, which is computationally wasteful because child processes often invoke execve() immediately afterward, discarding the copied memory pages.',
      'Copy-on-Write (COW) optimizes this by duplicating only the page tables during fork(), marking all virtual memory pages in both parent and child as read-only. Both processes share the exact same physical RAM frames until either process attempts a write operation. The CPU hardware then generates a page fault, the kernel allocates a new physical frame, copies the single modified page, updates the page table entry to read-write, and resumes execution seamlessly.'
    ]
  },
  {
    id: 'zombie-vs-orphan-processes',
    level: 'medium',
    tags: ['Concept check', 'Exam practice'],
    question: 'Distinguish between a zombie process and an orphan process, and explain how each is resolved by the operating system.',
    answer: [
      'A zombie process (marked as <defunct> in process listings) is a process that has completed execution via exit(), released its virtual memory, file descriptors, and user space structures, but still retains its entry in the process table. It remains a zombie so its parent process can read its exit status code via the wait() or waitpid() system call. Once the parent reaps the child with wait(), the kernel completely purges the PCB from the process table.',
      'An orphan process occurs when a parent process terminates before its child process finishes execution. Because an orphaned process has no parent to wait() for it upon termination, it would permanently become a zombie if left unattended.',
      'To prevent zombie accumulation, the operating system kernel re-parents orphan processes to the root ancestor process (PID 1, historically init, and systemd on modern Linux systems). PID 1 periodically invokes wait() in an event loop, immediately reaping all adopted orphan children when they terminate.'
    ]
  },
  {
    id: 'shared-memory-vs-message-passing',
    level: 'hard',
    tags: ['Interview practice', 'Exam practice'],
    question: 'Compare Shared Memory and Message Passing IPC mechanisms across speed, kernel intervention, and synchronization requirements.',
    answer: [
      'Shared Memory establishes a region of physical RAM that is mapped concurrently into the virtual address spaces of two or more independent processes. Once the mapping is configured via shm_open() and mmap(), data transfers occur at raw memory bus speeds without invoking the kernel or copying buffers. However, the operating system provides no automatic synchronization, placing the responsibility on application developers to coordinate access using semaphores, mutexes, or atomic flags to prevent race conditions.',
      'Message Passing exchanges data via explicit kernel-mediated communication primitives (such as pipes, message queues, and sockets). Every message transmission requires transitioning into kernel mode and copying data from the sender user buffer to a kernel intermediate buffer, and then from the kernel buffer to the receiver user space. While slower due to system call overhead and dual memory copies, Message Passing is inherently synchronized by the kernel and scales seamlessly across networked distributed systems where processes do not share physical memory.'
    ]
  }
]

export default questions
