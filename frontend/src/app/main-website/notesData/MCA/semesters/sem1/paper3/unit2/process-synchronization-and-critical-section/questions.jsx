const questions = [
  {
    id: 'race-condition-definition',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define a Race Condition and demonstrate how concurrent execution causes shared memory corruption.',
    answer: [
      'A Race Condition is an undesirable situation that occurs when two or more concurrent processes or threads access and manipulate shared data simultaneously, and the final outcome of the execution depends entirely on the non-deterministic order in which instructions are interleaved by the CPU scheduler.',
      'For example, consider a shared integer variable counter = 5. Process A executes counter++ while Process B executes counter--. At the machine level, counter++ decomposes into three CPU instructions: (1) MOV register1, counter, (2) ADD register1, 1, and (3) MOV counter, register1. Similarly, counter-- decomposes into (1) MOV register2, counter, (2) SUB register2, 1, and (3) MOV counter, register2.',
      'If the scheduler interrupts Process A after step 2 (where register1 = 6) and executes Process B completely (setting counter = 4), and then resumes Process A to complete step 3, Process A writes 6 into counter, completely overwriting and discarding Process B decrement. The final value becomes 6 instead of the correct 5.'
    ]
  },
  {
    id: 'critical-section-three-requirements',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'State the three mandatory criteria that any valid solution to the Critical Section Problem must satisfy.',
    answer: [
      'Any valid algorithm resolving the Critical Section Problem must satisfy three strict requirements:',
      '1. Mutual Exclusion: If a process is executing in its critical section, no other processes can be executing in their respective critical sections at that same time.',
      '2. Progress: If no process is executing in its critical section and some processes wish to enter, only those processes that are not executing in their remainder sections can participate in the decision of which process will enter next, and this selection cannot be postponed indefinitely.',
      '3. Bounded Waiting: There must exist a bound or limit on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted, thereby preventing starvation.'
    ]
  },
  {
    id: 'petersons-algorithm-correctness',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain Peterson\'s Algorithm for two processes and prove how it guarantees Mutual Exclusion.',
    answer: [
      'Peterson\'s Algorithm is a classic software-based synchronization solution for two processes (P0 and P1). It shares two variables: boolean flag[2] (where flag[i] = true indicates that process Pi is ready to enter the critical section) and integer turn (indicates whose turn it is to enter).',
      'Process Pi sets flag[i] = true, sets turn = j (yielding priority politely to the other process), and then loops while (flag[j] && turn == j). When Pj finishes or is not ready, Pi enters the critical section. Upon exit, Pi sets flag[i] = false.',
      'Proof of Mutual Exclusion: For both P0 and P1 to enter the critical section simultaneously, both flag[0] and flag[1] must be true, and both while conditions must evaluate to false simultaneously. This requires (turn == 1) to be false (so turn == 0) and (turn == 0) to be false (so turn == 1) at the exact same instant. Since turn is a single shared integer memory location, it can only hold either 0 or 1, never both. Therefore, mutual exclusion is preserved.'
    ]
  },
  {
    id: 'petersons-modern-hardware-failure',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'Why does Peterson\'s Algorithm fail on modern computer architectures without memory barriers?',
    answer: [
      'Peterson\'s algorithm assumes sequential consistency: instructions execute and memory writes become visible to all processors in the exact sequential order specified by the program code.',
      'Modern superscalar processors (such as x86-64 and ARM) and optimizing compilers perform out-of-order execution, speculative execution, and store buffering to maximize throughput. A processor can reorder the store to flag[i] and the store to turn, or reorder the reads in the while loop.',
      'If the write to turn becomes visible before the write to flag[i], or if local store buffers delay the visibility of flag[i] to the other core, both processes can observe flag[j] as false simultaneously, allowing both to enter their critical sections concurrently. To work on modern hardware, Peterson\'s algorithm requires explicit memory barriers (fences).'
    ]
  },
  {
    id: 'test-and-set-vs-compare-and-swap',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain the hardware atomic instructions TestAndSet and CompareAndSwap, and demonstrate how they implement spinlocks.',
    answer: [
      'TestAndSet (TAS) is an atomic hardware instruction that reads the current value of a boolean memory location, sets the memory location to true, and returns the original value, executed as an indivisible hardware bus cycle.',
      'CompareAndSwap (CAS) is an atomic instruction that takes three parameters: a memory address, an expected value, and a new value. If the memory location holds the expected value, CAS updates it to the new value; otherwise, it leaves the memory unmodified. In both cases, it returns the original value.',
      'A spinlock using TAS initializes boolean lock = false. A thread acquires the lock by looping while (TestAndSet(&lock) == true). The first thread reads false, atomically sets lock = true, exits the loop, and enters the critical section. Subsequent threads read true, remaining trapped in the busy-waiting while loop until the holder exits and executes lock = false.'
    ]
  }
]

export default questions
