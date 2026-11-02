import Callout from '@/app/main-website/shared/components/Callout'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from './questions'

export default function Chapter() {
  const enhancedClockTable = {
    caption: 'Enhanced Second-Chance Page Replacement Classification Scheme',
    headers: ['Class', 'Reference Bit', 'Modify (Dirty) Bit', 'Operational Meaning', 'Eviction Priority'],
    rows: [
      [
        'Class 0 (0, 0)',
        '0',
        '0',
        'Neither recently used nor modified.',
        'Best page to replace; clean frame can be overwritten instantly without disk I/O.'
      ],
      [
        'Class 1 (0, 1)',
        '0',
        '1',
        'Not recently used, but modified (dirty).',
        'Second choice; requires writing modified page back to disk before frame reuse.'
      ],
      [
        'Class 2 (1, 0)',
        '1',
        '0',
        'Recently used, but clean (unmodified).',
        'Third choice; likely to be accessed again soon, but requires no disk writeback.'
      ],
      [
        'Class 3 (1, 1)',
        '1',
        '1',
        'Recently used and modified.',
        'Worst page to replace; heavily active and requires expensive disk writeback.'
      ]
    ]
  }

  const replacementComparisonTable = {
    caption: 'Comprehensive Comparison of Page Replacement Algorithms',
    headers: ['Algorithm', 'Selection Criterion', 'Hardware Complexity', 'Bélády Anomaly', 'Real-World Kernel Usage'],
    rows: [
      [
        'First-In, First-Out (FIFO)',
        'Replaces the oldest page brought into physical memory.',
        'Low (Simple FIFO queue pointer).',
        'Subject to Anomaly (More frames can increase faults).',
        'Rarely used as standalone policy; lacks recency awareness.'
      ],
      [
        'Optimal (OPT / MIN)',
        'Replaces page that will not be accessed for longest future time.',
        'Impossible (Requires clairvoyant future knowledge).',
        'Free from Anomaly (Stack Algorithm).',
        'Theoretical baseline benchmark for evaluating other algorithms.'
      ],
      [
        'Least Recently Used (LRU)',
        'Replaces page that has not been accessed for longest past time.',
        'High (Requires hardware counters or doubly-linked stacks).',
        'Free from Anomaly (Stack Algorithm).',
        'Gold standard theoretical basis, but too expensive for pure hardware.'
      ],
      [
        'Second-Chance (Clock)',
        'Approximates LRU using a single reference bit in a circular queue.',
        'Low (1 bit per PTE and a circular list pointer).',
        'Free from practical anomalies.',
        'Standard foundation for production kernels (Linux and BSD).'
      ]
    ]
  }

  return (
    <>
      <p>
        In early computer architectures, an executable program could never exceed the physical size of installed RAM. If a machine possessed 64 MB of RAM, a 100 MB database process would immediately abort with out-of-memory errors. <strong>Virtual Memory</strong> removes this physical barrier by decoupling the user logical address space from physical memory. For Master of Computer Applications (MCA) students, mastering virtual memory requires analyzing <strong>Demand Paging</strong>, Page Fault pipelines, Page Replacement Algorithms (FIFO, Optimal, LRU, Clock), Bélády&apos;s Anomaly, and Peter Denning&apos;s <strong>Working-Set Model</strong> for thrashing prevention.
      </p>

      <h2>1. The Concept of Virtual Memory and Demand Paging</h2>
      <p>
        <strong>Virtual Memory</strong> is an architectural abstraction that enables the execution of processes that may not be completely resident in physical RAM. Programs can address virtual memory spaces that are orders of magnitude larger than physical memory (for example, executing a 16 GB program on a machine with 4 GB of RAM).
      </p>
      <ul>
        <li>
          <strong>Principle of Locality:</strong> In practice, programs rarely access their entire code and data simultaneously. Large error-handling routines, initialization code, and oversized arrays are accessed infrequently.
        </li>
        <li>
          <strong>Benefits:</strong> Enables massive virtual address spaces, increases the degree of multiprogramming (more concurrent processes in RAM), and accelerates process startup since programs begin executing before their full binary is loaded.
        </li>
      </ul>

      <h3>Demand Paging and The Lazy Pager</h3>
      <p>
        Under <strong>Demand Paging</strong>, virtual pages are loaded into physical RAM only when they are explicitly referenced during instruction execution (often termed a <em>lazy swapper</em> or <em>pager</em>):
      </p>
      <ul>
        <li>
          Each Page Table Entry (PTE) contains a hardware <strong>Valid-Invalid Bit</strong>:
          <ul>
            <li><strong>Valid (Bit = 1):</strong> The page is currently resident in physical RAM. Memory access proceeds at hardware bus speed.</li>
            <li><strong>Invalid (Bit = 0):</strong> The page is either outside the process legal address space or currently resides on the backing store (secondary storage).</li>
          </ul>
        </li>
      </ul>

      <h2>2. The Page Fault Handling Pipeline</h2>
      <p>
        When the CPU attempts to access a virtual page whose valid-invalid bit is 0, the MMU cannot resolve the physical address and triggers a hardware exception called a <strong>Page Fault</strong>.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-3 font-sans">The Six-Stage Page Fault Handling Sequence</h4>
        
        <div className="space-y-3 font-mono text-xs text-ink/90 dark:text-night-ink/90">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">Stage 1: Hardware Trap to OS</strong><br />
            CPU MMU detects valid bit = 0. Execution freezes, CPU saves instruction pointer %rip and generates Page Fault Exception (Vector 14), saving the faulting memory address in register <code>CR2</code>.
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">Stage 2: Validity and Access-Control Check</strong><br />
            The kernel consults its internal memory descriptor (<code>mm_struct</code> / VMA). If the address is invalid (outside valid segments), the OS generates a <code>SIGSEGV</code> (Segmentation Fault). If valid, it proceeds to page-in.
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">Stage 3: Frame Allocation &amp; Victim Selection</strong><br />
            The kernel searches the physical memory free-frame list. If no free frames exist, it invokes a <strong>Page Replacement Algorithm</strong> to select a victim frame (and writes it to disk if dirty).
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">Stage 4: Backing Store Disk I/O</strong><br />
            The kernel issues a non-blocking disk read request to fetch the missing page from backing store into the allocated physical frame. The faulting process is moved to the Waiting Queue.
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-brand dark:text-night-brand font-sans">Stage 5: Page Table Update</strong><br />
            When the disk controller raises an I/O completion interrupt, the kernel updates the PTE: writes the new physical frame number and flips the valid-invalid bit to <strong>1 (Valid)</strong>.
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <strong className="text-success dark:text-night-success font-sans">Stage 6: Instruction Restart</strong><br />
            The faulting process is moved back to the Ready Queue. When dispatched, the kernel executes a return-from-trap instruction, restarting the exact assembly instruction that faulted.
          </div>
        </div>
      </div>

      <h3>Effective Access Time (EAT) Under Demand Paging</h3>
      <p>
        Let <em>p</em> be the <strong>Page Fault Rate</strong> (0 &le; <em>p</em> &le; 1), <em>t<sub>RAM</sub></em> be the physical memory access time, and <em>t<sub>fault</sub></em> be the page fault service latency:
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono font-bold text-center text-brand dark:text-night-brand mb-3">
          Effective Access Time (EAT) = (1 - p) &times; t<sub>RAM</sub> + p &times; t<sub>fault</sub>
        </div>

        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-2">
          <strong>Worked Numerical Problem:</strong> Given <em>t<sub>RAM</sub> = 200 ns</em>, and disk page fault service time <em>t<sub>fault</sub> = 8 ms = 8,000,000 ns</em>:
        </p>

        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono space-y-2 text-ink/90 dark:text-night-ink/90">
          <div>EAT = (1 - p) &times; 200 + p &times; 8,000,000 = 200 + 7,999,800 &times; p.</div>
          <div>If <strong>p = 0.001 (1 fault per 1000 memory accesses):</strong></div>
          <div>EAT = 200 + 7,999.8 &asymp; <strong>8,200 ns = 8.2 &mu;s</strong>!</div>
          <div className="font-bold text-danger dark:text-night-danger pt-1">
            Performance Consequence: The computer operates 41 times slower (4,000% slowdown) due to a 0.1% fault rate! To keep performance degradation under 10%, the page fault rate must be strictly less than 1 in 400,000 accesses (p &lt; 0.0000025).
          </div>
        </div>
      </div>

      <h2>3. Page Replacement Algorithms</h2>
      <p>
        When a page fault occurs and physical RAM has no free frames, the kernel must choose an existing resident page to evict (the <em>victim frame</em>). If the victim page was modified while in RAM (indicated by the <strong>Dirty / Modify Bit = 1</strong>), it must be written back to disk before the frame can be repurposed.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-brand dark:text-night-brand mb-2 font-sans">Reference String Trace Comparison (3 Physical Frames)</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          Consider the standard examination reference string:
          <code>7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1</code> across 3 frames:
        </p>

        <div className="space-y-3 text-xs font-mono text-ink/90 dark:text-night-ink/90">
          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-danger dark:text-night-danger block mb-1 font-sans text-sm">1. First-In, First-Out (FIFO) Algorithm</span>
            Replaces the oldest page loaded into RAM. Evaluates using a simple FIFO queue.<br />
            <strong>Total Page Faults: 15</strong>.
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-success dark:text-night-success block mb-1 font-sans text-sm">2. Optimal Page Replacement (OPT / MIN)</span>
            Replaces the page that will not be used for the longest future duration.<br />
            At reference 2 (frames have 7, 0, 1): page 7 will not be used until step 18; hence 7 is replaced.<br />
            <strong>Total Page Faults: 9</strong> (Mathematically provable minimum possible fault count).
          </div>

          <div className="p-3 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line">
            <span className="font-bold text-brand dark:text-night-brand block mb-1 font-sans text-sm">3. Least Recently Used (LRU) Algorithm</span>
            Replaces the page that has not been referenced for the longest past interval.<br />
            Approximates OPT by using recent history as a predictor of future access patterns.<br />
            <strong>Total Page Faults: 12</strong>.
          </div>
        </div>
      </div>

      <ComparisonTable {...replacementComparisonTable} />

      <Callout type="mistake" title="Examination Focus: Bélády's Anomaly in FIFO">
        Intuitively, allocating more physical RAM frames to a program should always decrease or maintain page fault rates. <strong>Bélády&apos;s Anomaly</strong> is the phenomenon where adding physical frames causes an INCREASE in page faults under FIFO!<br /><br />
        <strong>Proof Reference String:</strong> <code>1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5</code>.<br />
        &bull; With <strong>3 Frames:</strong> FIFO incurs exactly <strong>9 Page Faults</strong>.<br />
        &bull; With <strong>4 Frames:</strong> FIFO incurs exactly <strong>10 Page Faults</strong>!<br /><br />
        <strong>Why LRU is immune:</strong> LRU and Optimal belong to a mathematical class called <strong>Stack Algorithms</strong>, where the set of pages resident in memory for <em>n</em> frames is always a strict subset of pages resident for <em>n + 1</em> frames. Stack algorithms can never exhibit Bélády&apos;s anomaly.
      </Callout>

      <h2>4. LRU Approximation: Second-Chance (Clock) Algorithms</h2>
      <p>
        Because maintaining true LRU hardware counters or linked stacks on every single memory access is prohibitively expensive, production kernels utilize the <strong>Second-Chance (Clock) Algorithm</strong>:
      </p>
      <ul>
        <li>Each PTE contains a 1-bit <strong>Reference Bit</strong> (set to 1 by MMU hardware whenever the page is read or written).</li>
        <li>Pages are organized in a circular queue with a pointer acting as the clock hand.</li>
        <li>When a replacement frame is needed:
          <ul>
            <li>If the current page reference bit is <strong>0</strong>: It is selected as the victim frame immediately.</li>
            <li>If the reference bit is <strong>1</strong>: The kernel clears the bit to <strong>0</strong> (giving it a &quot;second chance&quot;), advances the clock hand to the next frame, and repeats.</li>
          </ul>
        </li>
      </ul>

      <h3>The Enhanced Second-Chance Algorithm</h3>
      <p>
        Modern operating systems examine both the <strong>Reference Bit</strong> and the <strong>Modify (Dirty) Bit</strong> as an ordered pair <code>&lang;Reference, Modify&rang;</code>:
      </p>
      <ComparisonTable {...enhancedClockTable} />

      <h2>5. Thrashing and The Working-Set Model</h2>
      <p>
        If the number of frames allocated to a process drops below the minimum number of active pages it references during a phase, the process immediately page faults.
      </p>

      <div className="my-6 p-5 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-ink dark:text-night-ink">
        <h4 className="text-base font-bold text-danger dark:text-night-danger mb-2 font-sans">The Thrashing Collapse Spiral</h4>
        <p className="text-xs text-ink/80 dark:text-night-ink/80 leading-relaxed mb-3">
          <strong>Thrashing</strong> occurs when a system spends more time swapping pages in and out of backing storage than executing application instructions:
        </p>
        <div className="p-4 rounded-lg bg-soft dark:bg-night-soft border border-line dark:border-night-line text-xs font-mono space-y-2 text-ink/90 dark:text-night-ink/90">
          <div>1. System memory becomes oversubscribed &rarr; Per-process frames decrease.</div>
          <div>2. Processes immediately page fault &rarr; Queue up waiting for disk I/O controllers.</div>
          <div>3. Ready Queue empties &rarr; CPU utilization plunges to near zero.</div>
          <div>4. Scheduler misinterprets low CPU utilization as idle capacity &rarr; Increases degree of multiprogramming.</div>
          <div>5. New processes enter &rarr; Demand more frames &rarr; Complete system freeze (Thrashing).</div>
        </div>
      </div>

      <h3>Peter Denning&apos;s Working-Set Model</h3>
      <p>
        To prevent thrashing, Peter Denning established the <strong>Working-Set Model</strong> based on the Principle of Locality:
      </p>
      <ul>
        <li>
          <strong>Working-Set Window (&Delta;):</strong> A fixed parameter representing a sliding window of the most recent page references (e.g., &Delta; = 10,000 references).
        </li>
        <li>
          <strong>Working-Set Size (WSS<sub>i</sub>):</strong> The total number of distinct pages referenced by process <em>P<sub>i</sub></em> within window &Delta;.
        </li>
        <li>
          <strong>Total System Frame Demand:</strong> <em>D = &Sigma; WSS<sub>i</sub></em>.
        </li>
      </ul>

      <div className="my-4 p-4 rounded-xl border border-line bg-surface dark:border-night-line dark:bg-night-surface text-xs font-mono text-ink dark:text-night-ink">
        <div className="space-y-1">
          <div>&bull; If <strong>D &le; Total Frames:</strong> Allocate each process its working set. Thrashing is completely prevented.</div>
          <div>&bull; If <strong>D &gt; Total Frames:</strong> System is oversubscribed. The kernel immediately <strong>suspends (swaps out) an entire process</strong>, releasing all its allocated frames to satisfy remaining active processes.</div>
        </div>
      </div>

      <h2>6. Kernel Memory Allocation: Buddy System and Slab Allocators</h2>
      <p>
        While user programs allocate memory in uniform 4 KB pages, operating system kernel components (like file system inodes, network buffer descriptors, and process control blocks) require variable-sized memory buffers that cannot afford external fragmentation:
      </p>
      <ul>
        <li>
          <strong>Buddy System:</strong> Allocates memory from a physically contiguous segment sized as powers of 2. An allocation request is rounded up to the nearest power of 2. If a larger block is available, it is split into two equal &quot;buddies&quot;. When adjacent buddies become free, the allocator rapidly coalesces them back into a single block.
        </li>
        <li>
          <strong>Slab Allocator:</strong> Eliminates internal fragmentation caused by the Buddy System. The kernel pre-allocates pools (slabs) of contiguous frames initialized as arrays of identical, commonly used kernel data structures (e.g., <code>struct inode</code> cache, <code>struct task_struct</code> cache). Kernel requests instantiate objects in <em>O(1)</em> time without memory allocation overhead.
        </li>
      </ul>

      <h2>Review checklist</h2>
      <ul>
        <li>Can you define Virtual Memory and explain the role of the Valid-Invalid bit in demand paging?</li>
        <li>Can you trace the six-stage Page Fault handling pipeline from hardware trap to instruction restart?</li>
        <li>Can you write the formula for Effective Access Time (EAT) and calculate the performance impact of a 0.1% page fault rate?</li>
        <li>Can you trace reference strings using FIFO, Optimal (OPT), and LRU page replacement algorithms?</li>
        <li>Can you prove Bélády&apos;s Anomaly under FIFO and explain why stack algorithms are immune?</li>
        <li>Can you explain how the Second-Chance (Clock) and Enhanced Second-Chance algorithms approximate LRU?</li>
        <li>Can you describe the thrashing collapse spiral and how Peter Denning&apos;s Working-Set Model prevents it?</li>
        <li>Can you contrast the Buddy System allocator with the Slab Allocator for kernel data structures?</li>
      </ul>
      <FAQ items={questions} />

      <h2>References and further exploration</h2>
      <ul>
        <li>
          <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/">Operating Systems: Three Easy Pieces (Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau)</a> - Chapter 21: Beyond Physical Memory: Mechanisms, and Chapter 22: Beyond Physical Memory: Policies.
        </li>
        <li>
          <a href="https://dl.acm.org/doi/10.1145/363095.363141">The Working Set Model for Program Behavior (Peter J. Denning, Communications of the ACM, 1968)</a> - Foundational paper formalizing memory locality, working sets, and thrashing bounds.
        </li>
        <li>
          <a href="https://www.kernel.org/doc/html/latest/mm/index.html">Memory Management Documentation - The Linux Kernel</a> - Authoritative reference for Linux page replacement (kswapd), page cache writeback, and the slab/slub allocator.
        </li>
      </ul>
    </>
  )
}
