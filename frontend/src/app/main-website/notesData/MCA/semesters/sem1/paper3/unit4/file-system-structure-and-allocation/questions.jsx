const questions = [
  {
    id: 'layered-file-system-architecture',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Describe the layered file system architecture. State the distinct responsibilities of the Logical File System, File-Organization Module, and Basic File System.',
    answer: [
      'Modern operating systems structure file system management as a hierarchy of modular layers, where each layer abstracts the complexity of the layer directly beneath it:',
      '1. Application Programs: User applications invoking high-level file system calls such as open(), read(), write(), and close().',
      '2. Logical File System: Manages file metadata, directory structures, path resolution, and protection. It translates symbolic file pathnames into a File Control Block (FCB) or inode number, maintains directory entry mappings, and enforces access control permissions.',
      '3. File-Organization Module: Translates logical block addresses (LBA 0, 1, 2, ..., n) within a file into physical device block numbers. It understands the underlying allocation scheme (contiguous, linked, indexed, or extent-based) and manages the free-space tracking subsystem.',
      '4. Basic File System: Issues generic physical read/write commands to device drivers to retrieve or write physical block numbers (e.g., "Read Block #19823 into Memory Address 0x8FA000"). It manages the kernel block buffer cache and memory-mapped I/O queues.',
      '5. I/O Control (Device Drivers and Interrupt Handlers): Contains hardware-specific device drivers that translate generic block commands into controller register instructions, DMA descriptors, and process hardware interrupts.',
      '6. Physical Devices: Physical magnetic hard disks, NVMe SSDs, flash memory, and optical storage arrays.'
    ]
  },
  {
    id: 'file-allocation-methods-comparison',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Contiguous Allocation, Linked Allocation, and Indexed Allocation methods across sequential access speed, direct (random) access capability, external fragmentation, and storage overhead.',
    answer: [
      '1. Contiguous Allocation: Each file occupies a contiguous set of consecutive disk blocks. Directory entry stores (start_block, length). (a) Sequential Access: Extremely fast because disk heads execute minimal seek latency; consecutive blocks stream off adjacent physical sectors. (b) Direct Access: Trivial and fast; the block address for relative offset b is simply start_block + floor(b / block_size). (c) Fragmentation: Suffers heavily from external fragmentation as files are created and deleted; requires dynamic compaction. (d) Space Overhead: Minimal (only 2 integers in directory entry). (e) Limitation: File size must be declared in advance; dynamic file growth is severely restricted unless extent-based reallocation is used.',
      '2. Linked Allocation: Each file is represented as a linked list of disk blocks. Each block stores user data plus a 4-byte or 8-byte pointer to the next disk block. Directory entry stores (first_block, last_block). (a) Sequential Access: Adequate, though disk heads must seek between scattered blocks unless defragmented. (b) Direct Access: Extremely poor; accessing block i requires traversing i - 1 intermediate pointers from the disk (O(N) seeks). (c) Fragmentation: Zero external fragmentation; any free block can be allocated. (d) Space Overhead: Pointer overhead within each block (e.g., 4 bytes out of 512 bytes = 0.78% wasted). (e) Reliability: Highly vulnerable; a single corrupted block pointer loses access to all subsequent file blocks.',
      '3. Indexed Allocation: Brings all block pointers together into an auxiliary Index Block. Directory entry points to the index block, whose i-th entry points to the i-th physical data block. (a) Sequential Access: Good; pointers are traversed sequentially in memory. (b) Direct Access: Fast; direct index lookup into the index block requires only one extra read (or zero if cached). (c) Fragmentation: Zero external fragmentation. (d) Space Overhead: High pointer overhead for very small files (allocating an entire 4 KB index block for a 20-byte file wastes 99.5% of the block). Multi-level indexing or combined inode structures solve the file size boundary.'
    ]
  },
  {
    id: 'fat-architecture-and-limits',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain the working of the File Allocation Table (FAT). How does it improve upon standard linked allocation, and why does it struggle on large storage drives?',
    answer: [
      'The File Allocation Table (FAT) is a specialized variation of linked allocation developed for MS-DOS and retained in FAT12, FAT16, and FAT32 filesystems.',
      'In standard linked allocation, block pointers are embedded inside individual physical disk blocks, requiring actual disk reads to traverse the pointer chain. FAT solves this by extracting all block pointers out of the data blocks and centralizing them into a single tabular array stored at the beginning of the volume.',
      'How FAT operates: The disk is divided into clusters. The FAT array has one entry per cluster. A directory entry stores the file name and starting cluster number k. The FAT entry at index k contains the cluster number of the next cluster in the file, forming a linked chain. A special end-of-file marker (e.g., 0xFFFFFFF in FAT32) terminates the chain, while unused clusters are marked with 0x0000000.',
      'Improvement over linked allocation: Because the entire FAT can be cached in kernel RAM, pointer traversal for direct (random) access occurs at RAM speed without issuing disk seeks until the target cluster number is resolved. Furthermore, data blocks contain 100% user data without embedded pointer waste.',
      'Limitation on large drives: As disk capacity grows, the FAT array size expands significantly. In FAT32 with 4 KB clusters on a 2 TB disk, the FAT table requires hundreds of megabytes of continuous RAM just to maintain the allocation map. Additionally, FAT lacks native journaling, making it susceptible to metadata corruption during unexpected power outages.'
    ]
  },
  {
    id: 'unix-inode-max-file-size-derivation',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice', 'Mathematical derivation'],
    question: 'Derive the maximum file size supported by a classic UNIX inode containing 12 direct block pointers, 1 single indirect pointer, 1 double indirect pointer, and 1 triple indirect pointer. Assume a block size of 4 KB (4096 bytes) and 4-byte (32-bit) disk block addresses.',
    answer: [
      'Let disk block size S = 4 KB = 4096 bytes, and disk block address pointer size P = 4 bytes.',
      '1. Number of block pointers per indirect block:',
      'N = S / P = 4096 bytes / 4 bytes = 1024 pointers per block (2 to the power of 10 pointers).',
      '2. Capacity via 12 Direct Pointers:',
      'Direct Blocks = 12 blocks.',
      'Direct Capacity = 12 * 4 KB = 48 KB.',
      '3. Capacity via 1 Single Indirect Pointer:',
      'Single Indirect points to 1 index block containing N pointers.',
      'Single Indirect Blocks = 1024 blocks.',
      'Single Indirect Capacity = 1024 * 4 KB = 4096 KB = 4 MB.',
      '4. Capacity via 1 Double Indirect Pointer:',
      'Double Indirect points to 1 index block containing 1024 pointers, each pointing to a single indirect index block of 1024 pointers.',
      'Double Indirect Blocks = 1024 * 1024 = 1,048,576 blocks (2 to the power of 20 blocks).',
      'Double Indirect Capacity = 1,048,576 * 4 KB = 4,194,304 KB = 4096 MB = 4 GB.',
      '5. Capacity via 1 Triple Indirect Pointer:',
      'Triple Indirect points to 1 index block pointing to 1024 double indirect blocks.',
      'Triple Indirect Blocks = 1024 * 1024 * 1024 = 1,073,741,824 blocks (2 to the power of 30 blocks).',
      'Triple Indirect Capacity = 1,073,741,824 * 4 KB = 4,294,967,296 KB = 4096 GB = 4 TB.',
      'Total Maximum File Size:',
      'Total Capacity = 48 KB + 4 MB + 4 GB + 4 TB = 4,402,345,008 KB approximately equal to 4.004 TB.',
      'Note: If block pointers are 8 bytes (64-bit addresses as in modern 64-bit filesystems), each 4 KB block holds 512 pointers, and total addressable capacity scales differently according to the revised pointer stride.'
    ]
  },
  {
    id: 'vfs-architecture-and-polymorphism',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Explain the Virtual File System (VFS) abstraction in Unix/Linux. Define its four primary data objects and explain how object-oriented polymorphism is implemented in C using operation structures.',
    answer: [
      'The Virtual File System (VFS) is a kernel software abstraction layer positioned directly between user-space system calls and concrete filesystem implementations (such as ext4, XFS, Btrfs, FAT32, NFS, and sysfs). It provides a uniform POSIX API, allowing applications to read and write files without knowing whether the target resides on an NVMe SSD, an optical drive, or a remote server over TCP/IP.',
      'The VFS is architected around four primary object types:',
      '1. Superblock Object (struct super_block): Represents an entire mounted filesystem. Stores filesystem type, block size, mount flags, root dentry pointer, and superblock operations.',
      '2. Inode Object (struct inode): Represents a specific file, directory, or device on disk. Contains file metadata (permissions, UID, GID, size, timestamps, block pointers). An inode exists independently of directory names.',
      '3. Dentry Object (struct dentry): Represents a directory entry, which is a specific pathname component (e.g., in "/usr/bin/gcc", "usr", "bin", and "gcc" each have a dentry). Dentries link filenames to inode numbers and are cached in the high-speed dentry cache (dcache) to eliminate expensive disk directory traversals.',
      '4. File Object (struct file): Represents an open file instance created when a process calls open(). Tracks open-file state including current file offset (f_pos), access flags, and reference count.',
      'Polymorphism in C: The Linux kernel achieves object-oriented polymorphism by embedding function pointer tables within each VFS object: struct super_operations, struct inode_operations, and struct file_operations.',
      'For example, struct file has a member "const struct file_operations *f_op". When user code executes read(fd, buf, len), the VFS invokes: file->f_op->read(file, buf, len, &file->f_pos). In ext4, f_op points to ext4_file_operations; in an NFS mount, f_op points to nfs_file_operations. The caller executes identical system calls while the underlying implementation executes the correct filesystem-specific driver logic.'
    ]
  }
]

export default questions
