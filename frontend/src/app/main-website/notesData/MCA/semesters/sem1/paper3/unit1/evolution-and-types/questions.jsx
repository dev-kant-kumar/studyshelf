const questions = [
  {
    id: 'multiprogramming-vs-multiprocessing',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Distinguish between Multiprogramming, Multiprocessing, Multitasking, and Multithreading.',
    answer: [
      'Multiprogramming refers to keeping multiple programs in main memory concurrently so that when the active program waits for an I/O operation, the CPU switches to another program. The primary goal is maximizing CPU utilization in a uniprocessor system.',
      'Multiprocessing refers to a system possessing two or more physical CPU cores or processors capable of executing multiple instructions simultaneously in true hardware parallelism.',
      'Multitasking is a logical extension of multiprogramming where the CPU executes multiple jobs by switching among them rapidly using fixed time slices (quanta). The primary goal is minimizing interactive response time for human users.',
      'Multithreading refers to dividing a single process into multiple lightweight execution units (threads) that share the same address space, code segment, and heap, but maintain independent thread execution contexts (registers and stack).'
    ]
  },
  {
    id: 'tanenbaum-cpu-utilization',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain the probabilistic model of CPU utilization under multiprogramming with its mathematical formula.',
    answer: [
      'In a multiprogramming system where n processes are resident in memory, suppose each process spends a fraction p of its total time waiting for I/O operations (where 0 <= p <= 1).',
      'Assuming processes are independent, the probability that all n processes are simultaneously blocked waiting for I/O is p raised to the power n. Therefore, the CPU utilization is given by: CPU Utilization = 1 - (p raised to n).',
      'For example, if a workload spends 80 percent of its time waiting for I/O (p = 0.8): With n = 1 process, CPU utilization is only 1 - 0.8 = 0.20 (20 percent). With n = 5 processes, CPU utilization jumps to 1 - (0.8 raised to 5) = 1 - 0.328 = 0.672 (67.2 percent). With n = 10 processes, utilization reaches 1 - (0.8 raised to 10) = 89.3 percent. This mathematically demonstrates why multiprogramming dramatically increases hardware throughput.'
    ]
  },
  {
    id: 'hard-vs-soft-rtos',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Hard Real-Time and Soft Real-Time systems with systems engineering trade-offs.',
    answer: [
      'A Hard Real-Time System requires that operational deadlines are strictly and deterministically met. Missing even a single deadline is classified as a total system failure with potentially catastrophic safety consequences (e.g. automotive anti-lock brakes, missile guidance, cardiac pacemakers). These systems strictly prohibit virtual memory, demand paging, and dynamic memory allocation because page faults and garbage collection introduce unbounded latency jitter.',
      'A Soft Real-Time System prioritizes real-time tasks over non-real-time tasks, but a missed deadline degrades quality of service (QoS) rather than causing catastrophic failure (e.g. video streaming, live audio production, VoIP codecs). These systems can utilize virtual memory and general-purpose kernels optimized with preemptible kernel patches (such as Linux PREEMPT_RT).'
    ]
  },
  {
    id: 'priority-inversion-pathfinder',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'What is Priority Inversion, how did it affect the Mars Pathfinder spacecraft, and how does Priority Inheritance solve it?',
    answer: [
      'Priority Inversion occurs in preemptive priority-based scheduling when a low-priority task (L) holds a shared resource (such as a mutex) needed by a high-priority task (H). Before L can release the mutex, an unrelated medium-priority task (M) that does not need the mutex preempts L because M has higher priority than L. Consequently, H is indirectly blocked waiting for M, inverting the intended priority hierarchy.',
      'During the 1997 Mars Pathfinder mission, a low-priority meteorological task acquired an information bus mutex. A medium-priority communications task preempted it repeatedly, preventing it from releasing the mutex. The high-priority attitude control task was blocked waiting for the mutex, causing a watchdog timer reset and repeatedly rebooting the spacecraft.',
      'The solution is the Priority Inheritance Protocol: when high-priority task H blocks on a resource held by low-priority task L, task L temporarily inherits the priority of H until it releases the resource. This prevents intermediate medium-priority tasks from preempting L, allowing L to finish quickly and hand the resource to H.'
    ]
  },
  {
    id: 'smp-vs-amp-numa',
    level: 'medium',
    tags: ['Concept check', 'Interview practice'],
    question: 'Contrast Symmetric Multiprocessing (SMP) and Asymmetric Multiprocessing (AMP). What is NUMA?',
    answer: [
      'In Asymmetric Multiprocessing (AMP), processors have dedicated master-slave relationships. A master processor runs the operating system kernel and dispatches user tasks to subordinate slave processors, or processors are dedicated to specific fixed tasks (e.g. DSP or network offload).',
      'In Symmetric Multiprocessing (SMP), all physical processors share access to all system resources (memory, bus, I/O devices), and every processor can run the kernel and user applications symmetrically without master-slave bottlenecks.',
      'Non-Uniform Memory Access (NUMA) is an SMP architecture where physical RAM is partitioned across multiple CPU sockets. A CPU accesses its local socket memory with very low latency (~60 ns), but accessing remote memory across the inter-socket interconnect (e.g. Intel UPI or AMD Infinity Fabric) incurs a significant latency penalty (~120-150 ns). Modern OS schedulers must be NUMA-aware to keep threads executing on the same CPU socket where their memory frames are allocated.'
    ]
  },
  {
    id: 'spooling-vs-buffering-exam',
    level: 'easy',
    tags: ['Exam practice'],
    question: 'How did SPOOLing revolutionize batch processing efficiency?',
    answer: [
      'In early batch systems, the CPU had to interact directly with slow mechanical card readers and tape drives, wasting substantial processor cycles waiting for mechanical movement.',
      'SPOOLing (Simultaneous Peripheral Operations On-Line) used high-speed secondary magnetic disk storage as an intermediary buffer. As card readers read jobs, card images were copied directly to disk in the background. The OS could immediately load queued jobs from the fast disk into memory as soon as the previous job completed.',
      'Similarly, print output was written directly to spool files on disk at high CPU speeds, allowing the CPU to proceed immediately while a background routine streamed the spool file to the slow physical printer at mechanical speed.'
    ]
  }
]

export default questions
