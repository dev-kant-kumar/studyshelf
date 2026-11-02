import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const deviceClassificationTable = {
    caption: 'Operating System Device Classifications and Kernel Interfaces',
    headers: ['Device Category', 'Data Transfer Unit', 'Access Pattern', 'Kernel Subsystem & Caching', 'Representative Hardware'],
    rows: [
      [
        'Block Device',
        'Fixed-size blocks (512 B to 4 KB).',
        'Random-access; can seek to any block offset independently.',
        'Managed by Block Layer and Page Cache; read-ahead and write-behind buffering.',
        'NVMe Solid-State Drives, SATA HDDs, USB flash drives, SD cards.'
      ],
      [
        'Character Device',
        'Stream of individual bytes (unstructured).',
        'Sequential stream; random seek is generally not supported.',
        'Direct unbuffered or ring-buffered byte queues without Page Cache.',
        'Keyboards, computer mice, serial consoles, audio DSPs, pseudoterminals.'
      ],
      [
        'Network Device',
        'Discrete packets / frames of variable length.',
        'Asynchronous stream via socket endpoints (send/recv).',
        'Socket buffers (sk_buff in Linux); protocol stacks (TCP/IP) manage ordering.',
        'Gigabit Ethernet controllers (NIC), Wi-Fi transceivers, cellular modems.'
      ]
    ]
  }

  const ioModelsTable = {
    caption: 'Comparative Analysis of Kernel Input/Output Execution Models',
    headers: ['I/O Execution Model', 'Thread State During Transfer', 'Kernel Return Behavior', 'Programming Complexity', 'Ideal Systems Workload'],
    rows: [
      [
        'Synchronous Blocking',
        'Thread is suspended (WAITING state) until transfer finishes.',
        'Returns with populated buffer and byte count when data is in RAM.',
        'Simple, linear sequential code flow.',
        'Simple scripts, CLI tools, compute threads with dedicated disk readers.'
      ],
      [
        'Non-Blocking (O_NONBLOCK)',
        'Thread remains RUNNING; continuously polls device status.',
        'Returns immediately with data or -1 (errno set to EAGAIN / EWOULDBLOCK).',
        'Moderate; requires polling loop or sleep backoff to prevent 100% CPU burn.',
        'Real-time audio processing loops where threads cannot afford to block.'
      ],
      [
        'I/O Multiplexing (epoll)',
        'Thread sleeps waiting on an event demultiplexer (epoll_wait).',
        'Unblocks when one or more file descriptors become ready for read/write.',
        'High; requires event-driven state machines and reactor architectures.',
        'High-concurrency web servers (Nginx, Node.js, Netty) handling 100K+ connections.'
      ],
      [
        'Asynchronous I/O (io_uring)',
        'Thread remains RUNNING; does not block on submission or transfer.',
        'Kernel completes DMA and copies data; notifies user via completion queue.',
        'Highest; ring-buffer coordination and zero-copy memory management.',
        'Ultra-high performance NVMe database storage engines (RocksDB, ScyllaDB).'
      ]
    ]
  }

  const storageHierarchyTable = {
    caption: 'The Complete Computer Storage Hierarchy: Latency, Bandwidth, and Volatility',
    headers: ['Hierarchy Level', 'Typical Capacity', 'Access Latency (ns)', 'Normalized Relative Latency', 'Managed By', 'Volatility'],
    rows: [
      [
        'CPU Registers',
        '~1 KB per core',
        '0.5 ns',
        '1x (Instantaneous baseline)',
        'Compiler / Assembly Instruction',
        'Volatile'
      ],
      [
        'L1 Cache (Instruction/Data)',
        '32 KB - 64 KB per core',
        '1.0 - 1.5 ns',
        '2x - 3x',
        'CPU Hardware Cache Controller',
        'Volatile'
      ],
      [
        'L2 Cache',
        '512 KB - 1 MB per core',
        '3.0 - 5.0 ns',
        '6x - 10x',
        'CPU Hardware Cache Controller',
        'Volatile'
      ],
      [
        'L3 Cache (Shared Die)',
        '16 MB - 96 MB',
        '10 - 20 ns',
        '20x - 40x',
        'CPU Hardware Cache Controller',
        'Volatile'
      ],
      [
        'Main Memory (DRAM)',
        '16 GB - 256 GB',
        '60 - 100 ns',
        '120x - 200x',
        'Operating System Virtual Memory',
        'Volatile'
      ],
      [
        'NVMe Solid-State Drive',
        '512 GB - 4 TB',
        '10,000 - 30,000 ns (10-30 us)',
        '20,000x - 60,000x',
        'OS File System / NVMe Driver',
        'Non-Volatile'
      ],
      [
        'Mechanical Hard Disk (HDD)',
        '2 TB - 24 TB',
        '5,000,000 - 10,000,000 ns (5-10 ms)',
        '10,000,000x - 20,000,000x',
        'OS File System / Disk Scheduler',
        'Non-Volatile'
      ],
      [
        'Cloud / Tape Archive',
        'Petabytes to Exabytes',
        '100,000,000+ ns (100+ ms to minutes)',
        '200,000,000x+',
        'Distributed Storage Protocols',
        'Non-Volatile'
      ]
    ]
  }

  const epollExampleCode = `// Linux C Demonstration: Setting Non-Blocking I/O and epoll Event Multiplexing
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/epoll.h>
#include <errno.h>

#define MAX_EVENTS 10

int set_nonblocking(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);
    if (flags == -1) return -1;
    return fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

int main() {
    int epoll_fd = epoll_create1(0);
    struct epoll_event ev, events[MAX_EVENTS];

    // Set standard input (stdin) to non-blocking mode
    set_nonblocking(STDIN_FILENO);

    ev.events = EPOLLIN | EPOLLET; // Edge-triggered read
    ev.data.fd = STDIN_FILENO;
    epoll_ctl(epoll_fd, EPOLL_CTL_ADD, STDIN_FILENO, &ev);

    printf("Waiting for asynchronous I/O event without thread blocking...\\n");
    int nfds = epoll_wait(epoll_fd, events, MAX_EVENTS, 5000); // 5s timeout

    if (nfds > 0) {
        char buffer[128];
        ssize_t bytes = read(STDIN_FILENO, buffer, sizeof(buffer) - 1);
        if (bytes > 0) {
            buffer[bytes] = '\\0';
            printf("Read %zd bytes asynchronously: %s", bytes, buffer);
        }
    } else {
        printf("Timeout reached: No I/O ready.\\n");
    }

    close(epoll_fd);
    return 0;
}`

  return (
    <>
      <p>
        The primary purpose of an operating system is to execute user programs while abstracting and optimizing the underlying physical storage and input/output machinery. A software engineer writing high-performance backend software, database engines, or distributed systems cannot treat storage as a uniform, infinite black box. For MCA students preparing for university papers and core systems interviews, mastering I/O structure and the storage hierarchy requires understanding physical access latencies, caching mathematics, and kernel buffering semantics.
      </p>

      <h2>What you will learn</h2>
      <ul>
        <li>I/O hardware architecture: Ports, buses (PCIe, SATA, USB), device controllers, and memory-mapped vs port-mapped I/O.</li>
        <li>The Kernel I/O subsystem: Device drivers, block vs character vs network device abstractions.</li>
        <li>I/O execution models: Synchronous blocking, non-blocking polling, event demultiplexing (epoll), and asynchronous I/O (io_uring).</li>
        <li>Subsystem services: Buffering (speed/size matching), Page Caching, dirty page writeback, spooling, and error handling.</li>
        <li>The complete storage hierarchy: Physical latencies, temporal vs spatial locality, and Effective Memory Access Time (EMAT) derivations.</li>
        <li>Secondary storage physical mechanics: Magnetic disk physics (seek time, rotational delay, transfer time) vs Solid-State Drive architecture (NAND flash pages, block erasures, FTL, and Wear Leveling).</li>
      </ul>

      <h2>1. I/O Hardware Architecture</h2>
      <p>
        A computer communicates with the external world through physical peripheral controllers connected to the central processor via system buses:
      </p>
      <ul>
        <li>
          <strong>Device Controller:</strong> An electronic chip or circuit board (such as an NVMe host controller, SATA AHCI controller, or GPU) that manages the physical device. It contains local buffer storage and a set of specialized hardware registers:
          <ul>
            <li><code>Data-in / Data-out Registers:</code> Used to exchange data bytes with the CPU or memory.</li>
            <li><code>Status Register:</code> Read by the host to inspect flags (e.g., Device Busy, Error Detected, Transfer Complete).</li>
            <li><code>Control Register:</code> Written by the host to command the device (e.g., Start Read, Enable Interrupts, Reset).</li>
          </ul>
        </li>
        <li>
          <strong>Bus Topologies:</strong> High-speed point-to-point interconnects (such as PCIe 5.0 delivering up to 64 GB/s across 16 lanes) connect high-bandwidth devices to the CPU root complex, while slower shared buses (SATA, USB) multiplex low-throughput peripherals.
        </li>
      </ul>

      <h3>Memory-Mapped I/O vs Port-Mapped (Isolated) I/O</h3>
      <p>
        CPUs communicate with controller registers through two distinct architectural models:
      </p>
      <ul>
        <li>
          <strong>Port-Mapped I/O (Isolated I/O):</strong> The CPU architecture provides a separate electrical bus line and dedicated assembly instructions (<code>IN</code> and <code>OUT</code> on x86). The I/O address space is entirely distinct from physical memory addresses.
        </li>
        <li>
          <strong>Memory-Mapped I/O (MMIO):</strong> Device controller registers and local buffers are mapped directly into the CPU physical memory address space. The CPU reads and writes device registers using standard memory instructions (<code>MOV</code>, <code>LDR</code>, <code>STR</code>). The hardware Memory Management Unit (MMU) marks these pages as uncacheable (strongly ordered) to ensure reads and writes immediately reach the physical device registers without being trapped in CPU L1/L2 caches.
        </li>
      </ul>

      <h2>2. Device Drivers and Kernel Abstraction Layers</h2>
      <p>
        Because hardware controllers vary wildly in electrical protocols, timings, and command registers, the operating system kernel provides a uniform abstraction layer through <strong>Device Drivers</strong>.
      </p>
      <p>
        The kernel categorizes all hardware peripherals into three fundamental device classes:
      </p>

      <ComparisonTable {...deviceClassificationTable} />

      <h2>3. I/O Execution Models: From Blocking to Asynchronous</h2>
      <p>
        How an application interacts with device I/O dictates the concurrency and throughput ceiling of the entire software system:
      </p>

      <ComparisonTable {...ioModelsTable} />

      <p>
        Below is how high-performance systems use non-blocking descriptors with <code>epoll</code> to handle thousands of concurrent streams on a single CPU thread:
      </p>
      <CodeBlock language="text" code={epollExampleCode} />

      <h2>4. Kernel I/O Subsystem Services</h2>
      <p>
        The kernel I/O subsystem provides common services that shield application developers from low-level hardware constraints:
      </p>
      <ol>
        <li>
          <strong>I/O Scheduling:</strong> The kernel reorders pending block requests in the request queue to minimize physical disk head movement (e.g. elevator algorithms like SCAN and C-SCAN) or enforce fairness across processes (e.g. BFQ / Kyber schedulers for NVMe SSDs).
        </li>
        <li>
          <strong>Buffering:</strong> A buffer is a memory area in RAM that holds data during transit. Buffering addresses three distinct problems:
          <ul>
            <li><em>Speed Mismatch:</em> Slow internet packets arrive byte-by-byte into a buffer before being consumed in bulk by an application.</li>
            <li><em>Transfer Size Mismatch:</em> An application writing 100 bytes at a time is accumulated into a 4 KB buffer before being flushed as an aligned physical block write.</li>
            <li><em>Copy Semantics:</em> When an application calls <code>write(fd, buffer, len)</code>, the kernel copies the data into kernel memory before returning. The user program can immediately overwrite its buffer without corrupting the in-flight disk write.</li>
          </ul>
        </li>
        <li>
          <strong>Caching:</strong> Unlike a buffer (which merely holds data in transit), a <strong>Cache</strong> keeps a persistent copy of frequently accessed disk blocks in fast RAM. The Linux <strong>Page Cache</strong> caches file data in unallocated RAM frames. Read requests for cached pages are satisfied at memory bus speeds (~100 ns) instead of secondary storage speeds (~10 &mu;s). Modified pages are marked as <strong>dirty pages</strong> and asynchronously flushed to disk by background kernel flusher threads (or forced synchronously via <code>fsync()</code>).
        </li>
        <li>
          <strong>Spooling:</strong> Manages non-shareable sequential devices (such as label printers or plotting hardware) that cannot interleave data from concurrent programs.
        </li>
        <li>
          <strong>Device Reservation & Error Handling:</strong> Enforces exclusive access locks where necessary and provides robust retry logic, timeout recovery, and bad sector remapping when underlying hardware fails.
        </li>
      </ol>

      <h2>5. The Complete Computer Storage Hierarchy</h2>
      <p>
        Storage architectures are governed by fundamental physical trade-offs: smaller, faster memories are economically expensive and consume high electrical power, while larger, non-volatile memories are cheaper but substantially slower.
      </p>

      <ComparisonTable {...storageHierarchyTable} />

      <h3>Principles of Locality</h3>
      <p>
        The entire storage hierarchy functions effectively because real-world software workloads exhibit two forms of the <strong>Principle of Locality</strong>:
      </p>
      <ul>
        <li>
          <strong>Temporal Locality (Locality in Time):</strong> If a memory location is referenced at time $t$, it is highly probable that the exact same location will be referenced again in the near future (e.g., loop control counters, accumulator variables, small function code).
        </li>
        <li>
          <strong>Spatial Locality (Locality in Space):</strong> If a memory location at address $A$ is referenced, it is highly probable that nearby memory locations ($A + 1, A + 2$) will be referenced soon (e.g., sequential array iterations, contiguous instruction execution, row-major matrix traversals).
        </li>
      </ul>

      <h3>Effective Memory Access Time (EMAT) Mathematical Derivation</h3>
      <p>
        Consider a hierarchical memory subsystem consisting of an ultra-fast Cache and primary Main Memory (RAM):
      </p>
      <ul>
        <li>Let <code>t<sub>c</sub></code> = Cache Access Latency (e.g., 2 ns)</li>
        <li>Let <code>t<sub>m</sub></code> = Main Memory Access Latency (e.g., 80 ns)</li>
        <li>Let <code>h</code> = Cache Hit Ratio (fraction of accesses satisfied by cache, where 0 &lt;= h &lt;= 1)</li>
        <li>Miss Ratio = <code>1 - h</code></li>
      </ul>
      <p>
        In a sequential lookup model (where the CPU checks cache first, and on a miss, accesses main memory), the Effective Memory Access Time (EMAT) is formulated as:
      </p>

      <div className="my-6 p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
        <p className="font-mono text-center font-semibold text-brand dark:text-night-brand text-lg">
          EMAT = (h &times; t<sub>c</sub>) + ((1 - h) &times; (t<sub>c</sub> + t<sub>m</sub>))
        </p>
        <p className="font-mono text-center text-sm opacity-80 mt-1">
          Simplified for parallel lookups: EMAT = (h &times; t<sub>c</sub>) + ((1 - h) &times; t<sub>m</sub>)
        </p>
      </div>

      <h3>Worked Calculations: The Non-Linear Power of Hit Ratios</h3>
      <p>
        Suppose a server has cache access latency <code>t<sub>c</sub> = 2 ns</code> and main memory latency <code>t<sub>m</sub> = 80 ns</code>. Evaluate how hit ratio improvements impact average access latency:
      </p>

      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Case 1: Baseline Hit Ratio h = 80% (0.80)</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            EMAT = (0.80 &times; 2 ns) + (0.20 &times; (2 ns + 80 ns))
          </div>
          <div className="font-mono text-sm pl-4 opacity-90">
            EMAT = 1.6 ns + (0.20 &times; 82 ns) = 1.6 ns + 16.4 ns = 18.0 ns
          </div>
          <div className="text-sm opacity-80 mt-1">
            Result: Average memory access penalty is 18.0 ns.
          </div>
        </li>

        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Case 2: Optimized Hit Ratio h = 95% (0.95)</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            EMAT = (0.95 &times; 2 ns) + (0.05 &times; (2 ns + 80 ns))
          </div>
          <div className="font-mono text-sm pl-4 opacity-90">
            EMAT = 1.9 ns + (0.05 &times; 82 ns) = 1.9 ns + 4.1 ns = 6.0 ns
          </div>
          <div className="text-sm opacity-80 mt-1">
            Result: Average access latency drops by 3x (from 18.0 ns to 6.0 ns).
          </div>
        </li>

        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>Case 3: High-Locality Hit Ratio h = 99% (0.99)</strong>
          <div className="font-mono text-base my-2 font-semibold text-brand dark:text-night-brand">
            EMAT = (0.99 &times; 2 ns) + (0.01 &times; (2 ns + 80 ns))
          </div>
          <div className="font-mono text-sm pl-4 opacity-90">
            EMAT = 1.98 ns + (0.01 &times; 82 ns) = 1.98 ns + 0.82 ns = 2.80 ns
          </div>
          <div className="text-sm opacity-80 mt-1">
            Result: Access speed approaches near-pure cache latency (2.80 ns).
          </div>
        </li>
      </ul>

      <h2>6. Secondary Storage Physics: Magnetic Disks vs Solid-State Drives</h2>

      <h3>Magnetic Hard Disk Drives (HDD) Mechanics</h3>
      <p>
        A traditional mechanical hard drive consists of rigid circular platters coated with magnetic material, spinning on a spindle at high rotational speeds (typically 5,400 to 15,000 RPM).
      </p>
      <p>
        Total Disk Access Time is the sum of three physical operations:
      </p>

      <div className="my-6 p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
        <p className="font-mono text-center font-semibold text-brand dark:text-night-brand text-lg">
          Total Disk Access Time = Seek Time + Rotational Latency + Transfer Time
        </p>
      </div>

      <ul className="space-y-4 my-4">
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>1. Seek Time (T<sub>seek</sub>):</strong>
          <p className="text-sm my-1">
            The mechanical time required for the actuator arm to accelerate, move across platters, and stabilize the read/write head over the target cylinder. Typically 3 ms to 9 ms.
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>2. Rotational Latency (T<sub>rot</sub>):</strong>
          <p className="text-sm my-1">
            The time required for the target sector to spin under the read/write head. On average, the platter must rotate through half a full circle:
          </p>
          <div className="font-mono text-sm font-semibold text-brand dark:text-night-brand pl-4 my-1">
            Average Rotational Latency = 1 / (2 &times; Rotational Speed in RPS)
          </div>
          <p className="text-sm opacity-80 pl-4">
            Example for 7,200 RPM drive: 7,200 / 60 = 120 rev/s. Latency = 1 / (2 &times; 120) = 4.17 ms.
          </p>
        </li>
        <li className="p-4 rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
          <strong>3. Transfer Time (T<sub>trans</sub>):</strong>
          <div className="font-mono text-sm font-semibold text-brand dark:text-night-brand pl-4 my-1">
            Transfer Time = Bytes to Read or Write / Data Transfer Rate
          </div>
        </li>
      </ul>

      <h3>Solid-State Drives (NAND Flash) and Flash Translation Layer (FTL)</h3>
      <p>
        Solid-State Drives (SSDs) have no moving mechanical components, eliminating seek time and rotational latency. However, NAND flash introduces unique semiconductor physics:
      </p>
      <ul>
        <li>
          <strong>Asymmetric Read/Write vs Erase Granularity:</strong>
          <ul>
            <li>Data is read and written in units of <strong>Pages</strong> (typically 4 KB to 16 KB).</li>
            <li>Data can only be erased in units of <strong>Blocks</strong> (typically 128 to 512 pages / 2 MB to 8 MB).</li>
          </ul>
        </li>
        <li>
          <strong>No In-Place Overwrites:</strong> Once a NAND flash cell is programmed with electrons, it cannot be reprogrammed until the entire physical block containing it is erased.
        </li>
        <li>
          <strong>Out-of-Place Writes & Garbage Collection:</strong> When a file is updated, the SSD's <strong>Flash Translation Layer (FTL)</strong> writes the new data to a clean, previously erased page, updates its internal logical-to-physical mapping table, and marks the old physical page as invalid. When free erased blocks become scarce, background Garbage Collection must read valid pages out of a fragmented block, copy them to a new block, and erase the old block.
        </li>
        <li>
          <strong>Write Amplification Factor (WAF):</strong> Because Garbage Collection copies existing valid pages during block erasures, the physical bytes written to the flash silicon exceed the logical bytes written by the user operating system:
          <div className="font-mono text-sm font-semibold text-brand dark:text-night-brand pl-4 my-2">
            WAF = Physical Bytes Written to NAND / Logical Bytes Requested by OS
          </div>
        </li>
        <li>
          <strong>Wear Leveling:</strong> Each flash cell has a finite lifespan of Program/Erase (P/E) cycles (e.g. 1,000 to 3,000 cycles for TLC flash). The FTL implements dynamic and static wear leveling algorithms, distributing writes evenly across all physical flash blocks to prevent premature drive failure.
        </li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you explain the architectural difference between Port-Mapped I/O and Memory-Mapped I/O?</li>
        <li>Can you contrast Block, Character, and Network devices across transfer units and kernel caching mechanisms?</li>
        <li>Can you explain how non-blocking I/O and event demultiplexing (epoll) prevent thread starvation in high-concurrency servers?</li>
        <li>Can you derive the Effective Memory Access Time (EMAT) formula and calculate the access latency for given hit ratios?</li>
        <li>Can you detail the physical components of magnetic disk access time (Seek Time, Rotational Latency, Transfer Time)?</li>
        <li>Can you explain why NAND flash memory cannot be overwritten in place and define the Write Amplification Factor?</li>
      </ul>

      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Arpaci-Dusseau)</a> - Chapters on I/O Devices, Hard Disk Drives, and Flash-based SSDs.
        </li>
        <li>
          <a href="https://man7.org/linux/man-pages/man7/epoll.7.html">Linux Programmer's Manual: epoll(7)</a> - Complete reference for I/O event multiplexing in the Linux kernel.
        </li>
        <li>
          <a href="https://kernel.dk/io_uring.pdf">Efficient IO with io_uring (Jens Axboe)</a> - Official architecture whitepaper on modern asynchronous Linux I/O.
        </li>
      </ul>
    </>
  )
}
