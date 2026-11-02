import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const paradigmsTable = {
    caption: 'Comparative Analysis of Operating System Architectural Paradigms',
    headers: ['Operating System Type', 'Primary Optimization Goal', 'CPU Preemption Mechanism', 'Memory Architecture', 'Primary Engineering Challenge'],
    rows: [
      [
        'Simple Batch System',
        'Maximize operator throughput; eliminate human card-loading idle time.',
        'None; cooperative run-to-completion or program abort.',
        'Single contiguous user memory partition alongside resident monitor.',
        'Synchronous mechanical I/O delays keep the CPU idle over 90% of the time.'
      ],
      [
        'Multiprogrammed Batch',
        'Maximize aggregate CPU utilization and peripheral bus overlap.',
        'I/O completion interrupts and timer-based long-term scheduling.',
        'Static/dynamic memory partitions with base and limit protection registers.',
        'Preventing mutual memory interference and managing job scheduling queues.'
      ],
      [
        'Time-Sharing (Multitasking)',
        'Minimize interactive user response latency and ensure temporal fairness.',
        'Periodic hardware interval timer interrupts (fixed time quantum).',
        'Virtual memory with demand paging and swapping mechanisms.',
        'Minimizing context-switching overhead and CPU cache/TLB pollution.'
      ],
      [
        'Real-Time (RTOS)',
        'Deterministic temporal predictability and guaranteed deadline compliance.',
        'Strict preemptive priority scheduling (e.g., Rate Monotonic, EDF).',
        'Direct static physical memory mapping; demand paging strictly disabled.',
        'Eliminating unbounded interrupt latency and preventing priority inversion.'
      ],
      [
        'Distributed System',
        'Seamless resource pooling and fault-tolerant collective execution.',
        'Independent autonomous local schedulers coordinated via RPC/consensus.',
        'Disjoint physical memory; message-passing over network interconnects.',
        'Clock synchronization, network latency partitions, and distributed consensus.'
      ],
      [
        'Parallel / Multiprocessor (SMP)',
        'True hardware parallelism; linear compute scaling across cores.',
        'Multi-core preemptive scheduling with load balancing and core affinity.',
        'Shared physical address space (Uniform Memory Access or NUMA).',
        'Cache coherency protocols (MESI/MOESI) and bus lock contention.'
      ]
    ]
  }

  const hardVsSoftTable = {
    caption: 'Engineering Comparison: Hard Real-Time vs Soft Real-Time Systems',
    headers: ['Evaluation Parameter', 'Hard Real-Time System (HRTS)', 'Soft Real-Time System (SRTS)'],
    rows: [
      [
        'Consequence of Missed Deadline',
        'Catastrophic system failure; danger to human life or total physical loss.',
        'Degraded Quality of Service (QoS); user annoyance or temporary data loss.'
      ],
      [
        'Temporal Determinism',
        'Absolute mathematical guarantee; zero tolerance for unbounded jitter.',
        'Probabilistic statistical guarantee; average response time optimized.'
      ],
      [
        'Virtual Memory & Demand Paging',
        'Strictly prohibited; page faults introduce unbounded mechanical delays.',
        'Permitted; virtual memory widely utilized with memory locking (mlock).'
      ],
      [
        'Kernel Preemptibility',
        'Fully preemptible microkernel or RTOS core (e.g., FreeRTOS, QNX, VxWorks).',
        'Standard kernel with real-time preemption patches (e.g., Linux PREEMPT_RT).'
      ],
      [
        'Representative Industry Use Cases',
        'Automotive anti-lock braking (ABS), avionics flight control, pacemakers.',
        'VoIP telephone audio, online video streaming, multiplayer game engines.'
      ]
    ]
  }

  const smpVsAmpTable = {
    caption: 'Multiprocessing Architectures: Symmetric (SMP) vs Asymmetric (AMP)',
    headers: ['Architectural Dimension', 'Symmetric Multiprocessing (SMP)', 'Asymmetric Multiprocessing (AMP)'],
    rows: [
      [
        'Processor Role Hierarchy',
        'All physical CPU cores are identical peers; any core can run any task.',
        'Master-slave hierarchy; master controls OS kernel, slaves run assigned tasks.'
      ],
      [
        'Operating System Execution',
        'A single OS kernel image executes concurrently across all available cores.',
        'The kernel runs exclusively on the master core; slaves execute worker code.'
      ],
      [
        'Load Balancing',
        'Dynamic and automatic; scheduler moves ready threads across idle cores.',
        'Static or manually partitioned; slave cores can idle while master is saturated.'
      ],
      [
        'Hardware Cost and Complexity',
        'High; requires hardware cache coherency buses and atomic synchronization.',
        'Lower; simpler hardware, often used in embedded multi-core microcontrollers.'
      ]
    ]
  }

  const numaAffinityCode = `// Linux C demonstration: Setting CPU Affinity and NUMA Policy
#define _GNU_SOURCE
#include <sched.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>

void* worker_thread(void* arg) {
    int core_id = *(int*)arg;
    cpu_set_t cpuset;

    // 1. Clear CPU mask and bind current thread to specific hardware core
    CPU_ZERO(&cpuset);
    CPU_SET(core_id, &cpuset);

    pthread_t current_thread = pthread_self();
    if (pthread_setaffinity_np(current_thread, sizeof(cpu_set_t), &cpuset) != 0) {
        perror("pthread_setaffinity_np failed");
        return NULL;
    }

    // 2. Thread executes locked to this core, maximizing L1/L2 cache locality
    printf("Worker thread executing deterministically on CPU core %d\\n", core_id);
    
    // Perform compute-intensive operations without cross-core migration...
    return NULL;
}`

  return (
    <>
      <p>
        Operating systems did not emerge in their current form through theoretical design alone. They evolved iteratively in direct response to physical hardware bottlenecks, economic pressures, and changing workload profiles. For MCA students preparing for advanced university papers and systems engineering interviews, mastering OS evolution requires understanding the specific engineering trade-offs that triggered each architectural paradigm.
      </p>

      <h2>What you will learn</h2>
      <ul>
        <li>The chronological evolution of operating systems: From bare-metal serial processing to modern distributed clusters.</li>
        <li>Batch processing mechanics: Resident monitors, JCL, card-tape bottlenecks, and the SPOOLing revolution.</li>
        <li>Multiprogramming foundations and Tanenbaum's mathematical model of CPU utilization.</li>
        <li>Time-sharing systems: Time quanta, interactive fairness, and memory virtualization.</li>
        <li>Real-time operating systems (RTOS): Hard vs Soft deadlines, rate-monotonic scheduling, and the Mars Pathfinder priority inversion case study.</li>
        <li>Parallel and distributed architectures: Symmetric vs Asymmetric Multiprocessing (SMP vs AMP) and NUMA memory hierarchies.</li>
      </ul>

      <h2>1. The Chronological Evolution of Operating Systems</h2>

      <h3>1. Serial Processing (First Generation: 1940s - 1950s)</h3>
      <p>
        In the earliest digital computers (vacuum tube systems like ENIAC and early transistorized mainframes), there was no operating system. Programmers had dedicated, reserved physical access to the console for fixed blocks of time.
      </p>
      <p>
        Execution was entirely serial. The programmer physically mounted magnetic tape reels, loaded paper tape or punched card decks into readers, wired custom patch panels, and toggled console switches. If a program encountered an error or crashed, the CPU halted, and the programmer had to inspect memory contents through physical lights on the console.
      </p>
      <Callout type="mistake" title="Primary Silicon Inefficiency">
        <p>
          The hardware setup time (mounting reels, adjusting card trays, clearing printer paper jams) frequently exceeded the actual computational execution time by orders of magnitude. The expensive central processing unit remained completely idle for more than 90% of scheduled machine time.
        </p>
      </Callout>

      <h3>2. Simple Batch Systems (Second Generation: Late 1950s - 1960s)</h3>
      <p>
        To eliminate human setup overhead, computer scientists created the first crude operating systems: <strong>Resident Monitors</strong>. Instead of individual users interacting directly with the computer, human operators collected jobs with similar software requirements into batches.
      </p>
      <p>
        A special control language called <strong>Job Control Language (JCL)</strong> was punched onto cards (such as <code>$JOB</code>, <code>$FORTRAN</code>, <code>$RUN</code>, <code>$END</code>). The resident monitor sat permanently in lower memory. When Job 1 finished or aborted, the monitor automatically flushed memory, parsed the next JCL card, loaded the compiler or loader, and immediately transferred control to Job 2.
      </p>
      <p>
        While simple batch systems eliminated manual human transition delays, they ran directly into the <strong>I/O Bottleneck</strong>:
      </p>
      <ul>
        <li>CPU instruction cycle speeds: Microseconds (10<sup>-6</sup> seconds).</li>
        <li>Mechanical card reader / printer speeds: Milliseconds to seconds (10<sup>-1</sup> to 10<sup>0</sup> seconds).</li>
      </ul>
      <p>
        Because early batch systems supported only a single job in memory at any given time (uniprogramming), whenever the active program requested a tape read or printer write, the CPU was forced into a tight hardware spin-loop until the mechanical device finished.
      </p>

      <h3>3. Multiprogrammed Batch Systems & SPOOLing</h3>
      <p>
        The breakthrough that solved the mechanical I/O bottleneck was <strong>Multiprogramming</strong>, reinforced by high-speed magnetic disk storage and Direct Memory Access (DMA).
      </p>
      <p>
        In a multiprogramming operating system, main memory is partitioned to hold multiple jobs simultaneously (Job A, Job B, Job C). The operating system executes Job A. When Job A issues an I/O request (such as reading a record from secondary storage), the CPU does not halt. Instead, the OS scheduler immediately switches the CPU execution context to Job B. When Job B initiates I/O, the CPU switches to Job C. When Job A's I/O completes, the I/O controller signals a hardware interrupt, and the OS places Job A back into the ready queue.
      </p>

      <Callout type="definition" title="SPOOLing: Simultaneous Peripheral Operations On-Line">
        <p>
          <strong>SPOOLing</strong> uses high-speed magnetic secondary disk storage as a massive intermediate buffer between slow mechanical peripheral devices and high-speed CPU memory. Rather than reading punched cards directly into active memory during program execution, card decks were read continuously into disk spool files in the background. Similarly, print outputs were directed to spool files on disk at memory-bus speeds, allowing programs to complete immediately without waiting for mechanical print heads.
        </p>
      </Callout>

      <h3>Tanenbaum's Probabilistic Model of CPU Utilization</h3>
      <p>
        The mathematical power of multiprogramming can be analyzed using Andrew Tanenbaum's probabilistic model. Suppose n independent processes are concurrently resident in main memory, and each process spends a fraction p of its total execution lifetime waiting for I/O operations (where 0 &lt;= p &lt;= 1).
      </p>
      <p>
        Assuming the I/O operations of the processes are statistically independent, the mathematical probability that all n processes are simultaneously blocked waiting for I/O is:
      </p>
      <p className="font-mono text-center font-semibold my-4 text-brand dark:text-night-brand">
        P(All blocked) = p<sup>n</sup>
      </p>
      <p>
        Since the CPU is idle only when every single resident process is blocked, the resulting CPU utilization is given by:
      </p>
      <p className="font-mono text-center font-semibold my-4 text-brand dark:text-night-brand">
        CPU Utilization = 1 - p<sup>n</sup>
      </p>

      <h3>Worked Calculation: Impact of Degree of Multiprogramming</h3>
      <p>
        Consider a realistic business computing workload where programs spend 80% of their time waiting for disk and network I/O (p = 0.8):
      </p>
      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Degree of Multiprogramming n = 1 (Uniprogramming):</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            CPU Utilization = 1 - (0.8)<sup>1</sup> = 1 - 0.8 = 0.20
          </div>
          <div className="text-sm opacity-80">
            Result: Only 20% CPU utilization (80% wasted on mechanical I/O delay).
          </div>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Degree of Multiprogramming n = 2:</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            CPU Utilization = 1 - (0.8)<sup>2</sup> = 1 - 0.64 = 0.36
          </div>
          <div className="text-sm opacity-80">
            Result: 36% CPU utilization.
          </div>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Degree of Multiprogramming n = 5:</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            CPU Utilization = 1 - (0.8)<sup>5</sup> = 1 - 0.32768 = 0.6723
          </div>
          <div className="text-sm opacity-80">
            Result: 67.2% CPU utilization.
          </div>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Degree of Multiprogramming n = 10:</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            CPU Utilization = 1 - (0.8)<sup>10</sup> = 1 - 0.10737 = 0.8926
          </div>
          <div className="text-sm opacity-80">
            Result: 89.3% CPU utilization (near-saturation of physical hardware).
          </div>
        </li>
      </ul>
      <p>
        This mathematical derivation proves why adding memory to allow a higher degree of multiprogramming (n) yields substantial increases in hardware utilization without needing a faster CPU.
      </p>

      <h2>2. Time-Sharing Systems (Multitasking)</h2>
      <p>
        While multiprogrammed batch systems maximized machine utilization, they were unsuitable for interactive human software development. Turnaround times (the time from submitting a card deck to receiving printed output) were measured in hours or days.
      </p>
      <p>
        <strong>Time-Sharing Systems</strong> (pioneered by systems like CTSS and MULTICS in the 1960s, and later refined by Unix) introduced conversational, interactive computing. The operating system multiplexes CPU execution time across multiple active users connected via terminals.
      </p>
      <ul>
        <li>
          <strong>Time Quantum (Time Slice):</strong> The CPU allocates a small slice of continuous execution time (typically 10 ms to 100 ms) to each active process.
        </li>
        <li>
          <strong>Preemption via Timer Interrupt:</strong> At the end of each quantum, the hardware interval timer fires an interrupt, preempting the active process and switching the CPU to the next ready process in round-robin fashion.
        </li>
        <li>
          <strong>Perceptual Concurrency:</strong> Because human sensory perception operates on a scale of ~100 ms, rapid switching creates the seamless illusion that each user possesses an exclusive, dedicated computer.
        </li>
      </ul>

      <ComparisonTable {...paradigmsTable} />

      <h2>3. Real-Time Operating Systems (RTOS)</h2>
      <p>
        In a general-purpose operating system (like Linux, Windows, or macOS), the scheduler optimizes for aggregate throughput, average turnaround time, and fair resource sharing. In a <strong>Real-Time Operating System</strong>, the fundamental criterion of correctness is <strong>temporal determinism</strong>.
      </p>
      <Callout type="definition" title="Real-Time Correctness Principle">
        <p>
          In a real-time system, the correctness of a computation depends not only on the logical correctness of its mathematical results, but also upon the exact physical time at which those results are delivered. A logically correct answer delivered after its specified deadline is a system failure.
        </p>
      </Callout>

      <ComparisonTable {...hardVsSoftTable} />

      <h3>The Mars Pathfinder Priority Inversion Case Study</h3>
      <p>
        A frequent high-level examination and systems engineering interview question asks to explain <strong>Priority Inversion</strong> using the historic 1997 Mars Pathfinder spacecraft anomaly:
      </p>
      <ol>
        <li>
          <strong>The Setup:</strong> The Mars Pathfinder spacecraft ran the VxWorks real-time operating system. Three tasks of differing priorities competed for CPU execution:
          <ul>
            <li><strong>Task H (High Priority):</strong> The attitude control and stabilization thread responsible for keeping the spacecraft balanced.</li>
            <li><strong>Task M (Medium Priority):</strong> The communications thread streaming science telemetry to Earth.</li>
            <li><strong>Task L (Low Priority):</strong> A meteorological measurement thread recording Martian surface temperatures.</li>
          </ul>
        </li>
        <li>
          <strong>The Bug (Priority Inversion):</strong> Task L acquired a shared mutex guarding the spacecraft's internal information bus. While Task L held the mutex, an interrupt woke High-Priority Task H. Task H preempted Task L and attempted to acquire the information bus mutex. Because the mutex was locked by Task L, Task H blocked.
        </li>
        <li>
          <strong>The Catastrophe:</strong> Before Task L could complete its brief critical section and release the mutex, Medium-Priority Task M woke up. Because Task M had higher priority than Task L, Task M preempted Task L. Crucially, Task M did not use the information bus mutex at all. Consequently, Task M continued running indefinitely, preventing Task L from running to release the mutex. High-Priority Task H was thus indirectly blocked behind Medium-Priority Task M.
        </li>
        <li>
          <strong>The Result:</strong> A hardware watchdog timer detected that High-Priority Task H had missed its execution deadline, concluded the computer was frozen, and executed an automatic full system reboot, interrupting science data transmission repeatedly.
        </li>
        <li>
          <strong>The Solution (Priority Inheritance Protocol):</strong> Jet Propulsion Laboratory (JPL) engineers resolved the issue remotely by enabling the <strong>Priority Inheritance Protocol</strong>. Under this protocol, when High-Priority Task H blocks on a mutex held by Low-Priority Task L, Task L temporarily inherits the priority of Task H. Because Task L now runs with high priority, Medium-Priority Task M cannot preempt it. Task L completes its critical section rapidly, releases the mutex, returns to its original low priority, and Task H immediately acquires the mutex and proceeds.
        </li>
      </ol>

      <h2>4. Parallel and Multiprocessor Systems</h2>
      <p>
        Multiprocessor systems (tightly coupled systems) contain two or more physical CPU cores sharing a single physical memory address space, system bus, clock, and peripheral devices.
      </p>

      <ComparisonTable {...smpVsAmpTable} />

      <h3>Uniform Memory Access (UMA) vs Non-Uniform Memory Access (NUMA)</h3>
      <p>
        In modern enterprise multi-socket servers, symmetric multiprocessing scales beyond a single central memory bus:
      </p>
      <ul>
        <li>
          <strong>UMA (Uniform Memory Access):</strong> All processors access physical memory through a single shared system bus with identical access latency. As the number of CPU cores scales past 8 to 16, the single memory bus becomes a severe electrical and throughput bottleneck.
        </li>
        <li>
          <strong>NUMA (Non-Uniform Memory Access):</strong> Physical memory is partitioned across multiple distinct CPU sockets (NUMA nodes). A CPU core accessing its local on-socket memory channels experiences minimal latency (~60 ns). However, if that core accesses memory frames attached to an adjacent CPU socket, the request must traverse an inter-socket interconnect (such as Intel Ultra Path Interconnect - UPI, or AMD Infinity Fabric), adding substantial latency (~120 ns to 150 ns).
        </li>
      </ul>
      <p>
        Operating system schedulers must be NUMA-aware, placing processes on the CPU socket closest to their allocated memory frames. Below is how low-level systems engineers bind execution threads to specific physical CPU cores using POSIX affinity primitives:
      </p>

      <CodeBlock language="text" code={numaAffinityCode} />

      <h2>5. Distributed Operating Systems</h2>
      <p>
        In contrast to multiprocessor systems, a <strong>Distributed System</strong> is a collection of physically independent, autonomous computing nodes connected over a local or wide-area network.
      </p>
      <ul>
        <li><strong>No Shared Memory:</strong> Each node possesses its own private CPU, clock, and physical RAM. Communication occurs entirely through message passing over network sockets or Remote Procedure Calls (RPC).</li>
        <li><strong>No Global Clock:</strong> Because relativistic delays and network jitter prevent perfect synchronization of physical quartz clocks, distributed operating systems rely on logical clocks (Lamport Timestamps or Vector Clocks) to establish partial ordering of events.</li>
        <li><strong>Fault Tolerance and Consensus:</strong> Unlike an SMP system where a kernel panic halts all cores, a distributed system must survive independent partial node failures using distributed consensus protocols (such as Paxos or Raft).</li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you derive Andrew Tanenbaum's CPU utilization formula 1 - p<sup>n</sup> and calculate utilization gains for given I/O percentages?</li>
        <li>Can you explain how SPOOLing decoupled high-speed CPU computation from mechanical peripheral speeds?</li>
        <li>Can you trace the exact sequence of events causing Priority Inversion and explain how Priority Inheritance mathematically solves it?</li>
        <li>Can you contrast Hard vs Soft Real-Time systems across deadline consequences, virtual memory usage, and kernel designs?</li>
        <li>Can you distinguish between UMA and NUMA multiprocessor memory architectures and explain the role of thread affinity?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Arpaci-Dusseau)</a> - Chapters on CPU scheduling and multiprocessor architectures.
        </li>
        <li>
          <a href="https://www.cs.unc.edu/~anderson/teach/comp737/papers/pathfinder.html">What Really Happened on Mars? (Mike Jones, IEEE Real-Time Systems)</a> - Definitive retrospective on the Mars Pathfinder priority inversion diagnosis and patch.
        </li>
        <li>
          <a href="https://man7.org/linux/man-pages/man3/pthread_setaffinity_np.3.html">Linux Programmer's Manual: pthread_setaffinity_np(3)</a> - POSIX thread CPU affinity documentation.
        </li>
      </ul>
    </>
  )
}
