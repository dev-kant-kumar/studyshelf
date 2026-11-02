const questions = [
  {
    id: 'api-vs-system-call',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Why do application programmers use Application Programming Interfaces (APIs) rather than directly invoking raw system calls?',
    answer: [
      'An API (such as the POSIX standard API in C or the Java API) defines a set of standardized functions available to an application programmer. A raw system call is the low-level, hardware-specific entry gate into the kernel.',
      'Programmers use APIs for three reasons: 1. Portability: An application written to the POSIX API can compile and run unchanged on Linux, macOS, and BSD, even though their underlying raw system call numbers and register conventions differ.',
      '2. Simplicity and Buffering: Standard C library wrapper functions (like fopen() and fread()) provide user-space buffering, reducing the number of expensive system call round-trips to the kernel.',
      '3. Error Translation: C library wrappers inspect the raw return code from the kernel, unpack error flags, populate the thread-local errno variable, and provide human-readable error diagnostics via perror() or strerror().'
    ]
  },
  {
    id: 'fork-execve-waitpid-lifecycle',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice', 'Practical'],
    question: 'Trace the lifecycle of process creation using fork(), execve(), and waitpid(). Why are fork and exec separate system calls in Unix?',
    answer: [
      'In Unix-like operating systems, process creation is deliberately split into two distinct orthogonal system calls:',
      '1. fork() duplicates the calling process, creating an exact child process. The child receives an identical copy of the parent address space (optimized via Copy-on-Write), file descriptor table, and credentials, but possesses a unique Process ID (PID). fork() returns 0 to the child and the child PID to the parent.',
      '2. execve() replaces the current process image (code segment, data segment, heap, and stack) with a completely new executable loaded from disk, while preserving open file descriptors.',
      'Separating fork() and execve() allows the shell or application to configure the execution environment between the two calls: redirecting standard I/O (using dup2() for pipes or files), changing user permissions, setting environment variables, or altering signal masks before the new program executes.',
      'waitpid() suspends the parent process until the child terminates, collecting the child exit status code and allowing the kernel to reap the child process control block (PCB), preventing Zombie processes.'
    ]
  },
  {
    id: 'errno-and-signal-interrupt',
    level: 'medium',
    tags: ['Interview practice'],
    question: 'How do Unix system calls signal error conditions, and what is EINTR?',
    answer: [
      'By convention, most Unix system calls return a signed integer where non-negative values indicate success (e.g., file descriptors or byte counts) and -1 indicates failure.',
      'When an error occurs, the kernel places a specific positive error number into the processor register, and the C library wrapper stores it into the thread-local variable errno (defined in <errno.h>). Examples include ENOENT (No such file or directory) and EACCES (Permission denied).',
      'EINTR (Interrupted system call) occurs when a slow blocking system call (such as read() waiting on a network socket) is interrupted by the delivery of an asynchronous signal (e.g. SIGINT or SIGALRM). The kernel aborts the system call and returns -1 with errno set to EINTR. Robust production software must check for this condition and restart the call in a loop, or configure signal handlers with the SA_RESTART flag.'
    ]
  },
  {
    id: 'shared-memory-vs-message-passing',
    level: 'medium',
    tags: ['Exam practice', 'Concept check'],
    question: 'Compare Shared Memory and Message Passing Inter-Process Communication (IPC).',
    answer: [
      'In Shared Memory IPC, communicating processes establish a common region of physical memory mapped into their respective virtual address spaces. Once established, data exchange occurs at full memory bus speeds using standard memory reads and writes without invoking the kernel. However, processes must implement their own user-space synchronization (such as mutexes or semaphores) to prevent race conditions.',
      'In Message Passing IPC, processes exchange discrete messages using kernel-mediated primitives (such as send() and receive() via pipes, message queues, or sockets). The kernel handles synchronization, buffer management, and isolation automatically. However, message passing incurs significant overhead because every message transfer requires kernel system calls and data buffer copies between user space and kernel memory.'
    ]
  }
]

export default questions
