import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const diskSchedulingTable = {
    caption: 'Disk Scheduling Algorithms Comparative Analysis',
    headers: ['Algorithm', 'Scheduling Logic', 'Total Head Movement (Worked Case)', 'Starvation Risk', 'Ideal Operating Scenario'],
    rows: [
      [
        'FCFS (First-Come, First-Served)',
        'Services pending requests strictly in chronological arrival order.',
        '640 cylinders (Worst)',
        'Zero: guarantees fair, deterministic order.',
        'Extremely low-load systems with few concurrent requests.'
      ],
      [
        'SSTF (Shortest Seek Time First)',
        'Selects the pending request closest to the current head location.',
        '236 cylinders (Low)',
        'High: outer/inner requests starve under local clustered traffic.',
        'Predictable, non-critical desktop workloads.'
      ],
      [
        'SCAN (Elevator Algorithm)',
        'Head sweeps in one direction to the physical boundary, then reverses.',
        '236 cylinders (Low)',
        'Zero: bounds maximum waiting time.',
        'General-purpose operating systems with heavy random I/O loads.'
      ],
      [
        'C-SCAN (Circular SCAN)',
        'Sweeps in one direction to the boundary, resets to start without servicing.',
        '382 cylinders (Moderate)',
        'Zero: provides most uniform waiting time across all cylinders.',
        'Multi-user enterprise database servers.'
      ],
      [
        'LOOK',
        'Sweeps in one direction only to the furthest pending request, then reverses.',
        '208 cylinders (Optimal in example)',
        'Zero: bounded waiting time without boundary seek waste.',
        'Standard HDD schedulers in modern operating systems.'
      ],
      [
        'C-LOOK',
        'Sweeps in one direction to furthest request, resets to closest request.',
        '322 cylinders (Balanced)',
        'Zero: uniform service without boundary seek waste.',
        'Enterprise disk arrays balancing seek time and fair latency.'
      ]
    ]
  }

  const hddVsSsdTable = {
    caption: 'Architectural Comparison: Magnetic HDD vs Solid-State Drive (SSD)',
    headers: ['Characteristic', 'Magnetic Hard Disk Drive (HDD)', 'Solid-State Drive (SSD / NVMe)'],
    rows: [
      [
        'Physical Mechanism',
        'Mechanical spinning platters, magnetic read/write actuator heads.',
        'Semiconductor NAND flash memory chips; zero moving parts.'
      ],
      [
        'Seek & Rotational Latency',
        'Substantial: 4 to 12 milliseconds per random read seek.',
        'Zero: nanosecond random access across all memory addresses.'
      ],
      [
        'Read/Write Unit Granularity',
        'Symmetric sector level (512 bytes or 4,096 bytes).',
        'Asymmetric: Reads/Writes at Page level (4-16 KB); Erases at Block level (2-8 MB).'
      ],
      [
        'In-Place Updates',
        'Fully supported: overwrites magnetic tracks directly.',
        'Impossible: requires Erase-Before-Write; out-of-place writes via FTL.'
      ],
      [
        'Write Endurance',
        'Practically infinite write cycles (limited by mechanical bearing wear).',
        'Finite write cycles (1,000 to 10,000 P/E cycles per NAND cell).'
      ],
      [
        'Kernel I/O Schedulers',
        'SCAN, LOOK, CFQ (optimized to minimize mechanical arm motion).',
        'None / No-op, mq-deadline, Kyber (multi-queue hardware parallelism).'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Secondary storage management governs the performance, latency, and throughput of non-volatile data access.
        This comprehensive study explores magnetic hard drive geometry, physical latency derivations, Logical Block Addressing (LBA),
        a complete mathematical walkthrough of disk scheduling algorithms, Solid-State Drive (SSD) flash architecture,
        the Flash Translation Layer (FTL), wear leveling, the TRIM command, and modern NVMe multi-queue scheduling.
      </p>

      <h2>1. Magnetic Disk Physical Architecture</h2>
      <p>
        Traditional secondary storage relies on magnetic hard disk drives (HDDs). An HDD is an electromechanical device
        constructed from multiple stacked, rigid circular platters:
      </p>
      <ul>
        <li>
          <strong>Platters and Spindle:</strong> Platters are coated with a microscopically thin magnetic recording film.
          All platters are mounted onto a central spindle that rotates continuously at a fixed angular velocity,
          typically 5,400, 7,200, 10,000, or 15,000 Revolutions Per Minute (RPM).
        </li>
        <li>
          <strong>Read/Write Heads:</strong> Both the top and bottom surfaces of each platter are read and written by dedicated
          magnetic heads. The heads &ldquo;fly&rdquo; on an aerodynamic cushion of air nanometers above the spinning surface.
        </li>
        <li>
          <strong>Actuator Arm Assembly:</strong> All read/write heads are fixed to a single rigid mechanical assembly.
          When the voice-coil actuator moves the arm, all heads move radially across platter surfaces in unison.
        </li>
        <li>
          <strong>Tracks and Cylinders:</strong> Each platter surface is divided into concentric circular rings called <strong>tracks</strong>.
          The set of all tracks across all platter surfaces located at the identical radial arm position forms a <strong>cylinder</strong>.
        </li>
        <li>
          <strong>Sectors:</strong> Tracks are subdivided into discrete angular arcs called <strong>sectors</strong>.
          The sector is the atomic transfer unit of the physical disk (historically 512 bytes, now 4,096 bytes in Advanced Format 4Kn drives).
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Mathematical Formulation of Disk Access Latency
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Total Access Time Formula:</div>
            <div className="text-brand dark:text-night-brand font-bold text-sm">
              Total Access Time = T<sub>seek</sub> + T<sub>rotation</sub> + T<sub>transfer</sub> + T<sub>controller</sub>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Individual Latency Components:</div>
            <div>
              <strong>1. Seek Time (T<sub>seek</sub>):</strong> Time for mechanical arm to position heads over target cylinder (3 to 9 ms).
            </div>
            <div>
              <strong>2. Average Rotational Latency (T<sub>rotation</sub>):</strong> Time for target sector to rotate beneath head.<br />
              T<sub>rotation</sub> = 0.5 &times; (60 seconds / RPM)<br />
              For a 7,200 RPM drive: T<sub>rotation</sub> = 0.5 &times; (60,000 ms / 7,200) = <strong>4.17 ms</strong>
            </div>
            <div>
              <strong>3. Transfer Time (T<sub>transfer</sub>):</strong> Time to read or write data bits off the track.<br />
              T<sub>transfer</sub> = Number of Bytes to Transfer / Peak Internal Data Transfer Rate
            </div>
            <div>
              <strong>4. Controller Overhead (T<sub>controller</sub>):</strong> Electronic processing latency to validate ECC and transfer across the SATA/SAS bus (typically &lt; 0.5 ms).
            </div>
          </div>
        </div>
      </div>

      <h2>2. Addressing: CHS vs Logical Block Addressing (LBA)</h2>
      <p>
        Historically, computers addressed disk sectors using <strong>Cylinder-Head-Sector (CHS)</strong> coordinates.
        This required the operating system to understand the drive exact internal geometry:
      </p>
      <ul>
        <li>
          <strong>The CHS Capacity Wall:</strong> BIOS INT 13h allocated 10 bits for cylinders (1,024), 8 bits for heads (256),
          and 6 bits for sectors (63), imposing a strict <strong>8.4 GB capacity limit</strong>.
        </li>
        <li>
          <strong>Zone-Bit Recording (ZBR):</strong> Outer tracks on a circular platter have greater physical circumference than inner tracks.
          Modern drives pack significantly more sectors onto outer tracks than inner tracks. Because CHS assumed constant sectors per track,
          it could not support ZBR.
        </li>
        <li>
          <strong>Logical Block Addressing (LBA):</strong> Modern operating systems treat the disk as a flat, one-dimensional array
          of logical blocks numbered sequentially from <code>0</code> to <code>N - 1</code>.
          The embedded disk controller maps 1-D LBA indices to internal physical geometry, defective sector lists, and ZBR zones transparently.
        </li>
      </ul>

      <h2>3. Disk Scheduling Algorithms</h2>
      <p>
        Because seek time is the dominant bottleneck in mechanical hard drives, the operating system reorders pending I/O requests
        in the queue to minimize physical head movement:
      </p>

      <ComparisonTable {...diskSchedulingTable} />

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Worked Examination Problem: Comprehensive Disk Scheduling Comparison
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Problem Specification:</div>
            <div>Disk Geometry: 200 Cylinders (numbered 0 to 199)</div>
            <div>Initial Head Position: Cylinder 53</div>
            <div>Pending Request Queue: [98, 183, 37, 122, 14, 124, 65, 67]</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Algorithm Traces and Head Movement:</div>
            <div>
              <strong>1. FCFS:</strong> 53 &rarr; 98 &rarr; 183 &rarr; 37 &rarr; 122 &rarr; 14 &rarr; 124 &rarr; 65 &rarr; 67<br />
              Movement = 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = <strong>640 cylinders</strong>
            </div>
            <div>
              <strong>2. SSTF:</strong> 53 &rarr; 65 &rarr; 67 &rarr; 37 &rarr; 14 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183<br />
              Movement = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = <strong>236 cylinders</strong>
            </div>
            <div>
              <strong>3. SCAN (moving down towards 0):</strong> 53 &rarr; 37 &rarr; 14 &rarr; <strong>0</strong> &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183<br />
              Movement = (53 - 0) + (183 - 0) = 53 + 183 = <strong>236 cylinders</strong>
            </div>
            <div>
              <strong>4. C-SCAN (moving up towards 199):</strong> 53 &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183 &rarr; <strong>199</strong> &rarr; <strong>0</strong> &rarr; 14 &rarr; 37<br />
              Movement = (199 - 53) + (199 - 0) + (37 - 0) = 146 + 199 + 37 = <strong>382 cylinders</strong>
            </div>
            <div>
              <strong>5. LOOK (moving down towards 0):</strong> 53 &rarr; 37 &rarr; 14 &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183 (stops at 14; skips 0)<br />
              Movement = (53 - 14) + (183 - 14) = 39 + 169 = <strong>208 cylinders</strong>
            </div>
            <div>
              <strong>6. C-LOOK (moving up towards 199):</strong> 53 &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183 &rarr; 14 &rarr; 37 (skips 199 and 0)<br />
              Movement = (183 - 53) + (183 - 14) + (37 - 14) = 130 + 169 + 23 = <strong>322 cylinders</strong>
            </div>
          </div>
        </div>
      </div>

      <h2>4. Solid-State Drive (SSD) Architecture</h2>
      <p>
        Solid-State Drives (SSDs) replace mechanical platters with semiconductor <strong>NAND flash memory</strong>.
        SSDs have completely transformed secondary storage design:
      </p>

      <ComparisonTable {...hddVsSsdTable} />

      <h3>The Erase-Before-Write Asymmetry and FTL</h3>
      <p>
        NAND flash introduces a unique physical constraint:
      </p>
      <ul>
        <li>
          <strong>Page vs Block Granularity:</strong> Data is read and written in <strong>Pages</strong> (4 KB to 16 KB),
          but data can only be erased in <strong>Blocks</strong> (128 to 512 pages, totaling 2 MB to 8 MB).
        </li>
        <li>
          <strong>Out-of-Place Writes:</strong> Once a flash page is written, it cannot be rewritten until the entire enclosing
          block is erased. The <strong>Flash Translation Layer (FTL)</strong> writes the updated data to an empty page elsewhere,
          updates its internal LBA-to-physical mapping table, and flags the old page as &ldquo;invalid&rdquo; (stale).
        </li>
        <li>
          <strong>Garbage Collection &amp; Write Amplification:</strong> When free blocks run low, the FTL triggers Garbage Collection:
          it copies remaining valid pages out of a fragmented block into a clean block, then erases the old block.
          This causes <strong>Write Amplification</strong> (writing more flash bytes than the host requested).
        </li>
        <li>
          <strong>Wear Leveling:</strong> Flash cells endure only 1,000 to 10,000 program/erase cycles before physical breakdown.
          The FTL implements Dynamic and Static Wear Leveling, distributing erase cycles uniformly across the entire memory array.
        </li>
        <li>
          <strong>The TRIM Command:</strong> When files are deleted, standard filesystems only remove directory entries.
          The <code>TRIM</code> system command informs the SSD FTL that specific LBAs are no longer in use, allowing garbage collection
          to skip copying stale pages and maintaining maximum drive write speeds.
        </li>
      </ul>

      <Callout type="info" title="Why Elevator Scheduling is Obsolete on NVMe SSDs">
        Traditional schedulers (SCAN, LOOK) assume mechanical head movement penalties. On modern NVMe SSDs, all flash cells
        exhibit uniform random access latencies (~10 &mu;s). Running an elevator scheduler serializes requests and consumes CPU cycles.
        Modern Linux systems use the <code>none</code> scheduler or multi-queue schedulers (<code>mq-deadline</code>, <code>kyber</code>),
        enabling NVMe drives to service up to 64,000 hardware queues in parallel with 64,000 commands per queue!
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
