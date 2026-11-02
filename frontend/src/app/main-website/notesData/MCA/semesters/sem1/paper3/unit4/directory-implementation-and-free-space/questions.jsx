const questions = [
  {
    id: 'directory-implementation-comparison',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Compare Linear List, Hash Table, and B+ Tree directory implementations in terms of search time, insertion complexity, and scalability.',
    answer: [
      'Operating systems implement directory tables using three fundamental data structures:',
      '1. Linear List of Directory Entries: A simple array or linked list of (filename, inode_number) records. (a) Search: Linear scan requires O(N) comparisons in the worst and average cases. (b) Insertion: Check uniqueness via O(N) scan, then append to tail or reuse a deleted slot in O(1). (c) Deletion: Search slot O(N), then zero the entry or compact the array. (d) Scalability: Adequate for directories with tens of files; unacceptable bottleneck for modern folders containing hundreds of thousands of files.',
      '2. Hash Table: Computes a hash h(name) indexing into a fixed-size array of buckets, each pointing to a linked list of entries to resolve collisions. (a) Search: Average O(1) time complexity. (b) Insertion: O(1) average time. (c) Challenges: Hash collisions require chaining or open addressing; resizing requires costly rehashing of all entries; ordered alphabetical listing (like ls -l) requires sorting the entire table.',
      '3. Balanced B+ Trees and HTrees (ext4, XFS, NTFS): Directories structured as balanced multi-way search trees indexed by hash or name strings. (a) Search: O(log N) guaranteed worst-case search time. (b) Insertion and Deletion: O(log N) self-balancing operations with node splitting and merging. (c) Scalability: Flawlessly scales to millions of files per directory with minimal memory overhead and rapid range queries.'
    ]
  },
  {
    id: 'free-space-management-techniques',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain the four primary free-space management techniques: Bit Vector (Bitmap), Linked Free List, Grouping, and Counting.',
    answer: [
      'The operating system must track all unallocated disk blocks to assign storage to new or expanding files. The four core techniques are:',
      '1. Bit Vector / Bitmap: The disk is represented by an array of bits, where each bit corresponds to one physical disk block: bit[i] = 1 indicates block i is free, and bit[i] = 0 indicates block i is allocated. Advantages: Compact and simple; allows hardware bit-scan instructions (e.g., finding the first free block via CPU instructions); easily finds contiguous clusters of free blocks. Disadvantage: Entire bitmap should ideally reside in main memory for speed.',
      '2. Linked Free List: All free disk blocks are linked together in a linked list. The kernel superblock maintains a pointer to the first free block, which contains a pointer to the next free block, and so on. Advantages: Zero RAM overhead (pointers reside inside the free blocks themselves); allocating or freeing a block is O(1) at the head. Disadvantages: Substantial disk I/O overhead to traverse the chain; cannot easily allocate contiguous blocks.',
      '3. Grouping: A modification of the linked list where the first free block stores the addresses of n free blocks. The first n - 1 blocks are truly free data blocks; the n-th block contains the addresses of another n free blocks. Advantage: Enables rapid allocation of large groups of free blocks with minimal disk seeks compared to single-pointer linked lists.',
      '4. Counting: Takes advantage of the reality that contiguous blocks are frequently allocated and freed together. Instead of tracking individual block addresses, the free list stores entries consisting of: (Address of first free block, Count of contiguous free blocks). Advantage: Radically reduces list length on systems with contiguous clustering and minimizes fragmentation tracking overhead.'
    ]
  },
  {
    id: 'bitmap-size-calculation-and-bit-scans',
    level: 'medium',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Calculate the memory size of a bit vector required to manage a 1 TB hard disk with 4 KB allocation blocks. Explain how the CPU efficiently identifies the first free block.',
    answer: [
      '1. Mathematical Calculation of Bitmap Size:',
      'Total Disk Capacity = 1 TB = 1024 GB = 1,048,576 MB = 1,099,511,627,776 bytes (2 to the power of 40 bytes).',
      'Block Size = 4 KB = 4096 bytes (2 to the power of 12 bytes).',
      'Total Number of Disk Blocks = Total Disk Capacity / Block Size = (2 to the power of 40) / (2 to the power of 12) = 2 to the power of 28 blocks = 268,435,456 blocks.',
      'Since each disk block requires exactly 1 bit in the bitmap:',
      'Total Bits Required = 268,435,456 bits (2 to the power of 28 bits).',
      'Total Bytes Required = (2 to the power of 28 bits) / 8 bits per byte = (2 to the power of 28) / (2 to the power of 3) = 2 to the power of 25 bytes.',
      'Converting to Megabytes: (2 to the power of 25 bytes) / (2 to the power of 20 bytes/MB) = 32 MB.',
      'Conclusion: A 1 TB drive with 4 KB blocks requires exactly 32 MB of RAM to hold its entire allocation bitmap.',
      '2. Efficient Identification of the First Free Block:',
      'Rather than checking bits one by one in software loops, modern CPUs provide dedicated hardware bitwise instructions that find the first set bit in a 64-bit word in a single clock cycle.',
      'In x86-64 assembly, the bsfl (Bit Scan Forward) or tzcnt (Count Trailing Zeros) instructions, accessible in C via __builtin_ctzll(), immediately return the index of the first free bit. The kernel scans 64 blocks simultaneously per instruction: if a 64-bit word equals 0x0000000000000000, all 64 blocks are allocated, and the kernel skips to the next 64-bit word instantly.'
    ]
  },
  {
    id: 'journaling-vs-fsck-crash-recovery',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Analyze the metadata update inconsistency hazard during system crashes. Compare traditional fsck consistency checks with modern Write-Ahead Logging (Journaling) across its three operating modes.',
    answer: [
      'The Metadata Update Hazard arises because modifying a file often requires multiple separate disk writes that cannot be executed in a single atomic hardware operation. For example, appending a block requires: (1) Setting bit in free block bitmap, (2) Updating the file inode size and block pointer, and (3) Writing data into the physical block. If power cuts out between step 1 and 2, the block is reserved in the bitmap but unreferenced by any file (space leak). If power cuts out between step 2 and 1, the inode points to a block marked free, so another process could claim it (data corruption).',
      'Traditional Offline Recovery (fsck / chkdsk): Reconstructs consistency post-crash by scanning every single inode, directory entry, and allocation block across the entire partition. On multi-terabyte enterprise storage arrays, fsck takes hours or days to complete, during which the system remains completely offline.',
      'Write-Ahead Logging / Journaling (ext3, ext4, NTFS, XFS): Solves this by designating a sequential circular log on disk. Before any metadata is modified on disk, the sequence of intended changes is recorded as an atomic transaction in the journal. Once the transaction commit record is written to the journal, changes are lazily written to their permanent on-disk structures (checkpointing). On reboot following a crash, the kernel simply inspects the journal: committed transactions are replayed (redo log) and uncommitted ones are discarded, restoring consistency in milliseconds.',
      'The Three Linux ext3/ext4 Journaling Modes:',
      '1. Journal Mode (Full Data Journaling): Both file metadata and user data blocks are written to the journal before flushing to disk. Highest data integrity, but doubles disk write traffic, severely reducing write throughput.',
      '2. Ordered Mode (Default): Only metadata is logged in the journal, but the kernel guarantees that user data blocks are flushed to physical disk before the associated metadata transaction commits in the journal. Guarantees that on crash recovery, files never contain stale or leaked disk garbage.',
      '3. Writeback Mode: Only metadata is journaled; user data is flushed to disk asynchronously without ordering constraints relative to the journal commit. Provides highest write throughput, but after a crash, files may contain old or uninitialized disk blocks.'
    ]
  },
  {
    id: 'copy-on-write-cow-filesystems',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'How do Copy-on-Write (CoW) filesystems like ZFS and Btrfs achieve crash consistency without traditional journaling? Explain Merkle tree root pointer updates and snapshot mechanics.',
    answer: [
      'Copy-on-Write (CoW) filesystems fundamentally reject the principle of "in-place updates". In traditional filesystems (ext4), modifying a block overwrites the original sector on disk. In ZFS and Btrfs, existing data and metadata blocks are immutable.',
      'When an application modifies data block D: (1) The filesystem allocates a new, completely separate free block D_prime on disk and writes the updated contents there. (2) The parent indirect block referencing D is copied to a new block pointing to D_prime. (3) This cascading copy continues up the filesystem Merkle tree until reaching the root anchor pointer (the "uberblock" in ZFS). (4) The uberblock is updated atomically in a single disk write. The entire transaction becomes visible instantaneously at the exact moment the root pointer switches.',
      'Crash Consistency Guarantee: If power cuts out at any intermediate instant before the root pointer is committed, the disk simply retains the old, completely consistent tree; the partially written orphan blocks are reclaimed on next mount. No journal, no replaying, and no fsck are ever required.',
      'Zero-Cost Snapshots: Because blocks are never overwritten, creating a snapshot requires nothing more than saving a copy of the root tree pointer. A snapshot takes fractions of a millisecond and consumes zero bytes of storage initially. As modifications occur, only the newly diverged blocks consume additional physical space.'
    ]
  }
]

export default questions
