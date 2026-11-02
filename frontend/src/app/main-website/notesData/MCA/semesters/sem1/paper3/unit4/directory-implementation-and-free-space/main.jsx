import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const directoryStructuresTable = {
    caption: 'Directory Implementation Data Structures Comparison',
    headers: ['Data Structure', 'Lookup Complexity', 'Insertion Complexity', 'Deletion Complexity', 'Strengths and Scaling Profile'],
    rows: [
      [
        'Linear List',
        'O(N) sequential search',
        'O(N) check + O(1) append',
        'O(N) search + mark/shift',
        'Simple to implement; adequate only for small directories (< 100 entries).'
      ],
      [
        'Hash Table with Chaining',
        'O(1) average; O(N) worst',
        'O(1) average',
        'O(1) average',
        'Extremely fast lookups; requires collision chaining and fixed table resizing.'
      ],
      [
        'B+ Tree / HTree (ext4, XFS)',
        'O(log N) worst case',
        'O(log N) tree rebalance',
        'O(log N) tree rebalance',
        'Industrial standard; scales to millions of entries; supports rapid range queries.'
      ]
    ]
  }

  const freeSpaceTable = {
    caption: 'Free-Space Management Algorithms Comparison',
    headers: ['Technique', 'Memory Overhead', 'Allocation Latency', 'Contiguous Block Finding', 'Key Systems Trade-Off'],
    rows: [
      [
        'Bit Vector / Bitmap',
        'Fixed: 1 bit per disk block (32 MB for 1 TB disk)',
        'O(1) using CPU bit-scan instructions (tzcnt / bsfl)',
        'Optimal (contiguous bits correspond to contiguous sectors)',
        'High RAM usage; ideal when cached entirely in main memory.'
      ],
      [
        'Linked Free List',
        'Zero extra RAM (pointers stored inside free blocks)',
        'O(1) for single block from head',
        'Very difficult (requires traversing scattered disk blocks)',
        'Zero RAM cost, but severe disk seek overhead during list traversal.'
      ],
      [
        'Grouping',
        'Minimal (cached master block of block addresses)',
        'O(1) burst allocation of n blocks',
        'Moderate (stores blocks in clusters of n addresses)',
        'Greatly reduces disk I/O compared to single-pointer linked lists.'
      ],
      [
        'Counting',
        'Minimal on defragmented volumes',
        'O(1) for contiguous spans',
        'Optimal (explicitly stores starting block & contiguous count)',
        'List expands if disk suffers high fragmentation.'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Robust operating systems require high-performance directory lookups, scalable free-space tracking,
        and fail-safe crash resilience. This study examines linear lists, hash tables, and B+ tree directory
        structures, mathematical derivations of bitmap sizing, the metadata update crash hazard, Write-Ahead
        Logging (Journaling) modes, and modern Copy-on-Write (CoW) consistency guarantees.
      </p>

      <h2>1. Directory Implementation Techniques</h2>
      <p>
        A directory translates human-readable file path strings into the internal file identifier (inode number).
        Because every file operation (opening, reading metadata, or executing a program) requires directory lookups,
        the efficiency of directory searching governs overall operating system responsiveness.
      </p>

      <ComparisonTable {...directoryStructuresTable} />

      <h3>The Modern B+ Tree / HTree Solution</h3>
      <p>
        In modern enterprise filesystems (such as Linux ext4, SGI XFS, and Windows NTFS), directories are implemented
        using balanced search trees:
      </p>
      <ul>
        <li>
          <strong>ext4 HTree:</strong> A specialized constant-depth index tree using 32-bit hashes of filenames as keys.
          It prevents hash collision attacks while retaining constant-time <code>O(1)</code> to logarithmic <code>O(log N)</code> lookups
          even in directories holding 10 million files.
        </li>
        <li>
          <strong>In-Memory Dentry Cache (dcache):</strong> Regardless of on-disk structure, the Linux kernel maintains
          a hash table of recently resolved directory components in RAM. A successful hit in the dcache resolves the
          path in nanoseconds without issuing any physical disk reads.
        </li>
      </ul>

      <h2>2. Free-Space Management Mechanisms</h2>
      <p>
        When files are created or expanded, the operating system must allocate unassigned disk blocks.
        When files are truncated or deleted, the released blocks must be returned to the free pool:
      </p>

      <ComparisonTable {...freeSpaceTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Worked Mathematical Derivation: Bit Vector Sizing for a 1 TB Disk
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Storage Parameters:</div>
            <div>Total Drive Capacity = 1 TB = 1,024 GB = 1,048,576 MB = 1,099,511,627,776 bytes (2<sup>40</sup> bytes)</div>
            <div>Filesystem Allocation Block Size = 4 KB = 4,096 bytes (2<sup>12</sup> bytes)</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Step-by-Step Bit Allocation:</div>
            <div>
              <strong>Step 1: Compute Total Number of Physical Blocks</strong><br />
              Total Blocks = Total Disk Bytes / Block Size<br />
              Total Blocks = 2<sup>40</sup> / 2<sup>12</sup> = 2<sup>28</sup> blocks = <strong>268,435,456 blocks</strong>
            </div>
            <div>
              <strong>Step 2: Calculate Required Bit Vector Size in Bits</strong><br />
              Since 1 bit tracks exactly 1 block:<br />
              Total Bits = 2<sup>28</sup> bits
            </div>
            <div>
              <strong>Step 3: Convert Bits to Bytes</strong><br />
              Bytes = 2<sup>28</sup> bits / 8 bits per byte = 2<sup>28</sup> / 2<sup>3</sup> = 2<sup>25</sup> bytes
            </div>
            <div>
              <strong>Step 4: Convert Bytes to Megabytes</strong><br />
              Megabytes = 2<sup>25</sup> bytes / 2<sup>20</sup> bytes per MB = 2<sup>5</sup> MB = <strong>32 MB</strong>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-success dark:text-night-success font-sans">Conclusion &amp; Performance Impact:</div>
            <div className="text-success dark:text-night-success font-bold text-sm">
              Bitmap Memory Footprint = Exactly 32 Megabytes of RAM
            </div>
            <p className="text-ink/80 dark:text-night-ink/80 font-sans pt-1">
              On modern servers with gigabytes of RAM, keeping the entire 32 MB bitmap in memory is trivial.
              CPUs locate free blocks in 1 clock cycle using the <code>tzcnt</code> (Count Trailing Zeros) assembly instruction.
            </p>
          </div>
        </div>
      </div>

      <h2>3. File System Consistency and Crash Recovery</h2>
      <p>
        A fundamental dilemma in operating system design is that a single logical file operation requires
        multiple discrete physical disk writes. Because disk hardware updates one sector at a time, a sudden
        power failure or kernel panic midway through an update leaves the filesystem in a corrupted, inconsistent state.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-danger dark:text-night-danger mb-2 font-sans">
          The Metadata Update Inconsistency Hazard: Appending to a File
        </h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 mb-3">
          Appending a new data block to an existing file requires three separate physical writes:
        </p>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Write 1:</strong> Update the Free Block Bitmap to mark Block #5042 as allocated.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Write 2:</strong> Update the Inode to record Block #5042 in its pointer table and increment file size.
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong>Write 3:</strong> Write the actual user data bytes into Block #5042.
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs">
          <div className="font-bold text-danger dark:text-night-danger">Failure Scenarios:</div>
          <ul className="list-disc pl-4 mt-1 space-y-1 text-ink/80 dark:text-night-ink/80">
            <li>
              <strong>Crash between Write 1 and Write 2:</strong> Block #5042 is marked allocated in the bitmap, but no inode points to it.
              The block is leaked forever and cannot be used by any file.
            </li>
            <li>
              <strong>Crash between Write 2 and Write 1:</strong> The inode points to Block #5042, but the bitmap marks it free.
              Another file can claim Block #5042, causing two files to overwrite each other (severe data corruption and security hazard).
            </li>
          </ul>
        </div>
      </div>

      <h3>Offline Scavenging (fsck) vs Write-Ahead Logging (Journaling)</h3>
      <p>
        Older filesystems relied on <code>fsck</code> (File System Check) upon reboot. <code>fsck</code> scans every single
        inode and directory on disk to reconstruct invariants, a process that can take hours or days on multi-terabyte drives.
      </p>
      <p>
        Modern systems (Linux ext3/ext4, Windows NTFS, XFS) resolve this using <strong>Journaling (Write-Ahead Logging / WAL)</strong>:
      </p>
      <ol>
        <li>
          <strong>Log Transaction:</strong> The sequence of intended metadata updates is written to a dedicated circular journal on disk.
        </li>
        <li>
          <strong>Commit:</strong> An atomic commit record is appended to the journal, marking the transaction valid.
        </li>
        <li>
          <strong>Checkpoint:</strong> The changes are lazily written to their permanent on-disk structures.
        </li>
        <li>
          <strong>Fast Crash Recovery:</strong> On reboot, the kernel scans only the small journal.
          Committed transactions are replayed (redo); uncommitted transactions are discarded. Recovery completes in milliseconds.
        </li>
      </ol>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          The Three Linux ext4 Journaling Modes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-brand dark:text-night-brand">1. Journal Mode</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Both metadata AND user data are logged to the journal before writing to disk.
              Maximum integrity; halves write speed due to double disk writes.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-success dark:text-night-success">2. Ordered Mode (Default)</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Only metadata is journaled, but user data blocks are guaranteed to flush to disk BEFORE the metadata transaction commits.
              Prevents files from reading uninitialized stale sectors after a crash.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <div className="font-bold text-accent dark:text-night-accent">3. Writeback Mode</div>
            <p className="mt-1 text-ink/80 dark:text-night-ink/80">
              Only metadata is journaled; user data flushes asynchronously without ordering guarantees.
              Highest throughput; after a crash, files may briefly display stale disk blocks.
            </p>
          </div>
        </div>
      </div>

      <h2>4. Copy-on-Write (CoW) Architectures: ZFS and Btrfs</h2>
      <p>
        Next-generation filesystems discard journaling entirely by embracing <strong>Copy-on-Write (CoW)</strong>:
      </p>
      <ul>
        <li>
          <strong>Never Overwrite in Place:</strong> When modifying data block <em>D</em>, the filesystem allocates a new free block <em>D&prime;</em>
          and writes the modified data there.
        </li>
        <li>
          <strong>Cascading Pointer Updates:</strong> The parent pointer block is copied to point to <em>D&prime;</em>, propagating
          upwards through the Merkle tree to the root anchor pointer (the <em>uberblock</em>).
        </li>
        <li>
          <strong>Atomic Root Switch:</strong> The new uberblock is written in a single atomic write. The entire update becomes valid simultaneously.
          If power fails prior to writing the uberblock, the filesystem automatically remains in its pristine earlier state.
        </li>
        <li>
          <strong>Zero-Cost Instantaneous Snapshots:</strong> A snapshot simply clones the root tree pointer.
          Because old blocks are never overwritten, snapshots take less than a millisecond and occupy zero extra disk space until data diverges.
        </li>
      </ul>

      <FAQ items={questions} />
    </>
  )
}
