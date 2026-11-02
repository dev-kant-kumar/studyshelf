import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const raidComparisonTable = {
    caption: 'Comprehensive Architectural Comparison of Standard RAID Levels',
    headers: ['RAID Level', 'Redundancy Principle', 'Storage Efficiency (N Drives of Capacity C)', 'Fault Tolerance', 'Random Write Penalty'],
    rows: [
      [
        'RAID 0',
        'Block-level striping without redundancy.',
        '100% (N &times; C)',
        '0 drives (single failure destroys entire array)',
        '1 write (zero penalty)'
      ],
      [
        'RAID 1',
        'Physical disk mirroring (exact duplicates).',
        '50% (C for 2 disks)',
        '1 drive per mirrored pair',
        '2 writes (writes to both primary & mirror)'
      ],
      [
        'RAID 4',
        'Block striping with dedicated centralized parity disk.',
        '((N - 1) / N) &times; 100%',
        '1 drive (parity disk or any single data disk)',
        '2 reads + 2 writes (parity disk is severe bottleneck)'
      ],
      [
        'RAID 5',
        'Block striping with cyclically distributed XOR parity.',
        '((N - 1) / N) &times; 100%',
        '1 drive anywhere in the array',
        '2 reads + 2 writes (distributed parity avoids bottleneck)'
      ],
      [
        'RAID 6',
        'Block striping with dual distributed parity (XOR P + Reed-Solomon Q).',
        '((N - 2) / N) &times; 100%',
        '2 simultaneous drive failures',
        '3 reads + 3 writes (higher computational penalty)'
      ],
      [
        'RAID 10 (1+0)',
        'Stripe of mirrors (RAID 0 over multiple RAID 1 pairs).',
        '50% ((N / 2) &times; C)',
        'Survives multiple failures if in distinct mirror sets',
        '2 writes (zero parity calculation overhead)'
      ]
    ]
  }

  return (
    <>
      <p className="lead">
        Storage reliability guarantees that persistent data remains intact despite physical hardware degradation,
        sector decay, head crashes, and power failures. This study covers physical and logical disk formatting,
        the complete system bootstrap pipeline from firmware to kernel initialization, defective sector management
        (sparing vs slipping), RAID architectures (0, 1, 5, 6, 10), and the exact mathematics of XOR parity reconstruction.
      </p>

      <h2>1. Disk Formatting: Physical vs Logical</h2>
      <p>
        Before a storage drive can hold files, it must undergo a two-phase structural preparation process:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          The Two Levels of Disk Formatting
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-brand dark:text-night-brand">1. Low-Level (Physical) Formatting</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              Executed at the factory during manufacturing. It writes physical sector divisions directly onto magnetic recording tracks.
              Each sector receives:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li><strong>Preamble / Header:</strong> Bit synchronization markers, cylinder/head/sector numbers, and defect flags.</li>
              <li><strong>Payload Data:</strong> 512 bytes (legacy) or 4,096 bytes (Advanced Format 4Kn).</li>
              <li><strong>Trailing ECC:</strong> Error-Correcting Code bytes (Reed-Solomon / LDPC) for real-time bit-flip detection and repair.</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-2">
            <div className="font-bold text-success dark:text-night-success">2. Partitioning &amp; High-Level (Logical) Formatting</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              Executed by the operating system installer or system administrator:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-ink/80 dark:text-night-ink/80">
              <li><strong>Partitioning:</strong> Slices the drive into logical containers using MBR (Master Boot Record) or modern GPT (GUID Partition Table).</li>
              <li><strong>Filesystem Generation:</strong> Writes the superblock, inode allocation tables, free-space bitmaps, and creates the root directory (<code>/</code>).</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>2. Boot Block and System Bootstrap Architecture</h2>
      <p>
        Bootstrapping is the sequence of software transitions that brings a computer from cold electrical power-on
        to an operational multitasking operating system:
      </p>
      <ol>
        <li>
          <strong>Firmware Execution (BIOS / UEFI):</strong> When power is applied, the CPU program counter points to
          non-volatile ROM/NVRAM. Firmware executes the <strong>Power-On Self-Test (POST)</strong> to diagnose CPU registers,
          memory modules, and PCI devices.
        </li>
        <li>
          <strong>Locating the Boot Sector:</strong> In legacy BIOS, firmware reads Sector 0 (LBA 0) of the primary drive:
          the <strong>Master Boot Record (MBR)</strong>. In modern systems, <strong>UEFI</strong> reads the GUID Partition Table (GPT)
          and boots directly into the FAT32-formatted EFI System Partition (ESP).
        </li>
        <li>
          <strong>Primary Bootloader (Stage 1):</strong> In MBR systems, LBA 0 contains 446 bytes of machine code.
          Because 446 bytes is insufficient to understand filesystems, it merely locates the active partition boot record (VBR)
          and chain-loads the secondary bootloader.
        </li>
        <li>
          <strong>Secondary Bootloader (e.g., GRUB2):</strong> Contains native filesystem drivers (ext4, XFS, Btrfs).
          GRUB displays the operating system selection menu, loads the compressed Linux kernel image (<code>vmlinuz</code>)
          and the Initial RAM Disk (<code>initramfs</code>) into RAM, and executes the kernel entry point.
        </li>
        <li>
          <strong>Kernel Initialization:</strong> The kernel probes hardware devices, uncompresses the <code>initramfs</code>
          to load storage and network drivers, mounts the true root filesystem, and spawns the initial user-space process
          (<strong>PID 1: systemd</strong>).
        </li>
      </ol>

      <h2>3. Bad Block Management: Sparing vs Slipping</h2>
      <p>
        Manufacturing imperfections or mechanical head contact create microscopic physical media flaws called <strong>Bad Blocks</strong>.
        Drive electronics isolate and repair these flaws transparently:
      </p>
      <ul>
        <li>
          <strong>Factory Defect List (P-List):</strong> Permanent manufacturing defects detected at the factory during low-level formatting.
        </li>
        <li>
          <strong>Grown Defect List (G-List):</strong> Defective sectors that decay during drive runtime due to magnetic degradation or repeated read errors.
        </li>
      </ul>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-2 font-sans">
          Hardware Defect Remediation: Sparing vs Slipping
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-accent dark:text-night-accent">Sector Sparing (Forwarding / Remapping)</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              The controller reserves a hidden pool of spare sectors on each cylinder or spare tracks.
              When sector #104 falls bad, the controller updates its internal G-List translation table: any read/write
              to LBA #104 is transparently re-routed to Spare Sector #S1.
            </p>
            <div className="text-ink/70 dark:text-night-ink/70 font-sans pt-1">
              <em>Trade-Off:</em> Sparing introduces seek latency because the read head must divert to the spare track.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-success dark:text-night-success">Sector Slipping</div>
            <p className="text-ink/80 dark:text-night-ink/80">
              When a defect is identified during low-level formatting, the controller shifts (slips) all subsequent sector addresses forward.
              If sector 17 is defective, physical sector 18 becomes logical 17, and physical sector 19 becomes logical 18.
            </p>
            <div className="text-success dark:text-night-success font-sans pt-1">
              <em>Advantage:</em> Preserves rotational contiguity and maximum sequential transfer bandwidth!
            </div>
          </div>
        </div>
      </div>

      <h2>4. Redundant Arrays of Independent Disks (RAID)</h2>
      <p>
        RAID unifies multiple physical storage drives into a single logical volume, balancing capacity, performance, and fault tolerance:
      </p>

      <ComparisonTable {...raidComparisonTable} />

      <h2>5. RAID 5 Parity Mathematics and Data Reconstruction</h2>
      <p>
        RAID 5 achieves single-drive fault tolerance with minimum storage overhead by applying the bitwise
        <strong>Exclusive-OR (XOR, &oplus;)</strong> operator across data stripes:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-sm font-bold text-brand dark:text-night-brand mb-3 font-sans">
          Worked Mathematical Example: RAID 5 Parity Generation &amp; Single-Disk Rebuild
        </h4>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Given Three Data Disks with Byte Payloads:</div>
            <div>Disk 1 (D<sub>1</sub>) = 1 0 1 1 0 0 1 1</div>
            <div>Disk 2 (D<sub>2</sub>) = 1 1 0 0 1 1 0 1</div>
            <div>Disk 3 (D<sub>3</sub>) = 0 1 1 0 1 0 1 0</div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-ink dark:text-night-ink font-sans">Phase 1: Compute Parity Byte P = D<sub>1</sub> &oplus; D<sub>2</sub> &oplus; D<sub>3</sub></div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 7: 1 &oplus; 1 &oplus; 0 = 0</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 6: 0 &oplus; 1 &oplus; 1 = 0</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 5: 1 &oplus; 0 &oplus; 1 = 0</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 4: 1 &oplus; 0 &oplus; 0 = 1</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 3: 0 &oplus; 1 &oplus; 1 = 0</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 2: 0 &oplus; 1 &oplus; 0 = 1</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 1: 1 &oplus; 0 &oplus; 1 = 0</div>
            <div className="text-ink/80 dark:text-night-ink/80">Bit 0: 1 &oplus; 1 &oplus; 0 = 0</div>
            <div className="text-brand dark:text-night-brand font-bold pt-1">
              Parity Byte P = 0 0 0 1 0 1 0 0 (Stored on Parity Disk)
            </div>
          </div>

          <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line space-y-1">
            <div className="font-bold text-danger dark:text-night-danger font-sans">Phase 2: Catastrophic Crash of Disk 2</div>
            <p className="text-ink/80 dark:text-night-ink/80 font-sans">
              Disk 2 suffers physical actuator motor failure. D<sub>2</sub> is lost.
              The RAID controller reads surviving disks D<sub>1</sub>, D<sub>3</sub>, and Parity P:
            </p>
            <div className="text-success dark:text-night-success font-bold">
              Mathematical Derivation: D<sub>2</sub> = D<sub>1</sub> &oplus; D<sub>3</sub> &oplus; P
            </div>
            <div className="text-ink/80 dark:text-night-ink/80 pt-1">
              D<sub>1</sub> = 1 0 1 1 0 0 1 1<br />
              D<sub>3</sub> = 0 1 1 0 1 0 1 0<br />
              P  = 0 0 0 1 0 1 0 0
            </div>
            <div className="text-success dark:text-night-success font-bold text-sm pt-2">
              Reconstructed D<sub>2</sub> = 1 1 0 0 1 1 0 1 (Matches original lost D<sub>2</sub> byte exactly!)
            </div>
          </div>
        </div>
      </div>

      <Callout type="warning" title="The RAID 5 Small-Write Penalty &amp; Write Hole">
        Modifying a single data block in RAID 5 cannot update parity in one write. It requires the <strong>Small Write Penalty</strong>:
        (1) Read old data, (2) Read old parity, (3) Compute new parity: <code>P_new = P_old &oplus; D_old &oplus; D_new</code>,
        (4) Write new data, and (5) Write new parity (2 reads + 2 writes = 4 I/O operations).<br />
        Furthermore, if power fails between step 4 and step 5, parity falls permanently out of sync with data (the <strong>RAID Write Hole</strong>).
        Enterprise arrays protect against this using non-volatile battery-backed cache (NVRAM) or transaction journaling.
      </Callout>

      <FAQ items={questions} />
    </>
  )
}
