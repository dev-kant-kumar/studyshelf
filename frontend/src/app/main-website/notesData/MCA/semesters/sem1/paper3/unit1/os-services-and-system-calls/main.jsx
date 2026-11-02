import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const syscallTaxonomyTable = {
    caption: 'The Five Foundational Categories of POSIX Operating System Calls',
    headers: ['System Call Category', 'Core Operating Mechanism', 'Key POSIX System Calls', 'Kernel Subsystem Invoked', 'Primary Failure Modes'],
    rows: [
      [
        'Process Control',
        'Process lifecycle, scheduling priority, image replacement, signal delivery.',
        'fork(), execve(), waitpid(), exit(), kill(), getpid(), nice()',
        'Process Scheduler, Task Subsystem, Signal Dispatcher',
        'EAGAIN (process limit reached), ENOMEM (insufficient RAM), ECHILD'
      ],
      [
        'File Manipulation',
        'File creation, directory traversal, read/write, file locking, metadata inspection.',
        'open(), read(), write(), close(), lseek(), unlink(), stat(), fcntl()',
        'Virtual File System (VFS), Physical File Systems (ext4, XFS)',
        'ENOENT (no such file), EACCES (permission denied), ENOSPC (disk full)'
      ],
      [
        'Device Management',
        'Direct hardware configuration, device buffer transfers, terminal line disciplines.',
        'ioctl(), read(), write(), select(), poll(), epoll_ctl()',
        'Device Drivers, Character/Block Subsystem, APIC Bus Controllers',
        'ENODEV (no such device), EBUSY (device resource currently locked)'
      ],
      [
        'Information Maintenance',
        'System clock synchronization, resource accounting, CPU/memory telemetry.',
        'gettimeofday(), clock_gettime(), alarm(), sysinfo(), uname()',
        'Kernel Timer Subsystem, System Statistics Tracker',
        'EFAULT (invalid user buffer pointer address)'
      ],
      [
        'Communication & IPC',
        'Inter-process data exchange across memory boundaries or network sockets.',
        'pipe(), socket(), bind(), connect(), listen(), accept(), shmget()',
        'Networking Stack (TCP/IP), IPC Buffers, Shared Memory Subsystem',
        'ECONNREFUSED (port closed), EADDRINUSE, EPIPE (broken pipe)'
      ]
    ]
  }

  const apiVsSyscallTable = {
    caption: 'Architectural Comparison: Application Programming Interface (API) vs System Call',
    headers: ['Comparison Dimension', 'User Space API (e.g. Standard C Library)', 'Operating System System Call (Kernel Entry)'],
    rows: [
      [
        'Execution Privilege Level',
        'Executes in User Mode (Ring 3).',
        'Executes in Kernel Mode (Ring 0) after hardware trap.'
      ],
      [
        'Portability',
        'High; POSIX API code compiles across Linux, macOS, BSD, and Windows.',
        'Low; system call numbers and register conventions are OS-specific.'
      ],
      [
        'Execution Overhead',
        'Negligible; standard C function call (a few CPU clock cycles).',
        'High; privilege mode switch, register marshalling, kernel stack construction.'
      ],
      [
        'Buffering & Optimization',
        'User-space buffer (e.g., fopen/fread buffers 4 KB to minimize syscalls).',
        'Direct kernel buffer access; each call invokes driver and hardware controllers.'
      ]
    ]
  }

  const ipcComparisonTable = {
    caption: 'Inter-Process Communication Paradigms: Shared Memory vs Message Passing',
    headers: ['Evaluation Parameter', 'Shared Memory IPC', 'Message Passing IPC (Pipes, Sockets, Queues)'],
    rows: [
      [
        'Kernel Involvement',
        'Only during initial setup; subsequent data transfers bypass kernel completely.',
        'Every single read and write operation requires a kernel system call.'
      ],
      [
        'Transfer Speed',
        'Maximum; limited only by hardware memory bus bandwidth (~50-100 GB/s).',
        'Moderate; bounded by context switching and memory-copy overhead.'
      ],
      [
        'Synchronization Responsibility',
        'Application must implement mutual exclusion (mutexes, semaphores).',
        'Kernel automatically handles message queuing, synchronization, and blocking.'
      ],
      [
        'Distributed Capability',
        'Strictly confined to a single physical machine with shared RAM.',
        'Seamlessly extends across networks using network sockets (e.g. TCP/IP).'
      ]
    ]
  }

  const processLifecycleCode = `// Linux C Demonstration: Complete Process Lifecycle (fork, execve, waitpid)
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <errno.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        // fork() failed
        perror("fork failed to create child process");
        exit(EXIT_FAILURE);
    } else if (pid == 0) {
        // Child Process Context (pid == 0)
        printf("[Child PID %d] Executing image replacement via execve...\\n", getpid());
        
        char *args[] = {"/bin/ls", "-lh", "/tmp", NULL};
        char *envp[] = {NULL};

        // Replace child memory image with /bin/ls executable
        if (execve("/bin/ls", args, envp) == -1) {
            perror("execve failed to load executable");
            exit(EXIT_FAILURE);
        }
    } else {
        // Parent Process Context (pid holds child PID)
        printf("[Parent PID %d] Created child process with PID %d. Waiting...\\n", getpid(), pid);

        int status;
        // waitpid suspends parent until child with given PID terminates
        pid_t terminated_pid = waitpid(pid, &status, 0);

        if (terminated_pid == -1) {
            perror("waitpid failed");
            exit(EXIT_FAILURE);
        }

        if (WIFEXITED(status)) {
            printf("[Parent] Child %d terminated normally with exit status %d.\\n",
                   terminated_pid, WEXITSTATUS(status));
        } else if (WIFSIGNALED(status)) {
            printf("[Parent] Child %d killed by signal %d.\\n",
                   terminated_pid, WTERMSIG(status));
        }
    }

    return EXIT_SUCCESS;
}`

  return (
    <>
      <p>
        The operating system presents two fundamental interfaces: one to human users through system utilities and shells, and another to executing software programs through the system call interface. For MCA students preparing for academic examinations and systems programming interviews, mastering operating system services and system calls requires understanding the POSIX API contract, process lifecycle primitives, and system call error-handling mechanics.
      </p>

      <h2>What you will learn</h2>
      <ul>
        <li>Operating system user interfaces: Command-Line Interfaces (CLI), Graphical User Interfaces (GUI), and batch automation.</li>
        <li>Core operating system services: Program execution, I/O arbitration, file systems, IPC, error detection, resource allocation, and accounting.</li>
        <li>The five foundational POSIX system call categories: Process control, file manipulation, device management, information maintenance, and communications.</li>
        <li>The process creation lifecycle: Tracing <code>fork()</code>, <code>execve()</code>, and <code>waitpid()</code> with process state transitions.</li>
        <li>System call error handling: The thread-local <code>errno</code> variable, error codes (<code>ENOENT</code>, <code>EACCES</code>), and signal interruption (<code>EINTR</code>).</li>
        <li>Inter-process communication architectures: Shared Memory vs Message Passing trade-offs.</li>
      </ul>

      <h2>1. Operating System User Interfaces</h2>
      <p>
        Users interact with the operating system through one of three primary interface modalities:
      </p>
      <ul>
        <li>
          <strong>Command-Line Interface (CLI / Shell):</strong> A text-oriented interpreter (such as <code>bash</code>, <code>zsh</code>, or PowerShell) that accepts typed commands from the user and executes them. The shell is not part of the kernel; it is a standard user-space program that translates user commands into underlying system calls.
        </li>
        <li>
          <strong>Graphical User Interface (GUI):</strong> A visual desktop environment utilizing windows, icons, menus, and pointers (WIMP). Mouse clicks and touch gestures generate event streams that window managers map to system requests.
        </li>
        <li>
          <strong>Batch Interface:</strong> Commands and control instructions are supplied non-interactively in batch control files or automation scripts (e.g. systemd unit files or cron schedules).
        </li>
      </ul>

      <h2>2. Core Operating System Services</h2>
      <p>
        An operating system provides an environment for the execution of programs. The services provided can be categorized into functions that assist the user program and functions that ensure the safe, efficient operation of the system itself:
      </p>

      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>1. Program Execution:</strong>
          <p className="text-sm my-1">
            The OS must load an executable file (code, constants, and static data) from secondary storage into main memory, allocate a private virtual address space, configure stack and heap segments, initialize CPU registers, and schedule the program for execution.
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>2. I/O Operations:</strong>
          <p className="text-sm my-1">
            A running program cannot interact directly with physical hardware controllers. The OS provides uniform stream-oriented and block-oriented interfaces, managing device buffers, DMA channels, and interrupt handlers on behalf of the application.
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>3. File System Manipulation:</strong>
          <p className="text-sm my-1">
            Programs must read, write, create, truncate, and delete named files and directory hierarchies. The OS manages directory metadata, free-space allocation bitmaps, and access permission security bits.
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>4. Communications (IPC):</strong>
          <p className="text-sm my-1">
            Processes often must exchange information. The OS mediates communication through two primary paradigms: Shared Memory (direct memory mapping) or Message Passing (pipes, message queues, sockets).
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>5. Error Detection & Handling:</strong>
          <p className="text-sm my-1">
            The OS must constantly monitor for hardware malfunctions (memory parity errors, disk controller timeouts, power supply faults) and software arithmetic or memory violations (divide-by-zero, page faults, buffer overflows), taking corrective action to protect system stability.
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>6. Resource Allocation & Protection:</strong>
          <p className="text-sm my-1">
            When multiple processes or users compete for hardware, the OS enforces fair scheduling policies across CPU cores, memory frames, and disk bandwidth, while guaranteeing spatial and temporal isolation.
          </p>
        </li>
      </ul>

      <h2>3. The Five Categories of System Calls</h2>
      <p>
        System calls provide the means for a user-space program to request services from the kernel. Under the POSIX standard, system calls are grouped into five foundational categories:
      </p>

      <ComparisonTable {...syscallTaxonomyTable} />

      <h2>4. Process Lifecycle Mechanics: fork, execve, and waitpid</h2>
      <p>
        In Unix-like systems, process creation is unique because it separates process duplication from program loading:
      </p>

      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Step 1: Process Cloning via fork()</strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p>1. The calling parent process invokes fork().</p>
            <p>2. Kernel allocates a new Process Control Block (PCB) and assigns a unique child PID.</p>
            <p>3. Kernel duplicates the parent virtual address space mappings using Copy-on-Write (COW).</p>
            <p>4. Kernel duplicates parent file descriptor table (child shares open file offsets).</p>
            <p>5. Return value: fork() returns 0 to the child process; returns child PID to parent.</p>
          </div>
        </li>

        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Step 2: Image Replacement via execve()</strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p>1. The child process invokes execve(path, argv, envp).</p>
            <p>2. Kernel releases the old address space (code, data, heap, stack).</p>
            <p>3. Kernel parses the ELF binary header, loads new code and data segments into RAM.</p>
            <p>4. Kernel resets the instruction pointer (%rip) to the entry point (_start) of the new binary.</p>
            <p>5. Open file descriptors remain open unless marked with FD_CLOEXEC flag.</p>
          </div>
        </li>

        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Step 3: Synchronization and Reaping via waitpid()</strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p>1. The parent invokes waitpid(child_pid, &status, 0).</p>
            <p>2. If child is still running, parent state changes to WAITING; CPU yields.</p>
            <p>3. When child calls exit(), child transitions to ZOMBIE state (holds exit code in PCB).</p>
            <p>4. Kernel unblocks parent, copies exit code into parent status pointer, and frees child PCB.</p>
          </div>
        </li>
      </ul>

      <p>
        Below is a complete C systems program illustrating this entire lifecycle:
      </p>
      <CodeBlock language="text" code={processLifecycleCode} />

      <h2>5. The POSIX API and System Call Error Handling</h2>
      <p>
        Software engineers rarely invoke raw machine trap instructions directly. Instead, they write against standardized Application Programming Interfaces (APIs):
      </p>

      <ComparisonTable {...apiVsSyscallTable} />

      <h3>The Thread-Local errno Variable</h3>
      <p>
        When a system call encounters an error, it returns <code>-1</code> (or <code>NULL</code> for pointer-returning calls) and sets the global thread-local integer variable <code>errno</code> (defined in <code>&lt;errno.h&gt;</code>):
      </p>
      <ul>
        <li><code>ENOENT (2):</code> No such file or directory. The specified file path does not exist.</li>
        <li><code>EACCES (13):</code> Permission denied. File mode bits prohibit the requested read/write access.</li>
        <li><code>ENOMEM (12):</code> Out of memory. Kernel memory manager cannot allocate requested physical frames.</li>
        <li><code>EAGAIN (11):</code> Resource temporarily unavailable. Non-blocking file descriptor has no data ready.</li>
        <li><code>EINTR (4):</code> Interrupted system call. A blocking call was interrupted by a delivered signal.</li>
      </ul>

      <Callout type="mistake" title="The EINTR Signal Interruption Trap">
        <p>
          When a slow blocking system call (such as reading from a socket or waiting on a semaphore) is suspended, and the thread receives an asynchronous signal (e.g. <code>SIGINT</code> or <code>SIGALRM</code>), the kernel aborts the system call and returns <code>-1</code> with <code>errno = EINTR</code>. Production software must wrap blocking calls in a retry loop:
        </p>
        <p className="font-mono text-sm mt-2 text-brand dark:text-night-brand font-semibold">
          while ((bytes = read(fd, buf, len)) == -1 &amp;&amp; errno == EINTR) &#123; continue; &#125;
        </p>
      </Callout>

      <h2>6. Inter-Process Communication (IPC): Shared Memory vs Message Passing</h2>
      <p>
        Processes executing concurrently in an operating system are isolated by default. To collaborate on shared computations, the operating system provides two foundational IPC mechanisms:
      </p>

      <ComparisonTable {...ipcComparisonTable} />

      <h2>Review checklist</h2>
      <ul>
        <li>Can you list and explain all six core services provided by an operating system kernel?</li>
        <li>Can you enumerate the five categories of POSIX system calls and cite at least two primitives for each?</li>
        <li>Why does Unix separate process creation into two distinct calls: <code>fork()</code> and <code>execve()</code>?</li>
        <li>Can you trace the lifecycle of a child process from creation through execution and parent termination via <code>waitpid()</code>?</li>
        <li>How does the kernel communicate system call errors to user space, and why is handling <code>EINTR</code> critical?</li>
        <li>What are the fundamental architectural differences and performance trade-offs between Shared Memory and Message Passing IPC?</li>
      </ul>

      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://man7.org/linux/man-pages/man2/syscalls.2.html">Linux Programmer's Manual: syscalls(2)</a> - Comprehensive catalog of all Linux kernel system calls.
        </li>
        <li>
          <a href="https://pubs.opengroup.org/onlinepubs/9699919799/">The Open Group Base Specifications Issue 7 (POSIX.1-2017)</a> - Official standard specification for POSIX system interfaces.
        </li>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Arpaci-Dusseau)</a> - Chapters on Process API and Inter-Process Communication.
        </li>
      </ul>
    </>
  )
}
