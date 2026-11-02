const questions = [
  {
    id: 'hdd-physical-geometry-and-access-time',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Describe the physical architecture of a Magnetic Hard Disk Drive (HDD). Define Seek Time, Rotational Latency, Transfer Time, and write the formula for Total Access Time.',
    answer: [
      'A Magnetic Hard Disk Drive (HDD) consists of a stack of rigid circular platters coated with a thin ferromagnetic recording layer. Platters rotate simultaneously around a central spindle at constant angular velocity (typically 5,400 to 15,000 RPM). Each platter surface is read and written by an individual magnetic read/write head attached to an actuator arm. All actuator arms move simultaneously across platters as a single rigid comb assembly.',
      'Physical divisions: (1) Tracks: Concentric circular recording rings on each platter surface. (2) Cylinders: The set of all tracks across all platter surfaces located at the identical arm position (radius). (3) Sectors: Discrete angular subdivisions of a track, typically holding 512 bytes or 4,096 bytes (Advanced Format 4Kn).',
      'The components of Total Disk Access Time are:',
      '1. Seek Time (Ts): The time required for the mechanical actuator arm to move the read/write head from its current cylinder to the target cylinder (typically 3 to 9 milliseconds). It is the dominant physical delay.',
      '2. Rotational Latency (Tr): The time spent waiting for the target sector to rotate underneath the read/write head once the head reaches the cylinder. On average, it equals the time for half a platter revolution: Average Tr = 0.5 * (60 seconds / RPM). For a 7,200 RPM drive, Tr = 0.5 * (60,000 ms / 7,200) = 4.17 ms.',
      '3. Transfer Time (Tt): The time required to read or write the actual data bits as the target sector sweeps beneath the head. Tt = Bytes to transfer / Data Transfer Rate.',
      '4. Controller Overhead (Tc): Internal processing time consumed by disk electronics to validate ECC and communicate over the bus.',
      'Formula for Total Disk Access Time: Total Time = Seek Time + Rotational Latency + Transfer Time + Controller Overhead.'
    ]
  },
  {
    id: 'lba-vs-chs-addressing',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Logical Block Addressing (LBA) with historical Cylinder-Head-Sector (CHS) addressing. Why did modern operating systems abandon CHS?',
    answer: [
      '1. Historical Cylinder-Head-Sector (CHS) Addressing: In early PC architectures, the operating system directly addressed sectors using a 3-tuple: (Cylinder number, Head number, Sector number). The CPU had to know the exact physical geometry of the drive.',
      'Limitations of CHS: (a) Hardware abstraction leak: The OS was tightly coupled to physical drive mechanics. (b) Capacity wall: The BIOS INT 13h interface allocated 10 bits for cylinders (1,024), 8 bits for heads (256), and 6 bits for sectors (63), imposing an insurmountable 8.4 GB hard limit. (c) Zone-Bit Recording (ZBR) mismatch: Modern platters pack more sectors onto larger outer tracks than smaller inner tracks. CHS assumed a constant number of sectors per track across the entire disk, making it impossible to utilize outer platter space efficiently.',
      '2. Logical Block Addressing (LBA): The disk is presented to the operating system as a simple, flat, one-dimensional array of fixed-size logical blocks numbered sequentially from 0 to N - 1 (where N is total disk capacity in blocks).',
      'Advantages: The internal disk controller hardware translates the 1-D LBA integer into internal physical geometry (cylinder, head, sector) transparently. The operating system kernel is completely decoupled from disk geometry, bad sector remapping, and Zone-Bit Recording variations.'
    ]
  },
  {
    id: 'disk-scheduling-algorithms-overview',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK disk scheduling algorithms. Explain the elevator algorithm concept and starvation risks.',
    answer: [
      'Disk scheduling reorders pending I/O requests to minimize physical head movement (seek time) and optimize throughput:',
      '1. FCFS (First-Come, First-Served): Services requests in strict arrival order. Fair and starvation-free, but suffers from wild head thrashing across the platter, resulting in terrible average seek times.',
      '2. SSTF (Shortest Seek Time First): Selects the pending request closest to the current head position. Minimizes average response time compared to FCFS, but introduces severe starvation: requests at outer or inner cylinders may starve indefinitely if a continuous stream of requests arrives near the current head location.',
      '3. SCAN (Elevator Algorithm): The head moves in one direction (e.g., towards cylinder 0), servicing all pending requests along its path until it hits the physical disk boundary, then reverses direction and services requests on the return journey. Prevents starvation and bounds waiting time.',
      '4. C-SCAN (Circular SCAN): The head moves in one direction servicing requests until it hits the end, then immediately returns to the beginning of the disk without servicing any requests on the return trip. Provides a more uniform, equitable waiting time across all cylinders than standard SCAN.',
      '5. LOOK and C-LOOK: Practical optimizations of SCAN and C-SCAN. The head moves only as far as the final pending request in the current direction, reversing (LOOK) or resetting (C-LOOK) immediately without wasting time traveling all the way to the physical boundary cylinders (0 or N - 1).'
    ]
  },
  {
    id: 'worked-numerical-disk-scheduling',
    level: 'hard',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Solve this standard university exam numerical: A disk has 200 cylinders (0 to 199). The head is currently at cylinder 53. The pending request queue is: 98, 183, 37, 122, 14, 124, 65, 67. Calculate the Total Head Movement (cylinders traversed) for FCFS, SSTF, SCAN (moving towards 0), C-SCAN (moving towards 199), LOOK (moving towards 0), and C-LOOK (moving towards 199).',
    answer: [
      'Given: Current Head = 53. Queue: [98, 183, 37, 122, 14, 124, 65, 67].',
      '1. FCFS (Arrival Order):',
      'Path: 53 -> 98 -> 183 -> 37 -> 122 -> 14 -> 124 -> 65 -> 67.',
      'Movement = |98-53| + |183-98| + |37-183| + |122-37| + |14-122| + |124-14| + |65-124| + |67-65|',
      'Movement = 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = 640 cylinders.',
      '2. SSTF (Closest Next):',
      'Order: 53 -> 65 (12) -> 67 (2) -> 37 (30) -> 14 (23) -> 98 (84) -> 122 (24) -> 124 (2) -> 183 (59).',
      'Movement = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236 cylinders.',
      '3. SCAN (Moving towards 0):',
      'Services smaller requests down to boundary 0, then reverses upward:',
      'Path: 53 -> 37 -> 14 -> 0 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183.',
      'Movement = (53 - 0) + (183 - 0) = 53 + 183 = 236 cylinders.',
      '4. C-SCAN (Moving towards 199):',
      'Services larger requests up to boundary 199, jumps to 0, then services remaining requests up to 37:',
      'Path: 53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 199 -> 0 -> 14 -> 37.',
      'Movement = (199 - 53) + (199 - 0) + (37 - 0) = 146 + 199 + 37 = 382 cylinders.',
      '5. LOOK (Moving towards 0):',
      'Stops at smallest request (14) without hitting boundary 0:',
      'Path: 53 -> 37 -> 14 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183.',
      'Movement = (53 - 14) + (183 - 14) = 39 + 169 = 208 cylinders.',
      '6. C-LOOK (Moving towards 199):',
      'Stops at largest request (183), resets to smallest request (14), then moves up to 37:',
      'Path: 53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 14 -> 37.',
      'Movement = (183 - 53) + (183 - 14) + (37 - 14) = 130 + 169 + 23 = 322 cylinders.'
    ]
  },
  {
    id: 'ssd-architecture-and-scheduling-obsolescence',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'How do Solid-State Drives (SSDs) differ fundamentally from HDDs? Explain the Flash Translation Layer (FTL), Wear Leveling, TRIM, and why elevator disk scheduling is obsolete for NVMe SSDs.',
    answer: [
      '1. Solid-State Drive (SSD) Architecture:',
      'Unlike HDDs, SSDs contain zero moving parts. Storage is built from semiconductor NAND flash memory cells (SLC, MLC, TLC, QLC) organized into Pages (typically 4 KB to 16 KB) and Blocks (typically 128 to 512 pages, 2 MB to 8 MB).',
      'The Erase-Before-Write Asymmetry: In NAND flash, read and write operations occur at the Page granularity, but erase operations can only be performed at the whole Block level. A page cannot be overwritten in place; it must first be erased. If a block contains valid pages, modifying one page requires copying all valid pages to a new block, writing the new page, and erasing the original block. This causes Write Amplification (WAF = Bytes written to flash / Bytes requested by host).',
      '2. Flash Translation Layer (FTL): An embedded microcontroller running inside the SSD that maps logical block addresses (LBA) to dynamic physical flash pages. The FTL manages: (a) Out-of-place writes, (b) Garbage collection of stale blocks, and (c) Wear Leveling (dynamically distributing writes evenly across all flash cells to prevent premature cell death, since flash cells endure only 1,000 to 10,000 write cycles).',
      '3. The ATA/NVMe TRIM Command: Because traditional filesystems only update metadata when deleting a file (leaving data blocks untouched on storage), the SSD FTL cannot know that deleted blocks are free. The TRIM command informs the FTL that specific LBAs are no longer valid, allowing the SSD garbage collector to skip copying deleted pages, radically reducing write amplification and maintaining high write speeds.',
      '4. Why Elevator Scheduling is Obsolete on NVMe SSDs:',
      'Traditional algorithms (SCAN/LOOK) were designed exclusively to minimize mechanical actuator seek time on spinning magnetic platters. SSDs have zero seek time and zero rotational latency: every flash cell has uniform nanosecond access time regardless of LBA address. Reordering requests through an elevator queue merely adds CPU latency and serializes operations. Modern Linux systems use the "none" scheduler or multi-queue Kyber/BFQ schedulers, allowing NVMe SSDs to execute 64,000 concurrent hardware queues in parallel.'
    ]
  }
]

export default questions
