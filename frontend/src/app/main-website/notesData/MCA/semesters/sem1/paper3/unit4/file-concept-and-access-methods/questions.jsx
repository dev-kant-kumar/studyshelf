const questions = [
  {
    id: 'file-concept-attributes-and-magic-numbers',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Define the file concept in operating systems. List the primary file attributes and explain how the OS uses magic numbers to identify file formats.',
    answer: [
      'A file is an abstract, contiguous sequence of logical bytes mapped by the operating system onto non-volatile physical storage devices (such as hard drives, solid-state drives, or magnetic tapes). It provides a uniform physical abstraction, shielding user applications from device-specific sector layouts, cylinder geometry, and bus protocols.',
      'Primary file attributes maintained in the File Control Block (FCB) or inode include: (1) Identifier: Unique numeric tag (such as an inode number) identifying the file within the filesystem. (2) Name: Human-readable string identifying the file in a directory. (3) Type: Identifies format (regular file, directory, FIFO, socket, device special). (4) Location: Pointer to device blocks holding data. (5) Size: Current byte length and allocated block count. (6) Protection: Access control permissions governing read, write, and execute permissions. (7) Timestamps: Creation time, last access time (atime), and last modification time (mtime).',
      'Rather than relying solely on file extensions (which can be easily modified or spoofed), operating systems inspect the file header for "magic numbers" - specific, predetermined constant byte signatures located at byte offset 0. For example, ELF executables start with 0x7F 0x45 0x4C 0x46 ("\\x7FELF"), Java bytecode starts with 0xCA 0xFE 0xBA 0xBE, PDF files start with 0x25 0x50 0x44 0x46 ("%PDF"), and JPEG images begin with 0xFF 0xD8 0xFF. The OS loader or utilities like file inspect these bytes to verify binary integrity before execution or decoding.'
    ]
  },
  {
    id: 'file-access-methods-comparison',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Sequential Access, Direct (Random) Access, and Indexed Access methods. Explain how the lseek() system call facilitates random access.',
    answer: [
      'Sequential Access reads or writes records in strict physical order, one after the other. A file pointer maintained by the kernel tracks current position: read_next() advances the pointer by the record size, and rewind() resets the pointer to offset 0. This method mirrors sequential media like magnetic tape and is optimal for compilers, loggers, and audio/video streaming.',
      'Direct (Random) Access allows reading and writing logical blocks or records in arbitrary order without traversing intermediate records. Programs treat the file as a numbered sequence of fixed-size blocks (block 0, block 1, ..., block n). Applications request read(block_num) directly, making this essential for database management systems (B-trees, hash tables) and virtual machine disk images.',
      'Indexed Access constructs an auxiliary index file holding record keys and their corresponding disk block addresses. To retrieve a record, the operating system searches the index (using binary search or B-tree traversal) to find the target block address, then performs a direct access seek to that block. Multi-level indices (ISAM) scale this to massive datasets.',
      'The POSIX system call lseek(int fd, off_t offset, int whence) enables direct access on byte streams by adjusting the file offset pointer associated with open file descriptor fd. The whence argument determines the base reference: SEEK_SET (absolute offset from beginning of file), SEEK_CUR (relative offset from current position), or SEEK_END (offset relative to the end of file). It executes purely in kernel memory by modifying the open file table entry without issuing physical disk I/O until the subsequent read() or write().'
    ]
  },
  {
    id: 'directory-structures-and-links',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Compare Tree-Structured Directories with Acyclic-Graph Directories. Explain the fundamental differences between Hard Links and Soft (Symbolic) Links.',
    answer: [
      'A Tree-Structured Directory maintains a strict single-parent hierarchy rooted at "/". Every file and subdirectory has exactly one parent directory, guaranteeing unique absolute pathnames and preventing cycles. However, it completely prevents sharing files between users or projects without duplicating physical storage.',
      'An Acyclic-Graph Directory allows directories to share subdirectories and files across multiple branches simultaneously. A file can have multiple parent directory entries pointing to it. While it enables efficient collaborative sharing, it introduces hazards: multiple distinct pathnames refer to the identical file, and file deletion requires reference counting to avoid dangling pointers.',
      'A Hard Link creates a new directory entry (name) that points directly to an existing inode number on the same filesystem. Both names are equal peers sharing the identical disk blocks, metadata, and permissions. The kernel increments the inode link count (i_nlink). When a user deletes a hard link via unlink(), the kernel decrements i_nlink; physical disk blocks and the inode are deallocated only when i_nlink reaches 0 and all open file descriptors to it are closed. Hard links cannot span across different filesystems (because inode numbers are volume-local) and cannot link directories (to prevent directory graph cycles).',
      'A Soft (Symbolic) Link is an independent file with its own distinct inode number and data blocks. Its data content is simply a path string pointing to the target file. Soft links can cross filesystem boundaries and can target directories. However, if the target file is deleted or renamed, the symbolic link remains pointing to a non-existent path, becoming a "dangling link". Accessing a soft link incurs extra path resolution overhead.'
    ]
  },
  {
    id: 'kernel-file-table-architecture',
    level: 'hard',
    tags: ['Interview practice', 'Systems architecture'],
    question: 'Trace the kernel data structure hierarchy involved in file access: Per-Process File Descriptor Table, System-Wide Open-File Table, and Inode Table. What happens during open(), fork(), and read()?',
    answer: [
      'The operating system kernel coordinates file operations across three distinct hierarchical tables:',
      '1. Per-Process File Descriptor Table: Embedded in the process task_struct. An array indexed by integer file descriptors (0 = stdin, 1 = stdout, 2 = stderr). Each entry contains file descriptor flags (such as FD_CLOEXEC) and a pointer to an entry in the System-Wide Open-File Table.',
      '2. System-Wide Open-File Table: Maintained globally by the kernel. Contains an entry for every active open() invocation across all processes. Each entry stores: (a) current file offset pointer (f_pos), (b) access mode flags (read, write, append), (c) file lock status, (d) reference counter of how many file descriptors point to this entry, and (e) pointer to the in-memory inode.',
      '3. In-Memory Inode Table (VFS Inode): Contains one entry per active file on disk. Holds file ownership, permissions, file size, timestamps, device identifier, and physical block allocation pointers.',
      'Operations trace:',
      'open("/tmp/data.txt", O_RDONLY): The kernel traverses the directory tree to locate the file inode, checks permissions, allocates a new entry in the System-Wide Open-File Table with offset 0 and reference count 1, and assigns the lowest available integer index in the per-process table to point to this system-wide entry.',
      'fork(): The child process inherits an exact duplicate of the parent per-process file descriptor table. Both parent and child file descriptors point to the identical System-Wide Open-File Table entry, incrementing its reference count. Consequently, parent and child share the same file offset pointer: if the child calls read(), the parent subsequent read() continues immediately after the child bytes.',
      'read(fd, buf, n): The kernel indexes the process file descriptor table using fd, retrieves the open-file table entry, uses its f_pos to determine which disk blocks to read, transfers data to user buffer buf, and increments f_pos by the number of bytes read.'
    ]
  },
  {
    id: 'file-protection-unix-vs-acls',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Analyze file protection mechanisms. Compare standard UNIX 9-bit octal permissions (including SUID, SGID, and Sticky bits) with Access Control Lists (ACLs).',
    answer: [
      'File protection guarantees that files are accessed only by authorized principals according to defined security policies (Read, Write, Execute, Append, Delete).',
      'The standard UNIX permission model uses a compact 12-bit mode field within each inode:',
      'The lower 9 bits are partitioned into three 3-bit octal triads: Owner (User), Group, and Others (World). Each triad specifies Read (r = 4), Write (w = 2), and Execute (x = 1). For example, mode 0755 grants rwx to owner and r-x to group and others.',
      'The upper 3 special bits provide advanced privilege management: (1) SUID (Set User ID, octal 4000): When an executable with SUID is run, the process runs with the effective UID of the file owner (e.g., /usr/bin/passwd owned by root), allowing controlled privilege escalation. (2) SGID (Set Group ID, octal 2000): For files, sets effective GID. For directories, newly created files inherit the directory group ownership rather than the creator primary group. (3) Sticky Bit (octal 1000): On directories (such as /tmp), restricts file deletion and renaming exclusively to the file owner or root, preventing users from removing other users files.',
      'Limitation of standard UNIX permissions: It cannot express fine-grained access policies, such as "Grant Alice read-write, Bob read-only, and Charlie no access, while all belong to the engineering group".',
      'Access Control Lists (ACLs, POSIX 1003.1e) overcome this by attaching an explicit list of (principal, permissions) pairs to the file inode. Each ACL entry explicitly specifies permissions for individual named users and groups (e.g., user:alice:rw-, user:bob:r--, group:qa:r--). ACLs provide complete discretionary access control flexibility at the cost of variable-length metadata storage and slightly increased lookup overhead during open().'
    ]
  }
]

export default questions
