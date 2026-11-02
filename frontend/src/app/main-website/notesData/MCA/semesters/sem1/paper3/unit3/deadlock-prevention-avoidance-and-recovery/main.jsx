import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const preventionTable = {
    caption: 'Deadlock Prevention: Mechanisms and Trade-Offs for Invalidating Coffman Conditions',
    headers: ['Target Coffman Condition', 'Prevention Protocol / Mechanism', 'Architectural Cost and Performance Penalty'],
    rows: [
      [
        'Mutual Exclusion',
        'Make all resources shareable (e.g., read-only files) or virtualize dedicated devices using spooling daemons.',
        'Fundamentally inapplicable to inherently non-shareable resources like mutex locks, database write-locks, and hardware registers.'
      ],
      [
        'Hold and Wait',
        'Protocol 1: Process must request and receive all resources before execution begins. Protocol 2: Process must release all currently held resources before requesting new ones.',
        'Severe resource underutilization (resources held for long periods without being used) and potential starvation of jobs needing multiple popular resources.'
      ],
      [
        'No Preemption',
        'If process P holding resources requests an unavailable resource, all resources currently held by P are preempted and returned to the free pool. P is suspended until all required resources are simultaneously available.',
        'High execution disruption: can only be applied to resources whose state can be easily saved and restored (e.g., CPU registers and memory pages, but not tape drives or printers).'
      ],
      [
        'Circular Wait',
        'Havender Linear Ordering: impose a global 1-to-1 numbering F: R &rarr; N on all resources. Processes must request resources strictly in ascending numerical order.',
        'Restricts application programming flexibility; programmers must structure all code to acquire locks in identical global order, and runtime re-ordering is disallowed.'
      ]
    ]
  }

  const bankersSafetyCode = `// Banker's Algorithm: Safety Algorithm in C-style pseudocode
// Checks whether the current system state vector is safe.

#include <stdbool.h>

#define NUM_PROCESSES 5
#define NUM_RESOURCES 3

bool is_system_safe(int available[NUM_RESOURCES],
                    int max[NUM_PROCESSES][NUM_RESOURCES],
                    int allocation[NUM_PROCESSES][NUM_RESOURCES],
                    int need[NUM_PROCESSES][NUM_RESOURCES],
                    int safe_sequence[NUM_PROCESSES]) {
    // 1. Initialize Work and Finish vectors
    int work[NUM_RESOURCES];
    for (int j = 0; j < NUM_RESOURCES; j++) {
        work[j] = available[j];
    }

    bool finish[NUM_PROCESSES] = {false};
    int count = 0;

    // 2. Search for a process Pi such that finish[i] == false and Need[i] <= Work
    while (count < NUM_PROCESSES) {
        bool found_candidate = false;

        for (int i = 0; i < NUM_PROCESSES; i++) {
            if (!finish[i]) {
                bool can_satisfy = true;
                for (int j = 0; j < NUM_RESOURCES; j++) {
                    if (need[i][j] > work[j]) {
                        can_satisfy = false;
                        break;
                    }
                }

                // 3. If Pi can be satisfied, assume it completes and returns its allocation
                if (can_satisfy) {
                    for (int j = 0; j < NUM_RESOURCES; j++) {
                        work[j] += allocation[i][j];
                    }
                    finish[i] = true;
                    safe_sequence[count++] = i;
                    found_candidate = true;
                }
            }
        }

        // If no candidate process can execute, system is in an unsafe state
        if (!found_candidate) {
            return false;
        }
    }

    return true; // All processes finished; safe sequence exists!
}`

  return (
    <>
      <p>
        While understanding deadlock characterization is critical, real-world operating systems and database engines require concrete algorithmic techniques to prevent, avoid, detect, and recover from deadlocks. For Master of Computer Applications (MCA) students, this chapter details the mathematical mechanics of <strong>Deadlock Prevention</strong>, Edsger Dijkstra&apos;s <strong>Banker&apos;s Algorithm</strong> for deadlock avoidance, Wait-For Graph cycle detection, and victim preemption recovery strategies.
      </p>

      <h2>1. Deadlock Prevention: Eliminating Coffman Conditions</h2>
      <p>
        <strong>Deadlock Prevention</strong> is a set of static design protocols that constrain how resource requests are made, ensuring that at least one of the four Coffman conditions can never physically hold in the system.
      </p>
      <ComparisonTable {...preventionTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Formal Proof: Havender&apos;s Resource Ordering Precludes Circular Wait</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          Let <em>F: R &rarr; N</em> be a one-to-one function mapping each resource type to a unique integer. The rule mandates that process <em>P<sub>i</sub></em> can request resource <em>R<sub>b</sub></em> only if <em>F(R<sub>b</sub>) &gt; F(R<sub>a</sub>)</em>, where <em>R<sub>a</sub></em> is the highest-numbered resource currently held by <em>P<sub>i</sub></em>.
        </p>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2">
          <div className="text-danger dark:text-night-danger font-bold font-sans text-sm">Proof by Contradiction:</div>
          <div>1. Suppose a circular wait chain exists: P0 &rarr; P1 &rarr; P2 &rarr; ... &rarr; Pn &rarr; P0.</div>
          <div>2. Let held(Pi) be the highest resource index held by process Pi.</div>
          <div>3. For Pi to wait for P(i+1), Pi must be requesting a resource held by P(i+1).</div>
          <div>4. Under the ascending order rule, this requires: held(P0) &lt; held(P1) &lt; held(P2) &lt; ... &lt; held(Pn) &lt; held(P0).</div>
          <div>5. By transitivity, this implies: held(P0) &lt; held(P0).</div>
          <div className="font-bold text-brand dark:text-night-brand pt-1">
            6. An integer cannot be strictly less than itself. This is a mathematical contradiction. Hence, circular wait is strictly impossible.
          </div>
        </div>
      </div>

      <h2>2. Deadlock Avoidance: Safe vs Unsafe States</h2>
      <p>
        Instead of imposing restrictive prevention rules that hurt throughput, <strong>Deadlock Avoidance</strong> dynamically inspects every resource request at runtime using <em>a priori</em> knowledge of the maximum resources each process will ever need.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-3 font-sans">State Space Topology: Safe, Unsafe, and Deadlock</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-success dark:text-night-success block mb-2 font-sans text-sm">Safe State</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
              There exists at least one <strong>Safe Sequence</strong> &lang;P<sub>1</sub>, P<sub>2</sub>, ..., P<sub>n</sub>&rang; such that each process can complete execution using available resources plus resources released by completed predecessors.
            </p>
            <div className="font-bold text-success dark:text-night-success">Guarantee: Deadlock is 100% impossible.</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-accent dark:text-night-accent block mb-2 font-sans text-sm">Unsafe State</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
              No safe sequence exists. The operating system cannot guarantee that all processes will finish.
            </p>
            <div className="font-bold text-accent dark:text-night-accent">Warning: An unsafe state is NOT yet a deadlock, but can transition into one.</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-danger dark:text-night-danger block mb-2 font-sans text-sm">Deadlock State</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
              A proper subset of Unsafe States where processes are already blocked in an unresolvable circular dependency.
            </p>
            <div className="font-bold text-danger dark:text-night-danger">Condition: Deadlock &sub; Unsafe State.</div>
          </div>
        </div>
      </div>

      <h2>3. The Banker&apos;s Algorithm for Multi-Instance Systems</h2>
      <p>
        Formulated by Edsger Dijkstra, the <strong>Banker&apos;s Algorithm</strong> is the classic deadlock avoidance algorithm for systems with multiple instances of each resource type. It is named by analogy to a small-town banker who never allocates cash in a way that prevents fulfilling the maximum credit lines of customers.
      </p>

      <h3>Vector and Matrix Data Structures</h3>
      <p>
        For a system with <em>n</em> processes and <em>m</em> resource types:
      </p>
      <ul>
        <li><code>Available[m]:</code> 1D vector. If <code>Available[j] = k</code>, there are <em>k</em> instances of resource type <em>R<sub>j</sub></em> currently available.</li>
        <li><code>Max[n][m]:</code> 2D matrix. If <code>Max[i][j] = k</code>, process <em>P<sub>i</sub></em> may request at most <em>k</em> instances of resource type <em>R<sub>j</sub></em>.</li>
        <li><code>Allocation[n][m]:</code> 2D matrix. If <code>Allocation[i][j] = k</code>, process <em>P<sub>i</sub></em> currently holds <em>k</em> instances of resource type <em>R<sub>j</sub></em>.</li>
        <li>
          <code>Need[n][m]:</code> 2D matrix specifying remaining resource claims:
          <div className="my-2 p-2 rounded bg-soft dark:bg-night-soft border border-line dark:border-night-line font-mono text-center font-bold text-brand dark:text-night-brand text-xs">
            Need[i][j] = Max[i][j] - Allocation[i][j]
          </div>
        </li>
      </ul>

      <p>
        The safety algorithm pseudocode is structured as follows:
      </p>
      <CodeBlock language="c" code={bankersSafetyCode} />

      <h2>4. Complete Worked Examination Problem: Banker&apos;s Algorithm</h2>
      <p>
        Consider a system with <strong>5 processes (P<sub>0</sub>, P<sub>1</sub>, P<sub>2</sub>, P<sub>3</sub>, P<sub>4</sub>)</strong> and <strong>3 resource types (A, B, C)</strong>:
        Total instances: <em>A = 10, B = 5, C = 7</em>.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Step 1: Given State and Need Matrix Calculation</h4>
        
        <div className="overflow-x-auto my-3 text-xs font-mono">
          <table className="w-full text-left border-collapse border border-line dark:border-night-line">
            <thead className="bg-soft dark:bg-night-soft text-ink dark:text-night-ink">
              <tr>
                <th className="p-2 border border-line dark:border-night-line" rowSpan={2}>Process</th>
                <th className="p-2 border border-line dark:border-night-line text-center" colSpan={3}>Allocation</th>
                <th className="p-2 border border-line dark:border-night-line text-center" colSpan={3}>Max</th>
                <th className="p-2 border border-line dark:border-night-line text-center bg-selected/40 dark:bg-night-selected/40" colSpan={3}>Need (Max - Allocation)</th>
              </tr>
              <tr>
                <th className="p-2 border border-line dark:border-night-line">A</th><th className="p-2 border border-line dark:border-night-line">B</th><th className="p-2 border border-line dark:border-night-line">C</th>
                <th className="p-2 border border-line dark:border-night-line">A</th><th className="p-2 border border-line dark:border-night-line">B</th><th className="p-2 border border-line dark:border-night-line">C</th>
                <th className="p-2 border border-line dark:border-night-line bg-selected/40 dark:bg-night-selected/40">A</th><th className="p-2 border border-line dark:border-night-line bg-selected/40 dark:bg-night-selected/40">B</th><th className="p-2 border border-line dark:border-night-line bg-selected/40 dark:bg-night-selected/40">C</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border border-line dark:border-night-line font-bold">P0</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">1</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">7</td><td className="p-2 border border-line dark:border-night-line">5</td><td className="p-2 border border-line dark:border-night-line">3</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">7</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">4</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">3</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line font-bold">P1</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">3</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">1</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">2</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">2</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line font-bold">P2</td><td className="p-2 border border-line dark:border-night-line">3</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">9</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">6</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">0</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">0</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line font-bold">P3</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">1</td><td className="p-2 border border-line dark:border-night-line">1</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">0</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">1</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">1</td></tr>
              <tr><td className="p-2 border border-line dark:border-night-line font-bold">P4</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">0</td><td className="p-2 border border-line dark:border-night-line">2</td><td className="p-2 border border-line dark:border-night-line">4</td><td className="p-2 border border-line dark:border-night-line">3</td><td className="p-2 border border-line dark:border-night-line">3</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">4</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">3</td><td className="p-2 border border-line dark:border-night-line font-bold text-brand dark:text-night-brand bg-selected/30 dark:bg-night-selected/30">1</td></tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono mb-3">
          <div>Total Allocated: &Sigma;Allocation = (0+2+3+2+0, 1+0+0+1+0, 0+0+2+1+2) = (7, 2, 5)</div>
          <div>Available Vector: Available = Total - &Sigma;Allocation = (10-7, 5-2, 7-5) = <strong>(3, 3, 2)</strong></div>
        </div>

        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Step 2: Safety Algorithm Execution Trace</h4>
        <div className="space-y-2 text-xs font-mono text-ink/90 dark:text-night-ink/90">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Iteration 1:</strong> Work = (3, 3, 2). Check P0: Need(7,4,3) &le; Work(3,3,2) [False]. Check P1: Need(1,2,2) &le; Work(3,3,2) [<strong>True</strong>].<br />
            P1 executes &rarr; releases Allocation(2,0,0) &rarr; Work becomes (3+2, 3+0, 2+0) = <strong>(5, 3, 2)</strong>. Finish[1] = true.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Iteration 2:</strong> Work = (5, 3, 2). Check P3: Need(0,1,1) &le; Work(5,3,2) [<strong>True</strong>].<br />
            P3 executes &rarr; releases Allocation(2,1,1) &rarr; Work becomes (5+2, 3+1, 2+1) = <strong>(7, 4, 3)</strong>. Finish[3] = true.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Iteration 3:</strong> Work = (7, 4, 3). Check P4: Need(4,3,1) &le; Work(7,4,3) [<strong>True</strong>].<br />
            P4 executes &rarr; releases Allocation(0,0,2) &rarr; Work becomes (7+0, 4+0, 3+2) = <strong>(7, 4, 5)</strong>. Finish[4] = true.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Iteration 4:</strong> Work = (7, 4, 5). Check P0: Need(7,4,3) &le; Work(7,4,5) [<strong>True</strong>].<br />
            P0 executes &rarr; releases Allocation(0,1,0) &rarr; Work becomes (7+0, 4+1, 5+0) = <strong>(7, 5, 5)</strong>. Finish[0] = true.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Iteration 5:</strong> Work = (7, 5, 5). Check P2: Need(6,0,0) &le; Work(7,5,5) [<strong>True</strong>].<br />
            P2 executes &rarr; releases Allocation(3,0,2) &rarr; Work becomes (7+3, 5+0, 5+2) = <strong>(10, 5, 7)</strong>. Finish[2] = true.
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-selected/50 dark:bg-night-selected/50 border border-brand/30 text-xs font-mono font-semibold text-brand dark:text-night-brand text-center">
          Conclusion: System is in a SAFE STATE with Safe Sequence: &lang;P<sub>1</sub>, P<sub>3</sub>, P<sub>4</sub>, P<sub>0</sub>, P<sub>2</sub>&rang;
        </div>
      </div>

      <h2>5. Deadlock Detection and Recovery</h2>
      <p>
        If a system does not employ prevention or avoidance, deadlocks may occur. The operating system must periodically run a <strong>Deadlock Detection</strong> algorithm and initiate recovery.
      </p>

      <h3>Wait-For Graphs (Single-Instance Resources)</h3>
      <p>
        In systems where all resource types have only a single instance, the Resource-Allocation Graph is reduced to a <strong>Wait-For Graph (WFG)</strong> by collapsing resource nodes:
      </p>
      <ul>
        <li>A directed edge <em>P<sub>i</sub> &rarr; P<sub>j</sub></em> exists if process <em>P<sub>i</sub></em> is waiting for a resource held by process <em>P<sub>j</sub></em>.</li>
        <li>The operating system invokes a cycle-detection algorithm (such as Depth-First Search in <em>O(V<sup>2</sup>)</em>) periodically. <strong>A cycle in the Wait-For Graph confirms that a deadlock exists.</strong></li>
      </ul>

      <h3>Recovery Protocols: Termination vs Preemption</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-xs">
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-brand dark:text-night-brand text-base mb-2 font-sans">Process Termination</h4>
          <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
            <strong>Abort All Deadlocked Processes:</strong> Instantaneous recovery, but discards substantial completed computation.
          </p>
          <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
            <strong>Abort One at a Time:</strong> Terminate one process and re-run detection until the cycle is resolved. Abort victims are chosen based on priority, runtime consumed, and resources held.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-brand dark:text-night-brand text-base mb-2 font-sans">Resource Preemption</h4>
          <div className="space-y-2 text-ink/80 dark:text-night-ink/80 leading-relaxed">
            <div><strong>1. Selecting a Victim:</strong> Preempt from the process with lowest preemption cost.</div>
            <div><strong>2. Rollback:</strong> Roll victim back to a safe checkpoint or restart it completely.</div>
            <div><strong>3. Starvation Prevention:</strong> Ensure victim count is tracked so the same process is not repeatedly targeted.</div>
          </div>
        </div>
      </div>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you explain how Havender&apos;s resource ordering protocol eliminates the Circular Wait condition?</li>
        <li>Can you write the formal contradiction proof for Havender&apos;s ordering in an exam?</li>
        <li>Can you define Safe State and explain why an Unsafe State is not necessarily a deadlocked state?</li>
        <li>Can you state the four data structures of Banker&apos;s Algorithm (<code>Available</code>, <code>Max</code>, <code>Allocation</code>, <code>Need</code>)?</li>
        <li>Can you solve a complete 5-process Banker&apos;s Algorithm numerical question, deduce the Need matrix, and trace the safe sequence?</li>
        <li>Can you construct a Wait-For Graph (WFG) from an RAG and explain how the kernel detects cycles?</li>
        <li>Can you explain the three challenges of resource preemption recovery (victim selection, rollback, and starvation)?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 32: Common Concurrency Problems.
        </li>
        <li>
          <a href="https://www.cs.utexas.edu/users/EWD/ewd01xx/EWD108.PDF">The Mathematics Behind the Banker&apos;s Algorithm (E.W. Dijkstra, 1965)</a> - Original mathematical formulation of safe state sequences and avoidance matrices.
        </li>
        <li>
          <a href="https://dl.acm.org/doi/10.1145/362686.362692">Avoiding Deadlock in Multitasking Systems (J.W. Havender, IBM Systems Journal, 1968)</a> - Foundational paper on global resource hierarchy and linear request order.
        </li>
      </ul>
    </>
  )
}
