import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const ultVsKltTable = {
    caption: 'Architectural Comparison: User-Level Threads (ULT) vs Kernel-Level Threads (KLT)',
    headers: ['Feature', 'User-Level Threads (ULT)', 'Kernel-Level Threads (KLT)'],
    rows: [
      [
        'Management Entity',
        'Managed entirely by a user-space runtime thread library (e.g., green threads, fiber libraries).',
        'Managed and recognized directly by the operating system kernel scheduler.'
      ],
      [
        'Context Switching Overhead',
        'Extremely low. Performed via user-space function calls without switching CPU privilege levels (Ring 3 remains active).',
        'Higher overhead. Requires transitioning to supervisor mode (Ring 0), preserving kernel registers, and kernel scheduling logic.'
      ],
      [
        'Blocking System Call Impact',
        'Fatal to concurrency: if one thread issues a blocking I/O call, the entire process and all sibling threads block.',
        'Resilient: if one thread blocks on I/O, the kernel scheduler dispatches another sibling thread onto the CPU.'
      ],
      [
        'Multiprocessor / Multicore Utilization',
        'Cannot utilize multiple CPU cores concurrently; the kernel schedules the host process as a single execution entity.',
        'Full multicore hardware parallelism: distinct threads belonging to the same process execute simultaneously on separate cores.'
      ],
      [
        'OS Portability',
        'Highly portable; runs on any operating system supporting standard user-space memory abstractions.',
        'OS-specific; relies directly on kernel threading APIs and system calls (e.g., clone() on Linux, CreateThread() on Windows).'
      ]
    ]
  }

  const threadStateTable = {
    caption: 'Resource Partitioning: Shared Process State vs Thread-Private State',
    headers: ['Resource Domain', 'Private to Each Thread (TCB)', 'Shared Across All Threads in Process'],
    rows: [
      [
        'CPU Execution State',
        'Program Counter (%rip), Stack Pointer (%rsp), CPU General Registers, Floating Point Registers.',
        'None; execution state is strictly isolated per thread.'
      ],
      [
        'Memory Segments',
        'Private Runtime Stack (local variables, activation records, return addresses) and Thread-Local Storage (TLS).',
        'Executable Code (.text segment), Initialized Data (.data), BSS (.bss), and dynamic Run-time Heap.'
      ],
      [
        'Operating System Resources',
        'Thread ID (TID), scheduling priority, signal mask (blocked signals list), thread-private errno.',
        'Process ID (PID), User/Group IDs, open File Descriptor Table, network sockets, signal action handlers.'
      ]
    ]
  }

  const pthreadCode = `// Production-grade demonstration of POSIX multithreading (pthreads) in C.
// Demonstrates worker spawning, thread-private storage, parameter passing,
// and safe synchronization with pthread_join.

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define NUM_WORKERS 4

// Thread-Local Storage: Each thread receives its own private instance of this variable
__thread int thread_private_counter = 0;

// Shared data structure accessed by all threads
long long shared_global_accumulator = 0;

// Parameter structure passed to worker threads
typedef struct {
    int thread_id;
    int iterations;
} WorkerTask;

void* worker_routine(void* arg) {
    WorkerTask* task = (WorkerTask*)arg;
    
    // Increment thread-private storage without requiring mutex locks
    for (int i = 0; i < task->iterations; i++) {
        thread_private_counter++;
    }

    printf("[Worker Thread %d (TID: 0x%lx)] Completed %d private iterations. TLS counter = %d\\n",
           task->thread_id, (unsigned long)pthread_self(),
           task->iterations, thread_private_counter);

    // Dynamic result allocation returned to parent via pthread_join
    long long* return_val = malloc(sizeof(long long));
    *return_val = (long long)task->thread_id * 1000;
    
    pthread_exit((void*)return_val);
}

int main(void) {
    pthread_t thread_handles[NUM_WORKERS];
    WorkerTask tasks[NUM_WORKERS];
    int status;

    printf("[Main Process (PID: %d)] Spawning %d POSIX kernel threads...\\n",
           getpid(), NUM_WORKERS);

    // 1. Spawn worker threads
    for (int i = 0; i < NUM_WORKERS; i++) {
        tasks[i].thread_id = i + 1;
        tasks[i].iterations = (i + 1) * 10000;
        
        status = pthread_create(&thread_handles[i], NULL, worker_routine, &tasks[i]);
        if (status != 0) {
            perror("pthread_create failed");
            exit(EXIT_FAILURE);
        }
    }

    // 2. Await worker completion and collect results (reaping)
    for (int i = 0; i < NUM_WORKERS; i++) {
        void* result_ptr;
        status = pthread_join(thread_handles[i], &result_ptr);
        if (status != 0) {
            perror("pthread_join failed");
            exit(EXIT_FAILURE);
        }

        long long worker_result = *(long long*)result_ptr;
        free(result_ptr); // Free dynamically allocated worker result
        
        printf("[Main Process] Reaped Worker %d with computed return code: %lld\\n",
               i + 1, worker_result);
    }

    printf("[Main Process] All worker threads joined successfully. Exiting clean.\\n");
    return 0;
}`

  return (
    <>
      <p>
        In modern operating systems, the classical concept of a process is bifurcated into two distinct notions: <strong>resource ownership</strong> (the virtual address space, memory mappings, and open files) and <strong>execution scheduling</strong> (the stream of instructions, program counter, and CPU registers). A <strong>thread</strong> is the basic unit of CPU utilization that represents an independent dispatchable execution context within a host process.
      </p>

      <h2>1. The Thread Concept: Process vs Thread</h2>
      <p>
        Traditional processes are often termed <em>heavyweight processes</em> because creating, maintaining, and switching between them requires extensive kernel intervention, separate page table allocations, and significant memory overhead. A thread, often termed a <em>lightweight process (LWP)</em>, shares its virtual address space with sibling threads while maintaining private execution registers.
      </p>
      <ComparisonTable {...threadStateTable} />

      <Callout type="definition" title="Why Threads Share the Heap and Code but Isolate the Stack">
        If sibling threads shared a single stack, calling functions or pushing local variables would interleave and overwrite activation records, immediately crashing the program. Each thread is allocated its own contiguous slice of the virtual memory space as its <strong>private stack</strong>. However, all threads share the exact same <strong>heap</strong> and <strong>global data segments</strong>, which allows zero-copy data exchange but creates dangerous concurrency race conditions if not protected with synchronization primitives.
      </Callout>

      <h2>2. Benefits of Multithreading</h2>
      <p>
        Contemporary server and client applications rely heavily on multithreading for four fundamental reasons:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-brand dark:text-night-brand text-base mb-1">1. Responsiveness</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            In graphical user interfaces (GUIs) or interactive services, a dedicated background worker thread performs long-running computations or network I/O while the main event thread continues responding instantly to user clicks and input events.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-success dark:text-night-success text-base mb-1">2. Resource Sharing</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Unlike processes that require complex IPC setup (pipes, shared memory segments, message queues) to exchange data, threads read and write the exact same address space directly via pointers, simplifying concurrent application architectures.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-accent dark:text-night-accent text-base mb-1">3. Economy</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Allocating memory and page tables for a new process via <code>fork()</code> is computationally expensive. Spawning a thread in Linux is approximately 10 to 30 times faster, and thread context switching incurs minimal cache disruption since page tables (CR3) are not modified.
          </p>
        </div>
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-brand dark:text-night-brand text-base mb-1">4. Scalability (Multicore Parallelism)</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            A single-threaded process can only occupy a single CPU core, leaving modern 16-core or 64-core processors largely idle. A multithreaded application scales transparently across all available physical cores, executing independent threads in true hardware parallelism.
          </p>
        </div>
      </div>

      <h2>3. Concurrency vs Hardware Parallelism</h2>
      <p>
        In systems examinations and technical interviews, students must never conflate <strong>concurrency</strong> with <strong>parallelism</strong>:
      </p>

      <div className="overflow-x-auto my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-brand dark:text-night-brand font-bold block mb-2 font-sans text-sm">Concurrency (Interleaving on Single Core)</span>
            <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
              The ability of a system to structure, handle, and make progress on multiple execution flows over overlapping time intervals.
            </p>
            <div className="font-mono text-xs p-3 rounded-md bg-surface dark:bg-night-surface border border-line dark:border-night-line text-ink dark:text-night-ink">
              Core 0: [Thread 1] &rarr; [Thread 2] &rarr; [Thread 1] &rarr; [Thread 3] (Time Slicing)
            </div>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-success dark:text-night-success font-bold block mb-2 font-sans text-sm">Parallelism (Simultaneous Hardware Execution)</span>
            <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
              The simultaneous physical execution of multiple instruction sequences at the exact same physical instant across multiple processor cores.
            </p>
            <div className="font-mono text-xs p-3 rounded-md bg-surface dark:bg-night-surface border border-line dark:border-night-line text-ink dark:text-night-ink">
              Core 0: [Thread 1 executing concurrently]<br />
              Core 1: [Thread 2 executing concurrently]
            </div>
          </div>
        </div>
      </div>

      <h2>4. User-Level Threads (ULT) vs Kernel-Level Threads (KLT)</h2>
      <p>
        Operating systems implement multithreading support at two distinct structural layers: in user-space libraries or natively inside the kernel scheduler.
      </p>
      <ComparisonTable {...ultVsKltTable} />

      <h3>Multithreading Models</h3>
      <p>
        The relationship between user-space threads and kernel execution entities is governed by three primary models:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-5 rounded-xl border border-danger/30 bg-surface dark:border-night-danger/30 dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-1 font-sans">1. Many-to-One Model</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Maps many user-level threads to a single kernel thread. Thread management is fast because it is performed entirely in user space. However, if a thread issues a blocking system call, the entire process stalls. True multicore hardware parallelism is impossible because the kernel sees only one schedulable entity.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-success/30 bg-surface dark:border-night-success/30 dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="text-sm font-bold text-success dark:text-night-success mb-1 font-sans">2. One-to-One Model (Modern Linux &amp; Windows Standard)</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Maps each user thread directly to an independent kernel thread. If one thread blocks on I/O, other threads continue running unhindered. Multiple threads execute simultaneously across multiple physical CPU cores. This model is utilized by the Linux Native POSIX Thread Library (NPTL) and Windows threading architectures.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-brand/30 bg-surface dark:border-night-brand/30 dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-1 font-sans">3. Many-to-Many / Two-Level Model</h4>
          <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Multiplexes <em>M</em> user-level threads onto <em>N</em> kernel-level threads (where <em>M &gt;= N</em>). Developers can instantiate thousands of lightweight user threads without overwhelming kernel memory tables. The operating system kernel coordinates with the user runtime using <strong>scheduler activations</strong> (upcall mechanisms). While theoretically flexible, its implementation complexity has led modern operating systems to standardize on the robust One-to-One model.
          </p>
        </div>
      </div>

      <h2>5. POSIX Multithreading (Pthreads) and Thread Safety</h2>
      <p>
        On UNIX and Linux systems, multithreading is standardized by the IEEE POSIX 1003.1c specification (Pthreads). The following production-grade C implementation demonstrates thread creation, thread-local storage, dynamic parameter allocation, and thread joining:
      </p>
      <CodeBlock language="c" code={pthreadCode} />

      <h3>Thread Cancellation and Cancellation Points</h3>
      <p>
        Thread cancellation is the mechanism of terminating a target thread before its natural completion (for example, terminating worker threads when a database query is aborted by the client):
      </p>
      <ul>
        <li>
          <strong>Asynchronous Cancellation:</strong> The kernel terminates the target thread immediately. This is inherently hazardous: if the canceled thread is holding a mutex lock or in the middle of modifying shared memory structures, data remains permanently corrupted and waiting threads deadlock.
        </li>
        <li>
          <strong>Deferred Cancellation (Recommended):</strong> The target thread terminates only when it reaches explicitly defined <strong>cancellation points</strong> (such as system calls <code>read()</code>, <code>write()</code>, <code>sleep()</code>, or an explicit call to <code>pthread_testcancel()</code>). The thread executes registered cleanup handlers to unlock mutexes and free resources before safely exiting.
        </li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you list which execution resources are private to a thread (TID, registers, stack, TLS) and which are shared across the process (heap, text, files)?</li>
        <li>Can you contrast User-Level Threads (ULT) and Kernel-Level Threads (KLT) across context switch overhead and blocking I/O behavior?</li>
        <li>Can you explain why the One-to-One multithreading model replaced the Many-to-One model on modern Linux and Windows?</li>
        <li>Do you know the difference between concurrency and parallelism, and why single-core systems cannot achieve hardware parallelism?</li>
        <li>Can you explain why deferred thread cancellation is safe while asynchronous cancellation risks resource leaks and mutex deadlocks?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 26: Concurrency: An Introduction, and Chapter 27: Interlude: Thread API.
        </li>
        <li>
          <a href="https://man7.org/linux/man-pages/man7/pthreads.7.html">Linux Programmer&apos;s Manual: pthreads(7)</a> - Overview of POSIX threads, thread cancellation points, and NPTL implementation details.
        </li>
        <li>
          <a href="https://pubs.opengroup.org/onlinepubs/9699919799/">The Open Group Base Specifications Issue 7 (POSIX.1-2008)</a> - Official IEEE POSIX standard for multithreading primitives.
        </li>
      </ul>
    </>
  )
}
