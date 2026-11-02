const questions = [
  {
    id: 'address-binding-stages',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Explain the three stages of program address binding: Compile Time, Load Time, and Execution Time.',
    answer: [
      'Address binding is the process of mapping program instructions and data references from symbolic names (such as variable identifiers) to concrete memory addresses. This occurs across three evolutionary stages:',
      '1. Compile Time: If it is known at compile time where the process will reside in physical RAM, the compiler generates absolute machine code (e.g., .COM files in early MS-DOS). If the starting location changes, the entire program must be recompiled.',
      '2. Load Time: If the physical memory location is not known at compile time, the compiler generates relocatable code. The loader performs address binding when the program is loaded into RAM. However, if the process is subsequently moved in memory, it must be reloaded from disk.',
      '3. Execution Time (Run Time): If the process can be moved from one memory segment to another during its execution (via swapping or paging), address binding is delayed until runtime. This requires special hardware support: the Memory Management Unit (MMU) dynamic relocation register.'
    ]
  },
  {
    id: 'mmu-relocation-and-limit-check',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Describe how the Memory Management Unit (MMU) uses Base and Limit registers to translate addresses and enforce memory protection.',
    answer: [
      'The CPU generates a logical (virtual) address. To enforce protection and dynamic relocation, the MMU uses two hardware registers: the Limit Register and the Relocation (Base) Register.',
      'Step 1 (Bounds Check): The CPU hardware compares the generated logical address against the Limit Register: if (Logical Address >= Limit Register), the MMU raises a hardware trap to the kernel (segmentation violation / trap vector 13), immediately halting the offending process.',
      'Step 2 (Physical Translation): If the address is within valid bounds (Logical Address < Limit Register), the MMU hardware adder adds the value of the Relocation (Base) Register: Physical Address = Logical Address + Relocation Register.',
      'The resulting physical address is asserted onto the memory address bus to access physical RAM. User programs never see or access physical addresses directly.'
    ]
  },
  {
    id: 'internal-vs-external-fragmentation',
    level: 'easy',
    tags: ['Concept check', 'Exam practice'],
    question: 'Differentiate between Internal Fragmentation and External Fragmentation. How are they resolved?',
    answer: [
      'Internal Fragmentation occurs when memory is allocated in fixed-size blocks (such as fixed partitions or 4 KB paging frames). If a process requests 5 KB of memory and is allocated two 4 KB frames (8 KB total), the unused 3 KB within the second frame is internal fragmentation. It is memory that is allocated to a process but never used. Resolution: reducing allocation block sizes.',
      'External Fragmentation occurs when there is sufficient total free memory available in the system to satisfy an allocation request, but the free memory is fragmented into small, non-contiguous slices. No single contiguous hole is large enough to hold the process. Resolution: Memory Compaction (relocating active processes to one end of memory to consolidate holes) or Non-Contiguous Memory Allocation (Paging and Segmentation).'
    ]
  },
  {
    id: 'dynamic-storage-allocation-algorithms',
    level: 'medium',
    tags: ['Exam practice'],
    question: 'Compare First-Fit, Best-Fit, and Worst-Fit dynamic storage allocation strategies.',
    answer: [
      'When managing variable-sized memory holes, the operating system can choose among three classic allocation strategies:',
      '1. First-Fit: Scans the free hole list from the beginning and allocates the very first hole that is large enough. It is computationally the fastest algorithm and generally exhibits excellent storage utilization.',
      '2. Best-Fit: Searches the entire list of free holes to find the smallest hole that is large enough to satisfy the request. While it minimizes immediate leftover wasted space, it creates an abundance of tiny, unusable fragment holes that degrade memory over time.',
      '3. Worst-Fit: Searches the entire list to find the largest available hole. The rationale is that the leftover fragment after allocation will be large enough to remain useful for subsequent process allocations. However, simulations prove Worst-Fit produces the poorest overall memory utilization.'
    ]
  }
]

export default questions
