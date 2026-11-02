import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const accessMethodsTable = {
    caption: 'Operating System File Access Methods Comparison',
    headers: ['Access Method', 'Underlying Philosophy', 'Pointer Operations', 'Primary Use Cases', 'Hardware Suitability'],
    rows: [
      [
        'Sequential Access',
        'Records processed in strict chronological order; contiguous byte streaming.',
        'read_next(), write_next(), rewind() to offset 0.',
        'Compilers, text parsing, log aggregation, media streaming.',
        'Optimal for both magnetic tapes and streaming block storage.'
      ],
      [
        'Direct / Random Access',
        'File viewed as an indexed sequence of fixed-size numbered blocks; arbitrary order access.',
        'read(block_n), write(block_n), lseek(offset, whence).',
        'Relational databases (B-Tree indexes), VM disk images, memory-mapped files.',
        'Requires random-access devices (HDDs, SSDs, NVMe); impossible on tape.'
      ],
      [
        'Indexed Access',
        'Auxiliary index maps logical keys to disk block addresses; index search precedes block fetch.',
        'Key lookup &rarr; locate block pointer &rarr; direct block access.',
        'ISAM database tables, enterprise directories, record-oriented filesystems.',
        'Fast random-access drives with substantial memory caching for index nodes.'
      ]
    ]
  }

  const linksComparisonTable = {
    caption: 'Architectural Comparison: Hard Links vs Symbolic (Soft) Links',
    headers: ['Characteristic', 'Hard Link (ln target link)', 'Soft / Symbolic Link (ln -s target link)'],
    rows: [
      [
        'Inode Mapping',
        'Shares the exact same inode number as the original target file.',
        'Allocates a brand-new, distinct inode number with its own file control block.'
      ],
      [
        'Data Block Storage',
        'Shares the original data blocks; no separate disk space consumed for file body.',
        'Consumes a small disk block containing the target pathname string as data.'
      ],
      [
        'Link Counter (i_nlink)',
        'Increments the target inode link counter (i_nlink++) on creation.',
        'Does not affect the target inode link counter; target i_nlink remains unchanged.'
      ],
      [
        'Target Deletion Behavior',
        'Data remains intact and accessible via remaining hard links until i_nlink drops to 0.',
        'Target data is deleted; soft link becomes a broken / dangling pointer.'
      ],
      [
        'Filesystem Boundary',
        'Strictly restricted to the same filesystem / volume (inode numbers are local).',
        'Can cross filesystem boundaries, mount points, and even point to network volumes.'
      ],
      [
        'Directory Linking',
        'Disallowed in modern OS kernels to prevent infinite loops and cycle creation.',
        'Allowed; OS path resolvers protect against cycles by bounding symlink depth.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        The file system provides the fundamental non-volatile storage abstraction in modern operating systems.
        This comprehensive study explores the file concept, byte-stream interfaces, file attributes, access patterns,
        hierarchical directory models, link semantics, mounting mechanisms, and multi-tier access protection policies.
      </p>

      <h2>1. The File Concept and Abstraction</h2>
      <p>
        Physical storage devices (such as magnetic disks, solid-state drives, and flash arrays) store information in
        fixed-size, sector-level hardware divisions (typically 512 bytes or 4096 bytes). Managing raw physical sectors
        directly from user space is impractical and hazardous. The operating system provides a uniform logical abstraction:
        the <strong>file</strong>.
      </p>
      <p>
        A file is a named, contiguous sequence of logical bytes mapped by the operating system onto physical storage media.
        In the UNIX design philosophy, &ldquo;everything is a file&rdquo; - regular documents, directories, hardware devices,
        pipes, and network sockets present uniform byte-oriented interfaces.
      </p>

      <h3>Core File Attributes</h3>
      <p>
        Every file possesses both user data and operating system metadata. Metadata is encapsulated within an on-disk
        control structure termed the <strong>File Control Block (FCB)</strong> in Windows or the <strong>inode</strong> in UNIX/Linux:
      </p>
      <ul>
        <li>
          <strong>Name:</strong> The human-readable symbolic string used by human users and applications to identify the file in directory trees.
        </li>
        <li>
          <strong>Identifier:</strong> A unique numeric index (e.g., inode number) that identifies the file internally to the operating system kernel across its parent filesystem.
        </li>
        <li>
          <strong>File Type:</strong> Classifies the file format (regular file, directory, symbolic link, character device, block device, FIFO, socket).
        </li>
        <li>
          <strong>Location:</strong> Pointers to the physical storage device blocks holding the file actual contents.
        </li>
        <li>
          <strong>Size:</strong> Current file length in bytes, along with the total count of disk allocation blocks reserved.
        </li>
        <li>
          <strong>Protection:</strong> Access control flags specifying read, write, and execute permissions for authorized user identities.
        </li>
        <li>
          <strong>Timestamps:</strong> High-resolution records of creation time (ctime), last access time (atime), and last data modification time (mtime).
        </li>
      </ul>

      <h3>File Format Identification: Extensions vs Magic Numbers</h3>
      <p>
        Operating systems identify file formats using two primary paradigms:
      </p>
      <ol>
        <li>
          <strong>File Extensions:</strong> Systems like MS-DOS and Windows append a trailing suffix (e.g., <code>.exe</code>, <code>.docx</code>, <code>.pdf</code>)
          to associate files with designated handler applications via registry lookup. However, extensions are superficial and can be trivially renamed or falsified.
        </li>
        <li>
          <strong>Magic Numbers:</strong> UNIX, Linux, and enterprise systems inspect the file raw binary header at byte offset 0.
          Magic numbers are predetermined constant byte signatures embedded during file generation.
        </li>
      </ol>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Standard Binary Magic Number Signatures
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-2 overflow-x-auto">
          <div><code>0x7F 0x45 0x4C 0x46</code> &rarr; ELF Binary Executable (&quot;\x7FELF&quot; on Linux)</div>
          <div><code>0xCA 0xFE 0xBA 0xBE</code> &rarr; Java Bytecode Class File</div>
          <div><code>0x25 0x50 0x44 0x46</code> &rarr; Adobe PDF Document (&quot;%PDF&quot;)</div>
          <div><code>0xFF 0xD8 0xFF</code> &rarr; JPEG Graphic Image Format</div>
          <div><code>0x50 0x4B 0x03 0x04</code> &rarr; ZIP Archive / Java JAR / Office DOCX (&quot;PK..&quot;)</div>
        </div>
      </div>

      <h2>2. File Operations and Kernel Data Structures</h2>
      <p>
        The operating system exposes system calls that allow user-space applications to manipulate files safely across the
        user-kernel protection boundary. The primary operations include:
      </p>
      <ul>
        <li><code>open(pathname, flags, mode)</code>: Verifies permissions, locates the inode, and returns an integer file descriptor index.</li>
        <li><code>read(fd, buffer, count)</code>: Transfers up to count bytes from the current file offset into user memory buffer.</li>
        <li><code>write(fd, buffer, count)</code>: Writes data from user buffer into the file at the current offset, allocating disk blocks if necessary.</li>
        <li><code>lseek(fd, offset, whence)</code>: Repositions the file offset pointer for direct/random access.</li>
        <li><code>close(fd)</code>: Decrements open-file reference counts and releases the descriptor index back to the process pool.</li>
        <li><code>unlink(pathname)</code>: Removes a directory entry and decrements the target inode hard link count.</li>
      </ul>

      <h3>The Three-Tier Kernel File Table Hierarchy</h3>
      <p>
        Managing concurrent file access across multiple threads and processes requires three distinct kernel structures:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Kernel File Data Structure Architecture
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand">1. Per-Process Descriptor Table</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              Array located inside the process <code>task_struct</code>. Indexed by integer <code>fd</code> (0, 1, 2 = stdin, stdout, stderr).
              Stores descriptor flags (e.g., <code>FD_CLOEXEC</code>) and points to an entry in the system-wide open file table.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-accent dark:text-night-accent">2. System-Wide Open-File Table</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              Global kernel table tracking every active open instance. Stores current file byte offset (<code>f_pos</code>), access mode (read/write),
              advisory locks, reference count, and a pointer to the in-memory inode.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success">3. In-Memory Inode Table</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              Active VFS representation of on-disk inode. Contains file owner, permission bits, exact file byte size, device ID,
              and physical disk block allocation pointers. Shared across all open instances of the file.
            </p>
          </div>
        </div>
      </div>

      <Callout type="info" title="System Call Concurrency: open() vs fork()">
        When two distinct processes invoke <code>open()</code> on the same file independently, each receives an independent
        System-Wide Open-File Table entry with its own private <code>f_pos</code> file offset. However, when a process calls <code>fork()</code>,
        the child inherits exact copies of the parent file descriptors pointing to the <strong>same</strong> System-Wide Open-File Table entry.
        Consequently, parent and child share the identical file offset pointer: a read performed by the child advances the offset for the parent.
      </Callout>

      <h2>3. File Access Methods</h2>
      <p>
        The access method defines the logical sequence and navigation rules used by software to retrieve and store records within a file:
      </p>

      <ComparisonTable {...accessMethodsTable} />

      <h3>Direct Access and the lseek() System Call</h3>
      <p>
        In Direct Access, programs access arbitrary byte offsets instantly without sequential parsing. The POSIX <code>lseek()</code>
        system call updates the file position pointer in the kernel open-file table entry without triggering disk I/O:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          POSIX lseek() System Call Prototype and Offsets
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line font-mono text-xs text-ink/90 dark:text-night-ink/90 space-y-2 overflow-x-auto">
          <div className="font-bold text-brand dark:text-night-brand">off_t lseek(int fd, off_t offset, int whence);</div>
          <div><code>SEEK_SET</code>: New offset = offset (absolute position from byte 0).</div>
          <div><code>SEEK_CUR</code>: New offset = current_offset + offset (relative forward/backward).</div>
          <div><code>SEEK_END</code>: New offset = file_size + offset (relative to end of file; allows sparse file creation).</div>
        </div>
      </div>

      <h2>4. Directory Structures and Implementations</h2>
      <p>
        A directory is a special logical file maintained by the operating system that maps human-readable names to file identifiers (inode numbers).
        Operating systems have evolved through several directory organization architectures:
      </p>

      <h3>Chronological Directory Architectures</h3>
      <ol>
        <li>
          <strong>Single-Level Directory:</strong> All files across the entire computer reside in one shared directory.
          Severe collision flaw: two users cannot create files with identical names (e.g., <code>test.c</code>).
          Offers zero isolation or organizational capability.
        </li>
        <li>
          <strong>Two-Level Directory:</strong> Introduces a Master File Directory (MFD) pointing to individual User File Directories (UFDs).
          Each user owns a private namespace where names can be reused safely.
          Limitation: Isolation prevents collaborative multi-user sharing and forbids nested folder hierarchies.
        </li>
        <li>
          <strong>Tree-Structured Directory:</strong> A hierarchical tree rooted at <code>/</code> (root). Interior nodes represent directories;
          leaf nodes represent files or empty folders. Introduces <strong>absolute pathnames</strong> (full path from root, e.g., <code>/home/mca/os/unit4.txt</code>)
          and <strong>relative pathnames</strong> (relative to current working directory, e.g., <code>./unit4.txt</code>).
        </li>
        <li>
          <strong>Acyclic-Graph Directory:</strong> Allows directories to share subdirectories and files across multiple branches simultaneously.
          A single file can exist in multiple parent directories without duplication of disk storage.
          Requires reference-counting link mechanics to ensure files are not deallocated while references remain.
        </li>
        <li>
          <strong>General Graph Directory:</strong> Arises if arbitrary directory links are permitted, potentially introducing cycles.
          Cycles can trap directory search routines (such as <code>find</code> or backup utilities) in infinite loops and prevent standard
          reference counters from reaching zero (cyclic memory leak), requiring garbage collection algorithms.
        </li>
      </ol>

      <h2>5. Links: Hard Links vs Symbolic (Soft) Links</h2>
      <p>
        Unix-like operating systems implement file sharing through two distinct linking mechanisms:
      </p>

      <ComparisonTable {...linksComparisonTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Deep Dive: The Deletion Lifecycle of a Hard Link
        </h4>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono text-ink/90 dark:text-night-ink/90 space-y-1">
          <div>Step 1: File created: &quot;report.pdf&quot; &rarr; Inode #402118, i_nlink = 1.</div>
          <div>Step 2: Hard link added: &quot;ln report.pdf backup.pdf&quot; &rarr; Inode #402118, i_nlink = 2.</div>
          <div>Step 3: User deletes &quot;report.pdf&quot; via unlink() system call.</div>
          <div>Step 4: Kernel removes &quot;report.pdf&quot; directory entry; decrements Inode #402118 link count (i_nlink = 1).</div>
          <div className="font-bold text-accent dark:text-night-accent">
            Step 5: Physical data blocks are NOT freed! &quot;backup.pdf&quot; retains full access to Inode #402118.
          </div>
          <div>Step 6: User deletes &quot;backup.pdf&quot; &rarr; i_nlink drops to 0.</div>
          <div className="font-bold text-success dark:text-night-success">
            Step 7: If no active process holds an open file descriptor to Inode #402118, disk blocks and inode are released to the free pool.
          </div>
        </div>
      </div>

      <h2>6. File System Mounting and Namespaces</h2>
      <p>
        Before a storage volume (partition, USB drive, or remote NFS share) can be accessed, it must be attached to the logical directory
        hierarchy via <strong>mounting</strong>:
      </p>
      <ul>
        <li>
          <strong>Mount Point:</strong> An existing, empty directory within the current filesystem hierarchy (e.g., <code>/mnt/data</code> or <code>/media/usb</code>).
        </li>
        <li>
          <strong>Mount Procedure:</strong> The kernel verifies the filesystem superblock on the target device, creates a <code>struct vfsmount</code>
          entry in the kernel mount table, and overlays the root directory of the mounted filesystem on top of the mount point.
        </li>
        <li>
          <strong>Pathname Resolution:</strong> During pathname traversal, when the kernel VFS layer encounters a directory entry flagged as a mount point,
          it seamlessly switches traversal to the root dentry of the mounted filesystem.
        </li>
      </ul>

      <h2>7. File Protection and Access Control Models</h2>
      <p>
        Operating systems enforce confidentiality, integrity, and availability by regulating access rights:
      </p>

      <h3>UNIX 12-Bit Permission Architecture</h3>
      <p>
        Every UNIX/Linux inode maintains a 12-bit mode field representing permissions:
      </p>
      <ul>
        <li>
          <strong>Standard 9-Bit Triad (rwxrwxrwx):</strong> Divided into Owner (User), Group, and Other (World).
          Read (<code>r = 4</code>), Write (<code>w = 2</code>), and Execute (<code>x = 1</code>). For directories, &lsquo;x&rsquo; grants search/traversal permission.
        </li>
        <li>
          <strong>SUID (Set User ID, octal 4000):</strong> Executes the binary with the effective privileges of the file owner (e.g., <code>passwd</code> binary owned by root).
        </li>
        <li>
          <strong>SGID (Set Group ID, octal 2000):</strong> On executables, runs with effective group privileges. On directories, forces all newly created files to inherit the parent directory group ID.
        </li>
        <li>
          <strong>Sticky Bit (octal 1000):</strong> When placed on a shared writable directory (e.g., <code>/tmp</code>), only the file owner or root can delete or rename files inside it.
        </li>
      </ul>

      <h3>Access Control Lists (ACLs)</h3>
      <p>
        Standard UNIX triads cannot represent arbitrary access matrices (such as granting write permissions to user Alice and read-only to user Bob without granting access to the entire group).
        <strong>Access Control Lists (ACLs, POSIX 1003.1e)</strong> attach an explicit list of <code>(principal, permissions)</code> pairs to the inode, enabling fine-grained enterprise security policies.
      </p>

      <FAQ items={questions} />
    </>
  )
}
