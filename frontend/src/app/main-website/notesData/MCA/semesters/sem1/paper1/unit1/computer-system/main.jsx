import FAQ from '@/app/main-website/shared/components/FAQ'
import questions from '../introduction/questions'
import Callout from '@/app/main-website/shared/components/Callout'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'

export default function Chapter() {
  return <>
    <p>This chapter develops the machinery introduced in Introduction to computers. It teaches the essential system model here; later units examine architecture, memory technologies, and operating systems in more detail.</p>
    <h2>What you will learn</h2>
    <p>Identify processor, memory, storage, and input/output roles; trace a stored program; distinguish software, firmware, processes, and threads; explain locality, interrupts, and DMA.</p>
    <h2>1. The computer system and its components</h2>
    <ComparisonTable caption="Functional components and the questions they answer" headers={['Component', 'Main role', 'Example question']} rows={[
      ['Processor', 'Executes instructions and coordinates operations', 'Which operation should run next?'],
      ['Main memory', 'Holds working instructions and data', 'What values are needed during this execution?'],
      ['Persistent storage', 'Retains files and other durable data', 'What should remain after the application closes?'],
      ['Input/output subsystem', 'Transfers data between the system and its environment', 'How does a key press reach the application?'],
      ['Interconnects and controllers', 'Carry transfers and coordinate access to devices', 'How does the processor communicate with memory and devices?'],
    ]} />
    <h3>Inside the processor</h3>
    <p>The <strong>arithmetic and logic unit (ALU)</strong> performs operations such as addition and comparisons. <strong>Control logic</strong> interprets instructions and coordinates their execution. <strong>Registers</strong> retain small amounts of state close to the execution units, including operands and control information. Modern processors also contain caches and specialised execution units.</p>
    <p>This functional description is deliberately simplified. Not every arithmetic operation uses one identical ALU, and actual processors may pipeline operations, predict branches, or execute instructions out of order while preserving the required architectural behaviour.</p>
    <h3>Memory is not the same as storage</h3>
    <p>Ordinary DRAM used as main memory is volatile: it normally needs power to retain contents. SSDs and hard drives retain data without continuous power. Registers, caches, main memory, and persistent storage have different capacities, costs, and access characteristics.</p>
    <p>When an application loads a document, it may read the file from storage into memory. Editing the in-memory copy does not guarantee that changes have been saved. Closing an application before saving can lose those changes; a correctly designed autosave system changes this behaviour.</p>
    <Callout type="mistake"><p>“More RAM means faster CPU” is incorrect. More RAM can improve a workload that otherwise causes memory pressure and expensive paging. It does not directly increase processor clock frequency or guarantee that every application becomes faster.</p></Callout>

    <h3>Addresses, values, and the memory model</h3>
    <p>An address identifies a location in an address space; the contents are the value stored there. The number on a locker identifies the locker, not what it contains. Similarly, changing a memory value does not necessarily change its address. A variable is a program-level name; the implementation decides how its value is represented and where it lives.</p>
    <p>In a simple byte-addressed model, consecutive addresses identify consecutive bytes. A multi-byte value occupies more than one byte, so the implementation must know its size and byte order. Do not assume every abstract instruction or hardware device uses exactly the same addressable unit.</p>
    <ComparisonTable caption="Toy byte-addressed memory: addresses and contents are distinct" headers={['Address', 'Contents', 'Possible interpretation']} rows={[
      ['1000', '01000001', 'ASCII A, or unsigned integer 65'],
      ['1001', '00000101', 'Unsigned integer 5'],
      ['1002', '00000000', 'Integer zero, or a terminator under a chosen convention'],
    ]} />
    <p>A real application normally uses virtual addresses managed through the OS and processor’s memory mechanisms. A virtual address need not equal a physical memory location. Virtual memory provides an abstraction; it does not create unlimited RAM. Detailed address translation belongs to later operating-system study.</p>
    <h3>Why memory is a hierarchy</h3>
    <p>Fast storage close to execution units is expensive in capacity and implementation resources. Large storage has different access costs. Systems combine levels to obtain useful capacity and speed at an acceptable cost. Registers serve immediate instruction needs; caches retain likely reusable data; main memory supports working state; persistent storage holds durable files.</p>
    <p><strong>Temporal locality</strong> means recently used data or instructions are likely to be used again. A loop repeatedly accessing a counter is an example. <strong>Spatial locality</strong> means nearby locations are likely to be used together. Sequentially reading an array is an example. A cache exploits these patterns, but it cannot guarantee a hit for every access.</p>
    <p>Consider reading ten consecutive array elements versus following ten pointers to widely separated locations. Both perform ten logical reads; their memory-system behaviour can differ. This explains why counting operations alone may not predict execution time.</p>
    <h3>Capacity, access latency, and bandwidth</h3>
    <p>Capacity asks how much can be stored. Access latency asks how long a particular access takes. Bandwidth asks how much data can be transferred per unit time under stated conditions. These are different measurements. A larger drive does not automatically have lower access latency; a high transfer rate does not eliminate the time needed to begin an operation.</p>
    <p>State whether a capacity uses decimal or binary units when it matters. One kilobyte is 1000 bytes; one kibibyte is 1024 bytes. Bits and bytes also differ: 80 megabits per second is 10 megabytes per second before overhead and other limitations, because one byte has eight bits.</p>
    <h2>2. Hardware, software, and the operating system</h2>
    <p><strong>Hardware</strong> consists of physical components. <strong>Software</strong> consists of programs and associated material used to specify behaviour. Neither a device's appearance nor its price tells you whether a particular workload will run well.</p>
    <p>An <strong>application</strong> performs a user task. The <strong>operating system</strong> manages resources and provides services and abstractions such as processes and files. It helps applications use hardware without each application implementing every device-specific detail.</p>
    <p>A process is an executing program together with its execution state and resources. With time sharing, the OS can give multiple processes opportunities to run on a processor. Protection mechanisms help isolate processes, although isolation is not an unconditional guarantee against all faults or attacks.</p>
    <p><strong>Firmware</strong> is software closely associated with a device and commonly stored in non-volatile memory. “Firmware is hardware” is inaccurate: the storage chip is hardware; the instructions stored on it are software.</p>

    <h3>The operating system as manager and boundary</h3>
    <p>Applications share finite resources. The OS schedules execution, manages memory, provides device access, and applies access-control decisions. A running program should not obtain unrestricted access to another program’s memory merely because both use the same machine.</p>
    <p>Applications request services through defined interfaces. A library function may invoke an OS service, perform user-space work, or do both. A <strong>system call</strong> is a controlled entry into an OS service. “Every function call is a system call” is false.</p>
    <p>For example, opening a file requires finding the file, checking access conditions, and establishing a usable handle or descriptor. Reading then requests bytes. A read can fail or return fewer bytes than requested. Robust software checks what actually happened rather than assuming the requested outcome occurred.</p>
    <h3>Source, compiler, executable, and runtime</h3>
    <p><strong>Source code</strong> is a human-oriented program representation. A <strong>compiler</strong> translates one program representation into another; machine code is one possible target. A <strong>linker</strong> combines required code and resolves references in a conventional compiled build. A <strong>loader</strong> helps prepare an executable for running. A <strong>runtime</strong> supplies execution support required by a language or environment.</p>
    <p>An interpreter performs a program’s behaviour through another executing program. A just-in-time compiler translates some code during execution. These are implementation strategies, not rigid categories attached forever to a programming language. What matters is the actual environment and its execution model.</p>
    <h3>Program, process, and thread</h3>
    <p>A saved program is not itself a running process. Two processes can execute the same program while maintaining different state. A process may have multiple threads that share some resources and retain separate execution state.</p>
    <p><strong>Concurrency</strong> is organising overlapping activities. A single core can interleave them. <strong>Parallelism</strong> is simultaneous execution of some work. Extra cores help only when the program and workload expose usable parallel work and other resource limits permit it.</p>
    <h2>3. What happens when a program runs?</h2>
    <p>A source file is not always directly executable by the processor. A compiled program may be translated into machine instructions; other programs run through an interpreter or a runtime. Some environments combine interpretation and compilation. In all cases, execution eventually depends on machine-level operations.</p>
    <ol>
      <li>The system prepares the program's execution environment. Required code and data become accessible in memory; they need not all be read from storage at once.</li>
      <li>At a conceptual level, the processor fetches an instruction using an instruction address.</li>
      <li>It decodes the instruction to determine the operation and operands.</li>
      <li>It performs the required action, such as computing a value, accessing memory, or changing control flow.</li>
      <li>It updates architectural state and proceeds to the next instruction determined by the program's control flow.</li>
    </ol>
    <p>This fetch–decode–execute model explains instruction processing. It is not a timing diagram of a modern CPU: several instructions can be in different pipeline stages simultaneously.</p>
    <h3>Stored-program principle</h3>
    <p>Instructions are represented in a form that can be stored and retrieved by a machine. Changing the program changes the computation without rebuilding the underlying processor. Do not turn this principle into the claim that every computer has one physically unified instruction-and-data memory: systems may separate instruction and data paths or caches.</p>
    <CodeBlock language="Pseudocode" code={`marks = [72, 81, 67]
total = 0
for each mark in marks:
    total = total + mark
percentage = (total / 300) * 100
display percentage`} />
    <p>Here the list is data; the loop and expressions describe instructions. The total evolves from 0 to 72 to 153 to 220. The percentage is approximately 73.33%. That interpretation assumes three subjects, each out of 100. If maxima differ, calculate using their actual sum rather than hard-coding 300.</p>

    <h3>A complete execution trace using a toy machine</h3>
    <p>Use a simple machine with an accumulator register ACC, a program counter PC, and two memory values: address 200 contains 7; address 201 contains 5. Its invented instruction set contains LOAD, ADD, STORE, and HALT. This is a teaching model, not a particular commercial processor.</p>
    <CodeBlock language="Toy assembly" code={`0: LOAD  200
1: ADD   201
2: STORE 202
3: HALT`} />
    <ComparisonTable caption="Trace of a four-instruction program" headers={['Before instruction', 'Action', 'State after completion']} rows={[
      ['PC = 0', 'Copy memory[200] into ACC', 'ACC = 7; next PC = 1'],
      ['PC = 1', 'Add memory[201] to ACC', 'ACC = 12; next PC = 2'],
      ['PC = 2', 'Copy ACC into memory[202]', 'memory[202] = 12; next PC = 3'],
      ['PC = 3', 'Stop this toy execution', 'Result remains 12 in address 202'],
    ]} />
    <p>LOAD copies a value; it does not erase the source location. STORE writes a value; it does not turn an address into the value itself. The PC and ACC hold different kinds of state. If the program forgot STORE, the computed answer could remain in ACC without being written to the intended result location.</p>
    <p>Actual instruction sets include defined operand forms, registers, instruction encodings, and exception behaviour. A processor’s <strong>instruction set architecture (ISA)</strong> defines the software-visible execution contract. Its <strong>microarchitecture</strong> is an implementation of that contract. Different implementations can run compatible instructions while having different performance.</p>
    <h3>Control flow: sequence, selection, and repetition</h3>
    <p>Sequence follows successive operations. Selection chooses a path based on a condition. Repetition performs a set of operations multiple times. An instruction that changes where execution continues is often called a branch or jump, depending on the instruction set.</p>
    <p>In the marks example, iteration reads each mark and updates a total. If the loop skips one entry, correctly implemented addition cannot repair the missing work. Tracing control flow is therefore as important as checking arithmetic.</p>
    <h3>Input/output: the CPU is not doing everything itself</h3>
    <p>Device controllers coordinate device operations. Polling checks whether an operation is ready or complete. An interrupt can notify the processor of an event through a handler. Neither mechanism is always best; checking and notification both have costs.</p>
    <p>Some controllers use direct memory access to transfer data without making the CPU copy every unit using ordinary instructions. The CPU still sets up work and deals with results or errors. An I/O request has a lifecycle; issuing it is not the same as completing it.</p>
    <FAQ items={questions.filter(item => ['ram-storage', 'program-process', 'firmware', 'instruction-cycle', 'more-ram', 'cache', 'virtual-memory', 'interrupt-poll', 'dma'].includes(item.id))} />
    <h2>Revision checkpoints</h2>
    <p>Explain the main mechanisms in your own words, reproduce the worked examples without looking, and answer the tagged questions before expanding their solutions. When an answer depends on assumptions, state them explicitly.</p>
    <h2>References and further reading</h2>
    <p>The supplied MCA syllabus defines the topic placement (Fundamentals of Computers, PDF page 9). The chapter explains its prerequisites and worked examples directly; the references support verification and optional further study. The explanations, examples, diagrams, and practice questions here are original teaching material.</p>
    <ul><li><a href="https://cs50.harvard.edu/x/notes/0/">Harvard CS50, Lecture 0</a>: introductory problem solving and binary representations.</li><li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf">Operating Systems: Three Easy Pieces, Introduction to Operating Systems</a>, by Remzi and Andrea Arpaci-Dusseau: processes, resource management, and persistence.</li><li><a href="https://docs.python.org/3/tutorial/floatingpoint.html">Python documentation: floating-point limitations</a>: representation error and numeric comparisons.</li><li><a href="https://www.unicode.org/faq/utf_bom.html">Unicode Consortium: UTF encodings</a>: bytes, code points, and encodings.</li><li><a href="https://www.cs.cornell.edu/courses/cs314/2004fa/l10.pdf">Cornell computer architecture lecture: performance</a>: performance metrics and Amdahl’s law.</li><li><a href="https://pages.cs.wisc.edu/~remzi/Classes/537/Fall2022/Book/file-devices.pdf">OSTEP: I/O devices</a>: polling, interrupts, and DMA.</li><li><a href="https://courses.csail.mit.edu/6.045/spring07/materials.html">MIT: automata, computability, and complexity</a>: the boundaries of algorithmic computation.</li></ul>
  </>
}
