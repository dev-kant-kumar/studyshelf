import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const transferMechanismsTable = {
    caption: 'Comparison of Primary I/O Data Transfer Mechanisms',
    headers: ['Mechanism', 'CPU Utilization', 'Latency Overhead', 'Ideal Data Transfer Scale', 'Hardware Complexity'],
    rows: [
      [
        'Polling (Programmed I/O)',
        '100% busy-waiting while waiting for slow devices.',
        'Zero interrupt latency; optimal for sub-microsecond responses.',
        'Small transfers on dedicated real-time or ultra-fast devices.',
        'Minimal (requires only basic status/data registers).'
      ],
      [
        'Interrupt-Driven I/O',
        'Minimal during device latency; CPU switched to other tasks.',
        'High: 2 to 5 microseconds per interrupt (context save, ISR, cache flush).',
        'Moderate data rates (keyboards, serial ports, mice).',
        'Moderate (requires Interrupt Controller like APIC/PIC).'
      ],
      [
        'Direct Memory Access (DMA)',
        'Near zero: CPU interrupted once per entire multi-megabyte block.',
        'Negligible; transfers happen autonomously over system bus.',
        'High-bandwidth block transfers (disks, SSDs, Gigabit Ethernet).',
        'High (requires dedicated DMA controller & bus mastering).'
      ]
    ]
  }

  const ioModelsTable = {
    caption: 'Comparison of I/O Execution Models',
    headers: ['Model', 'Process State During I/O', 'Kernel Notification Mechanism', 'Scalability (Concurrently Open Sockets)', 'Modern API Examples'],
    rows: [
      [
        'Synchronous Blocking',
        'Suspended in wait queue; unscheduled by CPU.',
        'Process woken by kernel when data is copied to user buffer.',
        'Poor: requires one thread per connection (1 thread = 8 MB stack).',
        'Standard read(), write(), recv()'
      ],
      [
        'Synchronous Non-Blocking',
        'Active; system call returns immediately with EAGAIN.',
        'Application must poll descriptors in a tight user-space loop.',
        'Poor: wastes CPU cycles in repetitive polling loops.',
        'fcntl(fd, F_SETFL, O_NONBLOCK)'
      ],
      [
        'I/O Multiplexing',
        'Suspended waiting on an interest list of file descriptors.',
        'Kernel returns list of descriptors that are ready for reading/writing.',
        'High: handles 100,000+ active connections per thread.',
        'Linux epoll, BSD kqueue, POSIX poll()'
      ],
      [
        'Asynchronous I/O (AIO)',
        'Runs continuously; submits transfer request and continues immediately.',
        'Kernel copies data into user buffer; notifies via ring buffers.',
        'Maximum: zero system call overhead per I/O in ring mode.',
        'Linux io_uring, Windows IOCP, POSIX AIO'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        The Input/Output subsystem orchestrates communication between the CPU and diverse physical hardware peripherals.
        This deep technical guide details the I/O bus architecture, device controller registers, Port-Mapped vs Memory-Mapped
        addressing, the three fundamental transfer mechanisms, the two-level kernel interrupt pipeline, DMA cycle stealing,
        and modern high-performance asynchronous I/O architectures.
      </p>

      <h2>1. I/O Hardware Architecture</h2>
      <p>
        Computer systems interact with physical peripherals (hard drives, flash controllers, network cards, graphics adapters)
        through an interconnected hierarchy of hardware components:
      </p>
      <ul>
        <li>
          <strong>Ports:</strong> Electrical contact points linking peripheral cables or traces to the computer motherboard.
        </li>
        <li>
          <strong>Buses:</strong> Shared electrical communication pathways linking the CPU to memory and peripheral devices.
          Modern architectures employ hierarchical buses: the ultra-fast <strong>PCIe (Peripheral Component Interconnect Express)</strong>
          bus links CPU cores to NVMe storage and GPUs, bridging through the chipset to slower peripheral buses (SATA, USB).
        </li>
        <li>
          <strong>Device Controller (Host Adapter):</strong> A specialized processing chip built into the motherboard or peripheral card.
          It translates digital commands received from the CPU into analog physical motions (e.g., spinning disk motors or laser heads)
          and manages signal modulation, buffering, and hardware CRC/ECC checksum validation.
        </li>
      </ul>

      <h3>Controller Register Architecture</h3>
      <p>
        The CPU controls hardware peripherals by reading and writing four standard registers located inside the device controller:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          The Four Standard Device Controller Registers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">1. Data-in Register</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Read by the host CPU to collect inbound data bytes received from the external peripheral.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-accent dark:text-night-accent">2. Data-out Register</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Written by the host CPU to transmit outbound data bytes to the peripheral.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-danger dark:text-night-danger">3. Status Register</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Read by the CPU to inspect hardware state bits: <code>BUSY</code>, <code>ERROR</code>, <code>READY</code>, or <code>DATA_AVAILABLE</code>.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success">4. Control Register</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Written by the CPU to issue commands (e.g., <code>READ_SECTOR</code>, <code>WRITE_BLOCK</code>) and toggle hardware interrupts.
            </p>
          </div>
        </div>
      </div>

      <h2>2. Register Addressing: Port-Mapped I/O vs Memory-Mapped I/O</h2>
      <p>
        Processors address controller registers using two contrasting hardware paradigms:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          PMIO vs MMIO Architectural Comparison
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand">Port-Mapped I/O (PMIO / Isolated I/O)</div>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li>Uses a separate 16-bit I/O address space physically isolated from system RAM.</li>
              <li>Requires special privileged assembly instructions: <code>in</code> and <code>out</code> on x86.</li>
              <li>Does not consume physical RAM address space.</li>
              <li>Restricted to ring 0 kernel mode unless permitted by the CPU IOPL flag or TSS I/O bitmap.</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success">Memory-Mapped I/O (MMIO)</div>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li>Device registers are mapped directly into the CPU physical memory address space.</li>
              <li>CPU accesses hardware using standard instructions (<code>mov</code>, pointer dereference).</li>
              <li>Faster execution; allows rich CPU addressing modes without dedicated I/O opcodes.</li>
              <li>
                <strong>Critical Rule:</strong> The MMU must mark MMIO pages as <em>Uncacheable (UC)</em>.
                If cached in L1/L2, reads will fetch stale data and writes will fail to reach hardware!
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2>3. The Three Fundamental Transfer Mechanisms</h2>
      <p>
        The operating system transfers data between peripheral hardware and physical memory using three foundational architectures:
      </p>

      <ComparisonTable {...transferMechanismsTable} />

      <h2>4. The Two-Level Kernel Interrupt Architecture</h2>
      <p>
        In high-performance operating systems, an Interrupt Service Routine (ISR) cannot perform lengthy operations
        while holding hardware interrupts disabled. Doing so drops subsequent hardware interrupts (causing packet loss
        or missed clock ticks) and stalls the operating system. Modern kernels divide interrupt processing into two phases:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Top-Half vs Bottom-Half Interrupt Processing Pipeline
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-danger dark:text-night-danger">1. Top-Half (Hardirq / Fast Handler)</div>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li>Executes immediately upon interrupt firing in hardware interrupt context.</li>
              <li>Local CPU interrupts are disabled.</li>
              <li>Acknowledges the controller and clears hardware interrupt status bits.</li>
              <li>Transfers incoming raw bytes into a kernel buffer queue.</li>
              <li>Schedules the bottom-half deferred work and exits in &lt; 2 microseconds.</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success">2. Bottom-Half (Softirq, Tasklet, Workqueue)</div>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li>Runs asynchronously after the hardirq with interrupts fully re-enabled.</li>
              <li>Performs compute-intensive protocol parsing (e.g., TCP/IP packet disassembly, checksumming).</li>
              <li>Wakes up blocked user-space processes waiting for data.</li>
              <li>
                <strong>Linux Implementations:</strong> Softirqs (multi-CPU concurrent execution),
                Tasklets (serialized softirqs), and Workqueues (kernel thread context; can sleep on mutexes).
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2>5. Direct Memory Access (DMA) Mechanics and Scatter-Gather</h2>
      <p>
        Programmed I/O forces the CPU to transfer data byte-by-byte through registers.
        <strong>Direct Memory Access (DMA)</strong> bypasses the CPU entirely:
      </p>
      <ol>
        <li>
          <strong>Programming:</strong> The device driver writes the physical RAM destination address, byte count,
          and transfer direction into the DMA Controller (DMAC) registers.
        </li>
        <li>
          <strong>Bus Mastery:</strong> The DMAC requests system bus control (Bus Request) and receives Bus Grant from the CPU.
        </li>
        <li>
          <strong>Direct Transfer:</strong> Data streams directly between the device FIFO buffer and physical RAM over the bus.
        </li>
        <li>
          <strong>Completion Interrupt:</strong> When the transfer byte counter reaches zero, the DMAC releases the bus
          and fires a single hardware interrupt to notify the kernel.
        </li>
      </ol>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Why Scatter-Gather DMA is Critical in Paged Memory
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3">
          In virtual memory operating systems, a contiguous user buffer (e.g., a 64 KB network frame) is fragmented
          into 16 disjoint physical 4 KB memory frames scattered arbitrarily across physical RAM:
        </p>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2">
          <div>Without Scatter-Gather: The CPU must copy data into a contiguous &quot;bounce buffer&quot; (destroying performance).</div>
          <div className="text-success dark:text-night-success font-bold">
            With Scatter-Gather DMA: The driver builds an in-memory descriptor list:
          </div>
          <div className="pl-4 text-ink/80 dark:text-night-ink/80">
            Descriptor[0] &rarr; &#123; Base: Frame 0x10A000, Length: 4096 &#125;<br />
            Descriptor[1] &rarr; &#123; Base: Frame 0x8FA000, Length: 4096 &#125;<br />
            Descriptor[2] &rarr; &#123; Base: Frame 0x3BC000, Length: 4096 &#125;
          </div>
          <div>The DMAC hardware traverses this list autonomously, completing the transfer in a single uninterrupted operation.</div>
        </div>
      </div>

      <h2>6. Synchronous vs Asynchronous I/O Models</h2>
      <p>
        Application architectures rely on different operating system I/O execution models to balance responsiveness and throughput:
      </p>

      <ComparisonTable {...ioModelsTable} />

      <Callout type="tip" title="Modern Systems Innovation: Linux io_uring">
        Traditional asynchronous I/O (POSIX AIO) suffered from thread overhead and limited filesystem support.
        In 2019, the Linux kernel introduced <strong>io_uring</strong>. <code>io_uring</code> utilizes two circular ring buffers
        (a Submission Queue and a Completion Queue) shared directly between user space and kernel space memory.
        Applications submit I/O requests and reap completions via atomic ring pointers with <strong>zero system calls</strong>
        in polling mode, achieving millions of IOPS per single CPU core.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
