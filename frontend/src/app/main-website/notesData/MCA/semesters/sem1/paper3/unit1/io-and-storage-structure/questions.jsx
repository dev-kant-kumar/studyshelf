const questions = [
  {
    id: 'blocking-vs-nonblocking-async-io',
    level: 'hard',
    tags: ['Interview practice', 'Practical'],
    question: 'Distinguish between Blocking I/O, Non-Blocking I/O, and Asynchronous I/O with system call mechanics.',
    answer: [
      'In Blocking I/O, when a thread issues a read() system call, the kernel pauses the thread, transitions its state from RUNNING to WAITING, and switches the CPU to another task. The thread remains blocked until data arrives in the kernel buffer, at which point the kernel copies bytes to user space and wakes the thread.',
      'In Non-Blocking I/O (configured via the O_NONBLOCK flag on file descriptors), if no data is available when read() is invoked, the system call does not block. Instead, it returns immediately with an error code (-1) and sets errno to EAGAIN or EWOULDBLOCK. The application must poll or use an event notification mechanism.',
      'In Asynchronous I/O (such as POSIX AIO or Linux io_uring), the application submits an I/O request to the kernel and continues executing immediately. The entire transfer (including copying data from the device into the user buffer) is performed by the kernel and DMA hardware in the background. When completed, the kernel notifies the application via an event completion ring or callback signal.'
    ]
  },
  {
    id: 'effective-memory-access-time',
    level: 'medium',
    tags: ['Exam practice', 'Concept check'],
    question: 'Define Effective Memory Access Time (EMAT) and derive the mathematical formula using Cache Hit Ratio.',
    answer: [
      'Effective Memory Access Time (EMAT) is the average time required by the CPU to access a memory operand across a hierarchical cache-and-main-memory architecture.',
      'Let h be the Cache Hit Ratio (the fraction of memory accesses satisfied directly by the cache, where 0 <= h <= 1). Let tc be the Cache Access Time, and let tm be the Main Memory Access Time.',
      'The formula for EMAT is: EMAT = (h * tc) + ((1 - h) * (tc + tm)). In systems where cache and memory lookups are initiated in parallel, this simplifies to: EMAT = (h * tc) + ((1 - h) * tm). Because cache access latency is orders of magnitude smaller than DRAM latency, even small increases in hit ratio (e.g. 90% to 98%) yield substantial reductions in average memory stall cycles.'
    ]
  },
  {
    id: 'block-vs-character-devices',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'How does an operating system distinguish between Block Devices and Character Devices?',
    answer: [
      'A Block Device stores information in fixed-size blocks (typically 512 bytes to 4,096 bytes), each with its own physical address. The operating system can read or write any block independently in random-access fashion (e.g. NVMe SSDs, magnetic hard disks, USB flash drives). Block devices utilize the kernel Page Cache to buffer whole blocks.',
      'A Character Device delivers or accepts an unbuffered stream of individual characters or bytes. There is no block structure and the device cannot be seeked randomly (e.g. keyboards, serial mice, sound cards, serial terminals). The OS communicates with character devices via sequential byte queues.'
    ]
  },
  {
    id: 'spooling-vs-buffering-distinction',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Explain the difference between Buffering and Spooling in the kernel I/O subsystem.',
    answer: [
      'Buffering reserves an area of primary memory (RAM) to hold data during transfers between two devices or between a device and an application. It resolves speed mismatches (e.g. slow network stream vs fast CPU) and supports copy semantics so user buffers can be modified immediately after a write() call.',
      'Spooling (Simultaneous Peripheral Operations On-Line) uses secondary storage (magnetic disk or SSD) as a large queue to manage jobs directed to non-shareable dedicated devices (such as physical printers). Because a printer cannot interleave lines from two programs simultaneously, print outputs are written to separate spool files on disk and printed sequentially one complete file at a time.'
    ]
  },
  {
    id: 'disk-access-time-components',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'What are the physical components of Hard Disk Access Time? Provide the total formula.',
    answer: [
      'Hard Disk Access Time consists of three physical components:',
      '1. Seek Time: The time required for the mechanical actuator arm to position the read/write heads over the target cylinder track. This is typically the largest component (averaging 3 ms to 9 ms).',
      '2. Rotational Latency: The time required for the target sector on the spinning platter to rotate under the read/write head. Average rotational latency is half the time of one full revolution (e.g. 4.17 ms for a 7,200 RPM drive).',
      '3. Transfer Time: The time needed to physically stream the data bytes off the platter surface into the disk controller buffer, calculated as: Transfer Time = Bytes to Transfer / Data Transfer Rate.',
      'Total Access Time = Seek Time + Rotational Latency + Transfer Time.'
    ]
  },
  {
    id: 'flash-wear-leveling-waf',
    level: 'hard',
    tags: ['Interview practice'],
    question: 'Why cannot Solid-State Drives (SSDs) overwrite a single page directly, and what is Write Amplification?',
    answer: [
      'In NAND flash memory, read and write operations occur at the Page level (typically 4 KB to 16 KB), but erase operations can only occur at the Block level (typically 128 to 512 pages / 2 MB to 8 MB). Once a page is written, it cannot be overwritten in place; it must be erased first.',
      'To modify data, the Flash Translation Layer (FTL) writes updated data to a fresh, previously erased page and marks the old page as invalid. Over time, free erased blocks run out, triggering Garbage Collection: the FTL copies all valid pages from a mixed block to a clean block and erases the entire original block.',
      'Write Amplification Factor (WAF) is the ratio of total bytes written to the physical NAND flash memory compared to the bytes requested by the host operating system: WAF = Flash Writes / Host Writes. A high WAF reduces drive lifespan and degrades write throughput.'
    ]
  }
]

export default questions
