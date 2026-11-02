import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const processVsProgramTable = {
    caption: 'Fundamental Differences Between a Program and a Process',
    headers: ['Attribute', 'Program', 'Process'],
    rows: [
      [
        'Nature and State',
        'Passive entity stored as a static file on persistent storage (e.g., an ELF binary or executable file on disk).',
        'Active entity with allocated hardware execution context (Program Counter, CPU registers, stack pointer, and active state).'
      ],
      [
        'Lifespan',
        'Indefinite; exists on storage media until explicitly deleted by a user or installer.',
        'Transient; created dynamically via system calls, executes its instruction sequence, and terminates when completed or killed.'
      ],
      [
        'Resource Allocation',
        'Occupies zero physical RAM, zero CPU cycles, and requires no peripheral devices or operating system scheduling queues.',
        'Occupies dedicated virtual memory segments, physical RAM pages, CPU time slices, open file descriptors, and I/O channels.'
      ],
      [
        'Multiplicity',
        'A single program executable file on disk can be loaded multiple times to spawn numerous concurrent processes.',
        'Each running instance possesses a unique Process Identifier (PID), isolated memory space, and distinct execution state.'
      ]
    ]
  }

  const pcbTable = {
    caption: 'Core Components of the Process Control Block (struct task_struct)',
    headers: ['Field Name', 'Purpose', 'Architectural Role in the Operating System'],
    rows: [
      [
        'Process Identification (PID / PPID)',
        'Unique integer descriptor assigned to the process and its parent.',
        'Provides indexing keys for kernel lookup tables, access-control boundaries, and parent-child hierarchy tracing.'
      ],
      [
        'Process State',
        'Current operational phase (Ready, Running, Blocked, Terminated).',
        'Determines which kernel scheduling queue or wait queue currently houses the process pointer.'
      ],
      [
        'Hardware Context (Registers / PC / SP)',
        'Preserved values of %rip, %rsp, base pointers, and general registers.',
        'Restored into CPU execution units during context switching to resume instruction execution without state corruption.'
      ],
      [
        'Memory Management (mm_struct / CR3)',
        'Pointers to the process page tables, segment descriptors, and bounds.',
        'Loaded into the CPU memory management unit (MMU) on context switch to activate the virtual-to-physical address mapping.'
      ],
      [
        'CPU Scheduling Metadata',
        'Static/dynamic priority, time slice remaining, virtual runtime (vruntime).',
        'Evaluated by the scheduler to select the optimal candidate process from the ready queue for CPU assignment.'
      ],
      [
        'I/O & Accounting Information',
        'Table of open file descriptors, allocated peripherals, CPU clock ticks.',
        'Enforces resource quotas, manages I/O buffers, and tracks billable execution metrics.'
      ]
    ]
  }

  const ipcComparisonTable = {
    caption: 'Architectural Comparison: Shared Memory vs Message Passing IPC',
    headers: ['Feature', 'Shared Memory IPC', 'Message Passing IPC'],
    rows: [
      [
        'Communication Mechanism',
        'Common physical memory region mapped concurrently into the virtual address spaces of cooperating processes.',
        'Data exchanged via explicit kernel-mediated primitives (pipes, FIFOs, message queues, and network sockets).'
      ],
      [
        'Data Transfer Speed',
        'Memory bus bandwidth speed. Zero kernel transitions and zero memory copies after initial segment mapping.',
        'Lower throughput due to system call overhead and two memory copies (user space to kernel buffer, then to destination user space).'
      ],
      [
        'Kernel Intervention',
        'Only involved during initial creation and mapping (e.g., shm_open, mmap, shmget). Not involved during reads/writes.',
        'Every message exchange requires kernel mode traps (write, send, read, recv) and buffer allocation.'
      ],
      [
        'Synchronization Responsibility',
        'Application software must explicitly coordinate access using semaphores, mutexes, or atomic flags.',
        'The operating system kernel provides automatic blocking, buffer management, and mutual exclusion primitives.'
      ],
      [
        'Distributed Capability',
        'Strictly limited to a single shared-memory computer system or NUMA machine.',
        'Scales naturally across networked computers and distributed systems (e.g., TCP/IP sockets, RPC, MPI).'
      ]
    ]
  }

  const forkExecCode = `// Comprehensive demonstration of process creation, memory isolation,
// and lifecycle control using fork(), execve(), and waitpid() in C.

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int global_var = 100; // Resides in .data segment

int main(void) {
    int local_var = 42; // Resides in user runtime stack
    printf("[Parent PID: %d] Before fork: global=%d, local=%d\\n",
           getpid(), global_var, local_var);

    pid_t pid = fork();

    if (pid < 0) {
        // Fork failed (insufficient memory or PID exhaustion)
        perror("fork failed");
        exit(EXIT_FAILURE);
    } else if (pid == 0) {
        // --- CHILD PROCESS EXECUTION PATH ---
        printf("[Child PID: %d, PPID: %d] Fork succeeded. Modifying variables...\\n",
               getpid(), getppid());
        
        // Copy-on-Write (COW) triggers page fault and duplicates physical frames
        global_var += 50;
        local_var += 10;
        printf("[Child PID: %d] Modified values: global=%d, local=%d\\n",
               getpid(), global_var, local_var);

        // Replace child address space with /bin/echo using execve
        char *args[] = {"/bin/echo", "Child: Execve replacing process image!", NULL};
        char *env[]  = {NULL};
        execve("/bin/echo", args, env);

        // execve only returns if an error occurred
        perror("execve failed");
        exit(EXIT_FAILURE);
    } else {
        // --- PARENT PROCESS EXECUTION PATH ---
        int status;
        printf("[Parent PID: %d] Spawned child with PID %d. Waiting for reap...\\n",
               getpid(), pid);

        // Block parent until child terminates to prevent zombie creation
        pid_t terminated_child = waitpid(pid, &status, 0);

        if (WIFEXITED(status)) {
            printf("[Parent PID: %d] Child %d terminated normally with exit status: %d\\n",
                   getpid(), terminated_child, WEXITSTATUS(status));
        }

        // Verify parent variables remain unmodified (strict memory isolation)
        printf("[Parent PID: %d] Verified parent values: global=%d, local=%d\\n",
               getpid(), global_var, local_var);
    }

    return 0;
}`

  return (
    <>
      <p>
        The central abstraction in modern operating systems is the <strong>process</strong>. While early computers executed a single job sequentially with exclusive control over physical memory and the CPU, contemporary multi-user, multitasking platforms execute hundreds of concurrent processes simultaneously. For Master of Computer Applications (MCA) students, mastering processes requires examining how the operating system encapsulates state, virtualizes the CPU, manages address spaces, transitions between lifecycle states, and orchestrates inter-process communication (IPC).
      </p>

      <h2>1. The Process Concept and Virtual Memory Layout</h2>
      <p>
        A <strong>program</strong> is an inert, passive collection of compiled machine instructions and static data stored on non-volatile media (such as an ELF binary on Linux or a PE executable on Windows). A <strong>process</strong> is an active entity representing an instance of a program in execution.
      </p>
      <ComparisonTable {...processVsProgramTable} />

      <h3>The Virtual Address Space Architecture</h3>
      <p>
        When the operating system launches a process, it assigns a private, contiguous <strong>virtual address space</strong> mapped onto physical RAM frames through page tables. On modern 64-bit systems (such as x86-64), the process layout is organized into distinct logical segments:
      </p>

      <div className="overflow-x-auto my-6 p-4 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink text-sm font-mono leading-relaxed">
        <div className="text-center font-bold pb-2 border-b border-line dark:border-night-line text-brand dark:text-night-brand font-sans">
          User-Space Virtual Address Layout (High to Low Memory)
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-danger/10 dark:bg-night-danger/15 text-ink dark:text-night-ink">
          <span className="text-danger dark:text-night-danger font-bold">0x7FFFFFFFFFFF:</span> Kernel Space Boundary (Protected Ring 0)
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-accent-soft/40 dark:bg-night-accent-soft/40 text-ink dark:text-night-ink">
          <span className="text-accent dark:text-night-accent font-bold">User Runtime Stack (&darr; grows downward):</span> Local variables, function parameters, frame pointers (%rbp), and function return addresses.
        </div>
        <div className="py-3 px-3 border-b border-line dark:border-night-line bg-soft dark:bg-night-soft text-center italic text-subtle dark:text-night-subtle">
          &uarr; &darr; Dynamic Memory Gap (Unmapped virtual address gap to prevent collision) &uarr; &darr;
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-success/10 dark:bg-night-success/15 text-ink dark:text-night-ink">
          <span className="text-success dark:text-night-success font-bold">Memory Mapping Segment (mmap):</span> Shared libraries (libc.so), file-backed mappings, anonymous shared memory.
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-selected/50 dark:bg-night-selected/50 text-ink dark:text-night-ink">
          <span className="text-brand dark:text-night-brand font-bold">Run-time Heap (&uarr; grows upward):</span> Dynamically allocated memory via malloc(), calloc(), free() through brk/sbrk system calls.
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
          <span className="text-brand dark:text-night-brand font-bold">BSS Segment (.bss):</span> Block Started by Symbol. Uninitialized global and static variables, zero-filled by the loader.
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-selected/40 dark:bg-night-selected/40 text-ink dark:text-night-ink">
          <span className="text-brand dark:text-night-brand font-bold">Initialized Data Segment (.data):</span> Explicitly initialized global and static variables.
        </div>
        <div className="py-2 px-3 border-b border-line dark:border-night-line bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
          <span className="text-brand dark:text-night-brand font-bold">Text Segment (.text):</span> Read-only executable machine code instructions. Shared across concurrent process instances.
        </div>
        <div className="py-2 px-3 bg-danger/10 dark:bg-night-danger/15 text-ink dark:text-night-ink">
          <span className="text-danger dark:text-night-danger font-bold">0x000000000000:</span> NULL Pointer Guard Page (Unmapped to trap null pointer dereferences)
        </div>
      </div>

      <Callout type="definition" title="Guard Pages and Stack Overflow Traps">
        Modern operating systems insert an unmapped virtual page immediately below the maximum stack boundary, called a <strong>guard page</strong>. If an unbounded recursive function exhausts stack space, the CPU MMU attempts to write into the unmapped guard page, immediately raising a Page Fault (vector 14) that the kernel translates into a <code>SIGSEGV</code> (Segmentation Fault), halting the process before it can corrupt adjacent heap or code memory.
      </Callout>

      <h2>2. Process Control Block (PCB) and Context Switching</h2>
      <p>
        The kernel represents every active process as an instance of the <strong>Process Control Block (PCB)</strong>, known in the Linux kernel as <code>struct task_struct</code>. The PCB encapsulates all metadata needed to halt, preserve, schedule, and resume a process.
      </p>
      <ComparisonTable {...pcbTable} />

      <h3>The Mechanics of a Context Switch</h3>
      <p>
        When the CPU switches execution from Process A to Process B (triggered by a timer interrupt, an I/O wait, or a higher-priority task), the operating system performs a <strong>context switch</strong>. This involves four coordinated steps:
      </p>
      <ol>
        <li>
          <strong>Save State:</strong> The kernel saves the outgoing process hardware context (CPU registers, program counter %rip, stack pointer %rsp, and condition flags) into its PCB in memory.
        </li>
        <li>
          <strong>Update Accounting & Queue:</strong> The kernel updates Process A state (e.g., from Running to Ready or Waiting) and moves its PCB pointer to the appropriate scheduling or device queue.
        </li>
        <li>
          <strong>Switch Address Space:</strong> The kernel updates the memory management registers by loading the page directory base register (e.g., writing the physical address of Process B page tables into register <code>CR3</code> on x86-64).
        </li>
        <li>
          <strong>Restore State:</strong> The kernel loads Process B saved registers from its PCB into the CPU hardware units and sets the program counter to Process B saved instruction pointer, resuming execution.
        </li>
      </ol>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2">Quantifying Context Switching Costs: Direct vs Indirect</h4>
        <p className="text-sm leading-relaxed mb-3 text-ink/80 dark:text-night-ink/80">
          MCA students must distinguish between the <strong>direct computational cost</strong> and the <strong>indirect architectural cost</strong> of context switching during technical evaluations:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-accent dark:text-night-accent font-bold block mb-2 font-sans text-sm">Direct Costs (Deterministic CPU Overhead):</span>
            <div className="space-y-1 text-ink/80 dark:text-night-ink/80">
              <div>&bull; Register save/restore cycles (30-100 instructions)</div>
              <div>&bull; Kernel stack switching</div>
              <div>&bull; Page table pointer update (CR3 write)</div>
              <div>&bull; Execution duration: 1 to 5 microseconds</div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-brand dark:text-night-brand font-bold block mb-2 font-sans text-sm">Indirect Costs (Architectural Cache Disruption):</span>
            <div className="space-y-1 text-ink/80 dark:text-night-ink/80">
              <div>&bull; TLB invalidation flushes virtual address translations</div>
              <div>&bull; L1/L2/L3 CPU hardware caches become cold</div>
              <div>&bull; Subsequent memory reads trigger CPU stall cycles</div>
              <div>&bull; Latency penalty: Hundreds of nanoseconds per cache miss</div>
            </div>
          </div>
        </div>
      </div>

      <h2>3. Process Lifecycle and State Transitions</h2>
      <p>
        Throughout its existence, a process transitions through a finite set of states as it competes for system resources.
      </p>

      <h3>The Standard Five-State Process Model</h3>
      <ul>
        <li>
          <strong>New:</strong> The process is being created and its PCB allocated, but it has not yet been loaded into main memory or admitted to the ready queue.
        </li>
        <li>
          <strong>Ready:</strong> The process resides in main memory, possessing all necessary resources except the CPU, waiting for the scheduler to dispatch it.
        </li>
        <li>
          <strong>Running:</strong> The process currently occupies a CPU core and its instructions are being executed by hardware arithmetic logic units (ALUs).
        </li>
        <li>
          <strong>Waiting / Blocked:</strong> The process cannot proceed because it is waiting for an external event (such as disk I/O completion, a network packet, or a synchronization signal).
        </li>
        <li>
          <strong>Terminated:</strong> The process has completed execution or was killed; its resources are released, but its exit code is retained in the process table until collected.
        </li>
      </ul>

      <div className="overflow-x-auto my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-sm">
        <h4 className="font-bold text-brand dark:text-night-brand mb-3 font-sans">State Transition Trigger Matrix</h4>
        <div className="space-y-2 font-mono text-xs text-ink/90 dark:text-night-ink/90">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-brand dark:text-night-brand font-bold mr-2">New &rarr; Ready:</span> Admitted by the Long-Term Scheduler (Job Scheduler) based on memory availability.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-success dark:text-night-success font-bold mr-2">Ready &rarr; Running:</span> Selected and dispatched by the Short-Term Scheduler (CPU Scheduler).
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-accent dark:text-night-accent font-bold mr-2">Running &rarr; Ready:</span> Preemption due to time quantum expiration (timer interrupt) or higher-priority job arrival.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-danger dark:text-night-danger font-bold mr-2">Running &rarr; Waiting:</span> Process issues a blocking I/O request (read, write) or waits for child termination (waitpid).
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-brand dark:text-night-brand font-bold mr-2">Waiting &rarr; Ready:</span> Hardware I/O completion interrupt or signal arrival moves process to Ready Queue.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-danger dark:text-night-danger font-bold mr-2">Running &rarr; Terminated:</span> Process invokes exit() system call or receives fatal termination signal (SIGKILL).
          </div>
        </div>
      </div>

      <h3>The Seven-State Model with Process Swapping</h3>
      <p>
        When active processes exceed physical RAM capacity, the <strong>Medium-Term Scheduler (Swapper)</strong> migrates blocked or idle processes from physical RAM to the swap partition on secondary storage. This introduces two additional suspended states:
      </p>
      <ul>
        <li>
          <strong>Suspended Blocked:</strong> The process is waiting for an I/O event and has been swapped out to secondary storage to free physical RAM frames.
        </li>
        <li>
          <strong>Suspended Ready:</strong> The process has completed its I/O event while on disk and is ready for execution as soon as main memory space becomes available to swap it back into RAM.
        </li>
      </ul>

      <h2>4. Operations on Processes: Creation, Execution, and Termination</h2>
      <p>
        In modern UNIX and POSIX-compliant systems, process operations follow a hierarchical parent-child tree structure rooted at PID 1 (init or systemd).
      </p>

      <h3>Fork, Execve, and Copy-on-Write (COW) Mechanics</h3>
      <p>
        Process creation is uniquely separated into two distinct operations:
      </p>
      <ul>
        <li>
          <code>fork()</code> creates an exact duplicate clone of the calling process, inheriting environment variables, privileges, and open file descriptors. It returns <code>0</code> to the child process and the child new PID to the parent process.
        </li>
        <li>
          <code>execve()</code> replaces the current process address space, executable code (.text), heap, and stack with a fresh binary loaded from storage, while preserving the existing PID and open file descriptors.
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2">Deep Dive: Copy-on-Write (COW) Virtual Memory Optimization</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
          Historically, <code>fork()</code> physically copied every memory page of the parent into newly allocated RAM frames for the child. Because most programs immediately call <code>execve()</code> to load a different binary, this full memory copy was entirely wasted.
        </p>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
          Modern kernels solve this using <strong>Copy-on-Write (COW)</strong>: during <code>fork()</code>, the kernel copies only the page table pointers, marking all pages in both parent and child as <strong>read-only</strong>. When either process attempts a write, the CPU MMU raises a Page Fault. The kernel allocates a single new physical page frame, copies the 4 KB page data, marks the faulting process page table entry as read-write, and transparently resumes execution. Unmodified pages remain permanently shared, reducing fork latency by over 95%.
        </p>
      </div>

      <p>
        The following POSIX C program demonstrates the complete <code>fork()</code>, Copy-on-Write memory isolation, and <code>waitpid()</code> lifecycle:
      </p>
      <CodeBlock language="c" code={forkExecCode} />

      <h3>Process Anomalies: Zombie vs Orphan Processes</h3>
      <p>
        Failure to properly coordinate parent and child lifecycles produces two distinct operating system conditions:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-5 rounded-xl border border-danger/40 bg-surface dark:border-night-danger/40 dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-danger dark:text-night-danger text-base mb-2">Zombie Process (&lt;defunct&gt;)</h4>
          <p className="text-xs leading-relaxed text-ink/80 dark:text-night-ink/80 mb-2">
            A process that has finished execution via <code>exit()</code>, freed its memory pages, closed its files, but still occupies an entry in the kernel Process Table.
          </p>
          <div className="text-xs leading-relaxed text-ink/80 dark:text-night-ink/80 space-y-1">
            <div><strong className="text-ink dark:text-night-ink">Why it exists:</strong> The kernel preserves the PCB to deliver the 32-bit exit status code to the parent when it calls <code>wait()</code> or <code>waitpid()</code>.</div>
            <div><strong className="text-ink dark:text-night-ink">Risk:</strong> A runaway parent that never calls <code>wait()</code> can exhaust the kernel PID table, preventing new processes from spawning.</div>
            <div><strong className="text-ink dark:text-night-ink">Fix:</strong> Kill the negligent parent; the zombie is adopted by PID 1 and immediately reaped.</div>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-accent/40 bg-surface dark:border-night-accent/40 dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-accent dark:text-night-accent text-base mb-2">Orphan Process</h4>
          <p className="text-xs leading-relaxed text-ink/80 dark:text-night-ink/80 mb-2">
            A process that continues executing after its parent process has unexpectedly terminated or exited without waiting for its children.
          </p>
          <div className="text-xs leading-relaxed text-ink/80 dark:text-night-ink/80 space-y-1">
            <div><strong className="text-ink dark:text-night-ink">Kernel Resolution:</strong> The kernel automatically detects parent termination and re-parents all orphaned children to the root initialization process (<code>PID 1</code> / systemd).</div>
            <div><strong className="text-ink dark:text-night-ink">Reaping:</strong> PID 1 executes an infinite event loop calling <code>wait()</code>, ensuring that when an orphaned child eventually exits, its exit status is collected and its PCB cleared immediately.</div>
          </div>
        </div>
      </div>

      <h2>5. Inter-Process Communication (IPC) Foundations</h2>
      <p>
        Because the operating system strictly isolates the virtual address spaces of distinct processes to enforce security and fault containment, processes cannot directly access each other memory. Cooperating processes require <strong>Inter-Process Communication (IPC)</strong> mechanisms to exchange data and synchronize actions.
      </p>
      <ComparisonTable {...ipcComparisonTable} />

      <h3>Message Passing Models: Synchronization and Buffering</h3>
      <p>
        Message passing systems are characterized by two core architectural parameters:
      </p>
      <ul>
        <li>
          <strong>Synchronization Semantics:</strong>
          <ul>
            <li><em>Blocking Send (Synchronous):</em> The sending process suspends execution until the receiving process or kernel mailbox accepts the message.</li>
            <li><em>Non-Blocking Send (Asynchronous):</em> The sender writes the message to the kernel queue and immediately resumes execution.</li>
            <li><em>Blocking Receive:</em> The receiver halts until a message is available in the queue.</li>
            <li><em>Non-Blocking Receive:</em> The receiver retrieves either a valid message or an immediate error indicator (e.g., <code>EAGAIN</code>) without waiting.</li>
          </ul>
        </li>
        <li>
          <strong>Queue Capacity (Buffering):</strong>
          <ul>
            <li><em>Zero Capacity (Rendezvous):</em> The queue has a length of 0. The sender must wait until the receiver is ready to accept the transmission; neither can proceed independently.</li>
            <li><em>Bounded Capacity:</em> The queue holds a fixed number of <em>N</em> messages. If the queue is full, senders block until space is cleared.</li>
            <li><em>Unbounded Capacity:</em> The queue has infinite theoretical capacity; the sender never blocks.</li>
          </ul>
        </li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you detail the standard memory segments of a process (.text, .data, .bss, heap, stack) and explain the purpose of the unmapped guard page?</li>
        <li>Can you explain at least five critical data structures stored in the Linux <code>task_struct</code> (PCB)?</li>
        <li>Can you contrast direct vs indirect context switching overhead, highlighting the impact of TLB flushes and cold CPU caches?</li>
        <li>Do you understand how Copy-on-Write (COW) prevents redundant memory replication during <code>fork()</code>?</li>
        <li>Can you clearly differentiate between a Zombie process and an Orphan process, and explain how the kernel handles both?</li>
        <li>Can you compare Shared Memory and Message Passing IPC across performance, kernel traps, and synchronization?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 4: The Abstraction: The Process, and Chapter 5: Process API.
        </li>
        <li>
          <a href="https://man7.org/linux/man-pages/man2/fork.2.html">Linux Programmer&apos;s Manual: fork(2)</a> - Definitive specification for POSIX fork semantics, COW handling, and clone flags.
        </li>
        <li>
          <a href="https://www.kernel.org/doc/html/latest/process/index.html">The Linux Kernel Core API: Process Management</a> - Deep architectural documentation on <code>task_struct</code> and kernel scheduler runqueues.
        </li>
      </ul>
    </>
  )
}
