import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const schedulingDecisionTable = {
    caption: 'Four CPU Scheduling Decision Points and Preemption Classification',
    headers: ['State Transition', 'Trigger Event', 'Scheduling Nature', 'Preemption Policy'],
    rows: [
      [
        'Running &rarr; Waiting',
        'Process issues synchronous I/O request (read, write) or waits for child (waitpid).',
        'Voluntary (Cooperative)',
        'Non-preemptive: the CPU must select another ready process.'
      ],
      [
        'Running &rarr; Ready',
        'Hardware timer interrupt asserts; assigned time slice (quantum) expires.',
        'Involuntary',
        'Preemptive: running process is halted and moved to Ready Queue.'
      ],
      [
        'Waiting &rarr; Ready',
        'Peripheral I/O controller signals completion interrupt; missing data is in RAM.',
        'Involuntary',
        'Preemptive: higher-priority unblocked job can displace running process.'
      ],
      [
        'Running &rarr; Terminated',
        'Process finishes instruction execution via exit() or is killed by signal (SIGKILL).',
        'Voluntary / Fatal',
        'Non-preemptive: process vacates CPU; next ready process is scheduled.'
      ]
    ]
  }

  const schedulingCriteriaTable = {
    caption: 'Formal Evaluation Criteria for CPU Scheduling Algorithms',
    headers: ['Performance Metric', 'Formal Mathematical Definition', 'Target Optimization'],
    rows: [
      [
        'CPU Utilization',
        'Percentage of elapsed wall-clock time that the CPU is executing user or kernel code.',
        'Maximize (Typically 40% in lightly loaded systems to 90% in server environments).'
      ],
      [
        'Throughput',
        'Number of complete process executions achieved per standard unit of time (e.g., jobs/min).',
        'Maximize (Reduces queue backlog and processing delays).'
      ],
      [
        'Turnaround Time (TAT)',
        'Elapsed time from process arrival to final completion: TAT = Completion Time - Arrival Time.',
        'Minimize (Primary metric for batch processing efficiency).'
      ],
      [
        'Waiting Time (WT)',
        'Cumulative total time spent sitting in the Ready Queue: WT = Turnaround Time - Burst Time.',
        'Minimize (Reflects fairness and queue contention).'
      ],
      [
        'Response Time (RT)',
        'Elapsed time from process arrival to the first dispatch onto the CPU: RT = First Run - Arrival.',
        'Minimize (Crucial metric for desktop interactivity and real-time systems).'
      ]
    ]
  }

  return (
    <>
      <p>
        In multiprogrammed operating systems, the <strong>CPU Scheduler</strong> (short-term scheduler) is the component responsible for selecting which runnable process from the Ready Queue is allocated processor execution units when the CPU becomes available. The efficiency of CPU scheduling directly dictates application responsiveness, overall system throughput, and resource utilization across physical hardware.
      </p>

      <h2>1. The CPU-I/O Burst Cycle and Scheduling Criteria</h2>
      <p>
        Process execution consists of alternating cycles of <strong>CPU execution bursts</strong> (arithmetic computations, memory loads/stores, and logical branching) and <strong>I/O wait bursts</strong> (waiting for disk reads, network packets, or keyboard inputs).
      </p>
      <p>
        Across general-purpose workloads, the frequency distribution of CPU bursts exhibits an exponential decay profile: there is an overwhelming frequency of short CPU bursts (typically under 8 milliseconds, characterizing interactive and I/O-bound processes) and a small frequency of very long CPU bursts (characterizing compute-intensive batch jobs).
      </p>

      <h3>Preemptive vs Non-Preemptive Scheduling</h3>
      <p>
        Operating system schedulers are fundamentally categorized based on when they make allocation decisions:
      </p>
      <ComparisonTable {...schedulingDecisionTable} />

      <h3>Formal Mathematical Criteria</h3>
      <p>
        When evaluating or comparing scheduling algorithms for university examination problems and systems design, the following standard metrics are utilized:
      </p>
      <ComparisonTable {...schedulingCriteriaTable} />

      <h2>2. First-Come, First-Served (FCFS) and The Convoy Effect</h2>
      <p>
        <strong>First-Come, First-Served (FCFS)</strong> is the simplest scheduling algorithm. Processes are allocated the CPU strictly in the order they arrive in the Ready Queue, managed as a First-In, First-Out (FIFO) queue. It is strictly non-preemptive.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Worked Examination Example: FCFS and The Convoy Effect</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          Consider three processes arriving at time <em>t = 0</em> in the order <em>P<sub>1</sub>, P<sub>2</sub>, P<sub>3</sub></em> with CPU burst requirements:
          <em> P<sub>1</sub> = 24 ms, P<sub>2</sub> = 3 ms, P<sub>3</sub> = 3 ms</em>.
        </p>

        <div className="overflow-x-auto my-3 p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono">
          <div className="text-subtle dark:text-night-subtle mb-1 font-bold font-sans">Execution Gantt Chart (Schedule Order: P1 &rarr; P2 &rarr; P3):</div>
          <div className="py-2 px-3 bg-surface dark:bg-night-surface rounded border border-line dark:border-night-line text-accent dark:text-night-accent font-semibold">
            |&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; P1 (24 ms) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp; P2 (3 ms) &nbsp;|&nbsp; P3 (3 ms) &nbsp;|<br />
            0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30
          </div>
        </div>

        <div className="space-y-1 text-xs text-ink/80 dark:text-night-ink/80">
          <div>&bull; Waiting Time for P<sub>1</sub> = 0 ms</div>
          <div>&bull; Waiting Time for P<sub>2</sub> = 24 ms</div>
          <div>&bull; Waiting Time for P<sub>3</sub> = 27 ms</div>
          <div className="font-bold text-danger dark:text-night-danger pt-1">
            Average Waiting Time = (0 + 24 + 27) / 3 = 51 / 3 = 17.0 ms
          </div>
        </div>

        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mt-4 mb-2">
          Now, observe the performance change if the same processes arrive in reverse order: <em>P<sub>2</sub>, P<sub>3</sub>, P<sub>1</sub></em>:
        </p>

        <div className="overflow-x-auto my-3 p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono">
          <div className="text-subtle dark:text-night-subtle mb-1 font-bold font-sans">Execution Gantt Chart (Schedule Order: P2 &rarr; P3 &rarr; P1):</div>
          <div className="py-2 px-3 bg-surface dark:bg-night-surface rounded border border-line dark:border-night-line text-success dark:text-night-success font-semibold">
            |&nbsp; P2 (3 ms) &nbsp;|&nbsp; P3 (3 ms) &nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; P1 (24 ms) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br />
            0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30
          </div>
        </div>

        <div className="space-y-1 text-xs text-ink/80 dark:text-night-ink/80">
          <div>&bull; Waiting Time for P<sub>2</sub> = 0 ms</div>
          <div>&bull; Waiting Time for P<sub>3</sub> = 3 ms</div>
          <div>&bull; Waiting Time for P<sub>1</sub> = 6 ms</div>
          <div className="font-bold text-success dark:text-night-success pt-1">
            Average Waiting Time = (0 + 3 + 6) / 3 = 9 / 3 = 3.0 ms
          </div>
        </div>
      </div>

      <Callout type="mistake" title="The Convoy Effect Mechanism">
        The above mathematical proof demonstrates the <strong>Convoy Effect</strong>: when a heavy CPU-bound job runs first, all short I/O-bound jobs queue behind it. During this time, high-speed peripheral devices sit completely idle. When the long process finally issues an I/O request, the short processes execute quickly and sit idle waiting for the next burst, starving the CPU. FCFS yields highly variable, sub-optimal waiting times.
      </Callout>

      <h2>3. Shortest Job First (SJF) and Preemptive SRTF</h2>
      <p>
        <strong>Shortest Job First (SJF)</strong> associates each ready process with the length of its next CPU burst. The process with the smallest burst requirement is dispatched first. If two processes have equal burst times, FCFS is used as a tie-breaker.
      </p>
      <p>
        <strong>Mathematical Optimality:</strong> SJF is provably optimal because scheduling shorter jobs before longer jobs minimizes the cumulative waiting time of all tasks in the queue.
      </p>

      <h3>Shortest Remaining Time First (SRTF - Preemptive SJF)</h3>
      <p>
        When a new process arrives in the Ready Queue with a CPU burst shorter than the remaining burst time of the currently running process, a preemptive scheduler interrupts the running process and dispatches the new arrival.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Worked Examination Example: Preemptive SJF (SRTF)</h4>
        <div className="overflow-x-auto text-xs font-mono mb-3">
          <table className="w-full text-left border-collapse border border-line dark:border-night-line">
            <thead className="bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
              <tr>
                <th className="p-2 border border-line dark:border-night-line">Process</th>
                <th className="p-2 border border-line dark:border-night-line">Arrival Time</th>
                <th className="p-2 border border-line dark:border-night-line">Burst Time</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-line dark:border-night-line">P1</td><td className="p-2 border border-line dark:border-night-line">0 ms</td><td className="p-2 border border-line dark:border-night-line">8 ms</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line">P2</td><td className="p-2 border border-line dark:border-night-line">1 ms</td><td className="p-2 border border-line dark:border-night-line">4 ms</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line">P3</td><td className="p-2 border border-line dark:border-night-line">2 ms</td><td className="p-2 border border-line dark:border-night-line">9 ms</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line">P4</td><td className="p-2 border border-line dark:border-night-line">3 ms</td><td className="p-2 border border-line dark:border-night-line">5 ms</td></tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto my-3 p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono">
          <div className="text-subtle dark:text-night-subtle mb-1 font-bold font-sans">Execution Gantt Chart (Preemptive Switches Traced):</div>
          <div className="py-2 px-3 bg-surface dark:bg-night-surface rounded border border-line dark:border-night-line text-brand dark:text-night-brand font-semibold">
            | P1 (1ms) | P2 (4ms) | P4 (5ms) | P1 (7ms) | P3 (9ms) |<br />
            0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 17&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 26
          </div>
        </div>

        <div className="space-y-1 text-xs text-ink/80 dark:text-night-ink/80">
          <div>&bull; <em>t = 0:</em> P1 starts (Remaining: 8ms).</div>
          <div>&bull; <em>t = 1:</em> P2 arrives (Burst: 4ms). P1 remaining is 7ms. Since 4 &lt; 7, P1 is preempted; P2 runs.</div>
          <div>&bull; <em>t = 2:</em> P3 arrives (Burst: 9ms). P2 remaining is 3ms (3 &lt; 9). P2 continues.</div>
          <div>&bull; <em>t = 3:</em> P4 arrives (Burst: 5ms). P2 remaining is 2ms (2 &lt; 5). P2 continues.</div>
          <div>&bull; <em>t = 5:</em> P2 completes. Ready processes: P4 (5ms), P1 (7ms), P3 (9ms). P4 is chosen.</div>
          <div>&bull; <em>t = 10:</em> P4 completes. Ready processes: P1 (7ms), P3 (9ms). P1 runs.</div>
          <div>&bull; <em>t = 17:</em> P1 completes. P3 runs until <em>t = 26</em>.</div>
          <div className="pt-2 font-bold text-brand dark:text-night-brand">
            Turnaround Times: P1 = 17 - 0 = 17 ms; P2 = 5 - 1 = 4 ms; P3 = 26 - 2 = 24 ms; P4 = 10 - 3 = 7 ms.<br />
            Waiting Times: P1 = 17 - 8 = 9 ms; P2 = 4 - 4 = 0 ms; P3 = 24 - 9 = 15 ms; P4 = 7 - 5 = 2 ms.<br />
            Average Waiting Time = (9 + 0 + 15 + 2) / 4 = 26 / 4 = 6.5 ms.
          </div>
        </div>
      </div>

      <h3>Exponential Smoothing for Next CPU Burst Prediction</h3>
      <p>
        Because the kernel cannot know future burst lengths in advance, systems approximate SJF by predicting the next burst &tau;<sub>n+1</sub> using <strong>Exponential Smoothing</strong>:
      </p>

      <div className="my-4 p-4 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface font-mono text-xs text-ink dark:text-night-ink">
        <div className="text-center font-bold text-brand dark:text-night-brand mb-2 text-sm font-sans">
          &tau;<sub>n+1</sub> = &alpha; &times; t<sub>n</sub> + (1 - &alpha;) &times; &tau;<sub>n</sub>
        </div>
        <p className="text-ink/80 dark:text-night-ink/80 font-sans text-xs leading-relaxed mb-2">
          Where <em>t<sub>n</sub></em> is the actual measured duration of the most recent CPU burst, <em>&tau;<sub>n</sub></em> is the historical predicted duration, and <em>&alpha;</em> (0 &le; &alpha; &le; 1) is a weighting constant.
        </p>
        <div className="p-3 rounded bg-soft dark:bg-night-soft border border-line dark:border-night-line text-ink/80 dark:text-night-ink/80 space-y-1">
          <div>&bull; If &alpha; = 0: &tau;<sub>n+1</sub> = &tau;<sub>n</sub> (Recent history ignored; past trend dominates).</div>
          <div>&bull; If &alpha; = 1: &tau;<sub>n+1</sub> = t<sub>n</sub> (Only the most recent burst matters; high volatility).</div>
          <div>&bull; Standard setting: &alpha; = 0.5 (Balances recent behavior with long-term average).</div>
        </div>
      </div>

      <h2>4. Priority Scheduling and Starvation (Aging)</h2>
      <p>
        In <strong>Priority Scheduling</strong>, each process is assigned an integer priority rank, and the CPU is allocated to the highest-priority runnable process (in UNIX, lower integer values signify higher priority).
      </p>
      <ul>
        <li>
          <strong>Static Priorities:</strong> Remain fixed throughout the process lifetime (e.g., system daemon vs background compile).
        </li>
        <li>
          <strong>Dynamic Priorities:</strong> Adjusted continuously by the kernel based on memory residency, I/O burst frequency, and elapsed waiting time.
        </li>
      </ul>

      <Callout type="key" title="Indefinite Blocking (Starvation) and the Aging Mechanism">
        The primary flaw of strict priority scheduling is <strong>indefinite blocking (starvation)</strong>: a stream of high-priority processes can permanently block low-priority processes from ever acquiring CPU execution time.<br /><br />
        The standard operating system solution is <strong>Aging</strong>: a technique of gradually increasing the priority of processes that wait in the Ready Queue for extended durations. For example, the kernel decrements the process nice value by 1 every 100 milliseconds of unserviced waiting time. Eventually, even the lowest-priority background task rises to become the highest-priority task in the system, guaranteeing execution.
      </Callout>

      <h2>5. Round Robin (RR) and Quantum Trade-Offs</h2>
      <p>
        <strong>Round Robin (RR)</strong> is designed specifically for time-sharing systems. The scheduler defines a small unit of time called a <strong>time quantum</strong> (or time slice <em>q</em>, typically 10 to 100 milliseconds). The Ready Queue is treated as a circular FIFO queue.
      </p>
      <p>
        The scheduler dispatches the first process from the queue and sets the hardware timer to interrupt after <em>q</em> milliseconds. If the process finishes before the quantum expires, it voluntarily vacates the CPU. If the process is still executing when the timer fires, the OS preempts it, places it at the tail of the Ready Queue, and dispatches the next process.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Analyzing the Time Quantum Boundary Dilemma</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-danger dark:text-night-danger font-bold block mb-1 font-sans text-sm">Scenario A: Quantum q is Excessively Large (q &rarr; &infin;)</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
              If <em>q</em> exceeds the longest process burst in the system, no process is ever preempted by the timer. The Round Robin algorithm completely degenerates into <strong>First-Come, First-Served (FCFS)</strong>, reviving the Convoy Effect and destroying interactive desktop responsiveness.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-accent dark:text-night-accent font-bold block mb-1 font-sans text-sm">Scenario B: Quantum q is Extremely Small (q &rarr; 0)</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
              If <em>q</em> is configured to 1 millisecond and context switching requires 0.2 milliseconds, <strong>16.7% of all CPU cycles are consumed by context switching overhead</strong> rather than useful computation. Hardware caches are perpetually invalidated, leading to severe system thrashing.
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-selected/50 dark:bg-night-selected/50 border border-brand/30 text-xs font-mono text-brand dark:text-night-brand font-semibold">
          Golden Rule: Configure q such that ~80% of CPU bursts are shorter than q, keeping context-switch overhead below 1% of the quantum.
        </div>
      </div>

      <h2>6. Multilevel Queue (MLQ) and Multilevel Feedback Queue (MLFQ)</h2>
      <p>
        In enterprise operating systems, workloads are heterogeneous: interactive desktop windows require instantaneous response times, while background batch compilations require maximized throughput.
      </p>
      <ul>
        <li>
          <strong>Multilevel Queue (MLQ):</strong> Partitions the Ready Queue into multiple distinct queues (e.g., System Processes, Interactive UI, Batch Jobs). Each queue has its own scheduling algorithm (e.g., RR for UI, FCFS for batch), and scheduling between queues is typically fixed-priority preemptive. Processes permanently reside in their assigned queue.
        </li>
        <li>
          <strong>Multilevel Feedback Queue (MLFQ):</strong> Solves the rigidity of MLQ by allowing processes to <strong>move between queues</strong> based on their observed runtime behavior:
          <ul>
            <li>A new process enters the highest-priority queue (Q<sub>0</sub>) with a very short time quantum (e.g., 8 ms).</li>
            <li>If it does not finish within 8 ms, it is demoted to queue Q<sub>1</sub> (quantum = 16 ms).</li>
            <li>If it continues consuming CPU without yielding, it is demoted to lowest queue Q<sub>2</sub> (FCFS or large quantum).</li>
            <li>Processes that yield early for I/O remain in or are boosted back to high-priority interactive queues.</li>
          </ul>
        </li>
      </ul>

      <h2>7. Multiprocessor Scheduling and Linux CFS</h2>
      <p>
        When multiple physical CPU cores are available, scheduling complexity increases:
      </p>
      <ul>
        <li>
          <strong>Processor Affinity:</strong> A process has an affinity for the processor core on which it is currently running. Moving a process to a different core requires invalidating the cold cache on the old core and warming the cache on the new core. Schedulers support <em>soft affinity</em> (attempts to keep on same core) and <em>hard affinity</em> (strict pinning via <code>sched_setaffinity()</code>).
        </li>
        <li>
          <strong>Load Balancing:</strong> Ensures cores do not sit idle while others have deep runqueues:
          <ul>
            <li><em>Push Migration:</em> A kernel monitor task checks load periodically and pushes tasks from overloaded cores to idle cores.</li>
            <li><em>Pull Migration:</em> An idle core actively pulls waiting tasks from the runqueue of a busy core.</li>
          </ul>
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Modern Kernel Architecture: Linux Completely Fair Scheduler (CFS)</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          Since Linux 2.6.23, the standard scheduler for non-realtime tasks is the <strong>Completely Fair Scheduler (CFS)</strong>. CFS models an ideal multi-tasking CPU on hardware using two architectural primitives:
        </p>
        <div className="space-y-2 text-xs font-mono text-ink/90 dark:text-night-ink/90">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">1. Virtual Runtime (vruntime):</strong> Tracks the exact execution time consumed by a task, scaled inversely by its nice value (-20 to +19). A task with a lower nice value (higher priority) accumulates vruntime at a slower rate.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">2. Red-Black Tree Runqueue:</strong> Runnable tasks are indexed in a self-balancing red-black tree keyed by <code>vruntime</code>. The task that has executed least (smallest vruntime) is at the leftmost leaf node. CFS dispatches the leftmost node in O(1) time and re-inserts it after running in O(log N) time.
          </div>
        </div>
      </div>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you state the four CPU scheduling decision points and classify each as preemptive or non-preemptive?</li>
        <li>Can you define Turnaround Time, Waiting Time, and Response Time and write their formulas?</li>
        <li>Can you mathematically explain the Convoy Effect in FCFS and how it affects average waiting time?</li>
        <li>Can you trace a preemptive Shortest Remaining Time First (SRTF) schedule with a Gantt chart in a 10-mark exam question?</li>
        <li>Do you know how Exponential Smoothing predicts future CPU bursts using the &alpha; parameter?</li>
        <li>Can you explain how Aging prevents starvation in priority scheduling systems?</li>
        <li>Can you explain the trade-offs of choosing a very small versus a very large Round Robin time quantum?</li>
        <li>Do you understand how the Linux CFS uses <code>vruntime</code> and a Red-Black tree to maintain proportional fairness?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 7: Scheduling: Introduction, Chapter 8: Multi-level Feedback, and Chapter 9: Lottery Scheduling.
        </li>
        <li>
          <a href="https://www.kernel.org/doc/html/latest/scheduler/sched-design-CFS.html">CFS Scheduler Design - The Linux Kernel Documentation</a> - Deep technical architectural reference for CFS, vruntime mathematics, and sched_entity structures.
        </li>
        <li>
          <a href="https://man7.org/linux/man-pages/man2/sched_setaffinity.2.html">Linux Programmer&apos;s Manual: sched_setaffinity(2)</a> - API documentation for binding threads to physical CPU cores.
        </li>
      </ul>
    </>
  )
}
