const questions = [
  {
    id: 'preemptive-vs-nonpreemptive',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Differentiate between preemptive and non-preemptive CPU scheduling, identifying the four scheduling decision circumstances.',
    answer: [
      'In non-preemptive (cooperative) scheduling, once a process is allocated the CPU, it holds the processor until it voluntarily releases it, either by terminating or by transitioning to a waiting state (e.g., issuing an I/O request).',
      'In preemptive scheduling, the operating system can forcibly interrupt and suspend a running process to allocate the CPU to another ready task, triggered by hardware timer interrupts or the arrival of higher-priority processes.',
      'CPU scheduling decisions occur under four specific operating circumstances: (1) When a process switches from Running to Waiting (e.g., I/O request) [Non-preemptive], (2) When a process switches from Running to Ready (e.g., timer interrupt or quantum expiration) [Preemptive], (3) When a process switches from Waiting to Ready (e.g., I/O completion) [Preemptive], and (4) When a process terminates [Non-preemptive].'
    ]
  },
  {
    id: 'scheduling-criteria-formulas',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Define the standard CPU scheduling criteria and provide the mathematical formulas for Turnaround Time and Waiting Time.',
    answer: [
      'The standard CPU scheduling criteria used to evaluate algorithm efficiency include:',
      '1. CPU Utilization: The percentage of time the processor is actively executing user or kernel instructions (aiming for 40% to 90%).',
      '2. Throughput: The number of completed processes per unit of time.',
      '3. Turnaround Time: The total elapsed time from the instant a process is submitted until it completely finishes execution. Formula: Turnaround Time = Completion Time - Arrival Time.',
      '4. Waiting Time: The total cumulative time a process spends waiting in the ready queue before and between execution bursts. Formula: Waiting Time = Turnaround Time - Total CPU Burst Time.',
      '5. Response Time: The elapsed time from process submission to the first moment it produces an output or is initially dispatched onto the CPU.'
    ]
  },
  {
    id: 'convoy-effect-fcfs',
    level: 'medium',
    tags: ['Concept check', 'Interview practice'],
    question: 'What is the Convoy Effect in First-Come, First-Served (FCFS) scheduling, and how does it degrade system performance?',
    answer: [
      'The Convoy Effect is a severe scheduling anomaly that occurs in FCFS when a single long CPU-bound process occupies the processor while multiple short I/O-bound processes are forced to wait in the ready queue behind it.',
      'During this period, all I/O devices sit completely idle. When the long CPU-bound process finally completes its burst and issues an I/O request, all the short processes rapidly execute their brief CPU bursts and queue up at the I/O devices, leaving the CPU completely idle.',
      'This sequential convoying leads to poor CPU and device utilization, inflated average waiting times, and sluggish system responsiveness compared to algorithms that prioritize short jobs (such as SJF or Round Robin).'
    ]
  },
  {
    id: 'sjf-optimality-and-burst-prediction',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Why is Shortest Job First (SJF) provably optimal for minimizing average waiting time, and how does the OS predict future CPU bursts?',
    answer: [
      'SJF is provably optimal because scheduling shorter jobs ahead of longer jobs moves waiting processes out of the ready queue faster, reducing the cumulative waiting time sum for all processes in the system.',
      'However, pure SJF cannot be implemented for long-term CPU scheduling because the exact length of the next CPU burst cannot be known in advance.',
      'Operating systems approximate SJF by predicting the next burst using Exponential Smoothing (exponential moving average): tau(n+1) = alpha * t(n) + (1 - alpha) * tau(n), where t(n) is the actual measured duration of the n-th burst, tau(n) is the previous historical prediction, and alpha is a weighting parameter between 0 and 1. If alpha = 0.5, recent history and past trends receive equal weight.'
    ]
  },
  {
    id: 'round-robin-quantum-tradeoffs',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Analyze the trade-offs involved in choosing the Round Robin time quantum (q).',
    answer: [
      'In Round Robin (RR) scheduling, the choice of the time quantum (time slice q) is critical to system performance:',
      'If q is excessively large: The algorithm degenerates into First-Come, First-Served (FCFS). Interactive responsiveness plummets because short interactive requests must wait behind long computation bursts.',
      'If q is extremely small: The processor spends an unacceptable proportion of its total execution cycles performing context switches (saving/restoring registers, flushing TLBs, and warming hardware caches) rather than executing useful user instructions (context switch thrashing).',
      'Rule of thumb: The time quantum should be chosen such that approximately 80% of CPU bursts are shorter than q, and the context switch duration accounts for less than 1% of the quantum (typically between 10 ms and 100 ms in general-purpose desktop operating systems).'
    ]
  },
  {
    id: 'linux-cfs-internals',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'How does the Linux Completely Fair Scheduler (CFS) operate using virtual runtime (vruntime) and Red-Black trees?',
    answer: [
      'The Linux Completely Fair Scheduler (CFS) does not use traditional fixed time slices or priority arrays. Instead, it enforces fairness by tracking the virtual runtime (vruntime) of each schedulable task.',
      'vruntime represents the amount of execution time a thread has consumed on the CPU, scaled inversely by its nice level (static priority from -20 to +19). Higher priority tasks (lower nice value) accumulate vruntime at a slower rate, allowing them to receive more physical CPU time.',
      'CFS maintains all runnable tasks in a self-balancing Red-Black Tree indexed by vruntime. The task with the lowest vruntime resides at the leftmost node of the tree. When a scheduling decision occurs, the dispatcher instantly picks the leftmost task in O(1) time (via a cached pointer) and inserts it back into the tree in O(log N) time after execution.'
    ]
  }
]

export default questions
