import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const syncComparisonTable = {
    caption: 'Disk Flushing System Calls Comparison',
    headers: ['System Call', 'Data Flushed', 'Metadata Flushed', 'Primary Enterprise Use Case', 'Performance Cost'],
    rows: [
      [
        'sync()',
        'All dirty blocks across all filesystems.',
        'All dirty metadata across all volumes.',
        'System shutdown, periodic kernel flusher thread invocation.',
        'Extremely high (system-wide I/O spike).'
      ],
      [
        'fsync(fd)',
        'Dirty data blocks of specified file descriptor fd.',
        'All metadata: file length, timestamps (atime, mtime), permissions.',
        'Mission-critical financial transactions; strict persistence guarantee.',
        'High (requires extra disk seeks to update inode blocks).'
      ],
      [
        'fdatasync(fd)',
        'Dirty data blocks of specified file descriptor fd.',
        'Only metadata essential for retrieval (file size). Skips atime/mtime.',
        'High-performance database Write-Ahead Logs (PostgreSQL, MySQL, SQLite).',
        'Optimized (flushes only data blocks, avoiding redundant inode seeks).'
      ]
    ]
  }

  const zeroCopyComparisonTable = {
    caption: 'Data Transfer Pipelines: Traditional vs Zero-Copy Architecture',
    headers: ['Architecture', 'Context Switches', 'CPU Memory Copies', 'DMA Bus Copies', 'Primary Performance Limiter'],
    rows: [
      [
        'Traditional read() + write()',
        '4 context switches (2 read, 2 write)',
        '2 CPU copies (Page Cache &rarr; User &rarr; Socket)',
        '2 DMA copies (Disk &rarr; RAM &rarr; NIC)',
        'Memory bus saturation & CPU cache thrashing'
      ],
      [
        'Vectored I/O (readv / writev)',
        '2 context switches per batch',
        'Copies multiple user arrays directly',
        '2 DMA copies',
        'CPU memory copying overhead persists'
      ],
      [
        'Zero-Copy sendfile()',
        '2 context switches (1 call in, 1 out)',
        '0 CPU copies (with Scatter-Gather DMA)',
        '2 DMA copies (Disk &rarr; Page Cache &rarr; NIC)',
        'NIC hardware link speed / network bandwidth'
      ],
      [
        'Kernel Bypass (DPDK / SPDK)',
        '0 context switches (pure user space polling)',
        '0 CPU copies',
        'Direct hardware DMA to user ring buffers',
        'Physical PCIe bus & memory controller throughput'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        The Kernel I/O Subsystem coordinates device scheduling, memory caching, data buffering,
        and performance engineering across the operating system. This comprehensive guide covers
        mathematical speedup derivations for double buffering, the Unified Page Cache, writeback synchronization
        calls, traditional data copy bottlenecks, Zero-Copy architectures, and sub-microsecond Kernel Bypass.
      </p>

      <h2>1. Kernel I/O Subsystem Core Services</h2>
      <p>
        The operating system kernel provides centralized management services to harmonize mismatched speeds,
        coordinate shared access, and maximize hardware utilization:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Core Services of the Kernel I/O Subsystem
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">1. I/O Scheduling</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Reorders pending disk requests to minimize physical head travel and enforce fairness across threads.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-accent dark:text-night-accent">2. Buffering</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Absorbs speed mismatches between fast producers and slow consumers, supporting copy semantics during transmission.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success">3. Caching</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Retains copies of recently read disk blocks in high-speed RAM to eliminate physical storage accesses.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-danger dark:text-night-danger">4. Spooling</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Manages non-shareable sequential output devices (printers) by staging print jobs in intermediate disk files.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-ink dark:text-night-ink">5. Device Reservation</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Allocates exclusive device locks, coordinating access to dedicated serial ports or tape drives without deadlocks.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">6. Error Handling</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Coordinates SCSI/NVMe sense codes, retries transient parity errors, and remaps defective disk sectors automatically.
            </p>
          </div>
        </div>
      </div>

      <h2>2. Buffering Architectures and Mathematical Analysis</h2>
      <p>
        Buffering decouples hardware device speed from CPU computational speed.
        The operating system employs three primary buffering schemes:
      </p>
      <ul>
        <li>
          <strong>Single Buffering:</strong> The operating system assigns a single memory buffer in kernel space.
          The user process halts while the device transfers a block into this buffer. Once complete, data is copied
          to user memory, during which the hardware device stays idle. No overlap between I/O and CPU computation occurs.
        </li>
        <li>
          <strong>Double Buffering (Ping-Pong Buffering):</strong> The kernel allocates two alternating buffers (Buffer A and Buffer B).
          While the DMA controller fills Buffer A with incoming data from the device, the CPU concurrently processes and executes logic
          on Buffer B. When both finish, their roles swap.
        </li>
        <li>
          <strong>Circular Buffering:</strong> A fixed ring queue of three or more buffers.
          Employed when input arrivals are bursty: the circular queue absorbs sudden bursts of packets or sensor readings
          without dropping frames while the consumer CPU works down the backlog.
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Mathematical Derivation: Execution Time and Speedup in Double Buffering
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">System Variables:</div>
            <div>T = Time required for device to transfer one block into memory</div>
            <div>C = Time required for CPU to compute / process one block</div>
            <div>M = Time required to copy data from system buffer to user space</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Comparative Execution Times per Block:</div>
            <div>
              <strong>Case 1: Unbuffered System (Sequential Execution)</strong><br />
              Time per Block = T + C
            </div>
            <div>
              <strong>Case 2: Single-Buffered System</strong><br />
              Time per Block = max(T, C) + M
            </div>
            <div>
              <strong>Case 3: Double-Buffered System (Complete Hardware Overlap)</strong><br />
              Assuming copy time M is handled by DMA or zero-copy:<br />
              Time per Block = <strong>max(T, C)</strong>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-success dark:text-night-success font-sans">Worked Practical Example:</div>
            <div>Let Transfer Time T = 12 ms, and CPU Compute Time C = 8 ms.</div>
            <div>Unbuffered Time = 12 ms + 8 ms = <strong>20 ms per block</strong></div>
            <div>Double-Buffered Time = max(12, 8) = <strong>12 ms per block</strong></div>
            <div className="text-success dark:text-night-success font-bold text-sm pt-1">
              Throughput Improvement = ((20 - 12) / 12) &times; 100% = 66.7% Speedup!
            </div>
          </div>
        </div>
      </div>

      <h2>3. The Unified Page Cache and Writeback Synchronization</h2>
      <p>
        In modern Linux systems, disk block caching and virtual memory page management are unified in the
        <strong>Unified Page Cache</strong>:
      </p>
      <ul>
        <li>
          <strong>Write Caching:</strong> When an application invokes <code>write()</code>, bytes are copied into the Page Cache
          in physical RAM, the page is flagged as <em>dirty</em>, and the system call returns immediately.
        </li>
        <li>
          <strong>Dirty Page Writeback:</strong> Kernel flusher threads (e.g., <code>kswapd</code>, <code>wb_workfn</code>)
          traverse the page cache in the background, flushing dirty pages to non-volatile storage when the ratio of dirty memory
          exceeds <code>vm.dirty_background_ratio</code> or when dirty data ages beyond 30 seconds.
        </li>
      </ul>

      <h3>Comparison of Disk Synchronization Primitives</h3>
      <p>
        Because dirty writes reside in RAM, applications that require durability (such as database engines)
        must force data to non-volatile disk platters or flash cells:
      </p>

      <ComparisonTable {...syncComparisonTable} />

      <h2>4. Traditional I/O Bottlenecks vs Zero-Copy Architectures</h2>
      <p>
        In high-throughput server applications (such as static web servers or reverse proxies streaming files over HTTP),
        traditional <code>read()</code> and <code>write()</code> system calls create severe performance bottlenecks:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-2 font-sans">
          The Four Data Copies and Four Context Switches of Traditional I/O
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1">
          <div>1. App calls read() &rarr; Context switch to kernel (Switch 1)</div>
          <div>2. DMA copies disk sector to Kernel Page Cache (Copy 1: DMA)</div>
          <div>3. CPU copies Page Cache data to User Memory Buffer (Copy 2: CPU)</div>
          <div>4. read() returns to user space &rarr; Context switch back (Switch 2)</div>
          <div>5. App calls write() &rarr; Context switch to kernel (Switch 3)</div>
          <div>6. CPU copies User Memory Buffer to Kernel Socket Buffer (Copy 3: CPU)</div>
          <div>7. write() returns to user space &rarr; Context switch back (Switch 4)</div>
          <div>8. DMA copies Socket Buffer to Network Interface Card (Copy 4: DMA)</div>
          <div className="text-danger dark:text-night-danger font-bold pt-1">
            Total Penalty: 4 Context Switches + 2 Redundant CPU Memory Copies!
          </div>
        </div>
      </div>

      <h3>The Zero-Copy Solution: sendfile() and splice()</h3>
      <p>
        The Linux <code>sendfile()</code> system call eliminates the CPU copy completely:
      </p>
      <ul>
        <li>
          <strong>Direct Kernel Transfer:</strong> The application issues <code>sendfile(socket_fd, file_fd, &amp;offset, count)</code>.
          Data moves directly from the Page Cache into the socket buffer inside kernel space.
        </li>
        <li>
          <strong>Scatter-Gather DMA:</strong> If the NIC supports Scatter-Gather DMA, the kernel avoids copying payload bytes
          even within kernel memory. It merely passes page frame pointers to the NIC, which reads directly from the Page Cache via DMA.
        </li>
        <li>
          <strong>Net Result:</strong> Exactly 2 context switches, 0 CPU data copies, and massive savings in CPU cache bandwidth.
        </li>
      </ul>

      <ComparisonTable {...zeroCopyComparisonTable} />

      <h2>5. Kernel Bypass: DPDK and SPDK</h2>
      <p>
        For next-generation 100 Gbps networks and million-IOPS NVMe flash drives, the operating system kernel itself
        becomes the primary latency bottleneck. System call overhead, interrupt latencies, and kernel scheduler queues
        limit throughput.
      </p>
      <p>
        <strong>Kernel Bypass</strong> architectures (such as Intel DPDK for networking and SPDK for NVMe storage)
        completely eliminate the OS kernel from the active data path:
      </p>
      <ul>
        <li>
          <strong>User-Space Drivers:</strong> PCIe configuration registers and DMA descriptor rings are unbinded from kernel drivers
          and mapped directly into user process memory via Linux VFIO.
        </li>
        <li>
          <strong>Poll-Mode Drivers (PMD):</strong> Dedicated CPU cores execute tight polling loops directly on hardware ring pointers,
          eliminating 100% of interrupts, context switches, and system call traps.
        </li>
        <li>
          <strong>HugePages:</strong> Allocates 2 MB or 1 GB memory pages to eliminate page faults and minimize TLB misses.
        </li>
        <li>
          <strong>Performance Profile:</strong> Achieves sub-microsecond latency and handles over 100 million packets per second
          or 10 million storage IOPS on standard commodity server processors.
        </li>
      </ul>

      <FAQ items={questions} />
    </>
  )
}
