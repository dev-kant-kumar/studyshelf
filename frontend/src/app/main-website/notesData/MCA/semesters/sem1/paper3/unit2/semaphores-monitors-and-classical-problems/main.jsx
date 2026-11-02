import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const semaphoreTypesTable = {
    caption: 'Counting Semaphores vs Binary Semaphores (Mutexes)',
    headers: ['Property', 'Binary Semaphore (Mutex)', 'Counting Semaphore'],
    rows: [
      [
        'Value Range',
        'Strictly 0 and 1.',
        'Unrestricted non-negative integer domain (0 to N).'
      ],
      [
        'Initialization Value',
        'Typically initialized to 1.',
        'Initialized to N, representing the total available identical resource units.'
      ],
      [
        'Primary Use Case',
        'Mutual exclusion around a single critical section or shared critical data structure.',
        'Resource counting and rate-limiting (e.g., printer queues, buffer slots, connection pools).'
      ],
      [
        'Ownership Semantics',
        'Often implies ownership: the thread that locks the mutex should be the one to unlock it.',
        'No concept of ownership: one thread can signal() to awaken another thread executing wait().'
      ]
    ]
  }

  const producerConsumerCode = `// Bounded-Buffer (Producer-Consumer) Problem Solution using Semaphores

#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

#define BUFFER_SIZE 5

int buffer[BUFFER_SIZE];
int in = 0;   // Index where producer writes next item
int out = 0;  // Index where consumer reads next item

// Synchronization Semaphores
sem_t mutex;  // Controls mutual exclusion into the critical section (init: 1)
sem_t empty;  // Counts available empty slots in buffer (init: BUFFER_SIZE)
sem_t full;   // Counts filled slots ready for consumption (init: 0)

void* producer(void* arg) {
    int item = 1;
    while (1) {
        // Produce next data item...
        
        sem_wait(&empty); // Decrement empty slots; blocks if buffer is full (empty == 0)
        sem_wait(&mutex); // Lock critical section

        // --- CRITICAL SECTION: Insert item into circular buffer ---
        buffer[in] = item;
        printf("[Producer] Inserted item %d at slot %d\\n", item, in);
        in = (in + 1) % BUFFER_SIZE;
        item++;

        sem_post(&mutex); // Unlock critical section
        sem_post(&full);  // Increment filled count; awakens blocked consumers
    }
    return NULL;
}

void* consumer(void* arg) {
    while (1) {
        sem_wait(&full);  // Decrement filled slots; blocks if buffer is empty (full == 0)
        sem_wait(&mutex); // Lock critical section

        // --- CRITICAL SECTION: Remove item from circular buffer ---
        int item = buffer[out];
        printf("[Consumer] Consumed item %d from slot %d\\n", item, out);
        out = (out + 1) % BUFFER_SIZE;

        sem_post(&mutex); // Unlock critical section
        sem_post(&empty); // Increment empty count; awakens blocked producers

        // Process consumed item...
    }
    return NULL;
}`

  const readersWritersCode = `// First Readers-Writers Problem (Reader Preference) Solution

#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t rw_mutex; // Mutual exclusion for writers; blocks readers when writer is active (init: 1)
sem_t mutex;    // Protects read_count variable (init: 1)
int read_count = 0; // Number of processes currently reading

void* writer(void* arg) {
    while (1) {
        sem_wait(&rw_mutex); // Request exclusive write access

        // --- WRITING CRITICAL SECTION ---
        // Exclusively modify database / shared file...

        sem_post(&rw_mutex); // Release exclusive write access
    }
    return NULL;
}

void* reader(void* arg) {
    while (1) {
        sem_wait(&mutex); // Protect read_count update
        read_count++;
        if (read_count == 1) {
            // First reader locks out all writers
            sem_wait(&rw_mutex);
        }
        sem_post(&mutex);

        // --- READING CRITICAL SECTION ---
        // Concurrently read database / shared file...

        sem_wait(&mutex); // Protect read_count decrement
        read_count--;
        if (read_count == 0) {
            // Last reader vacates and unlocks access for writers
            sem_post(&rw_mutex);
        }
        sem_post(&mutex);
    }
    return NULL;
}`

  const diningPhilosophersCode = `// Dining Philosophers Problem: Deadlock-Free Asymmetric Solution

#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define N 5 // 5 Philosophers and 5 Chopsticks

sem_t chopsticks[N];

void* philosopher(void* num) {
    int i = *(int*)num;

    while (1) {
        // Philosopher is thinking...
        usleep(1000);

        // Deadlock-free asymmetric pick-up rule:
        // Even philosophers pick Right chopstick first, then Left.
        // Odd philosophers pick Left chopstick first, then Right.
        if (i % 2 == 0) {
            sem_wait(&chopsticks[(i + 1) % N]); // Pick up Right
            sem_wait(&chopsticks[i]);           // Pick up Left
        } else {
            sem_wait(&chopsticks[i]);           // Pick up Left
            sem_wait(&chopsticks[(i + 1) % N]); // Pick up Right
        }

        // --- CRITICAL SECTION: EATING ---
        printf("Philosopher %d is eating...\\n", i);
        usleep(1000);

        // Put down chopsticks in reverse order
        sem_post(&chopsticks[i]);
        sem_post(&chopsticks[(i + 1) % N]);
    }
    return NULL;
}`

  return (
    <>
      <p>
        While low-level hardware atomic instructions (like <code>TestAndSet</code> and <code>CompareAndSwap</code>) solve the Critical Section Problem, their reliance on continuous spin loops burns valuable CPU cycles. In 1965, Edsger Dijkstra introduced the <strong>Semaphore</strong>, providing the operating system with a high-level, blocking synchronization primitive that suspends waiting processes until signaled.
      </p>

      <h2>1. The Semaphore Concept and Atomic Primitives</h2>
      <p>
        A <strong>Semaphore</strong> <em>S</em> is an integer variable that, apart from initialization, is accessed exclusively through two standard, indivisible atomic operations: <code>wait()</code> and <code>signal()</code> (historically termed <em>P</em> for <em>proberen</em>, &quot;to test&quot;, and <em>V</em> for <em>verhogen</em>, &quot;to increment&quot;).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-xs font-mono">
        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <span className="text-brand dark:text-night-brand font-bold block mb-2 font-sans text-sm">wait(S) / P(S) Primitive</span>
          <div className="p-3 rounded-md bg-soft dark:bg-night-soft border border-line dark:border-night-line text-ink/90 dark:text-night-ink/90">
            wait(S) &#123;<br />
            &nbsp;&nbsp;while (S &le; 0) &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;// Do nothing (spin) or block<br />
            &nbsp;&nbsp;&#125;<br />
            &nbsp;&nbsp;S--;<br />
            &#125;
          </div>
          <p className="text-ink/80 dark:text-night-ink/80 font-sans text-xs mt-2 leading-relaxed">
            Atomically decrements <em>S</em>. If <em>S</em> is non-positive, the calling process blocks until another process increments it.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
          <span className="text-success dark:text-night-success font-bold block mb-2 font-sans text-sm">signal(S) / V(S) Primitive</span>
          <div className="p-3 rounded-md bg-soft dark:bg-night-soft border border-line dark:border-night-line text-ink/90 dark:text-night-ink/90">
            signal(S) &#123;<br />
            &nbsp;&nbsp;S++;<br />
            &#125;
          </div>
          <p className="text-ink/80 dark:text-night-ink/80 font-sans text-xs mt-2 leading-relaxed">
            Atomically increments <em>S</em>. If any processes are blocked waiting on <em>S</em>, one of them is awakened and made runnable.
          </p>
        </div>
      </div>

      <ComparisonTable {...semaphoreTypesTable} />

      <h2>2. Blocking (Sleep-Wait) Semaphores</h2>
      <p>
        To avoid CPU-wasting busy loops, operating systems implement semaphores using <strong>blocking wait queues</strong>. When a process invokes <code>wait()</code> and the semaphore is unavailable, the kernel suspends the calling process, places its PCB on the semaphore wait queue, and switches the CPU to another runnable task.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-mono">Kernel Implementation: struct semaphore</h4>
        <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line font-mono text-xs text-ink/90 dark:text-night-ink/90 mb-3 leading-relaxed">
          typedef struct &#123;<br />
          &nbsp;&nbsp;int value;<br />
          &nbsp;&nbsp;struct list_head wait_list; // FIFO queue of blocked process PCBs<br />
          &#125; semaphore_t;<br /><br />
          void wait(semaphore_t *S) &#123;<br />
          &nbsp;&nbsp;S-&gt;value--;<br />
          &nbsp;&nbsp;if (S-&gt;value &lt; 0) &#123;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// Add current PCB to S-&gt;wait_list and invoke kernel sleep()<br />
          &nbsp;&nbsp;&nbsp;&nbsp;sleep();<br />
          &nbsp;&nbsp;&#125;<br />
          &#125;<br /><br />
          void signal(semaphore_t *S) &#123;<br />
          &nbsp;&nbsp;S-&gt;value++;<br />
          &nbsp;&nbsp;if (S-&gt;value &le; 0) &#123;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// Remove process PCB from S-&gt;wait_list and invoke kernel wakeup()<br />
          &nbsp;&nbsp;&nbsp;&nbsp;wakeup();<br />
          &nbsp;&nbsp;&#125;<br />
          &#125;
        </div>
        <div className="p-3 rounded-lg bg-selected/50 dark:bg-night-selected/50 border border-brand/30 text-xs text-ink dark:text-night-ink font-sans leading-relaxed">
          <strong className="text-brand dark:text-night-brand font-semibold">Key Mathematical Insight for Exams:</strong> Because <code>S-&gt;value</code> is decremented before the negative check, if <code>S-&gt;value &lt; 0</code>, the absolute value <strong>|S-&gt;value|</strong> represents the <em>exact number of processes currently suspended</em> in <code>S-&gt;wait_list</code>!
        </div>
      </div>

      <h2>3. Monitors and Condition Variables</h2>
      <p>
        While semaphores are powerful, they are error-prone: a single programmer error (such as omitting a <code>signal()</code>, accidental double-calling of <code>wait()</code>, or swapping the order of calls) produces catastrophic system-wide deadlocks.
      </p>
      <p>
        To eliminate programmer errors, C.A.R. Hoare and Per Brinch Hansen invented the <strong>Monitor</strong>: a high-level language construct that encapsulates shared data variables, private initialization code, and public procedures. The compiler guarantees that <strong>only one thread can be actively executing inside the monitor at any given time</strong>.
      </p>

      <h3>Condition Variables and Signalling Semantics</h3>
      <p>
        To allow threads to wait inside a monitor without holding the lock forever, monitors provide <strong>Condition Variables</strong> (e.g., <code>condition x;</code>) with two operations:
      </p>
      <ul>
        <li>
          <code>x.wait():</code> The calling thread releases the monitor lock and suspends on condition variable <em>x</em>.
        </li>
        <li>
          <code>x.signal():</code> Awakens exactly one thread waiting on <em>x</em>. If no thread is waiting, the signal has no effect (unlike a semaphore, condition variables have no memory).
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink text-xs">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Hoare vs Mesa Monitor Semantics: Why Java &amp; POSIX Use While Loops</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-accent dark:text-night-accent font-bold block mb-1 font-sans text-sm">Hoare Semantics (Signal-and-Wait):</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
              When thread P signals condition <em>x</em>, control transfers immediately to waiting thread Q. Thread P is suspended. Because Q runs instantaneously, the condition that triggered the signal is guaranteed to be true:
            </p>
            <div className="font-mono text-xs p-2 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line text-ink dark:text-night-ink">
              if (!resource_available)<br />
              &nbsp;&nbsp;condition.wait();
            </div>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="text-brand dark:text-night-brand font-bold block mb-1 font-sans text-sm">Mesa Semantics (Signal-and-Continue - Java/POSIX):</span>
            <p className="text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
              When thread P signals condition <em>x</em>, thread P continues running inside the monitor. Thread Q is merely marked runnable. By the time Q acquires the monitor, another thread might have slipped in and consumed the resource. Hence, Q must re-evaluate the condition in a loop:
            </p>
            <div className="font-mono text-xs p-2 rounded bg-surface dark:bg-night-surface border border-line dark:border-night-line text-ink dark:text-night-ink">
              while (!resource_available)<br />
              &nbsp;&nbsp;condition.wait();
            </div>
          </div>
        </div>
      </div>

      <h2>4. Classical Synchronization Problem 1: Bounded-Buffer (Producer-Consumer)</h2>
      <p>
        A pool of <em>N</em> buffer slots is shared between two classes of processes: <strong>Producers</strong> that generate data items and place them into the buffer, and <strong>Consumers</strong> that take items from the buffer.
      </p>
      <p>
        The system uses three semaphores:
      </p>
      <ul>
        <li><code>mutex</code> (initialized to 1): Enforces mutual exclusion when writing to or reading from the buffer.</li>
        <li><code>empty</code> (initialized to <em>N</em>): Counts available vacant slots.</li>
        <li><code>full</code> (initialized to 0): Counts filled slots containing unread items.</li>
      </ul>
      <CodeBlock language="c" code={producerConsumerCode} />

      <Callout type="mistake" title="Examination Trap: Deadlock by Inverted Semaphore Order">
        Notice the exact order of calls in the producer: <code>sem_wait(&amp;empty)</code> followed by <code>sem_wait(&amp;mutex)</code>.<br /><br />
        If a student reverses this order to <code>sem_wait(&amp;mutex)</code> followed by <code>sem_wait(&amp;empty)</code>, the program will inevitably <strong>deadlock</strong>! If the buffer is completely full (<code>empty == 0</code>), the producer acquires the <code>mutex</code>, and then blocks on <code>empty</code> while still holding the mutex. When the consumer runs to drain an item, it immediately blocks on <code>sem_wait(&amp;mutex)</code>. Both processes remain permanently frozen.
      </Callout>

      <h2>5. Classical Synchronization Problem 2: Readers-Writers</h2>
      <p>
        A database or file is shared among multiple concurrent processes. Multiple <strong>Readers</strong> can read concurrently without conflict, but a <strong>Writer</strong> must have exclusive access to prevent data inconsistency.
      </p>
      <p>
        In the <strong>First Readers-Writers Problem (Reader Preference)</strong>, no reader is kept waiting unless a writer has already obtained permission to write:
      </p>
      <CodeBlock language="c" code={readersWritersCode} />
      <p className="text-xs text-subtle dark:text-night-subtle italic">
        Note on Writer Starvation: In the Reader Preference solution, if new readers arrive continuously before old readers finish, <code>read_count</code> never drops to 0. Consequently, waiting writers suffer from indefinite starvation. The <strong>Second Readers-Writers Problem (Writer Preference)</strong> remedies this by forcing subsequent readers to wait once a writer requests access.
      </p>

      <h2>6. Classical Synchronization Problem 3: Dining Philosophers</h2>
      <p>
        Five philosophers sit around a circular table with five bowls of rice and five single chopsticks placed between adjacent philosophers. A philosopher alternates between <strong>thinking</strong> and <strong>eating</strong>. To eat, a philosopher must acquire both their left and right chopsticks.
      </p>

      <div className="my-6 p-5 rounded-xl border border-danger/30 bg-surface dark:border-night-danger/30 dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-danger dark:text-night-danger mb-2 font-sans">The Naive Solution and Circular Wait Deadlock</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          If each chopstick is represented as a semaphore initialized to 1, and each philosopher attempts to pick up their left chopstick followed by their right chopstick:
        </p>
        <div className="p-3 rounded-md bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90">
          sem_wait(&amp;chopsticks[i]); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Pick up Left<br />
          sem_wait(&amp;chopsticks[(i + 1) % 5]); // Pick up Right
        </div>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mt-3">
          If all 5 philosophers become hungry simultaneously and pick up their left chopsticks at the exact same instant, every chopstick drops to 0. When each philosopher attempts to pick up their right chopstick, all five block indefinitely. A circular dependency chain is formed: Philosopher 0 waits for Chopstick 1 (held by Phil 1), Phil 1 waits for Chopstick 2 (held by Phil 2), ..., and Phil 4 waits for Chopstick 0 (held by Phil 0). The system is completely deadlocked.
        </p>
      </div>

      <h3>Deadlock-Free Solutions for Examinations</h3>
      <p>
        To eliminate the deadlock, we must break at least one of Coffman&apos;s four deadlock conditions:
      </p>
      <ol>
        <li>
          <strong>Asymmetric Solution (Odd-Even Pick-up):</strong> Even-numbered philosophers pick up their right chopstick first and then left, while odd-numbered philosophers pick up left first and then right. This breaks the circular wait condition.
        </li>
        <li>
          <strong>Capacity Limitation:</strong> Allow at most 4 philosophers to sit at the table simultaneously. By the Pigeonhole Principle, at least one philosopher will always be guaranteed both chopsticks, eat, and release them.
        </li>
        <li>
          <strong>State Testing with Monitors:</strong> A philosopher picks up chopsticks only if both neighboring philosophers are not currently eating (<code>state[LEFT] != EATING &amp;&amp; state[RIGHT] != EATING</code>).
        </li>
      </ol>
      <CodeBlock language="c" code={diningPhilosophersCode} />

      <h2>Review checklist</h2>
      <ul>
        <li>Can you state Dijkstra&apos;s definitions of atomic <code>wait()</code> and <code>signal()</code> operations?</li>
        <li>Can you contrast counting semaphores with binary semaphores (mutexes)?</li>
        <li>Can you explain why the absolute value of a negative blocking semaphore indicates the exact number of sleeping processes?</li>
        <li>Can you explain why reversing <code>wait(empty)</code> and <code>wait(mutex)</code> in Producer-Consumer produces an unrecoverable deadlock?</li>
        <li>Do you understand why Mesa monitor semantics requires <code>while (!condition) wait()</code> instead of an <code>if</code> check?</li>
        <li>Can you trace the circular wait condition in the naive Dining Philosophers problem and write the code for the asymmetric solution?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 30: Condition Variables, and Chapter 31: Semaphores.
        </li>
        <li>
          <a href="https://www.cs.utexas.edu/users/EWD/ewd01xx/EWD123.PDF">Cooperating Sequential Processes (E.W. Dijkstra, 1965)</a> - Original foundational paper introducing semaphores, P/V primitives, and the Critical Section Problem.
        </li>
        <li>
          <a href="https://man7.org/linux/man-pages/man3/sem_init.3.html">Linux Programmer&apos;s Manual: sem_init(3)</a> - POSIX unnamed semaphore initialization, wait, post, and destroy functions.
        </li>
      </ul>
    </>
  )
}
