import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const ioMechanismsTable = {
    caption: 'Comparative Analysis of Input/Output Hardware Transfer Architectures',
    headers: ['Architectural Dimension', 'Programmed I/O (Polling)', 'Interrupt-Driven I/O', 'Direct Memory Access (DMA)'],
    rows: [
      [
        'CPU Utilization',
        '100% busy-waiting; CPU trapped in status polling loop.',
        'Moderate; CPU interrupted on every single byte or word.',
        'Extremely low; CPU sets up transfer and receives 1 interrupt per block.'
      ],
      [
        'Data Transfer Rate',
        'Severely constrained by CPU clock and instruction loop speed.',
        'Constrained by interrupt context-switching overhead per byte.',
        'Approaches physical memory bus and peripheral controller bandwidth.'
      ],
      [
        'Hardware Complexity',
        'Minimal; device controller only needs status and data registers.',
        'Requires interrupt request lines (IRQs) and APIC controller logic.',
        'Highest; requires dedicated DMA controller with bus mastering circuitry.'
      ],
      [
        'Ideal Application Domain',
        'Extremely fast dedicated sensors or low-power microcontrollers.',
        'Low-throughput asynchronous devices (keyboard, mouse, serial console).',
        'High-bandwidth block/stream devices (NVMe SSDs, Gigabit NICs, GPUs).'
      ]
    ]
  }

  const topBottomHalfTable = {
    caption: 'Kernel Execution Boundaries: Top-Half vs Bottom-Half Interrupt Handling',
    headers: ['Evaluation Parameter', 'Top-Half (Hardirq / Immediate ISR)', 'Bottom-Half (Softirq / Tasklet / Workqueue)'],
    rows: [
      [
        'Execution Timing',
        'Runs immediately when hardware signals an interrupt line.',
        'Runs asynchronously when kernel exits hardirq context or scheduler picks worker.'
      ],
      [
        'Hardware Interrupt State',
        'Interrupts are disabled or masked on the executing CPU core.',
        'Hardware interrupts are re-enabled; can be interrupted by new device events.'
      ],
      [
        'Allowed Operations',
        'Cannot sleep, block, allocate dynamic memory, or call context-switching APIs.',
        'Workqueues execute in process context and can sleep, allocate memory, or block on I/O.'
      ],
      [
        'Core Responsibilities',
        'Read device status register, clear interrupt condition on hardware, copy data to queue.',
        'Analyze packet protocol headers, verify checksums, wake sleeping socket processes.'
      ]
    ]
  }

  const kernelDriverInterruptCode = `// Linux Kernel Driver Fragment: Top-Half ISR and Bottom-Half Workqueue
#include <linux/module.h>
#include <linux/interrupt.h>
#include <linux/workqueue.h>

static struct work_struct network_rx_work;

// Bottom-Half Handler: Executes in process context with interrupts enabled
static void network_rx_work_handler(struct work_struct *work) {
    // Perform compute-heavy operations, memory allocation, and packet decoding
    pr_info("Bottom-Half: Processing network packet payload asynchronously\\n");
}

// Top-Half Handler: Hardirq ISR executing with interrupts disabled
static irqreturn_t device_interrupt_handler(int irq, void *dev_id) {
    // 1. Acknowledge hardware device and clear interrupt pin
    // 2. Read status register into driver cache
    // 3. Defer heavy processing to bottom-half workqueue
    schedule_work(&network_rx_work);

    // Return IRQ_HANDLED immediately (execution time < 5 microseconds)
    return IRQ_HANDLED;
}

static int __init driver_init(void) {
    INIT_WORK(&network_rx_work, network_rx_work_handler);
    // Request IRQ line 42 with shared interrupt flag
    return request_irq(42, device_interrupt_handler, IRQF_SHARED, "demo_net_dev", (void*)driver_init);
}`

  return (
    <>
      <p>
        An operating system cannot function as an isolated piece of software. Its entire execution model is driven by physical hardware events occurring across the processor, system memory buses, and peripheral controllers. For MCA students preparing for advanced technical papers and systems engineering interviews, mastering computer system operation requires dissecting interrupt dispatch mechanics, Direct Memory Access (DMA) bus mastering, and hardware-enforced memory protection boundaries.
      </p>

      <h2>What you will learn</h2>
      <ul>
        <li>The system bootstrap sequence: From firmware reset vectors (UEFI/BIOS) to kernel initialization and long mode execution.</li>
        <li>The interrupt-driven execution model: Hardware IRQs, the Advanced Programmable Interrupt Controller (APIC), and Interrupt Descriptor Tables (IDT).</li>
        <li>Kernel concurrency boundaries: Top-Half vs Bottom-Half interrupt processing, softirqs, and workqueues.</li>
        <li>Direct Memory Access (DMA): Controller register architecture, burst mode vs cycle stealing, scatter-gather transfers, and cache coherency.</li>
        <li>Hardware memory protection: Base and Limit registers, Memory Management Units (MMU), and page table permission flags.</li>
        <li>I/O protection mechanisms: The I/O Privilege Level (IOPL) and the Task State Segment (TSS) I/O permission bitmap.</li>
      </ul>

      <h2>1. The System Bootstrap Sequence</h2>
      <p>
        When electrical power is applied to a computer system, volatile physical RAM contains random noise, and the CPU cannot run general-purpose software. The initialization process is guided by a deterministic hardware bootstrap pipeline:
      </p>
      <ol>
        <li>
          <strong>The Reset Vector:</strong> The processor hardware initializes its internal registers to predefined states. On x86 processors, the Program Counter (<code>CS:IP</code> / <code>RIP</code>) is forced to a hardwired physical address (<code>0xFFFFFFF0</code>), locating the system firmware stored in non-volatile ROM/flash memory.
        </li>
        <li>
          <strong>Firmware Execution (UEFI / BIOS):</strong> The firmware executes the Power-On Self-Test (POST) to verify CPU registers, memory controllers, and essential peripheral hardware. In modern systems, the Unified Extensible Firmware Interface (UEFI) verifies cryptographic digital signatures under Secure Boot to guarantee bootloader integrity.
        </li>
        <li>
          <strong>Bootloader Invocation:</strong> The firmware reads the primary partition table (GPT / MBR) from secondary storage and loads the stage-two bootloader (such as GRUB on Linux or Windows Boot Manager) into RAM.
        </li>
        <li>
          <strong>Kernel Decompression & Mode Transition:</strong> The bootloader transfers execution to the operating system kernel image. The kernel decompresses itself, initializes physical memory allocators, configures the initial Interrupt Descriptor Table (IDT), and transitions the processor from legacy 16-bit real mode through 32-bit protected mode into 64-bit long mode.
        </li>
        <li>
          <strong>PID 1 and Daemon Launch:</strong> The kernel mounts the root virtual file system (VFS), spawns the first user-space process (<code>init</code> or <code>systemd</code> with Process ID 1) in Ring 3, and transitions into an event-driven loop waiting for interrupts and system calls.
        </li>
      </ol>

      <h2>2. The Interrupt-Driven Execution Model</h2>
      <p>
        Modern operating systems are fundamentally event-driven programs. If there are no executing user processes and no pending hardware requests, the kernel executes the privileged <code>HLT</code> instruction, entering an idle power-saving state until an external interrupt wakes the core.
      </p>

      <h3>Hardware Interrupt Architecture</h3>
      <p>
        Peripherals communicate with the CPU using electrical Interrupt Request (IRQ) lines routed through an <strong>Advanced Programmable Interrupt Controller (APIC)</strong>:
      </p>
      <ul>
        <li>
          <strong>Local APIC vs I/O APIC:</strong> In multi-core symmetric multiprocessing (SMP) machines, an I/O APIC collects interrupt lines from peripheral buses (PCIe, USB) and routes them across the system bus to the designated Local APIC attached to an individual CPU core.
        </li>
        <li>
          <strong>The Interrupt Descriptor Table (IDT):</strong> The CPU maintains an in-memory table of 256 interrupt gates pointed to by the privileged <code>IDTR</code> register. When an interrupt arrives, the APIC places an 8-bit interrupt vector number (0 to 255) on the bus.
          <ul>
            <li><strong>Vectors 0 - 31 (Processor Exceptions):</strong> Hardwired by the CPU architecture for synchronous faults and aborts (Vector 0: Divide by Zero, Vector 13: General Protection Fault, Vector 14: Page Fault).</li>
            <li><strong>Vectors 32 - 255 (User & Device Interrupts):</strong> Assigned by the operating system kernel to peripheral hardware controllers and software trap gates.</li>
          </ul>
        </li>
      </ul>

      <h3>Top-Half vs Bottom-Half Interrupt Processing</h3>
      <p>
        A classical operating system design challenge is handling high-frequency interrupts (such as Gigabit Ethernet controllers receiving 1,000,000 packets per second) without locking the CPU.
      </p>
      <Callout type="key" title="The Hardirq Bottleneck">
        <p>
          When an Interrupt Service Routine (ISR) executes, hardware interrupts are masked (disabled) on that CPU core. If the ISR spends milliseconds parsing packet headers or copying data, incoming timer ticks and device interrupts are delayed or permanently lost.
        </p>
      </Callout>
      <p>
        Modern operating systems divide interrupt handling into two distinct operational phases:
      </p>
      <ol>
        <li>
          <strong>Top-Half (Hardirq / Immediate ISR):</strong> Executes in interrupt context with local interrupts masked. It performs the bare minimum required by the hardware: reads the device status register, clears the device interrupt pin, enqueues the raw data into a kernel buffer, schedules the bottom half, and immediately returns. Execution time is typically under 5 microseconds.
        </li>
        <li>
          <strong>Bottom-Half (Deferred Execution / Softirqs / Workqueues):</strong> Executes asynchronously with hardware interrupts fully re-enabled. It processes the buffered data, checks protocol integrity, allocates memory buffers, and unblocks sleeping user-space threads.
        </li>
      </ol>

      <ComparisonTable {...topBottomHalfTable} />

      <p>
        Below is a Linux device driver fragment illustrating this division of responsibility:
      </p>
      <CodeBlock language="text" code={kernelDriverInterruptCode} />

      <h2>3. Direct Memory Access (DMA) Deep-Dive</h2>
      <p>
        In early systems, all data transfer between peripheral devices and main memory relied on <strong>Programmed I/O</strong> or <strong>Interrupt-Driven I/O</strong>. In both models, every single byte or 32-bit word had to travel through CPU registers (<code>IN</code>, <code>OUT</code>, or <code>MOV</code>), wasting processor cycles on data transit.
      </p>

      <ComparisonTable {...ioMechanismsTable} />

      <h3>DMA Controller Architecture & Operation</h3>
      <p>
        A <strong>Direct Memory Access (DMA) Controller</strong> contains dedicated hardware channels equipped with three primary registers:
      </p>
      <ul>
        <li><strong>Memory Address Register (MAR):</strong> Holds the physical RAM address to which or from which data will be transferred.</li>
        <li><strong>Byte Count Register (BCR):</strong> Holds the total number of bytes remaining to be transferred.</li>
        <li><strong>Control & Status Register (CSR):</strong> Specifies the transfer direction (read vs write), block size, and transfer mode.</li>
      </ul>

      <h3>DMA Transfer Modes</h3>
      <ol>
        <li>
          <strong>Burst Mode (Block Transfer):</strong> The DMA controller seizes continuous control of the system memory bus and transfers an entire contiguous block of data without releasing the bus. The CPU is completely locked out of main memory during the burst (though it can continue executing instructions cached in L1/L2 SRAM).
        </li>
        <li>
          <strong>Cycle Stealing Mode:</strong> The DMA controller observes CPU bus cycles. When the CPU is executing an internal instruction phase (such as ALU multiplication or register shifting) that does not require the memory bus, the DMA controller "steals" that single bus cycle to transfer one word. This interleaves data transfer with CPU execution with negligible CPU slowdown.
        </li>
        <li>
          <strong>Transparent Mode:</strong> The DMA controller only transfers data when the CPU is completely stalled or performing an operation that does not utilize the external bus.
        </li>
      </ol>

      <Callout type="mistake" title="DMA Cache Coherency Pitfall">
        <p>
          Because the DMA controller writes directly to physical DRAM bypassing the CPU core, CPU cache lines (L1/L2/L3) corresponding to that memory address can become stale. Modern operating systems and chipset hardware must enforce <strong>cache coherency</strong> using bus snooping or explicit cache flushing instructions (such as <code>clflush</code> on x86) before and after DMA operations to prevent the CPU from reading stale data.
        </p>
      </Callout>

      <h2>4. Hardware Memory Protection: Base and Limit Registers</h2>
      <p>
        Before full virtual memory paging was developed, early multiprogramming architectures enforced spatial isolation using two hardware registers managed exclusively by the operating system kernel:
      </p>

      <div className="my-6 p-5 border rounded-lg bg-surface dark:bg-night-surface border-line dark:border-night-line font-mono text-sm">
        <p className="font-bold text-base mb-2 font-sans">Hardware Address Translation & Validation Flow:</p>
        <p>1. CPU Generates: Logical Address [LA]</p>
        <p>2. Hardware Check: IF (LA &gt;= Limit Register) THEN TRAP [General Protection Fault]</p>
        <p>3. Translation: Physical Address = LA + Base Register</p>
        <p>4. Memory Bus: Issue Read/Write to Physical Address in RAM</p>
      </div>

      <h3>Worked Example: Memory Protection Boundary Check</h3>
      <p>
        Suppose an operating system allocates a memory partition to Process 42 with the following hardware register values:
      </p>
      <ul>
        <li><code>Base Register</code> = <code>0x00400000</code> (Physical address 4,194,304 bytes / 4 MB)</li>
        <li><code>Limit Register</code> = <code>0x00080000</code> (Partition size of 524,288 bytes / 512 KB)</li>
      </ul>
      <p>
        Evaluate the hardware response for the following two logical memory accesses generated by Process 42:
      </p>
      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Access 1: Logical address <code>0x00045000</code></strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p>Validation: 0 &lt;= 0x00045000 &lt; 0x00080000 (282,624 &lt; 524,288) [Passed]</p>
            <p className="font-semibold text-brand dark:text-night-brand text-base">
              Physical Address = 0x00045000 + 0x00400000 = 0x00445000
            </p>
          </div>
          <p className="text-sm opacity-80">Result: The hardware Memory Management Unit safely executes the physical RAM read/write.</p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Access 2: Logical address <code>0x00092000</code></strong>
          <div className="font-mono text-sm my-2 space-y-1">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Validation: 0x00092000 &gt;= 0x00080000 (598,016 &gt;= 524,288) [Failed]
            </p>
          </div>
          <p className="text-sm opacity-80">Result: The MMU aborts the bus transaction before it reaches physical DRAM, flips the CPU into Ring 0, and raises a hardware trap (SIGSEGV) to abort the offending process.</p>
        </li>
      </ul>

      <h2>5. I/O Protection and Privilege Levels</h2>
      <p>
        To prevent user applications from directly reprogramming disk controllers or reading raw network packets, all I/O instructions must be protected by hardware:
      </p>
      <ul>
        <li>
          <strong>I/O Privilege Level (IOPL):</strong> On x86 processors, bits 12 and 13 of the <code>EFLAGS</code> register hold the IOPL. User-space programs execute with Current Privilege Level (CPL) = 3 and IOPL = 0. Attempting to execute direct I/O port instructions (<code>IN</code>, <code>OUT</code>, <code>INS</code>, <code>OUTS</code>) when CPL &gt; IOPL causes an immediate General Protection Fault.
        </li>
        <li>
          <strong>I/O Permission Bitmap (IOPB):</strong> For granular port sharing, modern x86 hardware provides an I/O Permission Bitmap inside the kernel's Task State Segment (TSS). Each bit represents one of the 65,536 available I/O ports. A user-mode process can access a specific hardware port only if the operating system explicitly clears the corresponding bit for that process using the <code>ioperm()</code> system call.
        </li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you trace the system bootstrap sequence from the CPU reset vector through POST, bootloader, mode switch, and PID 1?</li>
        <li>Can you explain why hardware interrupt handlers are split into Top-Half and Bottom-Half routines?</li>
        <li>Can you compare Programmed I/O, Interrupt-Driven I/O, and Direct Memory Access across CPU load, speed, and hardware cost?</li>
        <li>Can you perform mathematical address translation and bounds checks using Base and Limit register values?</li>
        <li>Can you explain how the x86 processor uses IOPL flags and the TSS I/O permission bitmap to prevent untrusted hardware port manipulation?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://www.oreilly.com/library/view/understanding-the-linux/0596005652/">Understanding the Linux Kernel (Bovet & Cesati)</a> - Chapters on Interrupts, Exceptions, and DMA bus mastering.
        </li>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Arpaci-Dusseau)</a> - Chapters on Hardware Protection and I/O Devices.
        </li>
        <li>
          <a href="https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html">Intel 64 and IA-32 Architectures Software Developer Manual (Volume 3A: System Programming Guide)</a> - Detailed specifications for APIC, IDT gates, and Task State Segments.
        </li>
      </ul>
    </>
  )
}
