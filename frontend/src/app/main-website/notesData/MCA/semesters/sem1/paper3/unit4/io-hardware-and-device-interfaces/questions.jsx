const questions = [
  {
    id: 'io-hardware-components-and-registers',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Describe the primary hardware components of an I/O subsystem: Ports, Buses, and Device Controllers. List the four standard controller registers.',
    answer: [
      'The I/O hardware infrastructure comprises three core architectural components:',
      '1. Ports: The hardware connection point through which a peripheral device communicates with the computer system (e.g., serial port, USB port).',
      '2. Buses: A shared set of electrical wires and communication protocols enabling data transfer between CPU, memory, and devices. Modern motherboards utilize hierarchical buses: the high-speed PCIe bus for GPUs and NVMe drives, connected via host bridges to expansion buses (SATA, USB).',
      '3. Device Controller (Host Adapter): A dedicated hardware processor that operates the mechanical or electronic peripheral device. It serializes and deserializes bit streams, performs error-correcting code (ECC) checks, and converts high-level commands into electrical signals.',
      'A standard device controller exposes four memory-mapped or port-mapped registers to the CPU:',
      '1. Data-in Register: Read by the CPU to receive input data bytes from the device.',
      '2. Data-out Register: Written by the CPU to send output data bytes to the device.',
      '3. Status Register: Read by the CPU to inspect hardware state flags (such as BUSY, ERROR, READY, or DATA_AVAILABLE).',
      '4. Control Register: Written by the CPU to configure device operating modes and issue execution commands (such as READ_SECTOR, WRITE_SECTOR, or ENABLE_INTERRUPTS).'
    ]
  },
  {
    id: 'mmio-vs-pmio-architecture',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Memory-Mapped I/O (MMIO) and Port-Mapped (Isolated) I/O (PMIO). Explain their instruction sets, address space mapping, and memory caching implications.',
    answer: [
      'Operating systems and microprocessors interact with device controller registers using two distinct addressing paradigms:',
      '1. Port-Mapped I/O (PMIO / Isolated I/O): Uses a completely separate 16-bit physical I/O address space isolated from main RAM. (a) CPU Instructions: Requires specialized assembly instructions such as in and out on x86 architectures (e.g., in al, 0x3F8). (b) Address Space: Does not consume physical memory addresses. (c) Protection: Privileged instructions; user space code attempting them triggers a General Protection Fault (#GP) unless granted permission via the x86 IOPL flag or TSS I/O permission bitmap.',
      '2. Memory-Mapped I/O (MMIO): Maps device controller registers directly into the physical memory address space of the processor. (a) CPU Instructions: Handled identically to normal memory locations using standard instructions (mov, load, store) and any addressing mode. (b) Address Space: Consumes a portion of physical address space (e.g., high memory addresses above RAM). (c) Caching Considerations: Critical hazard - CPU caches (L1, L2, L3) must NEVER cache device registers! If a status register were cached, the CPU would read stale cache lines and fail to detect hardware status changes. The kernel MMU must mark MMIO memory pages as Uncacheable (UC) or Write-Combining (WC) via page table attribute flags.'
    ]
  },
  {
    id: 'io-transfer-mechanisms-and-polling-sweet-spot',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Polling (Programmed I/O), Interrupt-Driven I/O, and Direct Memory Access (DMA). Under what specific systems condition is Polling faster than Interrupts?',
    answer: [
      'Operating systems transfer data between peripheral devices and memory using three primary mechanisms:',
      '1. Polling (Programmed I/O - PIO): The CPU repeatedly executes a busy-wait loop reading the controller status register until the BUSY bit clears. (a) Advantage: Zero interrupt latency and no context switch overhead. (b) Disadvantage: 100% CPU starvation if the device is slow (e.g., waiting 5 milliseconds for a magnetic disk seek wastes 15 million CPU clock cycles).',
      '2. Interrupt-Driven I/O: The CPU issues an I/O command and immediately context-switches to execute other productive processes. When the device finishes, the controller asserts an interrupt line (IRQ). The interrupt controller (APIC) pauses the CPU and invokes the Interrupt Service Routine (ISR). (a) Advantage: CPU is freed during mechanical device delays. (b) Disadvantage: Interrupt processing incurs context save/restore overhead, pipeline flushes, and cache pollution.',
      '3. Direct Memory Access (DMA): A dedicated DMA controller (DMAC) takes mastery of the system bus, moving multi-megabyte data blocks directly between device buffers and physical RAM without CPU involvement. The CPU is interrupted only once per entire block transfer rather than once per byte.',
      'When Polling is FASTER than Interrupts: When the device response time is shorter than the time required to service an interrupt! servicing a hardware interrupt requires saving registers, flushing CPU pipelines, executing the ISR, and context switching (often 2 to 5 microseconds). If an ultra-high-speed device (such as an NVMe SSD or 100 Gbps network card using DPDK/SPDK) responds in under 1 microsecond, polling is substantially faster and provides dramatically higher throughput than interrupt-driven I/O.'
    ]
  },
  {
    id: 'top-half-vs-bottom-half-interrupts',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Explain the Two-Level Interrupt Handling Architecture in operating system kernels: Top-Half (Hardirq) vs Bottom-Half (Softirq / Tasklets / Workqueues). Why is this division necessary?',
    answer: [
      'In high-throughput systems, an Interrupt Service Routine (ISR) cannot perform lengthy operations while running with interrupts disabled, as doing so drops subsequent hardware interrupts and starves the operating system. Modern kernels split interrupt processing into two complementary phases:',
      '1. Top-Half (Hardirq / Fast Handler):',
      '(a) Runs immediately when hardware asserts the interrupt line, executing in interrupt context with local CPU interrupts disabled.',
      '(b) Performs minimal critical tasks: acknowledges the hardware controller, clears the device interrupt status bit to prevent re-triggering, saves critical hardware registers, moves raw data into a kernel queue, schedules the bottom-half, and exits immediately.',
      '(c) Typical execution time: Under 1 to 5 microseconds.',
      '2. Bottom-Half (Softirq, Tasklet, Workqueue in Linux):',
      '(a) Runs asynchronously at a later time with hardware interrupts re-enabled.',
      '(b) Performs heavy computational tasks: TCP/IP checksum calculation, packet parsing, protocol demultiplexing, waking blocked user processes, and allocating memory buffers.',
      '(c) Bottom-half variants: Softirqs (executed on return from hardirq or by ksoftirqd, fully re-entrant across multiple CPUs), Tasklets (built on softirqs, serialized per device), and Workqueues (run in kernel thread process context, capable of sleeping and blocking on mutexes).',
      'Why the split is necessary: It guarantees that hardware remains responsive to physical real-world events while delegating non-urgent computational workloads to standard schedulable entities.'
    ]
  },
  {
    id: 'dma-transfer-modes-and-scatter-gather',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Trace the lifecycle of a DMA transfer. Contrast Cycle Stealing vs Burst Mode DMA, and explain why Scatter-Gather DMA is vital for modern virtual memory operating systems.',
    answer: [
      '1. DMA Transfer Lifecycle:',
      'Step 1: Device driver programs DMA controller (DMAC) registers with: memory physical target address, transfer byte count, transfer direction (read/write), and device port.',
      'Step 2: CPU executes start command and resumes running other user processes.',
      'Step 3: The DMAC asserts bus request (BR) to the CPU. The CPU yields bus control, acknowledging via bus grant (BG).',
      'Step 4: DMAC transfers data directly across the system bus between device FIFO and RAM without routing through CPU registers.',
      'Step 5: When the byte counter decrements to zero, DMAC relinquishes bus control and asserts an interrupt to signal transfer completion to the CPU.',
      '2. Cycle Stealing vs Burst Mode:',
      '(a) Cycle Stealing: The DMAC takes control of the bus for exactly one bus cycle per data word, interweaving transfers between CPU memory access cycles. Advantage: Minimal CPU instruction execution disruption. Disadvantage: Lower aggregate DMA throughput.',
      '(b) Burst Mode: The DMAC grabs bus control and holds it continuously until the entire data block is transferred. Advantage: Maximum transfer bandwidth. Disadvantage: CPU is locked out of main memory during the burst (CPU stalls if instructions miss L1/L2 cache).',
      '3. Why Scatter-Gather DMA is Vital:',
      'In operating systems with virtual memory, a user-space buffer that appears contiguous in virtual memory is almost always split across non-contiguous physical memory frames scattered across RAM.',
      'Without Scatter-Gather: The kernel would have to either allocate a contiguous physical bounce buffer and copy data with the CPU (destroying performance), or issue a separate DMA interrupt for every 4 KB page.',
      'With Scatter-Gather DMA: The driver constructs a Descriptor Table (scatter-gather list) in memory containing pairs of (physical frame address, length). The DMAC hardware iterates through the descriptor list autonomously, reading or writing to disjoint physical frames across RAM in a single uninterrupted operation.'
    ]
  }
]

export default questions
