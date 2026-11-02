const questions = [
  {
    id: 'kernel-io-subsystem-services-and-spooling',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'List the primary services provided by the Kernel I/O Subsystem. Explain Spooling and how it resolves device reservation for non-shareable peripherals.',
    answer: [
      'The Kernel I/O Subsystem encapsulates hardware abstraction and performance optimization services:',
      '1. I/O Scheduling: Reorders queued I/O requests to optimize device performance and avoid starvation.',
      '2. Buffering: Caches data in memory during transit to decouple speed mismatches between producer and consumer.',
      '3. Caching: Retains frequently read blocks in memory to eliminate physical device accesses.',
      '4. Spooling: Intercepts output directed to non-shareable devices and buffers it in intermediate disk files.',
      '5. Device Reservation: Enforces mutually exclusive access to dedicated hardware devices.',
      '6. Error Handling: Performs error recovery (retries, bad-sector reallocation) and reports hardware failures cleanly.',
      'Spooling (Simultaneous Peripheral Operations On-Line): Many hardware peripherals (such as printers, plotters, or tape drives) are strictly non-shareable: interleaved output from two concurrent processes would produce scrambled, useless output. Rather than blocking applications or creating deadlocks, the operating system intercepts print commands and redirects each process output into an individual temporary disk file (the spool file). The process completes execution immediately. A background daemon (the spooler) reads completed spool files one by one and streams them sequentially to the physical device.'
    ]
  },
  {
    id: 'buffering-techniques-and-double-buffering-derivation',
    level: 'medium',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Compare Single Buffering, Double Buffering (Ping-Pong), and Circular Buffering. Derive the execution time per block for unbuffered vs double-buffered systems where transfer time is T and compute time is C.',
    answer: [
      '1. Buffering Architectures:',
      'Single Buffering: The OS allocates one system buffer in kernel memory. While the device fills the buffer, the process must wait. Once full, data is copied to user memory; during this compute phase, the I/O device remains idle. Processing and transfer cannot proceed concurrently.',
      'Double Buffering (Ping-Pong Buffering): The OS allocates two alternating buffers (Buffer A and Buffer B). While the I/O device streams incoming data into Buffer A via DMA, the CPU concurrently processes and computes on the contents of Buffer B. When both finish, the roles swap. This completely decouples device transfer latency from CPU computation.',
      'Circular Buffering: A queue of three or more buffers arranged in a ring. Used when bursty arrival rates cause the input device to temporarily outpace the consumer CPU; the buffer ring absorbs bursts without dropping data.',
      '2. Mathematical Derivation of Speedup:',
      'Let T = time required for the I/O device to transfer one block into memory.',
      'Let C = time required for the CPU to compute / process one block of data.',
      'Let M = time required to copy data between system and user buffers.',
      'Case 1: Without Buffering (Unbuffered):',
      'The CPU and I/O device operate in strict sequence.',
      'Time per block = T + C.',
      'Case 2: Single Buffering:',
      'Time per block = max(T, C) + M.',
      'Case 3: Double Buffering:',
      'Assuming copy time M is negligible or handled via zero-copy DMA:',
      'Because I/O transfer and CPU computation occur in parallel:',
      'Time per block = max(T, C).',
      'Speedup Analysis: If T = 10 ms and C = 8 ms:',
      'Unbuffered Time = 10 ms + 8 ms = 18 ms per block.',
      'Double-Buffered Time = max(10, 8) = 10 ms per block.',
      'Throughput increases by (18 - 10) / 10 = 80%, demonstrating substantial performance enhancement through parallel hardware utilization.'
    ]
  },
  {
    id: 'page-cache-sync-fsync-fdatasync',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain the Linux Unified Page Cache and dirty writeback. Compare the behavior and performance overhead of sync(), fsync(), and fdatasync().',
    answer: [
      '1. Unified Page Cache and Dirty Writeback:',
      'Operating systems utilize physical RAM to cache disk data blocks, unifying file page caching and memory-mapped virtual memory into a single cache pool. When a process issues write(), data is copied into the page cache in RAM, marked "dirty", and write() returns immediately (asynchronous write). Kernel flusher threads (e.g., kswapd, wb_workfn) periodically write dirty pages back to physical storage based on configurable dirty-ratio thresholds or after a timeout (e.g., 30 seconds).',
      '2. Comparison of Synchronization System Calls:',
      'sync(): Commits all dirty metadata and file data blocks across all mounted filesystems to disk. In POSIX, sync() schedules the writes, but historically was not guaranteed to block until all writes finished before returning. In modern Linux, sync() blocks until all queued dirty buffers are completely flushed to non-volatile storage. It causes massive, indiscriminate disk I/O load.',
      'fsync(int fd): Forces all dirty data blocks AND all associated metadata (inode file size, modification timestamps mtime, permissions) belonging to the specific file descriptor fd to be written to physical storage. It blocks the calling thread until the storage controller acknowledges that the data has reached non-volatile persistent media.',
      'fdatasync(int fd): Flushes only the file dirty data blocks and only metadata that is strictly necessary to correctly read the data later (such as updated file length). It deliberately omits non-essential metadata changes like access time (atime) or modification time (mtime). By eliminating redundant inode metadata disk seeks, fdatasync() provides significantly higher write throughput for high-performance databases (like PostgreSQL, MySQL, SQLite WAL).'
    ]
  },
  {
    id: 'traditional-io-overhead-vs-zero-copy',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Trace the data copies and context switches in traditional Web Server I/O (read() + write()). Explain how Zero-Copy mechanisms like sendfile() and splice() eliminate these bottlenecks.',
    answer: [
      '1. Traditional Web Server Data Path (e.g., streaming a static file over a socket):',
      'The application executes: read(file_fd, buf, len); write(socket_fd, buf, len);',
      'This sequence incurs 4 context switches and 4 data copies:',
      'Copy 1 (DMA): Disk sector copied into Kernel Page Cache.',
      'Copy 2 (CPU): Kernel Page Cache copied across protection boundary into User Memory Buffer (read() returns; 2 context switches).',
      'Copy 3 (CPU): User Memory Buffer copied back into Kernel Socket Buffer (write() called; 2 context switches).',
      'Copy 4 (DMA): Kernel Socket Buffer copied directly to Network Interface Card (NIC) FIFO.',
      'Bottleneck: The two CPU memory copies (Copies 2 and 3) waste CPU cycles, flush CPU L1/L2 caches, and consume memory bus bandwidth, all for data that user code never even inspects!',
      '2. Zero-Copy via sendfile():',
      'The POSIX / Linux sendfile(socket_fd, file_fd, &offset, len) system call instructs the kernel to transfer data directly within kernel space:',
      'Copy 1 (DMA): Disk data transferred directly into Kernel Page Cache.',
      'With Scatter-Gather DMA enabled on the NIC: The kernel merely appends page descriptor pointers from the Page Cache into the socket buffer without copying any payload bytes.',
      'Copy 2 (DMA): The NIC reads payload bytes directly out of the Page Cache via DMA.',
      'Zero-Copy Results: Exactly 2 context switches (1 entry, 1 exit) and ZERO CPU data copies! Memory bus traffic drops by 50% to 75%, and network serving throughput multiplies dramatically.',
      '3. Linux splice(): Connects two file descriptors (one of which must be a pipe) via memory page remapping, transferring arbitrary data streams without copying across the user-kernel boundary.'
    ]
  },
  {
    id: 'kernel-bypass-dpdk-spdk',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Explain Kernel Bypass Architectures (DPDK and SPDK). How do user-space polling and direct PCIe ring buffer mapping achieve sub-microsecond latency and millions of IOPS?',
    answer: [
      'Traditional kernel I/O introduces inevitable latency overhead: system call context switching (SYSCALL / SYSRET instructions, ~100-200 ns), page table isolation (KPTI) mitigation overhead, lock contention in kernel queues, and interrupt processing latencies (~2-5 microseconds). For 100 Gbps network interfaces and million-IOPS NVMe drives, the kernel itself becomes the primary bottleneck.',
      'Kernel Bypass (DPDK - Data Plane Development Kit; SPDK - Storage Performance Development Kit) completely removes the operating system kernel from the active data path:',
      '1. User-Space Device Drivers: The device PCIe memory-mapped I/O registers (MMIO) and DMA descriptor ring buffers are unbinded from kernel drivers and mapped directly into user-space virtual memory using Linux VFIO (Virtual Function I/O) or UIO.',
      '2. Zero Context Switches: User applications interact directly with device hardware registers and rings in user space. No system calls (read, write, ioctl) are ever executed.',
      '3. Pure Polling Mode (PMD - Poll Mode Driver): Dedicated CPU cores execute a 100% busy-wait polling loop inspecting hardware completion ring pointers. This completely eliminates hardware interrupts and context switches.',
      '4. HugePages Memory: Uses 2 MB or 1 GB HugePages to guarantee physical memory contiguity and minimize TLB misses.',
      'Performance Outcome: Achieves deterministic, sub-microsecond packet and storage latencies and scales to 100 million packets per second (Mpps) or 10 million storage IOPS on standard commodity server hardware.'
    ]
  }
]

export default questions
