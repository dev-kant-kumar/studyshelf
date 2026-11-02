import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const allocationTable = {
    caption: 'Comparative Analysis of File Allocation Methods',
    headers: ['Criterion', 'Contiguous Allocation', 'Linked Allocation', 'FAT (File Allocation Table)', 'Indexed Allocation (Multi-Level)'],
    rows: [
      [
        'Sequential Access Speed',
        'Optimal (minimal head seeks; contiguous cylinder streaming).',
        'Moderate (requires seeking between scattered blocks).',
        'Good (cluster pointers resolved rapidly from memory cache).',
        'Excellent (index blocks cached in RAM; ordered direct access).'
      ],
      [
        'Direct / Random Access',
        'Direct mathematical address computation: O(1).',
        'Extremely slow: O(N) intermediate block seeks across disk.',
        'Moderate to fast: pointer chain traversed in RAM table.',
        'Fast: O(1) index block lookup (or 2-3 memory accesses for multi-level).'
      ],
      [
        'External Fragmentation',
        'Severe: requires periodic disk defragmentation / compaction.',
        'Zero: any free block anywhere on disk can be allocated.',
        'Zero: any free cluster can be appended to the allocation chain.',
        'Zero: non-contiguous blocks linked via index structure.'
      ],
      [
        'Internal Fragmentation',
        'Exists only in the final allocated block (average 0.5 * block_size).',
        'Exists only in the final block; plus pointer overhead per block.',
        'Exists in the final cluster of the file.',
        'Exists in the final data block plus unused slots in index blocks.'
      ],
      [
        'Dynamic File Expansion',
        'Extremely difficult: requires pre-allocation or reallocation.',
        'Trivial: allocate new block and append pointer to tail.',
        'Trivial: find free cluster in FAT and update tail pointer.',
        'Trivial: add pointer to index block; allocate new indirect block if full.'
      ],
      [
        'Storage Reliability',
        'High: corrupted sector affects only that specific sector.',
        'Poor: single broken pointer severs access to remaining file.',
        'Moderate: corrupted FAT damages multiple files simultaneously.',
        'High: loss of data block does not break other blocks; index intact.'
      ]
    ]
  }

  const layeredSystemTable = {
    caption: 'Layered File System Hierarchy and Functional Responsibilities',
    headers: ['Layer Name', 'Input from Upper Layer', 'Primary Kernel Responsibilities', 'Output to Lower Layer'],
    rows: [
      [
        'Application Layer',
        'User commands, high-level code',
        'Issues POSIX file system calls: open(), read(), write(), close()',
        'System call traps into kernel VFS'
      ],
      [
        'Logical File System',
        'File pathnames, access modes',
        'Manages directory entries, path resolution, permissions, FCB / inode metadata',
        'FCB / Inode number, file offset'
      ],
      [
        'File-Organization Module',
        'Logical block address (LBA 0..n)',
        'Translates file-relative logical blocks to physical disk sector addresses; tracks free space',
        'Physical block addresses'
      ],
      [
        'Basic File System',
        'Physical block numbers',
        'Issues generic read/write commands; manages system buffer cache and I/O memory buffers',
        'Generic block I/O requests'
      ],
      [
        'I/O Control Layer',
        'Generic block requests',
        'Device drivers and Interrupt Service Routines; programmes controller registers & DMA descriptors',
        'Hardware bus signals, interrupts'
      ],
      [
        'Physical Storage',
        'Bus read/write signals',
        'Physical storage platters, flash NAND cells, NVMe controllers',
        'Raw binary data stream'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        The file system bridges high-level user abstractions with low-level physical block storage.
        This deep technical exploration covers the layered file system architecture, on-disk data layouts,
        the Virtual File System (VFS) object model, mathematical derivations of maximum file sizes in UNIX inodes,
        and a rigorous evaluation of Contiguous, Linked, FAT, and Multi-Level Indexed allocation strategies.
      </p>

      <h2>1. Layered File System Architecture</h2>
      <p>
        To manage the immense complexity of translating symbolic pathnames into electrical hardware signals,
        operating systems partition file management into a modular hierarchy of decoupled layers. Each layer
        relies exclusively on the services provided by the layer beneath it:
      </p>

      <ComparisonTable {...layeredSystemTable} />

      <h2>2. On-Disk File System Layouts</h2>
      <p>
        When a storage volume is formatted with a filesystem (such as ext4 or NTFS), the disk partition is
        divided into standardized control blocks and data regions:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Typical On-Disk Filesystem Partition Layout
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">1. Boot Control Block</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Partition boot record containing bootloader code required to bootstrap the operating system from this volume.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-accent dark:text-night-accent">2. Volume Control Block</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Superblock containing volume geometry, total block count, free block count, block size, and inode table pointers.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success">3. Inode / Directory Tables</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Array of File Control Blocks (FCBs) and directory records mapping symbolic names to internal inode numbers.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-ink dark:text-night-ink">4. Data Block Region</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              The vast majority of the disk holding the actual user payload data blocks and multi-level indirect pointer blocks.
            </p>
          </div>
        </div>
      </div>

      <h2>3. The Virtual File System (VFS) Abstraction</h2>
      <p>
        Modern operating systems concurrently manage radically different filesystems: local journaling filesystems
        (ext4, XFS), legacy volume formats (FAT32, exFAT), network filesystems (NFS, SMB), and synthetic pseudofilesystems
        (<code>/proc</code>, <code>/sys</code>). The Linux kernel unifies these heterogeneous structures through the
        <strong>Virtual File System (VFS)</strong>.
      </p>

      <h3>The Four Core VFS Objects</h3>
      <ul>
        <li>
          <strong>Superblock (<code>struct super_block</code>):</strong> Represents an entire mounted filesystem volume.
          Stores filesystem type, block size, status flags, and a pointer to <code>struct super_operations</code>.
        </li>
        <li>
          <strong>Inode (<code>struct inode</code>):</strong> Represents a specific file, directory, or device node on disk.
          Contains ownership (UID/GID), permission mode, file size, timestamps, and a pointer to <code>struct inode_operations</code>.
        </li>
        <li>
          <strong>Dentry (<code>struct dentry</code>):</strong> Represents a directory entry (a specific component of a pathname).
          Dentries link filenames to their corresponding inode objects. The kernel caches dentries in the <strong>dentry cache (dcache)</strong>
          in RAM, accelerating path traversal from seconds to sub-microsecond memory lookups.
        </li>
        <li>
          <strong>File (<code>struct file</code>):</strong> Represents an active open file associated with a process.
          Maintains per-open state, including current byte offset (<code>f_pos</code>), access flags (<code>f_flags</code>),
          and a pointer to <code>struct file_operations</code>.
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          C Implementation of Polymorphism in Linux VFS
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3">
          The Linux kernel implements object-oriented dynamic dispatch in pure C using function pointer tables:
        </p>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line font-mono text-xs text-ink/90 dark:text-night-ink/90 space-y-1 overflow-x-auto">
          <div className="text-brand dark:text-night-brand font-bold">// Generic VFS file operations table</div>
          <div>struct file_operations &#123;</div>
          <div className="pl-4">ssize_t (*read) (struct file *, char __user *, size_t, loff_t *);</div>
          <div className="pl-4">ssize_t (*write) (struct file *, const char __user *, size_t, loff_t *);</div>
          <div className="pl-4">int (*open) (struct inode *, struct file *);</div>
          <div className="pl-4">int (*release) (struct inode *, struct file *);</div>
          <div className="pl-4">loff_t (*llseek) (struct file *, loff_t, int);</div>
          <div>&#125;;</div>
          <div className="pt-2 text-ink/70 dark:text-night-ink/70">// When user calls read(fd, buf, count), VFS dispatches:</div>
          <div className="text-success dark:text-night-success font-bold">file-&gt;f_op-&gt;read(file, buf, count, &amp;file-&gt;f_pos);</div>
        </div>
      </div>

      <h2>4. UNIX Inode Multi-Level Indexing: Architectural Derivation</h2>
      <p>
        The classic UNIX file system (UFS) and early ext2/ext3 filesystems utilize a combined indexing scheme
        to balance rapid access for small files with the ability to scale to multi-gigabyte or multi-terabyte files.
        A standard inode reserves 15 disk block pointer addresses:
      </p>
      <ul>
        <li><strong>Direct Pointers (Pointers 0 to 11):</strong> 12 direct addresses pointing straight to data blocks.</li>
        <li><strong>Single Indirect Pointer (Pointer 12):</strong> Points to an index block containing direct block addresses.</li>
        <li><strong>Double Indirect Pointer (Pointer 13):</strong> Points to an index block of index blocks.</li>
        <li><strong>Triple Indirect Pointer (Pointer 14):</strong> Points to an index block containing double indirect pointers.</li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Worked Mathematical Derivation: Maximum Supported File Size
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Given Operating System Parameters:</div>
            <div>Disk Block Size (S) = 4 KB = 4,096 bytes</div>
            <div>Disk Block Pointer Address (P) = 4 bytes (32-bit block addresses)</div>
            <div className="text-brand dark:text-night-brand font-bold pt-1">
              Pointers per Index Block (N) = S / P = 4,096 / 4 = 1,024 pointers (2<sup>10</sup> pointers)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Step-by-Step Capacity Calculation:</div>
            <div>
              <strong>1. Direct Allocation (12 Pointers):</strong><br />
              Blocks = 12<br />
              Capacity = 12 &times; 4 KB = <strong>48 KB</strong>
            </div>
            <div>
              <strong>2. Single Indirect Allocation (1 Pointer):</strong><br />
              Blocks = 1 &times; 1,024 = 1,024 blocks<br />
              Capacity = 1,024 &times; 4 KB = 4,096 KB = <strong>4 MB</strong>
            </div>
            <div>
              <strong>3. Double Indirect Allocation (1 Pointer):</strong><br />
              Blocks = 1 &times; 1,024 &times; 1,024 = 1,048,576 blocks (2<sup>20</sup> blocks)<br />
              Capacity = 1,048,576 &times; 4 KB = 4,194,304 KB = <strong>4 GB</strong>
            </div>
            <div>
              <strong>4. Triple Indirect Allocation (1 Pointer):</strong><br />
              Blocks = 1 &times; 1,024 &times; 1,024 &times; 1,024 = 1,073,741,824 blocks (2<sup>30</sup> blocks)<br />
              Capacity = 1,073,741,824 &times; 4 KB = 4,294,967,296 KB = <strong>4 TB</strong>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-success dark:text-night-success font-sans">Total Addressable File Capacity:</div>
            <div>Total Bytes = 48 KB + 4 MB + 4 GB + 4 TB</div>
            <div className="text-success dark:text-night-success font-bold text-sm">
              Total Maximum File Size &asymp; 4.0040039 TB
            </div>
          </div>
        </div>
      </div>

      <h2>5. Comparative Evaluation of Allocation Strategies</h2>
      <p>
        The file-organization module chooses how logical blocks are physically placed on disk sectors.
        The choice directly impacts read/write throughput, fragmentation, seek times, and space efficiency:
      </p>

      <ComparisonTable {...allocationTable} />

      <h3>The File Allocation Table (FAT) Deep-Dive</h3>
      <p>
        The FAT system eliminates the disk seek penalty of linked allocation by pulling block pointers out of data sectors
        into a centralized array located at the head of the volume:
      </p>
      <ul>
        <li>
          <strong>Cluster Mapping:</strong> Disk space is grouped into clusters (e.g., 4 KB to 32 KB).
          The directory entry stores only the initial starting cluster number.
        </li>
        <li>
          <strong>Linked Array Traversal:</strong> FAT entry <code>k</code> stores the cluster number of the succeeding block.
          A marker <code>0xFFFFFFF</code> indicates End-Of-File (EOF); <code>0x0000000</code> marks an unallocated free cluster.
        </li>
        <li>
          <strong>RAM Caching Advantage:</strong> Because the table is centralized, the kernel caches the FAT in RAM.
          Navigating to offset 100 MB requires zero disk seeks during chain walking; only the final target cluster read generates physical I/O.
        </li>
      </ul>

      <Callout type="warning" title="FAT Scalability Limits">
        On high-capacity modern drives, the FAT table becomes excessively large. For example, a 2 TB partition formatted
        with 4 KB clusters contains 536,870,912 clusters. With 32-bit entries (4 bytes each), the FAT table consumes
        <strong>2 GB of storage</strong>, which must be stored twice for redundancy (FAT1 and FAT2), creating unacceptable memory and disk overhead.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
