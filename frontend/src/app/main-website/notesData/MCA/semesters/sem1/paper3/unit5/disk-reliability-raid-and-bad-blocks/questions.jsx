const questions = [
  {
    id: 'disk-formatting-levels',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Compare Low-Level (Physical) Formatting with High-Level (Logical) Formatting. What structures are written to disk during each stage?',
    answer: [
      'Operating systems and manufacturers format secondary storage in two distinct phases:',
      '1. Low-Level (Physical) Formatting: Typically executed at the factory during manufacturing. It divides the physical magnetic platters into tracks and sectors. For each sector, the disk controller writes: (a) Preamble / Header: Contains synchronization bit patterns, cylinder/head/sector numbers, and defect flags. (b) Data Area: The payload area (512 or 4,096 bytes). (c) Trailing ECC (Error-Correcting Code): A mathematical checksum (typically Reed-Solomon or LDPC) used by hardware to detect and correct single-bit and multi-bit read errors automatically.',
      '2. Partitioning and High-Level (Logical) Formatting: Executed by the user or operating system installer. (a) Partitioning: Divides the drive into one or more logical volumes (MBR or GPT partition tables). (b) High-Level Formatting: Writes the logical file system structures to the partition. This writes the filesystem boot block, superblock / Master File Table, inode tables, free-space bitmaps, and creates the root directory ("/") ready for user file storage.'
    ]
  },
  {
    id: 'boot-block-and-system-bootstrap',
    level: 'medium',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Trace the complete System Bootstrap Sequence from power-on to user space: BIOS/UEFI, MBR/GPT, Bootloader (GRUB), and Kernel initialization.',
    answer: [
      'Booting an operating system involves a multi-stage chain-loading sequence:',
      'Step 1: Power-On and Firmware Initialization (BIOS / UEFI): When the computer is powered on, the CPU initializes its registers and executes firmware stored in non-volatile ROM/NVRAM. The firmware runs POST (Power-On Self-Test) to verify RAM, CPU, and connected hardware peripherals.',
      'Step 2: Locating the Boot Media: BIOS reads the first physical sector (LBA 0) of the configured boot drive, called the Master Boot Record (MBR). In modern UEFI systems, UEFI reads the GUID Partition Table (GPT) and directly accesses the FAT32-formatted EFI System Partition (ESP).',
      'Step 3: Loading the Primary Bootloader: In MBR systems, LBA 0 contains 446 bytes of bootstrap machine code. Because 446 bytes is too small to understand complex filesystems, it merely locates the active partition, loads its Volume Boot Record (VBR), and jumps to Stage-1.5/Stage-2 bootloaders (such as GRUB). In UEFI, the firmware natively executes the signed EFI binary (/EFI/BOOT/bootx64.efi).',
      'Step 4: Secondary Bootloader (e.g., GRUB2): GRUB contains filesystem drivers (ext4, NTFS). It displays the OS selection menu, loads the Linux kernel binary (vmlinuz) and the Initial RAM Disk (initramfs) into physical memory, and transfers CPU execution to the kernel entry point.',
      'Step 5: Kernel Initialization: The kernel probes hardware, mounts the initramfs root filesystem, loads essential device drivers, initializes the scheduler and memory management subsystem, mounts the real root filesystem, and spawns the first user-space initialization process (PID 1: systemd or init).'
    ]
  },
  {
    id: 'bad-block-management-sparing-vs-slipping',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Explain Bad Block Management in magnetic drives and SSDs. Compare Sector Sparing (Forwarding) with Sector Slipping.',
    answer: [
      'Due to microscopic physical manufacturing imperfections or mechanical head wear, certain disk sectors become defective and fail to retain magnetic charge or flash voltage. These are termed Bad Blocks.',
      '1. Hardware Defect Lists: Modern disk controllers maintain two internal defect lists in non-volatile controller memory: the P-List (Primary/Factory Defect List recorded during manufacturing) and the G-List (Grown Defect List recorded during drive runtime whenever read/write ECC validation fails repeatedly).',
      '2. Sector Sparing (Defect Forwarding / Remapping): The disk controller reserves a hidden pool of spare sectors on each cylinder or at the end of the disk. When LBA k becomes defective, the controller updates an internal translation table so that any subsequent read or write request for LBA k is transparently redirected (forwarded) to spare sector S. Limitation: Redirected sectors incur an extra mechanical seek delay because the head must move from the defective cylinder to the spare track.',
      '3. Sector Slipping: When a defect is discovered during low-level formatting, the controller shifts (slips) all subsequent sector addresses forward by one sector. For example, if sector 17 is bad, physical sector 18 becomes logical sector 17, physical sector 19 becomes logical sector 18, and so on. Advantage: Sector slipping preserves perfect rotational and seek contiguity, maintaining maximum sequential transfer throughput.'
    ]
  },
  {
    id: 'raid-levels-architectural-comparison',
    level: 'hard',
    tags: ['Exam practice', 'Systems architecture'],
    question: 'Compare RAID 0, RAID 1, RAID 5, RAID 6, and RAID 10 across data striping, redundancy mechanisms, usable storage capacity, fault tolerance, and write performance penalty.',
    answer: [
      'RAID (Redundant Array of Independent Disks) organizes multiple physical drives into a single logical volume to provide performance and fault tolerance:',
      '1. RAID 0 (Striping without Redundancy): Data is split into stripe chunks (e.g., 64 KB) and interleaved across N disks. Usable Capacity: N * C (100%). Fault Tolerance: 0 drives (loss of a single drive destroys all data). Performance: Maximum read and write throughput (N * single disk speed).',
      '2. RAID 1 (Mirroring): Complete duplicate copy of data maintained on a second drive. Usable Capacity: C (50% for 2 drives). Fault Tolerance: Can survive failure of 1 drive in each mirrored pair. Performance: Double read throughput; normal write throughput (must write to both drives).',
      '3. RAID 5 (Block-Level Striping with Distributed Parity): Data blocks and single XOR parity blocks are distributed cyclically across N disks (N >= 3). Usable Capacity: (N - 1) * C. Fault Tolerance: Survives 1 drive failure. Rebuild: If disk 2 fails, its data is reconstructed by XORing the surviving disks: D2 = D1 XOR D3 XOR P. Write Penalty: Every random write requires 2 reads and 2 writes (read old data, read old parity, write new data, write new parity).',
      '4. RAID 6 (Dual Distributed Parity): Employs two independent mathematical parity functions (XOR parity P and Reed-Solomon Galois-field syndrome Q) distributed across N disks (N >= 4). Usable Capacity: (N - 2) * C. Fault Tolerance: Survives failure of any 2 simultaneous drive failures. Write Penalty: Higher write penalty (3 reads and 3 writes per random update).',
      '5. RAID 10 (Stripe of Mirrors / RAID 1+0): Combines RAID 0 striping over pairs of RAID 1 mirrored disks (N >= 4, even). Usable Capacity: (N / 2) * C (50%). Fault Tolerance: Can survive multiple drive failures as long as no two failed drives belong to the identical mirrored pair. Performance: High read and write throughput with zero parity calculation overhead.'
    ]
  },
  {
    id: 'raid5-xor-parity-math-and-rebuild',
    level: 'hard',
    tags: ['Exam practice', 'Mathematical derivation'],
    question: 'Explain the mathematics of XOR Parity in RAID 5. Given three data bytes: D1 = 10110011, D2 = 11001101, and D3 = 01101010, calculate the parity byte P. Demonstrate step by step how D2 is reconstructed if Disk 2 suffers a catastrophic physical crash.',
    answer: [
      '1. Mathematical Properties of the Exclusive-OR (XOR) Operation:',
      'Identity: A XOR 0 = A. Self-Inverse: A XOR A = 0. Commutative and Associative: A XOR B = B XOR A, and (A XOR B) XOR C = A XOR (B XOR C).',
      '2. Parity Calculation in RAID 5:',
      'Parity byte P is defined as: P = D1 XOR D2 XOR D3.',
      'Given:',
      'D1 = 1 0 1 1 0 0 1 1',
      'D2 = 1 1 0 0 1 1 0 1',
      'D3 = 0 1 1 0 1 0 1 0',
      'Calculate bitwise XOR column by column:',
      'Bit 7: 1 XOR 1 XOR 0 = 0',
      'Bit 6: 0 XOR 1 XOR 1 = 0',
      'Bit 5: 1 XOR 0 XOR 1 = 0',
      'Bit 4: 1 XOR 0 XOR 0 = 1',
      'Bit 3: 0 XOR 1 XOR 1 = 0',
      'Bit 2: 0 XOR 1 XOR 0 = 1',
      'Bit 1: 1 XOR 0 XOR 1 = 0',
      'Bit 0: 1 XOR 1 XOR 0 = 0',
      'Parity Byte P = 0 0 0 1 0 1 0 0 (0x14).',
      '3. Reconstruction of Lost Data Byte D2 on Disk Failure:',
      'If Disk 2 crashes, D2 is completely destroyed. The RAID controller reads the surviving data disks (D1, D3) and the parity disk (P):',
      'Mathematical Derivation: XOR both sides of P = D1 XOR D2 XOR D3 with (D1 XOR D3):',
      'P XOR D1 XOR D3 = (D1 XOR D2 XOR D3) XOR D1 XOR D3 = D2 XOR (D1 XOR D1) XOR (D3 XOR D3) = D2 XOR 0 XOR 0 = D2.',
      'Therefore: D2 = D1 XOR D3 XOR P.',
      'Execution:',
      'D1 = 1 0 1 1 0 0 1 1',
      'D3 = 0 1 1 0 1 0 1 0',
      'P  = 0 0 0 1 0 1 0 0',
      'Bit 7: 1 XOR 0 XOR 0 = 1',
      'Bit 6: 0 XOR 1 XOR 0 = 1',
      'Bit 5: 1 XOR 1 XOR 0 = 0',
      'Bit 4: 1 XOR 0 XOR 1 = 0',
      'Bit 3: 0 XOR 1 XOR 0 = 1',
      'Bit 2: 0 XOR 0 XOR 1 = 1',
      'Bit 1: 1 XOR 1 XOR 0 = 0',
      'Bit 0: 1 XOR 0 XOR 0 = 1',
      'Reconstructed D2 = 1 1 0 0 1 1 0 1 (Exactly matches the original lost D2!).'
    ]
  }
]

export default questions
