const questions = [
  {
    id: 'page-fault-handling-sequence',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Trace the six-step sequence of events that occurs when a CPU encounters a Page Fault.',
    answer: [
      'A Page Fault occurs when a thread accesses a virtual page whose valid-invalid bit in the page table is set to 0 (invalid/not in RAM). The operating system handles it through the following six steps:',
      '1. Hardware Trap: The CPU Memory Management Unit (MMU) traps to the kernel (Page Fault Exception, Vector 14), saving the faulting instruction pointer %rip and the faulting memory address in register CR2.',
      '2. Validity Check: The kernel inspects its internal memory map (mm_struct) to determine whether the reference was an illegal memory access or merely a valid page currently on backing storage. If illegal, the kernel delivers a SIGSEGV.',
      '3. Frame Allocation: The kernel searches the physical memory free-frame list for an available frame. If all frames are occupied, it invokes a Page Replacement Algorithm to select a victim frame (and writes it to disk if dirty).',
      '4. Backing Store I/O: The kernel schedules a disk read operation to transfer the missing page from swap space or executable file into the newly allocated physical frame.',
      '5. Page Table Update: Once the disk controller signals an I/O completion interrupt, the kernel updates the page table entry: it records the physical frame number and sets the valid-invalid bit to 1 (valid).',
      '6. Instruction Restart: The kernel restores saved registers and executes return-from-trap, restarting the exact CPU instruction that triggered the page fault. The instruction now succeeds transparently.'
    ]
  },
  {
    id: 'beladys-anomaly-explanation',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Define Bélády\'s Anomaly and prove its occurrence in First-In, First-Out (FIFO) page replacement.',
    answer: [
      'Bélády\'s Anomaly is a counter-intuitive phenomenon where increasing the number of allocated physical memory frames results in an INCREASE in the total number of page faults for certain reference strings under specific replacement algorithms.',
      'László Bélády proved in 1969 that First-In, First-Out (FIFO) suffers from this anomaly because FIFO is not a stack algorithm; the set of pages in memory for n frames is not necessarily a subset of the pages in memory for n + 1 frames.',
      'Proof Example: Consider the reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5.',
      'With 3 frames: FIFO incurs exactly 9 page faults.',
      'With 4 frames: FIFO incurs exactly 10 page faults! Increasing memory capacity by 33% paradoxically increases page faults by 11%.'
    ]
  },
  {
    id: 'lru-vs-clock-algorithm',
    level: 'medium',
    tags: ['Exam practice', 'Interview practice'],
    question: 'Why is true LRU expensive to implement in hardware, and how does the Second-Chance (Clock) algorithm approximate it?',
    answer: [
      'True Least Recently Used (LRU) requires updating data structures on EVERY memory reference: either updating a hardware timestamp counter register in each page table entry or moving the referenced page to the top of a doubly linked stack. Because memory references occur billions of times per second, maintaining full stack synchronization in hardware creates intolerable latency and silicon overhead.',
      'The Second-Chance (Clock) Algorithm provides an efficient hardware approximation using only a single Reference Bit per page (set to 1 by MMU hardware on each access). Pages are organized in a circular queue with a pointer (clock hand).',
      'When a page must be replaced, the clock hand examines candidate pages: if the reference bit is 0, that page has not been accessed recently and is selected as the victim. If the reference bit is 1, the algorithm gives it a second chance: it clears the bit to 0, advances the clock hand, and inspects the next page. This circular inspection guarantees termination and closely mirrors LRU at minimal cost.'
    ]
  },
  {
    id: 'thrashing-and-working-set-model',
    level: 'hard',
    tags: ['Exam practice', 'Interview practice'],
    question: 'What is Thrashing, what causes it, and how does Peter Denning\'s Working-Set Model eliminate it?',
    answer: [
      'Thrashing is a severe performance collapse in which an operating system spends virtually all its time swapping pages between RAM and disk, with CPU execution progress dropping to near zero.',
      'Cause: When the degree of multiprogramming is increased beyond physical memory capacity, the frames allocated to each process drop below the minimum needed to hold their active working sets. Processes immediately page fault. When processes fault, they enter disk wait queues, causing CPU utilization to plunge. A naive CPU scheduler sees low CPU utilization and admits MORE processes into memory, compounding the shortage and locking the system into perpetual thrashing.',
      'Peter Denning\'s Working-Set Model prevents thrashing based on the Principle of Locality. It defines a working-set window Delta (e.g., the last 10,000 memory references). The working set of process Pi, denoted as WSS(i), is the set of distinct pages accessed within Delta.',
      'The operating system computes the total system demand: D = sum of WSS(i). If D <= total available frames, every active process is guaranteed sufficient frames and thrashing cannot occur. If D > total available frames, the kernel immediately suspends (swaps out) one or more processes, freeing their frames to satisfy the remaining active working sets.'
    ]
  }
]

export default questions
