import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const coffmanTable = {
    caption: 'The Four Coffman Conditions for Deadlock Characterization',
    headers: ['Condition', 'Operating System Definition', 'Practical Systems Manifestation'],
    rows: [
      [
        '1. Mutual Exclusion',
        'At least one resource must be non-shareable; only one process can hold the resource at any given instant.',
        'A magnetic tape drive, write-lock on a database row, or exclusive printer buffer that cannot be concurrently accessed.'
      ],
      [
        '2. Hold and Wait',
        'A process must hold at least one resource while waiting to acquire additional resources held by other processes.',
        'A thread holding a mutex on File A while blocking to acquire a second mutex on File B.'
      ],
      [
        '3. No Preemption',
        'Resources cannot be forcibly confiscated from a process; they can only be released voluntarily after task completion.',
        'The kernel will not forcibly revoke a write lock from a sleeping thread; it must wait until the thread calls unlock().'
      ],
      [
        '4. Circular Wait',
        'A closed chain of processes {P0, P1, ..., Pn} exists such that P0 waits for P1, P1 waits for P2, and Pn waits for P0.',
        'Process 1 holds Resource A and requests Resource B; Process 2 holds Resource B and requests Resource A.'
      ]
    ]
  }

  const deadlockComparisonTable = {
    caption: 'Comparison of Concurrency Anomalies: Deadlock vs Starvation vs Livelock',
    headers: ['Property', 'Deadlock', 'Starvation (Indefinite Blocking)', 'Livelock'],
    rows: [
      [
        'CPU Activity',
        'Processes are blocked/sleeping; CPU utilization by these processes is 0%.',
        'Process is runnable/ready; CPU is consumed by higher-priority tasks.',
        'Processes are actively running on the CPU; CPU utilization is 100% spinning.'
      ],
      [
        'Cause',
        'Circular dependency chain of ungrantable resource requests.',
        'Biased scheduling policies perpetually favoring higher-priority processes.',
        'Processes continuously react to each other state without achieving functional progress.'
      ],
      [
        'Self-Recovery',
        'Impossible without external intervention (process termination or resource preemption).',
        'Possible when high-priority workloads finish or under aging mechanisms.',
        'Rare; requires randomized back-off algorithms (e.g., Ethernet CSMA/CD back-off).'
      ],
      [
        'Number of Tasks Involved',
        'Strictly requires two or more cooperating or competing processes.',
        'Can affect a single unfortunate process in an otherwise active system.',
        'Typically involves two or more concurrent processes or network nodes.'
      ]
    ]
  }

  const handlingStrategiesTable = {
    caption: 'The Four Fundamental Operating System Deadlock Handling Strategies',
    headers: ['Strategy', 'Core Mechanism', 'Runtime Cost & System Impact', 'Adoption in Modern OS'],
    rows: [
      [
        'Deadlock Prevention',
        'Impose structural protocol rules that invalidate at least one of the four Coffman conditions.',
        'High resource underutilization and severe throughput restrictions (e.g., requesting all resources upfront).',
        'Embedded real-time microkernels with static allocation guarantees.'
      ],
      [
        'Deadlock Avoidance',
        'Dynamically inspect state vectors using a priori maximum resource claims (Banker Algorithm).',
        'High runtime overhead: requires tracking every request against available vectors in O(m &times; n<sup>2</sup>) time.',
        'Database transaction managers and safety-critical avionics.'
      ],
      [
        'Deadlock Detection & Recovery',
        'Permit deadlocks to occur, periodically trace cycles in wait-for graphs, and abort victim tasks.',
        'Moderate overhead; detection runs periodically, but recovery requires process abortion or rollback.',
        'Distributed databases and high-performance transaction engines.'
      ],
      [
        'Ignorance (Ostrich Algorithm)',
        'Ignore the problem completely under the premise that deadlocks are rare and cheaper to handle via reboot.',
        'Zero operating system overhead during normal runtime.',
        'General-purpose desktop and server OS (Linux, Windows, macOS, Android).'
      ]
    ]
  }

  return (
    <>
      <p>
        In multiprogramming environments, multiple processes compete for a finite set of shared system resources (such as memory pages, CPU cores, database records, and peripheral controllers). When process resource requests cannot be immediately fulfilled because the resources are held by other waiting processes, a system state can arise where none of the processes can ever proceed. For Master of Computer Applications (MCA) students, mastering <strong>Deadlocks</strong> requires analyzing formal system resource models, Coffman conditions, Resource-Allocation Graphs (RAGs), and algorithmic strategies for handling concurrent resource competition.
      </p>

      <h2>1. The Deadlock Problem and System Model</h2>
      <p>
        A <strong>Deadlock</strong> is a permanent blocking condition in which every process in a set is waiting for an event (typically the release of an allocated resource) that can only be triggered by another process in that exact same set.
      </p>

      <h3>The Formal System Resource Model</h3>
      <p>
        In operating systems theory, a computer system is formalized as a set of processes <em>P = &#123;P<sub>1</sub>, P<sub>2</sub>, ..., P<sub>n</sub>&#125;</em> competing for a set of distinct resource types <em>R = &#123;R<sub>1</sub>, R<sub>2</sub>, ..., R<sub>m</sub>&#125;</em>:
      </p>
      <ul>
        <li>
          <strong>Resource Types:</strong> Physical or logical categories of resources, such as disk drives, RAM frames, semaphore mutexes, and printer buffers.
        </li>
        <li>
          <strong>Resource Instances:</strong> Each resource type <em>R<sub>j</sub></em> contains <em>W<sub>j</sub></em> identical, interchangeable instances (for example, a system with 4 identical SSD partitions has 4 instances of type <em>R<sub>SSD</sub></em>).
        </li>
      </ul>

      <p>
        Under normal operating conditions, a process must interact with resources following a strict three-phase lifecycle:
      </p>
      <ol>
        <li>
          <strong>Request:</strong> The process requests an instance of resource <em>R<sub>j</sub></em>. If the request cannot be granted immediately (e.g., all instances are allocated), the calling process is suspended until instances become available.
        </li>
        <li>
          <strong>Use:</strong> The process operates on the acquired resource (e.g., reading sectors from disk or writing to a shared file).
        </li>
        <li>
          <strong>Release:</strong> The process voluntarily frees the resource, returning it to the kernel free pool and awakening waiting processes.
        </li>
      </ol>

      <h2>2. The Four Coffman Conditions</h2>
      <p>
        In their seminal 1971 paper, Edward G. Coffman Jr., Michael J. Elphick, and Arie Shoshani established that a deadlock can arise if and only if all four of the following conditions hold simultaneously within a system:
      </p>
      <ComparisonTable {...coffmanTable} />

      <Callout type="definition" title="The Interdependence of the Four Conditions">
        The four Coffman conditions are not independent: <strong>Circular Wait</strong> implies both <strong>Hold and Wait</strong> and <strong>Mutual Exclusion</strong>. However, stating all four explicitly is crucial because breaking <em>any single condition</em> guarantees that a deadlock cannot occur, which forms the theoretical foundation for <strong>Deadlock Prevention</strong>.
      </Callout>

      <h2>3. Resource-Allocation Graphs (RAG)</h2>
      <p>
        Deadlocks can be precisely characterized using a directed graph known as a <strong>Resource-Allocation Graph (RAG)</strong>, denoted as <em>G = (V, E)</em>:
      </p>
      <ul>
        <li>
          <strong>Vertices (V):</strong> Partitioned into two sets:
          <ul>
            <li>Process nodes: <em>P = &#123;P<sub>1</sub>, P<sub>2</sub>, ..., P<sub>n</sub>&#125;</em>, represented visually as circles.</li>
            <li>Resource nodes: <em>R = &#123;R<sub>1</sub>, R<sub>2</sub>, ..., R<sub>m</sub>&#125;</em>, represented visually as rectangles, with dots inside indicating individual resource instances.</li>
          </ul>
        </li>
        <li>
          <strong>Edges (E):</strong> Partitioned into two directed relationship types:
          <ul>
            <li><strong>Request Edge:</strong> A directed edge <em>P<sub>i</sub> &rarr; R<sub>j</sub></em> indicates that process <em>P<sub>i</sub></em> has requested an instance of resource type <em>R<sub>j</sub></em> and is currently waiting for it.</li>
            <li><strong>Assignment Edge:</strong> A directed edge <em>R<sub>j</sub> &rarr; P<sub>i</sub></em> indicates that an instance of resource type <em>R<sub>j</sub></em> has been allocated to process <em>P<sub>i</sub></em>.</li>
          </ul>
        </li>
      </ul>

      <h3>Cycle Analysis: Necessary vs Sufficient Conditions</h3>
      <p>
        A critical examination question for MCA students concerns the relationship between graph cycles and deadlocks:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-3 font-sans">Theorem: Cycle Condition in Resource-Allocation Graphs</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-danger dark:text-night-danger block mb-2 font-sans text-sm">Case 1: Single Instance per Resource Type</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
              If every resource type in the system contains exactly one instance:
            </p>
            <div className="p-3 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line font-mono text-xs text-brand dark:text-night-brand font-semibold text-center mb-2">
              Cycle in RAG &hArr; Deadlock Exists
            </div>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
              A directed cycle is <strong>both a necessary and sufficient condition</strong> for deadlock. Every process in the cycle is blocked on a resource held by another process in the cycle, forming an unbreakable circular wait chain.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-accent dark:text-night-accent block mb-2 font-sans text-sm">Case 2: Multiple Instances per Resource Type</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
              If resource types contain multiple identical instances:
            </p>
            <div className="p-3 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line font-mono text-xs text-accent dark:text-night-accent font-semibold text-center mb-2">
              Cycle in RAG &ne;&rArr; Deadlock Exists
            </div>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
              A directed cycle is a <strong>necessary condition, but NOT a sufficient condition</strong>. An external process holding an instance of a resource in the cycle may complete its execution, release its instance, and break the deadlock.
            </p>
          </div>
        </div>
      </div>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">Concrete Proof: Cycle in Multi-Instance Graph Without Deadlock</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          Consider 4 processes &#123;P<sub>1</sub>, P<sub>2</sub>, P<sub>3</sub>, P<sub>4</sub>&#125; and 2 resource types &#123;R<sub>1</sub>, R<sub>2</sub>&#125;, each with 2 instances:
        </p>
        <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line font-mono text-xs text-ink/90 dark:text-night-ink/90 space-y-1 mb-3">
          <div>&bull; R1 has 2 instances: Allocated to P1 and P2. (R1 &rarr; P1, R1 &rarr; P2)</div>
          <div>&bull; R2 has 2 instances: Allocated to P1 and P4. (R2 &rarr; P1, R2 &rarr; P4)</div>
          <div>&bull; P1 requests R1: (P1 &rarr; R1)</div>
          <div>&bull; P3 requests R1: (P3 &rarr; R1)</div>
          <div>&bull; Cycle exists: P1 &rarr; R1 &rarr; P1 (or P1 &rarr; R1 &rarr; P2 ...)</div>
        </div>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed">
          <strong>Why there is NO deadlock:</strong> Process <em>P<sub>4</sub></em> holds an instance of <em>R<sub>2</sub></em> but is not waiting for any resource. Process <em>P<sub>4</sub></em> will finish its execution, release its instance of <em>R<sub>2</sub></em>, which can then be allocated to <em>P<sub>1</sub></em>. Process <em>P<sub>1</sub></em> then completes and releases its resources, allowing all processes to finish smoothly. Hence, a cycle exists, but the system is entirely deadlock-free.
        </p>
      </div>

      <h2>4. Deadlock vs Starvation vs Livelock</h2>
      <p>
        Concurrency bugs often produce symptoms that resemble deadlocks but stem from fundamentally different execution dynamics:
      </p>
      <ComparisonTable {...deadlockComparisonTable} />

      <h2>5. Methods for Handling Deadlocks</h2>
      <p>
        Historically and theoretically, operating systems approach deadlocks through four distinct methodologies:
      </p>
      <ComparisonTable {...handlingStrategiesTable} />

      <Callout type="key" title="The Ostrich Algorithm in Modern Operating Systems">
        Why do mainstream kernels like Linux, Windows, and macOS adopt the <strong>Ostrich Algorithm</strong> (sticking one head in the sand and ignoring the problem)?<br /><br />
        In general-purpose operating systems, deadlocks between user applications occur infrequently compared to standard software crashes. The engineering cost of continuously running cycle-detection algorithms or forcing programs to declare maximum resource requirements upfront would degrade overall system responsiveness by 20% to 30%. Therefore, operating systems place the responsibility of synchronization correctness on application programmers and rely on human users to terminate non-responsive processes via Task Manager or <code>kill -9</code>.
      </Callout>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you define Deadlock and outline the Request-Use-Release resource protocol?</li>
        <li>Can you list and explain all four Coffman conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait)?</li>
        <li>Can you draw and label a Resource-Allocation Graph (RAG) with process nodes, resource nodes, request edges, and assignment edges?</li>
        <li>Can you explain why a cycle in a RAG is both necessary and sufficient for single-instance resources, but only necessary for multi-instance resources?</li>
        <li>Can you contrast Deadlock, Starvation, and Livelock across CPU utilization, root causes, and recovery mechanisms?</li>
        <li>Can you list the four methods for handling deadlocks and explain why commercial operating systems utilize the Ostrich Algorithm?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 32: Common Concurrency Problems.
        </li>
        <li>
          <a href="https://dl.acm.org/doi/10.1145/356586.356588">System Deadlocks (E.G. Coffman Jr., M.J. Elphick, and A. Shoshani, ACM Computing Surveys, 1971)</a> - The seminal paper establishing the four conditions for deadlock characterization.
        </li>
        <li>
          <a href="https://www.kernel.org/doc/html/latest/locking/lockdep-design.html">Runtime Locking Correctness Validator (lockdep) - The Linux Kernel Documentation</a> - How the Linux kernel uses graph-based cycle detection at runtime to catch kernel lock deadlocks.
        </li>
      </ul>
    </>
  )
}
