const questions = [
  {
    id: 'computer-vs-device', level: 'easy', tags: ['Concept check', 'Exam practice'],
    question: 'What makes a system a computer rather than just an electronic device?',
    answer: <><p>A computer performs operations on represented data under the control of instructions. Being electronic is not enough: an amplifier can alter a signal without being a general-purpose programmable computer. A laptop changes tasks by running different programs. An embedded controller may run only a small set of programs but still contains a processor, stored instructions, and state.</p><p>In an exam, give the definition, explain programmability, and illustrate input, processing, state, and output with one task. Avoid defining every computer as a desktop PC.</p></>,
  },
  {
    id: 'data-context', level: 'easy', tags: ['Concept check'],
    question: 'How does data become information?',
    answer: <><p>Interpretation provides context. The value 75 could describe marks, temperature, or a count. The record “75 marks out of 100 in Algorithms” allows a meaningful inference. Processing alone does not guarantee useful information: summing unrelated quantities produces a number without a useful interpretation.</p><p>Preserve units, field definitions, timestamps, and origin when those affect meaning. The result of one system may become another system’s input data.</p></>,
  },
  {
    id: 'binary-why', level: 'medium', tags: ['Interview practice', 'Curious learner'],
    question: 'Why do digital computers usually use binary instead of ten physical states?',
    answer: <><p>Two distinguishable logical states are practical to implement with electronic switching circuits. Real voltages are continuous; a circuit interprets ranges as logical values and tolerates some noise. Ten reliably separated states would require tighter discrimination under comparable conditions.</p><p>This is an engineering choice, not a law saying computation must use binary. Decimal and other computing designs exist. Binary also does not mean every transistor is always either perfectly at zero volts or perfectly at one volt.</p></>,
  },
  {
    id: 'encoding', level: 'medium', tags: ['Concept check', 'Interview practice'],
    question: 'Can the same bits represent a number, a letter, or an instruction?',
    answer: <><p>Yes. The pattern does not contain its interpretation. An encoding, type, instruction set, or file format defines what it means. The byte 01000001 is unsigned integer 65 or ASCII A. Treating arbitrary bytes as executable instructions is a separate interpretation with different validity rules.</p><p>This is why reading a binary file as text can produce nonsense, and why a program must know a field’s type before operating on its bytes.</p></>,
  },
  {
    id: 'unicode-length', level: 'medium', tags: ['Practical', 'Curious learner'],
    question: 'Why does a character count differ from a UTF-8 byte count?',
    answer: <><p>UTF-8 encodes a Unicode scalar value using one to four bytes. ASCII characters use one byte; other characters can use more. A user-perceived character may also consist of multiple code points, such as a letter followed by a combining mark.</p><p>Distinguish encoded bytes, code points, and grapheme clusters. A field limit of 20 bytes is not necessarily a limit of 20 visible characters. Define which measure an application needs instead of assuming every character occupies one byte.</p></>,
  },
  {
    id: 'ram-storage', level: 'easy', tags: ['Exam practice', 'Interview practice'],
    question: 'How are RAM and persistent storage different?',
    answer: <><p>Main memory supplies working instructions and data to executing programs. Ordinary DRAM requires power to retain contents. Persistent storage retains files without continuous power and generally offers greater capacity with different access costs.</p><p>Opening a file typically brings required data into memory. Editing that copy does not automatically update the file. “Memory is temporary and storage is permanent” is too absolute: persistence does not protect against deletion, corruption, or device failure.</p></>,
  },
  {
    id: 'program-process', level: 'medium', tags: ['Exam practice', 'Interview practice'],
    question: 'What is the difference between a program and a process?',
    answer: <><p>A program specifies instructions; a process is an instance of execution with state and resources. Two instances of the same application can have different memory contents, open files, and execution positions. A single application can also create multiple processes.</p><p>A process may contain several threads. Threads within that process commonly share its address space while having their own execution state, including stacks and registers. Concurrency does not imply that all threads execute simultaneously on separate cores.</p></>,
  },
  {
    id: 'firmware', level: 'easy', tags: ['Exam practice'],
    question: 'Is firmware hardware or software?',
    answer: <><p>Firmware is software closely associated with controlling a device and commonly stored in non-volatile memory. Its storage chip is hardware; the instructions are software. It may be updated, so “firmware can never change” is incorrect.</p><p>Device startup code and controller software are examples. Do not assume every firmware component is an operating system or every application is firmware.</p></>,
  },
  {
    id: 'instruction-cycle', level: 'medium', tags: ['Exam practice', 'Concept check'],
    question: 'Explain fetch–decode–execute without oversimplifying a modern processor.',
    answer: <><p>Conceptually, the processor obtains an instruction, determines its operation and operands, executes it, and updates the state needed for subsequent execution. A program counter or equivalent architectural mechanism records instruction-position information.</p><p>Modern processors can overlap stages, execute some work speculatively, and have multiple execution units. The conceptual cycle describes the meaning of instruction execution; it does not prove that one instruction completes per cycle or that every instruction takes the same time.</p></>,
  },
  {
    id: 'clock-performance', level: 'medium', tags: ['Interview practice', 'Practical'],
    question: 'Is a 4 GHz processor necessarily faster than a 3 GHz processor?',
    answer: <><p>No. Clock frequency measures cycles per second. For a simplified single-threaded compute workload, CPU time depends on instruction count, average cycles per instruction, and clock rate. Memory delays, different instruction sets, compiler output, and workload behaviour also matter.</p><p>Compare the same useful task with controlled inputs and measured completion time. A higher frequency can help when other relevant conditions are comparable, but the number alone does not establish overall performance.</p></>,
  },
  {
    id: 'amdahl', level: 'hard', tags: ['Interview practice', 'Curious learner'],
    question: 'If 80% of a task becomes four times faster, what is the overall speedup?',
    answer: <><p>Normalise the original time to 1. The unchanged fraction remains 0.20; the improved fraction takes 0.80/4 = 0.20. New time is 0.40, so speedup is 1/0.40 = 2.5 times. The elapsed-time reduction is 60%, not 75%.</p><p>If only that 80% could become arbitrarily fast, the remaining 20% would limit speedup to 5 times. This calculation assumes the fractions describe the original workload and that the change adds no overhead or new bottleneck.</p></>,
  },
  {
    id: 'latency-throughput', level: 'medium', tags: ['Interview practice'],
    question: 'Can throughput improve while a user’s response time gets worse?',
    answer: <><p>Yes. Batching or higher concurrency can increase work completed per second while causing an individual request to wait longer. At high load, queueing can increase latency even when the system remains busy and throughput is high.</p><p>Measure completion rate and response-time distribution separately. An average can conceal unusually slow requests. The correct optimisation target depends on whether the application needs interactive responsiveness, bulk processing, or both.</p></>,
  },
  {
    id: 'more-ram', level: 'medium', tags: ['Practical', 'Interview practice'],
    question: 'When does adding RAM help, and when does it not help?',
    answer: <><p>It can help when the working set does not fit comfortably in memory and the system repeatedly moves data between memory and storage. More memory may reduce paging and allow useful caching.</p><p>It may have little effect on a task limited by CPU computation, network delay, or an inefficient algorithm when memory is already sufficient. Diagnose memory pressure and workload behaviour before treating capacity as a universal speed control.</p></>,
  },
  {
    id: 'cache', level: 'medium', tags: ['Concept check', 'Interview practice'],
    question: 'Why is a small cache useful when much larger RAM already exists?',
    answer: <><p>Programs often reuse nearby or recently accessed data. A cache can serve many of these accesses at a lower cost than going to main memory. Its usefulness depends on the access pattern and whether needed data is present.</p><p>A larger cache is not automatically optimal: capacity, latency, power, and implementation costs interact. Cache hits help; cache misses still require accessing a lower level. A cache is not a replacement for persistent file storage.</p></>,
  },
  {
    id: 'virtual-memory', level: 'hard', tags: ['Interview practice', 'Curious learner'],
    question: 'Does virtual memory mean the computer has unlimited RAM?',
    answer: <><p>No. Virtual memory provides an address-space abstraction and mechanisms for mapping addresses to physical memory. Some systems can also keep less-used memory contents in backing storage, but storage access is not equivalent to RAM access.</p><p>Address-space limits, available physical memory, configured backing storage, and OS policy still constrain execution. A page fault is not automatically an error or a disk read: the OS may be able to satisfy it in other ways, including creating a zero-filled page.</p></>,
  },
  {
    id: 'interrupt-poll', level: 'hard', tags: ['Interview practice', 'Curious learner'],
    question: 'How do polling and interrupts differ, and is one always better?',
    answer: <><p>Polling checks a condition repeatedly, such as whether a device has completed a transfer. An interrupt allows an event to cause the processor to execute an appropriate handler, subject to the system’s interrupt mechanism and masking rules.</p><p>Interrupts avoid some unnecessary checking but have handling costs. Polling can be useful for frequent events or tightly controlled latency requirements. Real systems may combine both. Choose based on event rate, processing cost, responsiveness, and scheduling requirements.</p></>,
  },
  {
    id: 'dma', level: 'hard', tags: ['Curious learner', 'Interview practice'],
    question: 'What does direct memory access change about input/output?',
    answer: <><p>A DMA-capable controller transfers data between a device and memory without requiring the CPU to copy each individual data unit using ordinary instructions. The CPU still usually prepares the operation, manages buffers, and handles completion or errors.</p><p>“DMA does not involve the CPU at all” is therefore misleading. The system must also consider access permissions, memory consistency, and buffer lifetime. DMA reduces a particular kind of transfer work; it does not eliminate every I/O cost.</p></>,
  },
  {
    id: 'float', level: 'medium', tags: ['Practical', 'Interview practice'],
    question: 'Why can 0.1 + 0.2 fail an exact comparison with 0.3?',
    answer: <><p>Common binary floating-point formats cannot exactly represent many decimal fractions, including 0.1. Values and operations can be rounded to nearby representable numbers. Display formatting can hide that difference without removing it.</p><p>Choose an appropriate representation and comparison rule. Integer minor units may suit bounded money calculations; decimal or rational arithmetic may suit other requirements. A tolerance must reflect the domain, not an arbitrary large constant that conceals mistakes.</p></>,
  },
  {
    id: 'correct-secure', level: 'medium', tags: ['Interview practice', 'Practical'],
    question: 'Can a correct result still come from an unsafe or unreliable system?',
    answer: <><p>Yes. A correct marks total is insecure if an unauthorised user can change records. It is not durable if acknowledged results disappear after a crash. It may be unavailable if the service cannot respond when needed.</p><p>Check functional correctness, access control, durability, and availability separately. One successful calculation proves only that this particular execution produced an expected result under the conditions tested.</p></>,
  },
  {
    id: 'save-durability', level: 'hard', tags: ['Practical', 'Curious learner'],
    question: 'Does pressing Save guarantee that data survives a power failure?',
    answer: <><p>Not unconditionally. An application may write into a buffer, the OS may cache data, and a device may have its own write cache. The durability promise depends on the application, filesystem, device, and the operations used to commit data.</p><p>Differentiate “the application accepted my change”, “the write was requested”, and “the required durable state was committed”. Backups and recovery procedures address additional failure cases; saving a file is not itself a backup strategy.</p></>,
  },
  {
    id: 'algorithm-scale', level: 'hard', tags: ['Interview practice', 'Curious learner'],
    question: 'Why can a better algorithm matter more than a faster processor?',
    answer: <><p>Hardware improvements often provide a roughly multiplicative change for a fixed task, while algorithmic growth determines how work scales with input size. If one simplified method requires n squared comparisons and another requires n comparisons, doubling n multiplies their work by four and two respectively.</p><p>Actual performance still depends on constants, memory access, implementation, and input properties. Do not choose solely by asymptotic notation for every small workload. Use complexity to reason about growth, then measure representative executions.</p></>,
  },
  {
    id: 'parallel-limit', level: 'hard', tags: ['Interview practice'],
    question: 'Why does an eight-core processor not guarantee an eight-times speedup?',
    answer: <><p>Some work must remain sequential. Tasks may also spend time communicating, synchronising, contending for memory, or waiting for I/O. An implementation must expose independent work before extra cores can help.</p><p>Even when work is parallelisable, load imbalance can leave cores idle. Identify the sequential fraction and overhead, and compare the same workload. Concurrency is about managing overlapping work; parallelism means some work is actually executing simultaneously.</p></>,
  },
  {
    id: 'ai-correctness', level: 'medium', tags: ['Curious learner', 'Practical'],
    question: 'Does a computer understand a problem because its answer sounds convincing?',
    answer: <><p>No conclusion about correctness follows from fluency alone. An AI application still depends on data representations, a model or algorithm, and an execution environment. Its output can violate facts, constraints, or the user’s intended meaning.</p><p>Evaluate the answer against evidence and explicit requirements. For a calculation, inspect the inputs, units, formula, and result. For generated code, inspect behaviour and test meaningful cases rather than relying on a confident explanation.</p></>,
  },
  {
    id: 'testing-boundary', level: 'hard', tags: ['Practical', 'Interview practice'],
    question: 'What tests would you design for a marks-percentage program?',
    answer: <><p>Include normal valid values, all zeros, all maxima, differing subject maxima, missing inputs, a zero total maximum, out-of-range marks, and non-numeric input. Specify whether fractional marks are allowed before deciding their expected behaviour.</p><p>Check invariants: valid percentages remain between 0 and 100; changing the order of the same subject records should not change the result; the program must not silently treat missing data as zero. Tests depend on a stated contract, not just on reproducing the implementation.</p></>,
  },
  {
    id: 'troubleshoot', level: 'medium', tags: ['Practical', 'Interview practice'],
    question: 'A correct report disappears after restarting. How should you investigate?',
    answer: <><p>Separate hypotheses: it was never saved, it was saved elsewhere, the write failed, or the saved record is not being loaded. Reproduce the event using a small example, record the expected path or record key, check error reporting, and inspect the persisted result before restarting.</p><p>Then determine whether retrieval uses the same location or identifier. Test one explanation at a time. Avoid changing several settings at once because that destroys the evidence needed to identify the cause.</p></>,
  },
  {
    id: 'universal', level: 'hard', tags: ['Curious learner'],
    question: 'If a computer is programmable, can it solve every possible problem?',
    answer: <><p>No. Programmability does not remove limits of computability. In a sufficiently expressive general model, there is no algorithm that correctly decides, for every program and input, whether that program will eventually halt. This is the halting-problem limitation.</p><p>There are also resource limits for problems that are computable in principle. A method can require impractical time or memory. Keep “no general algorithm exists”, “this implementation is too slow”, and “we have not yet found a useful method” distinct.</p></>,
  },
  {
    id: 'exam-answer', level: 'easy', tags: ['Exam practice'],
    question: 'What does a strong answer on computer characteristics include?',
    answer: <><p>Start with a definition. Explain characteristics such as speed, accuracy, automation, diligence, storage, and versatility using a concrete example. Add the conditions behind each claim: accuracy depends on data and instructions; storage needs management and protection; automation needs correct setup.</p><p>Where relevant, use a functional diagram and trace a task. A longer list of adjectives is less useful than a shorter, correct explanation supported by examples and limitations.</p></>,
  },
]

export default questions
