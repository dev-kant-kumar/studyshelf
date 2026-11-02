const questions = [
  {
    id: 'semaphore-primitives-p-and-v',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define a Semaphore and write the atomic pseudocode definitions of wait() and signal().',
    answer: [
      'Introduced by Edsger Dijkstra in 1965, a Semaphore is a protected synchronization variable (an integer) that, apart from initialization, is accessed strictly through two standard, indivisible atomic operations: wait() (originally named P for proberen, "to test") and signal() (originally named V for verhogen, "to increment").',
      'Atomic definition of wait(S): while (S <= 0) { /* busy wait or sleep */ } S--;',
      'Atomic definition of signal(S): S++;',
      'In modern operating systems, wait() decrements the semaphore value; if the value is negative or zero, the calling process is placed on a wait queue and suspended. signal() increments the value; if there are waiting processes, one is unblocked and moved to the ready queue.'
    ]
  },
  {
    id: 'counting-vs-binary-semaphores',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Distinguish between a Counting Semaphore and a Binary Semaphore with practical use cases.',
    answer: [
      'A Binary Semaphore takes only values 0 and 1. It is initialized to 1 and used to enforce strict mutual exclusion (mutex) around a single critical section shared among any number of processes.',
      'A Counting Semaphore can span an unrestricted integer domain across zero and positive integers. It is initialized to an integer N representing the finite number of identical resource units available in the system (e.g., a printer pool with 4 printers, or a network connection pool of 20 sockets).',
      'Each process requiring a resource executes wait(), decrementing the count. When the count drops to 0, all resources are exhausted and subsequent processes block. When a process finishes with a resource, it executes signal(), incrementing the count and awakening a blocked requester.'
    ]
  },
  {
    id: 'blocking-semaphore-negative-values',
    level: 'hard',
    tags: ['Interview practice', 'Exam practice'],
    question: 'How is a blocking (sleep-wait) semaphore implemented, and why does a negative semaphore value represent the number of waiting processes?',
    answer: [
      'To prevent busy waiting from wasting CPU cycles, a blocking semaphore is represented as a structure containing an integer value and a FIFO queue of process control block (PCB) pointers: struct semaphore { int value; struct list_head wait_list; }.',
      'When wait(S) is called, S->value is decremented first: S->value--;. If S->value < 0, the calling process invokes the kernel sleep() primitive, suspending itself and placing its PCB onto S->wait_list.',
      'Because the value is decremented before testing, if S->value is negative, its absolute magnitude |S->value| equals the exact count of processes currently blocked and waiting on the wait_list. For example, if value = -3, exactly three processes are currently suspended waiting for a signal().'
    ]
  },
  {
    id: 'producer-consumer-deadlock-reversal',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'In the Producer-Consumer problem with semaphores, why does reversing wait(empty) and wait(mutex) cause a deadlock?',
    answer: [
      'In the standard Bounded-Buffer solution, the producer executes wait(empty) followed by wait(mutex). empty tracks available slots, and mutex protects the buffer array.',
      'If the order is reversed to wait(mutex) followed by wait(empty): suppose the buffer becomes completely full (empty = 0). The producer runs, successfully acquires the mutex (mutex becomes 0), and then calls wait(empty). Because empty is 0, the producer blocks on the empty semaphore while still holding the mutex lock!',
      'When the consumer attempts to run to consume an item and free up a buffer slot, it immediately executes wait(mutex). Because the sleeping producer holds the mutex, the consumer blocks waiting for the mutex. The producer is waiting for the consumer to signal empty, but the consumer cannot run because the producer holds mutex. Both processes are permanently blocked in a deadlock.'
    ]
  },
  {
    id: 'hoare-vs-mesa-monitor-semantics',
    level: 'hard',
    tags: ['Interview practice', 'Concept check'],
    question: 'Contrast Hoare (Signal-and-Wait) and Mesa (Signal-and-Continue) monitor semantics. Why does Mesa require while (!condition) wait()?',
    answer: [
      'In a Monitor, when process P executes x.signal() on a condition variable x, awakening process Q that was waiting on x:',
      'Under Hoare semantics (Signal-and-Wait), execution control immediately transfers to Q. P is suspended until Q vacates or blocks inside the monitor. Because Q runs immediately, the condition that triggered the signal is guaranteed to be true, allowing Q to use an if (!condition) wait() statement.',
      'Under Mesa semantics (Signal-and-Continue, used by Java, POSIX pthreads, and C#), P continues executing inside the monitor. Q is simply moved to the monitor ready queue. By the time Q eventually re-acquires the monitor lock, another thread may have entered the monitor and modified the shared condition. Therefore, Q cannot assume the condition is still valid and must re-evaluate the condition inside a while loop: while (!condition) wait().'
    ]
  },
  {
    id: 'dining-philosophers-deadlock-free-solutions',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Explain why the naive solution to the Dining Philosophers Problem deadlocks, and provide two distinct deadlock-free solutions.',
    answer: [
      'The naive solution assigns 5 chopsticks as semaphores. Each philosopher executes wait(chopstick[i]) for the left chopstick, followed by wait(chopstick[(i+1)%5]) for the right chopstick. If all 5 philosophers become hungry simultaneously and pick up their left chopsticks at the exact same instant, every chopstick semaphore drops to 0. When they attempt to pick up their right chopsticks, all 5 block indefinitely, producing a circular wait deadlock.',
      'Solution 1 (Asymmetric Pick-Up / Odd-Even): Even-numbered philosophers pick up their right chopstick first and then their left; odd-numbered philosophers pick up their left chopstick first and then their right. This breaks the circular wait condition.',
      'Solution 2 (Capacity Bound): Allow at most 4 philosophers to sit simultaneously at the table with 5 chopsticks. By Pigeonhole Principle, at least one philosopher is guaranteed to obtain both chopsticks, eat, and release them, preventing deadlock.'
    ]
  }
]

export default questions
