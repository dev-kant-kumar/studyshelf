import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const criteriaTable = {
    caption: 'Mandatory Requirements for a Valid Solution to the Critical Section Problem',
    headers: ['Criterion', 'Formal Operating System Requirement', 'Failure Consequence'],
    rows: [
      [
        '1. Mutual Exclusion',
        'If process P is executing in its critical section, no other processes can be executing in their critical sections simultaneously.',
        'Catastrophic shared data corruption, partial writes, double-frees, and non-deterministic system faults.'
      ],
      [
        '2. Progress',
        'If no process is in its critical section and some wish to enter, only processes not in remainder sections can decide who enters next, and this decision cannot be delayed indefinitely.',
        'Deadlock or livelock: CPU cycles wasted while all processes wait indefinitely without any task making forward progress.'
      ],
      [
        '3. Bounded Waiting',
        'A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has requested entry and before that request is granted.',
        'Indefinite starvation: an unfortunate thread is perpetually bypassed and never granted access to the critical resource.'
      ]
    ]
  }

  const raceConditionCode = `// Concrete demonstration of a Race Condition in C.
// Two concurrent POSIX threads execute 1,000,000 increments and decrements
// on an unprotected shared global variable.

#include <stdio.h>
#include <pthread.h>

#define ITERATIONS 1000000

volatile long long shared_counter = 0;

void* increment_worker(void* arg) {
    for (int i = 0; i < ITERATIONS; i++) {
        // Disassembles to 3 CPU instructions:
        // 1. MOV  %rax, shared_counter
        // 2. ADD  %rax, 1
        // 3. MOV  shared_counter, %rax
        shared_counter++;
    }
    return NULL;
}

void* decrement_worker(void* arg) {
    for (int i = 0; i < ITERATIONS; i++) {
        // Disassembles to 3 CPU instructions:
        // 1. MOV  %rbx, shared_counter
        // 2. SUB  %rbx, 1
        // 3. MOV  shared_counter, %rbx
        shared_counter--;
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, increment_worker, NULL);
    pthread_create(&t2, NULL, decrement_worker, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    // Expected mathematical outcome: 0
    // Actual runtime output: arbitrary numbers like -42918, +102384, or -301
    printf("Final Shared Counter Value: %lld (Race Condition Occurred!)\\n", 
           shared_counter);
    return 0;
}`

  const petersonCode = `// Peterson's Algorithm: Software-based solution for two processes (P0 and P1)

#include <stdbool.h>
#include <stdatomic.h>

// Shared control state
bool flag[2] = {false, false}; // flag[i] = true means Pi wants to enter CS
int turn = 0;                  // turn = i means it is Pi's turn to enter

void process_zero(void) {
    while (true) {
        // 1. ENTRY SECTION
        flag[0] = true;        // Express desire to enter
        turn = 1;              // Be polite: offer turn to P1
        
        // Wait while P1 wants to enter AND it is P1's turn
        while (flag[1] && turn == 1) {
            // Busy wait (spin)
        }

        // 2. CRITICAL SECTION
        // Manipulate shared resource exclusively here...

        // 3. EXIT SECTION
        flag[0] = false;       // Announce exit from critical section

        // 4. REMAINDER SECTION
        // Execute independent code not touching shared resource...
    }
}

void process_one(void) {
    while (true) {
        // 1. ENTRY SECTION
        flag[1] = true;        // Express desire to enter
        turn = 0;              // Be polite: offer turn to P0
        
        // Wait while P0 wants to enter AND it is P0's turn
        while (flag[0] && turn == 0) {
            // Busy wait (spin)
        }

        // 2. CRITICAL SECTION
        // Manipulate shared resource exclusively here...

        // 3. EXIT SECTION
        flag[1] = false;       // Announce exit from critical section

        // 4. REMAINDER SECTION
        // Execute independent code not touching shared resource...
    }
}`

  const spinlockAsmCode = `// Hardware Atomic Spinlock implementation using Compare-and-Swap (CAS)

#include <stdbool.h>

typedef struct {
    int lock_status; // 0 = unlocked (available), 1 = locked (in CS)
} spinlock_t;

void spin_lock_init(spinlock_t *lock) {
    lock->lock_status = 0;
}

void spin_lock_acquire(spinlock_t *lock) {
    // Atomic Compare-and-Swap:
    // If lock_status is 0, set it to 1 and return true (loop terminates).
    // If lock_status is already 1, return false and continue spinning.
    while (!__atomic_compare_exchange_n(&lock->lock_status, 
                                        &(int){0}, 
                                        1, 
                                        false, 
                                        __ATOMIC_ACQUIRE, 
                                        __ATOMIC_RELAXED)) {
        // CPU instruction: PAUSE on x86 to optimize pipeline power and memory bus
        #if defined(__x86_64__) || defined(_M_X64)
        __builtin_ia32_pause();
        #endif
    }
}

void spin_lock_release(spinlock_t *lock) {
    // Release lock atomically with Release memory ordering semantics
    __atomic_store_n(&lock->lock_status, 0, __ATOMIC_RELEASE);
}`

  return (
    <>
      <p>
        In concurrent systems where multiple processes or threads share common storage (such as global variables, memory-mapped buffers, or linked list descriptors), uncoordinated simultaneous modifications cause catastrophic corruption. <strong>Process Synchronization</strong> encompasses the algorithmic techniques, operating system abstractions, and hardware primitives designed to coordinate concurrent execution without race conditions.
      </p>

      <h2>1. The Concurrency Problem and Race Conditions</h2>
      <p>
        A <strong>Race Condition</strong> occurs when multiple threads or processes read and write shared data concurrently, and the final state of the data depends on the arbitrary, non-deterministic order in which instruction cycles interleave across CPU cores.
      </p>
      <p>
        The following C program illustrates how a simple variable increment and decrement across two POSIX threads produces completely corrupted results:
      </p>
      <CodeBlock language="c" code={raceConditionCode} />

      <div className="my-6 p-5 rounded-xl border border-danger/30 bg-surface dark:border-night-danger/30 dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-danger dark:text-night-danger mb-2 font-sans">Instruction Interleaving Mechanics: Why counter++ Fails</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          High-level operations like <code>counter++</code> are not atomic at the CPU hardware level. An increment breaks into three discrete assembly instructions:
        </p>
        <div className="overflow-x-auto p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1">
          <div>Step 1: MOV %rax, counter &nbsp;&nbsp;&nbsp;&nbsp;[Load counter (e.g., 5) into Register A]</div>
          <div>Step 2: ADD %rax, 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Increment Register A to 6]</div>
          <div>Step 3: MOV counter, %rax &nbsp;&nbsp;&nbsp;&nbsp;[Store Register A (6) back into memory]</div>
        </div>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mt-3">
          If the operating system timer fires between Step 2 and Step 3, the CPU preempts Thread 1. Thread 2 runs its three decrement steps, setting <code>counter = 4</code>. When Thread 1 resumes, it executes Step 3 and blindly overwrites memory with <code>6</code>. Thread 2 decrement is lost forever.
        </p>
      </div>

      <h2>2. The Critical Section Problem</h2>
      <p>
        A section of code that accesses shared resources (shared variables, files, tables) is called a <strong>Critical Section (CS)</strong>. To prevent race conditions, the code structure of each concurrent process is partitioned into four distinct segments:
      </p>
      <ol>
        <li>
          <strong>Entry Section:</strong> Requests permission to enter the critical section by checking synchronization flags or locks.
        </li>
        <li>
          <strong>Critical Section:</strong> Manipulates shared data exclusively. At most one process may be here at any instant.
        </li>
        <li>
          <strong>Exit Section:</strong> Releases locks, clears readiness flags, and notifies waiting processes.
        </li>
        <li>
          <strong>Remainder Section:</strong> Executes private computations that do not touch shared state.
        </li>
      </ol>

      <h3>The Three Mandatory Criteria</h3>
      <p>
        In academic examinations and system architecture proofs, any valid solution to the critical section problem must rigorously satisfy all three of the following conditions:
      </p>
      <ComparisonTable {...criteriaTable} />

      <h2>3. Software Solutions: Peterson&apos;s Algorithm</h2>
      <p>
        Proposed by Gary Peterson in 1981, <strong>Peterson&apos;s Algorithm</strong> is a classic software-based solution for two concurrent processes, <em>P<sub>0</sub></em> and <em>P<sub>1</sub></em>.
      </p>
      <CodeBlock language="c" code={petersonCode} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Formal Mathematical Proof of Peterson&apos;s Algorithm</h4>
        
        <div className="space-y-4 text-xs text-ink/80 dark:text-night-ink/80">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-brand dark:text-night-brand block mb-1 font-sans text-sm">1. Proof of Mutual Exclusion (By Contradiction)</span>
            Suppose both <em>P<sub>0</sub></em> and <em>P<sub>1</sub></em> enter their critical sections simultaneously.<br />
            For <em>P<sub>0</sub></em> to enter, its while condition must be false: <code>flag[1] == false</code> OR <code>turn == 0</code>.<br />
            For <em>P<sub>1</sub></em> to enter, its while condition must be false: <code>flag[0] == false</code> OR <code>turn == 1</code>.<br />
            Since both processes entered, both set their flags to <code>true</code> (<code>flag[0] = true</code> and <code>flag[1] = true</code>).<br />
            Therefore, we must have <code>turn == 0</code> (for P<sub>0</sub>) AND <code>turn == 1</code> (for P<sub>1</sub>) at the exact same instant.<br />
            Since <code>turn</code> is a single physical memory cell, it can hold either 0 or 1, but never both simultaneously. This is a contradiction. Hence, Mutual Exclusion is guaranteed.
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-brand dark:text-night-brand block mb-1 font-sans text-sm">2. Proof of Progress</span>
            If <em>P<sub>1</sub></em> does not wish to enter its CS, <code>flag[1] == false</code>. When <em>P<sub>0</sub></em> executes its entry section, the condition <code>(flag[1] &amp;&amp; turn == 1)</code> evaluates immediately to <code>false</code>, allowing <em>P<sub>0</sub></em> to enter without delay.<br />
            If both processes attempt to enter simultaneously, both set their flags to <code>true</code>. Whichever assignment to <code>turn</code> happens last will overwrite the earlier one (either <code>turn = 0</code> or <code>turn = 1</code>). The process whose index matches <code>turn</code> proceeds, guaranteeing progress.
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-brand dark:text-night-brand block mb-1 font-sans text-sm">3. Proof of Bounded Waiting</span>
            When <em>P<sub>0</sub></em> exits its CS, it sets <code>flag[0] = false</code>, which frees <em>P<sub>1</sub></em> from its while loop. If <em>P<sub>0</sub></em> immediately wants to re-enter, it must set <code>turn = 1</code> in its entry section, giving priority to <em>P<sub>1</sub></em>. Therefore, <em>P<sub>0</sub></em> cannot enter twice while <em>P<sub>1</sub></em> is waiting, establishing a strict bound of at most 1 entry.
          </div>
        </div>
      </div>

      <Callout type="mistake" title="Why Peterson's Algorithm Fails on Modern Hardware">
        Peterson&apos;s algorithm assumes a <strong>sequentially consistent</strong> memory model where memory reads and writes occur in the exact sequential order specified in source code. Modern out-of-order superscalar processors (x86-64, ARM) and optimizing C compilers aggressively reorder independent instructions and buffer writes in hardware store queues. Without explicit <strong>memory barriers (fences)</strong>, a CPU can reorder the write to <code>turn</code> before the write to <code>flag</code>, causing Peterson&apos;s algorithm to fail and allow concurrent entry.
      </Callout>

      <h2>4. Hardware Synchronization Primitives: Memory Barriers and Atomics</h2>
      <p>
        Because software algorithms fail on modern reordering hardware, operating system kernels rely on dedicated hardware instructions provided by CPU architectures.
      </p>

      <h3>Hardware Atomic Instructions: TestAndSet and CompareAndSwap</h3>
      <p>
        Modern processors implement atomic read-modify-write instructions that execute on the system bus as an indivisible hardware cycle:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-xs">
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-brand dark:text-night-brand mb-2 font-mono text-sm">TestAndSet (TAS)</h4>
          <div className="p-3 rounded-md bg-soft dark:bg-night-soft border border-line dark:border-night-line text-ink/90 dark:text-night-ink/90 font-mono text-xs leading-relaxed mb-2">
            bool TestAndSet(bool *target) &#123;<br />
            &nbsp;&nbsp;bool old_val = *target;<br />
            &nbsp;&nbsp;*target = true;<br />
            &nbsp;&nbsp;return old_val;<br />
            &#125;
          </div>
          <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Atomically reads the memory value, sets it to <code>true</code>, and returns the old value. If the lock was free (<code>false</code>), it returns <code>false</code> and locks it. If already locked (<code>true</code>), it returns <code>true</code> and keeps it locked.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <h4 className="font-bold text-brand dark:text-night-brand mb-2 font-mono text-sm">CompareAndSwap (CAS)</h4>
          <div className="p-3 rounded-md bg-soft dark:bg-night-soft border border-line dark:border-night-line text-ink/90 dark:text-night-ink/90 font-mono text-xs leading-relaxed mb-2">
            int CAS(int *val, int expected, int new_val) &#123;<br />
            &nbsp;&nbsp;int old_val = *val;<br />
            &nbsp;&nbsp;if (*val == expected) *val = new_val;<br />
            &nbsp;&nbsp;return old_val;<br />
            &#125;
          </div>
          <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed">
            Atomically compares the contents of memory with an expected value; only if they match does it update memory to the new value. CAS is the foundational primitive for lock-free concurrent data structures.
          </p>
        </div>
      </div>

      <h2>5. Spinlocks: Implementation and Architectural Trade-Offs</h2>
      <p>
        A <strong>Spinlock</strong> is a mutual exclusion lock where a thread waiting to acquire the lock loops continuously (&quot;spins&quot;) in a CPU polling loop checking the lock status.
      </p>
      <CodeBlock language="c" code={spinlockAsmCode} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">When to Use Spinlocks vs Blocking Mutexes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-success dark:text-night-success font-bold block mb-1 font-sans text-sm">Spinlocks are Ideal When:</span>
            <div className="space-y-1 text-ink/80 dark:text-night-ink/80">
              <div>&bull; Critical sections are extremely short (&lt; context switch duration).</div>
              <div>&bull; Multicore SMP systems where the lock holder is running on another physical core.</div>
              <div>&bull; Operating system interrupt handlers, where sleeping or context switching is strictly prohibited.</div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-danger dark:text-night-danger font-bold block mb-1 font-sans text-sm">Spinlocks are Hazardous When:</span>
            <div className="space-y-1 text-ink/80 dark:text-night-ink/80">
              <div>&bull; Single-core systems: the spinning thread starves the lock holder from acquiring CPU time to release the lock.</div>
              <div>&bull; Long-running critical sections (e.g., disk I/O): spinning burns 100% CPU cycles uselessly.</div>
              <div>&bull; High lock contention: causes cache coherence storm across the CPU interconnect bus.</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you define a race condition and trace assembly interleaving during concurrent variable modification?</li>
        <li>Can you name and define the four sections of a concurrent process (Entry, Critical, Exit, Remainder)?</li>
        <li>Can you state the three mandatory criteria for the Critical Section Problem (Mutual Exclusion, Progress, Bounded Waiting)?</li>
        <li>Can you write Peterson&apos;s algorithm in C and provide the proof by contradiction for Mutual Exclusion?</li>
        <li>Do you know why Peterson&apos;s algorithm breaks on modern multicore CPUs without memory barriers?</li>
        <li>Can you explain the semantics of atomic instructions <code>TestAndSet</code> and <code>CompareAndSwap</code>?</li>
        <li>Can you explain the trade-offs of spinlocks compared to blocking sleep locks?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 28: Locks, and Chapter 29: Lock-based Concurrent Data Structures.
        </li>
        <li>
          <a href="https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html">Intel 64 Architecture Memory Ordering Whitepaper</a> - Official hardware specification for memory fences, store buffers, and atomic lock prefixes.
        </li>
        <li>
          <a href="https://gcc.gnu.org/onlinedocs/gcc/_005f_005fatomic-Builtins.html">GCC Built-in Functions for Memory Model and Atomics</a> - Compiler reference for CAS, TAS, and memory barrier semantics.
        </li>
      </ul>
    </>
  )
}
